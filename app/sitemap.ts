import type { MetadataRoute } from "next"
import { ResumeDatabase } from "@/lib/db"
import { SITE } from "@/src/lib/seo/config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const lastModified = new Date()
	const resumes = await ResumeDatabase.getAllPublicResumes()

	const staticPages = [
		"/",
		"/blog",
		"/blog/ats-optimization",
		"/blog/career-advice",
		"/blog/resume-writing-tips",
		"/blog/profile-summary-guide",
		"/free-ai-tools/ai-resume-builder",
		"/free-ai-tools/resume-tailor",
		"/resources",
		"/resources/posts",
		"/resources/guides/jobfit-tailor-instructions",
		"/resources/guides/resume-from-file",
		"/privacy-policy",
		"/terms-and-conditions",
	]

	const staticEntries: MetadataRoute.Sitemap = [
		{
			url: SITE.baseUrl,
			lastModified,
			changeFrequency: "monthly",
			priority: 1.0,
		},

		...staticPages.slice(1).map(path => ({
			url: `${SITE.baseUrl}${path}`,
			lastModified,
			changeFrequency: "weekly" as const,
			priority: path.includes("privacy") || path.includes("terms") ? 0.3 : 0.3,
		})),
	]

	const resumeEntries: MetadataRoute.Sitemap = resumes.map(({ slug, updatedAt }) => ({
		url: `${SITE.baseUrl}/resume/${slug}`,
		lastModified: new Date(updatedAt),
		changeFrequency: "weekly",
		priority: 0.5,
	}))

	return [...staticEntries, ...resumeEntries]
}
