import type { ParsedResumeSchema } from "@/lib/tools-lib/shared-parsed-resume-schema"

export interface PartialResumeData {
	name?: string
	title?: string
	experience?: Array<{
		title?: string
		company?: string
		duration?: string
		details?: string[]
	}>
	skills?: string[]
	[key: string]: unknown
}

export interface ParseInfo {
	resumeId?: string
	resumeSlug?: string
	method: string
	confidence: number
	filename?: string
	fileType?: string
	fileSize?: number
	aiTailorCommentary?: string
}

export interface StreamUpdate {
	status: "analyzing" | "processing" | "saving" | "completed" | "error"
	message?: string
	progress?: number
	partialData?: PartialResumeData
	data?: ParsedResumeSchema
	meta?: ParseInfo
}

export type JobSpecMethod = "paste" | "upload"
export type ToneOption = "Formal" | "Neutral" | "Creative"

export interface ResumeGeneratorState {
	uploadedFile: File | null
	error: string
	isGenerating: boolean
	showErrorModal: boolean
	modalErrorMessage: string
	showColorDialog: boolean
	profileImage: string | null
	customColors: Record<string, string>
	resumeId: string | null
	generatedResume: ParsedResumeSchema | null
	streamingProgress: number
	streamingMessage: string
	partialResumeData: PartialResumeData | null
	localResumeData: ParsedResumeSchema | null
	isProcessing: boolean
}

export interface ResumeTailorState {
	uploadedFile: File | null
	error: string
	jobSpecMethod: "upload" | "paste"
	jobSpecText: string
	jobSpecFile: File | null
	tone: "Neutral" | "Formal" | "Concise" | "Creative"
	extraPrompt: string
	isTailoring: boolean
	showErrorModal: boolean
	modalErrorMessage: string
	showColorDialog: boolean
	profileImage: string | null
	customColors: Record<string, string>
	tailoredResume: ParsedResumeSchema | null
	tailoredResumeId: string | null
	isProcessing: boolean
	aiTailorCommentary: string | null
	streamingProgress: number
	streamingMessage: string
	partialResumeData: PartialResumeData | null
	localResumeData: ParsedResumeSchema | null
}

export interface ResumeTailorToolProps {
	isLoading: boolean
	setIsLoading: (loading: boolean) => void
	isAuthenticated: boolean
}
