"use client"

import React, { createContext, type ReactNode, useContext, useRef } from "react"
import { KEEP_TEMP_RESUMES_FOR_TESTING } from "@/lib/config"
import type { ParsedResumeSchema } from "@/lib/tools-lib/shared-parsed-resume-schema"

type SourceTool = "ai-resume-generator" | "ai-resume-tailor"

interface TempResumeData {
	slug: string
	resumeData: ParsedResumeSchema
	aiTailorCommentary?: string
	sourceTool: SourceTool
	createdAt: number
}

interface TempResumeStore {
	tempResumes: Map<string, TempResumeData>
	addTempResume: (slug: string, resumeData: ParsedResumeSchema, aiTailorCommentary?: string, sourceTool?: SourceTool) => void
	getTempResume: (slug: string) => TempResumeData | undefined
	removeTempResume: (slug: string) => void
	clearAllTempResumes: () => void
	generateTempSlug: () => string
	// Development helper
	getTempResumeCount: () => number
}

const TempResumeContext = createContext<TempResumeStore | null>(null)

export function TempResumeProvider({ children }: { children: ReactNode }) {
	const tempResumesRef = useRef(new Map<string, TempResumeData>())

	// Auto-cleanup old temp resumes (configurable for testing)
	React.useEffect(() => {
		if (KEEP_TEMP_RESUMES_FOR_TESTING) {
			// Don't auto-cleanup when testing flag is enabled
			return
		}

		const cleanupInterval = setInterval(
			() => {
				const now = Date.now()
				const oneHour = 60 * 60 * 1000 // 1 hour in milliseconds

				for (const [slug, data] of tempResumesRef.current.entries()) {
					if (now - data.createdAt > oneHour) {
						tempResumesRef.current.delete(slug)
					}
				}
			},
			5 * 60 * 1000
		) // Check every 5 minutes

		return () => clearInterval(cleanupInterval)
	}, [])

	const store: TempResumeStore = {
		get tempResumes() {
			return tempResumesRef.current
		},

		addTempResume: (
			slug: string,
			resumeData: ParsedResumeSchema,
			aiTailorCommentary?: string,
			sourceTool: SourceTool = "ai-resume-tailor" // Default to tailor for backward compatibility
		) => {
			tempResumesRef.current.set(slug, {
				slug,
				resumeData,
				aiTailorCommentary,
				sourceTool,
				createdAt: Date.now(),
			})
		},

		getTempResume: (slug: string) => {
			return tempResumesRef.current.get(slug)
		},

		removeTempResume: (slug: string) => {
			tempResumesRef.current.delete(slug)
		},

		clearAllTempResumes: () => {
			tempResumesRef.current.clear()
		},

		generateTempSlug: () => {
			// Generate a temporary slug using timestamp + random string
			const timestamp = Date.now().toString(36)
			const randomStr = Math.random().toString(36).substring(2, 8)
			return `temp-${timestamp}-${randomStr}`
		},

		getTempResumeCount: () => {
			return tempResumesRef.current.size
		},
	}

	return <TempResumeContext.Provider value={store}>{children}</TempResumeContext.Provider>
}

export function useTempResumeStore(): TempResumeStore {
	const context = useContext(TempResumeContext)
	if (!context) {
		throw new Error("useTempResumeStore must be used within TempResumeProvider")
	}
	return context
}

export type { SourceTool }
