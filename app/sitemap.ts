import type { MetadataRoute } from "next"
import { SITE } from "@/src/lib/seo/config"

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date()

	const urls = [
		"/",
		"/blog",
		"/blog/ats-optimization",
		"/blog/career-advice",
		"/blog/resume-writing-tips",
		"/tools/ai-resume-generator",
		"/tools/ai-resume-tailor",
		"/library",
		"/docs",
		"/docs/posts",
		"/docs/guides/jobfit-tailor-instructions",
		"/docs/guides/resume-from-file",
		"/privacy-policy",
		"/terms-and-conditions",
	]

	return urls.map((path) => ({ url: `${SITE.baseUrl}${path}`, lastModified }))
}

import type { MetadataRoute } from "next"
import { ResumeDatabase } from "@/lib/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.airesumegen.com"
	const resumes = await ResumeDatabase.getAllPublicResumes()

	const resumeEntries: MetadataRoute.Sitemap = resumes.map(({ slug, updatedAt }) => ({
		url: `${baseUrl}/resume/${slug}`,
		lastModified: new Date(updatedAt),
		changeFrequency: "weekly",
		priority: 0.6,
	}))

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1.0,
		},
		{
			url: `${baseUrl}/library`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/privacy-policy`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.3,
		},
		{
			url: `${baseUrl}/terms-and-conditions`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.3,
		},
		...resumeEntries,
	]
}
