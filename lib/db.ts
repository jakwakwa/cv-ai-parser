/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <ecperimental feature. when tested it will get typed> */

import { db } from "./prisma"
import type { Resume, UserAdditionalContext } from "./types"

// Prisma client is imported from ./prisma

// Helper to convert Prisma resume to our Resume type
function convertPrismaResume(resume: any): Resume {
	if (!resume) return resume
	return {
		...resume,
		createdAt: resume.createdAt.toISOString(),
		updatedAt: resume.updatedAt.toISOString(),
	}
}

export class ResumeDatabase {
	/**
	 * Save a new resume to the database
	 */
	static async saveResume(data: {
		userId: string
		title: string
		originalFilename: string
		fileType: string
		fileSize: number
		parsedData: any // EnhancedParsedResume
		parseMethod: string
		confidenceScore: number
		isPublic: boolean
		slug: string
		additionalContext?: UserAdditionalContext
	}): Promise<Resume> {
		try {
			const resume = await db.resume.create({
				data: {
					userId: data.userId,
					title: data.title,
					originalFilename: data.originalFilename,
					fileType: data.fileType,
					fileSize: data.fileSize,
					parsedData: data.parsedData,
					parseMethod: data.parseMethod,
					confidenceScore: data.confidenceScore,
					isPublic: data.isPublic,
					slug: data.slug,
					additionalContext: data.additionalContext,
					viewCount: 0,
					downloadCount: 0,
				},
			})

			return convertPrismaResume(resume)
		} catch (_error) {
			throw new Error("Error saving resume")
		}
	}

	/**
	 * Get all resumes for a specific user
	 */
	static async getUserResumes(userId: string): Promise<Resume[]> {
		try {
			const resumes = await db.resume.findMany({
				where: { userId },
				orderBy: { createdAt: "desc" },
			})
			return resumes.map(convertPrismaResume)
		} catch (_error) {
			throw new Error("Error fetching user resumes")
		}
	}

	/**
	 * Get a specific resume by ID
	 */
	static async getResume(id: string): Promise<Resume | null> {
		try {
			const resume = await db.resume.findUnique({
				where: { id },
			})
			return convertPrismaResume(resume)
		} catch (_error) {
			throw new Error("Error fetching resume")
		}
	}

	/**
	 * Get a resume with additional context
	 */
	static async getResumeWithContext(id: string): Promise<Resume | null> {
		try {
			const resume = await db.resume.findUnique({
				where: { id },
				include: {
					user: {
						select: { id: true, name: true, email: true },
					},
				},
			})
			return convertPrismaResume(resume)
		} catch (_error) {
			throw new Error("Error fetching resume with context")
		}
	}

	/**
	 * Get a resume by slug for a specific user (including private resumes)
	 */
	static async getUserResumeBySlug(slug: string, userId: string): Promise<Resume | null> {
		try {
			const resume = await db.resume.findFirst({
				where: { slug, userId },
			})
			return convertPrismaResume(resume)
		} catch (_error) {
			throw new Error("Error fetching user resume by slug")
		}
	}

	/**
	 * Get a public resume by slug
	 */
	static async getPublicResume(slug: string): Promise<Resume | null> {
		try {
			const resume = await db.resume.findFirst({
				where: { slug, isPublic: true },
			})
			return convertPrismaResume(resume)
		} catch (_error) {
			throw new Error("Error fetching public resume")
		}
	}

	/**
	 * Get all public resumes (for sitemap generation)
	 */
	static async getAllPublicResumes(): Promise<Array<{ slug: string; updatedAt: Date }>> {
		try {
			const resumes = await db.resume.findMany({
				where: { isPublic: true },
				select: { slug: true, updatedAt: true },
				orderBy: { updatedAt: "desc" },
			})
			return resumes
		} catch (_error) {
			return []
		}
	}

	/**
	 * Update a resume
	 */
	static async updateResume(
		id: string,
		data: Partial<{
			title: string
			parsedData: any
			isPublic: boolean
			slug: string
		}>
	): Promise<Resume> {
		try {
			const updatedResume = await db.resume.update({
				where: { id },
				data: {
					...data,
					parsedData: data.parsedData ? data.parsedData : undefined,
				},
			})
			return convertPrismaResume(updatedResume)
		} catch (_error) {
			throw new Error("Error updating resume")
		}
	}

	/**
	 * Delete a resume
	 */
	static async deleteResume(id: string): Promise<void> {
		try {
			await db.resume.delete({
				where: { id },
			})
		} catch (_error) {
			throw new Error("Error deleting resume")
		}
	}

	/**
	 * Save a resume version for tracking
	 */
	static async saveResumeVersion(data: { resumeId: string; versionNumber: number; parsedData: any; changesSummary: string }): Promise<any> {
		try {
			const version = await db.resumeVersion.create({
				data: {
					resumeId: data.resumeId,
					versionNumber: data.versionNumber,
					parsedData: data.parsedData,
					changesSummary: data.changesSummary,
				},
			})
			return version
		} catch (_error) {
			throw new Error("Error saving resume version")
		}
	}

	/**
	 * Get all versions for a resume
	 */
	static async getResumeVersions(resumeId: string): Promise<any[]> {
		try {
			const versions = await db.resumeVersion.findMany({
				where: { resumeId },
				orderBy: { versionNumber: "desc" },
			})
			return versions
		} catch (_error) {
			throw new Error("Error fetching resume versions")
		}
	}

	/**
	 * Increment view count for a resume
	 */
	static async incrementViewCount(id: string): Promise<void> {
		try {
			await db.resume.update({
				where: { id },
				data: { viewCount: { increment: 1 } },
			})
		} catch (_error) {
			throw new Error("Error incrementing view count")
		}
	}
}
