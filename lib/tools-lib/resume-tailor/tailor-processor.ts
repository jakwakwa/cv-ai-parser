import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import type { TextPart, FilePart } from "ai"
import { AI_MODEL_FLASH } from "@/lib/config"
import type { FileParseResult } from "../shared/file-parsers/base-parser"
import { enforceSummaryLimit } from "../shared/summary-limiter"
import type { ParsedResumeSchema } from "../shared-parsed-resume-schema"
import { parsedResumeSchema } from "../shared-parsed-resume-schema"
import { getJobSpecAnalysisPrompt, getOriginalResumeParsingPrompt, getTailoredResumeParsingPrompt, getTailoringStrategy } from "./tailor-prompts"
import type { UserAdditionalContext } from "./tailor-schema"

// This will be expanded with more metadata later
interface ProcessingResult {
	data: ParsedResumeSchema
	meta: {
		method: string
		confidence: number
		processingType: "tailor"
		aiTailorCommentary?: string
		jobMatchScore?: number
		optimizationLevel?: string
		processingTime?: number
	}
}

interface CustomizationOptions {
	profileImage?: string
	customColors?: Record<string, string>
}

// Placeholder for the full context needed for tailoring
type TailorContext = UserAdditionalContext

type JobAnalysis = {
	keywords: string[]
	requirements: string[]
	skills: string[]
}

class TailorProcessor {
	private stripCodeFences(raw: string): string {
		let text = raw.trim()
		// Remove triple backtick fences if present
		if (text.startsWith("```json")) {
			text = text.replace(/^```json\s*/, "")
		} else if (text.startsWith("```")) {
			text = text.replace(/^```\s*/, "")
		}
		if (text.endsWith("```")) {
			text = text.replace(/```\s*$/, "")
		}
		return text
	}

	// Extract the first balanced JSON object from the text
	private extractBalancedJsonObject(text: string): string | null {
		const start = text.indexOf("{")
		if (start === -1) return null
		let depth = 0
		let inString = false
		let isEscaped = false
		for (let i = start; i < text.length; i++) {
			const ch = text[i]
			if (inString) {
				if (isEscaped) {
					isEscaped = false
				} else if (ch === "\\") {
					isEscaped = true
				} else if (ch === '"') {
					inString = false
				}
				continue
			}
			if (ch === '"') {
				inString = true
				continue
			}
			if (ch === "{") depth++
			if (ch === "}") depth--
			if (depth === 0) {
				return text.substring(start, i + 1)
			}
		}
		return null
	}

	private removeTrailingCommas(jsonText: string): string {
		// Remove dangling commas before } or ]
		return jsonText.replace(/,(\s*[}\]])/g, "$1")
	}

	private cleanJson(raw: string): string {
		// Normalize unicode spaces and remove zero-width characters
		let text = raw.replace(/[\u200B-\u200D\uFEFF]/g, "")
		text = this.stripCodeFences(text)
		const balanced = this.extractBalancedJsonObject(text)
		text = balanced ?? text
		text = this.removeTrailingCommas(text)
		return text.trim()
	}

	private parseResumeJsonOrThrow(raw: string): ParsedResumeSchema {
		const cleaned = this.cleanJson(raw)
		try {
			const parsed = JSON.parse(cleaned)
			const sanitized = this.sanitizeResumeCandidate(parsed)
			const result = parsedResumeSchema.parse(sanitized)
			return result
		} catch (err) {
			const prefix = cleaned.slice(0, 2000)
			// Try to locate error position if available
			const errorMsg = err instanceof Error ? err.message : String(err)
			const positionMatch = errorMsg.match(/position\s+(\d+)/i)
			let context = ""
			if (positionMatch) {
				const pos = Number(positionMatch[1])
				const start = Math.max(0, pos - 80)
				const end = Math.min(cleaned.length, pos + 80)
				const marker = `${cleaned.slice(start, pos)}<<<HERE>>>${cleaned.slice(pos, end)}`
				context = `Context around error position ${pos}:\n${marker}`
			}
			const looksLikeSchema = /"type"\s*:\s*"object"|"properties"\s*:/i.test(prefix)
			console.error("[Tailor] Failed to parse AI JSON. Error:", errorMsg)
			console.error("[Tailor] Cleaned prefix (first 2000 chars):", prefix)
			if (context) console.error("[Tailor] Parse context:", context)
			if (looksLikeSchema) {
				console.error("[Tailor] Detected schema-shaped output (type/properties). Model likely emitted a JSON Schema instead of data.")
			}
			const devInfo = process.env.NODE_ENV !== "production" ? ` | dev: schemaLike=${looksLikeSchema}; ${context || `prefix:${prefix.slice(0, 300)}`}` : ""
			throw new Error(`AI returned invalid JSON. Please try again with a simpler file or job spec.${devInfo}`)
		}
	}

	private sanitizeResumeCandidate(candidate: unknown): unknown {
		// Remove nulls for optional string fields; ensure arrays; fix experience role/title; ensure details arrays
		const deepSanitize = (value: unknown): unknown => {
			if (value === null) {
				return undefined
			}
			if (Array.isArray(value)) {
				return value.map((v: unknown) => deepSanitize(v)).filter((v: unknown) => v !== undefined)
			}
			if (typeof value === "object" && value) {
				const input = value as Record<string, unknown>
				const out: Record<string, unknown> = {}
				for (const [key, val] of Object.entries(input)) {
					const sanitized = deepSanitize(val)
					if (sanitized !== undefined) out[key] = sanitized
				}
				return out
			}
			return value
		}

		const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null

		let result: unknown = deepSanitize(candidate)

		// Experience normalization
		if (isObject(result)) {
			const root = result as Record<string, unknown>
			const experience = root["experience"]
			if (Array.isArray(experience)) {
				root["experience"] = experience.map((exp: unknown) => {
					const e = isObject(exp) ? { ...(exp as Record<string, unknown>) } : ({} as Record<string, unknown>)
					const title = typeof e["title"] === "string" ? (e["title"] as string) : undefined
					const role = typeof e["role"] === "string" ? (e["role"] as string) : undefined
					if (!role && title) e["role"] = title
					if (!title && role) e["title"] = role
					const detailsValue = e["details"]
					const details = Array.isArray(detailsValue) ? detailsValue.filter((d: unknown) => typeof d === "string") : []
					e["details"] = details
					return e
				})
			}
			result = root
		}

		return result
	}

	async process(fileResult: FileParseResult, tailorContext: TailorContext, customization?: CustomizationOptions): Promise<ProcessingResult> {
		const startTime = Date.now()
		if (process.env.NODE_ENV !== "production") {
			console.log("Tailor processing for:", fileResult.fileName)
		}

		// Step 1: Parse original resume with precision
		const originalParsed = await this.parseOriginal(fileResult)

		// Step 2: Analyze job specification
		const _jobAnalysis = await this.analyzeJobSpec(tailorContext.jobSpecText || "")

		// Step 3: Apply tailoring based on job spec and tone
		const tailored = await this.applyTailoring(originalParsed, tailorContext)

		// Step 4: Apply customizations (profile image and colors)
		const customizedResume = this.applyCustomizations(tailored, customization)

		// SAFE ADDITION: Post-process summary to respect max character constraint.
		const lengthSafeResume = await enforceSummaryLimit(customizedResume)

		const processingTime = Date.now() - startTime
		const matchScore = this.calculateJobMatchScore(customizedResume, tailorContext)
		const strategy = getTailoringStrategy(tailorContext.tone)

		return {
			data: lengthSafeResume,
			meta: {
				method: "job-tailored",
				confidence: this.calculateTailoringMatch(customizedResume, tailorContext),
				processingType: "tailor",
				aiTailorCommentary: customizedResume.metadata?.aiTailorCommentary,
				jobMatchScore: matchScore,
				optimizationLevel: strategy.keywordDensity,
				processingTime,
			},
		}
	}

	private async parseOriginal(fileResult: FileParseResult): Promise<ParsedResumeSchema> {
		const model = google(AI_MODEL_FLASH)
		const messagesContent: (TextPart | FilePart)[] = []

		if (fileResult.fileType === "pdf" && fileResult.fileData) {
			messagesContent.push({
				type: "file",
				data: new Uint8Array(fileResult.fileData),
				mediaType: "application/pdf",
			})
			messagesContent.push({
				type: "text",
				text: getOriginalResumeParsingPrompt(""), // Prompt instructions
			})
		} else {
			messagesContent.push({
				type: "text",
				text: getOriginalResumeParsingPrompt(fileResult.content),
			})
		}

		if (process.env.NODE_ENV !== "production") {
			console.log("[Tailor] Parsing original resume for tailoring...")
		}

		const { text } = await generateText({
			model,
			messages: [
				{
					role: "user",
					content: messagesContent,
				},
			],
			temperature: 0.2,
		})

		return this.parseResumeJsonOrThrow(text)
	}

	private async analyzeJobSpec(jobSpec: string): Promise<JobAnalysis> {
		if (!jobSpec.trim()) {
			return { keywords: [], requirements: [], skills: [] }
		}

		// TODO: Implement actual AI call using getJobSpecAnalysisPrompt
		const _prompt = getJobSpecAnalysisPrompt(jobSpec)
		if (process.env.NODE_ENV !== "production") {
			console.log("Analyzing job specification...")
		}

		// Placeholder analysis
		return {
			keywords: ["React", "JavaScript", "API", "TeamWork"],
			requirements: ["3+ years experience", "Bachelor's degree"],
			skills: ["React", "Node.js", "REST APIs", "Agile"],
		}
	}

	private async applyTailoring(original: ParsedResumeSchema, context: TailorContext): Promise<ParsedResumeSchema> {
		const model = google(AI_MODEL_FLASH)
		const prompt = getTailoredResumeParsingPrompt(JSON.stringify(original, null, 2), context.jobSpecText || "", context.tone)

		if (process.env.NODE_ENV !== "production") {
			console.log("Applying tailoring with tone:", context.tone)
		}

		const { text } = await generateText({
			model,
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			temperature: 0.2,
		})

		return this.parseResumeJsonOrThrow(text)
	}

	private applyCustomizations(resume: ParsedResumeSchema, customization?: CustomizationOptions): ParsedResumeSchema {
		if (!customization) return resume

		const customizedResume = { ...resume }

		// Apply profile image if provided and not empty
		if (customization.profileImage && customization.profileImage.trim() !== "") {
			customizedResume.profileImage = customization.profileImage
			if (process.env.NODE_ENV !== "production") {
				console.log("[Tailor] Applied profile image to resume")
			}
		}

		// Apply custom colors if provided
		if (customization.customColors && Object.keys(customization.customColors).length > 0) {
			customizedResume.customColors = customization.customColors
			if (process.env.NODE_ENV !== "production") {
				console.log("[Tailor] Applied custom colors to resume:", Object.keys(customization.customColors))
			}
		}

		return customizedResume
	}

	private calculateJobMatchScore(tailored: ParsedResumeSchema, context: TailorContext): number {
		let score = 0
		const jobSpec = context.jobSpecText?.toLowerCase() || ""

		// Check skill alignment
		const relevantSkills = tailored.skills?.filter(skill => jobSpec.includes(skill.toLowerCase())) || []
		score += (relevantSkills.length / Math.max(tailored.skills?.length || 1, 1)) * 0.4

		// Check experience relevance
		const relevantExp =
			tailored.experience?.filter(exp => exp.details?.some(detail => detail && jobSpec.split(" ").some(word => detail.toLowerCase().includes(word.toLowerCase()) && word.length > 3))) || []
		score += (relevantExp.length / Math.max(tailored.experience?.length || 1, 1)) * 0.4

		// Check title alignment
		if (jobSpec.includes(tailored.title.toLowerCase())) {
			score += 0.2
		}

		return Math.min(score, 1.0)
	}

	private calculateTailoringMatch(tailored: ParsedResumeSchema, context: TailorContext): number {
		let score = 0

		// Base score for having tailored content
		if (tailored.metadata?.aiTailorCommentary) score += 0.3

		// Score for job spec utilization
		if (context.jobSpecText && context.jobSpecText.length > 50) score += 0.3

		// Score for tone application
		if (context.tone && context.tone !== "Neutral") score += 0.2

		// Score for data completeness
		if (tailored.skills && tailored.skills.length > 0) score += 0.1
		if (tailored.experience && tailored.experience.length > 0) score += 0.1

		return Math.min(score, 1.0)
	}
}

export const tailorProcessor = new TailorProcessor()
