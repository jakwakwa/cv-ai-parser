import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import type { ParsedResumeSchema } from "@/lib/tools-lib/shared-parsed-resume-schema"
import { createGeneratorFormData, parseResumeGenerator } from "../containers/tool-containers/api-service"
import type { ResumeGeneratorState, StreamUpdate } from "../containers/tool-containers/types"
import { useTempResumeStore } from "./use-temp-resume-store"

const initialState: ResumeGeneratorState = {
	// File upload states
	uploadedFile: null,
	error: "",

	// UI states
	isGenerating: false, // Add this line
	showErrorModal: false,
	modalErrorMessage: "",
	showColorDialog: false,

	// Streaming states
	streamingProgress: 0,
	streamingMessage: "",
	partialResumeData: null,

	// Profile customization states
	profileImage: null,
	customColors: {},
	resumeId: null, // Added missing property
	generatedResume: null, // Added missing property

	// Result state
	localResumeData: null,

	// Processing state
	isProcessing: false,
}

interface ParseInfo {
	resumeId?: string
	resumeSlug?: string
	method: string
	confidence: number
	filename?: string
	fileType?: string
	fileSize?: number
	processingType?: "generator"
	processingTime?: number
}

export function useResumeGenerator(isAuthenticated: boolean) {
	const [state, setState] = useState<ResumeGeneratorState>(initialState)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const router = useRouter()
	const { addTempResume, generateTempSlug } = useTempResumeStore()

	const updateState = (updates: Partial<ResumeGeneratorState>) => {
		setState(prev => ({ ...prev, ...updates }))
	}

	const resetToInitialState = () => {
		setState(initialState)
	}

	const validateFileSelection = (file: File): string | null => {
		const allowedTypes = ["application/pdf"]
		if (!allowedTypes.includes(file.type)) {
			return "Please upload a PDF file only."
		}
		return null
	}

	const validateForm = (): string | null => {
		if (!state.uploadedFile) {
			return "Please upload a resume file to get started."
		}
		return null
	}

	const handleFileSelection = (file: File) => {
		const error = validateFileSelection(file)
		if (error) {
			updateState({ error })
			return
		}

		updateState({ uploadedFile: file, error: "" })
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) handleFileSelection(file)
	}

	const handleRemoveFile = () => {
		updateState({ uploadedFile: null, error: "" })
		if (fileInputRef.current) fileInputRef.current.value = ""
	}

	const setProfileImage = (image: string) => updateState({ profileImage: image })
	const setCustomColors = (colors: Record<string, string>) => updateState({ customColors: colors })
	const setShowColorDialog = (show: boolean) => updateState({ showColorDialog: show })
	const setShowErrorModal = (show: boolean) => updateState({ showErrorModal: show })

	// Drag and drop handlers
	const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()

		const file = e.dataTransfer.files?.[0]
		if (file) handleFileSelection(file)
	}

	const handleStreamUpdate = (streamUpdate: StreamUpdate) => {
		updateState({
			streamingProgress: streamUpdate.progress || 0,
			streamingMessage: streamUpdate.message || "",
			partialResumeData: streamUpdate.partialData || null,
		})
	}

	const handleSuccessfulParse = async (parsedData: ParsedResumeSchema, uploadInfo?: ParseInfo) => {
		console.log("[GeneratorTool] Resume generated successfully:", {
			hasData: !!parsedData,
			method: uploadInfo?.method,
			confidence: uploadInfo?.confidence,
			processingType: uploadInfo?.processingType,
		})

		updateState({ localResumeData: parsedData })

		if (isAuthenticated) {
			// Save to database for authed users
			try {
				const response = await fetch("/api/resumes", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(parsedData),
				})
				if (!response.ok) {
					throw new Error("Failed to save resume to your library.")
				}
				router.push("/library")
				return
			} catch (_err) {
				updateState({
					modalErrorMessage: "Failed to save resume to your library. You can still preview it as a temp resume.",
					showErrorModal: true,
				})
				// fallback to temp resume preview
			}
		}

		// Create temporary resume for unauthed users or fallback
		if (parsedData) {
			const tempSlug = generateTempSlug()

			addTempResume(tempSlug, parsedData, undefined, "ai-resume-generator")

			console.log("[GeneratorTool] Created temp resume with slug:", tempSlug)
			router.push(`/resume/temp-resume/${tempSlug}`)
		}
	}

	// Main submit function
	const handleCreateResume = async () => {
		const validationError = validateForm()
		if (validationError) {
			updateState({ error: validationError })
			return
		}

		updateState({
			error: "",
			isProcessing: true,
			streamingProgress: 0,
			streamingMessage: "Analyzing your resume with precision...",
		})

		try {
			const formData = createGeneratorFormData(state, isAuthenticated)

			// Log form data for debugging
			const formDataLog: Record<string, string | File> = {}
			formData.forEach((value, key) => {
				formDataLog[key] = value instanceof File ? `[File: ${value.name}, size: ${value.size}]` : value
			})
			console.log("[GeneratorTool] Submitting resume for precise extraction:", formDataLog)

			const result = await parseResumeGenerator(formData, handleStreamUpdate)

			if (result.status === "completed" && result.data) {
				handleSuccessfulParse(result.data, result.meta)
			}
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."

			const enhancedErrorMessage = `${errorMessage}\n\nDon't worry! You can try again with:
• A different resume file format (PDF or TXT)
• Checking your internet connection
• Ensuring the file contains readable text

The resume generator focuses on precise extraction, so clear, well-formatted files work best.`

			updateState({
				modalErrorMessage: enhancedErrorMessage,
				showErrorModal: true,
				error: "",
			})
		} finally {
			updateState({
				streamingProgress: 0,
				streamingMessage: "",
				partialResumeData: null,
				isProcessing: false,
			})
		}
	}

	return {
		// State
		state,

		// Refs
		fileInputRef,

		// Actions
		handleFileChange,
		handleRemoveFile,
		handleDrag,
		handleDrop,
		handleCreateResume,
		resetToInitialState,

		// Setters
		setProfileImage,
		setCustomColors,
		setShowColorDialog,
		setShowErrorModal,
	}
}
