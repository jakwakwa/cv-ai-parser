import type { MetadataRoute } from "next";
import { SITE } from "@/src/lib/seo/config";
import { ResumeDatabase } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const resumes = await ResumeDatabase.getAllPublicResumes();

  const staticPages = [
    "/",
    "/blog",
    "/blog/ats-optimization",
    "/blog/career-advice",
    "/blog/resume-writing-tips",
    "/blog/profile-summary-guide",
    "/tools/ai-resume-generator",
    "/tools/ai-resume-tailor",
    "/library",
    "/docs",
    "/docs/posts",
    "/docs/guides/jobfit-tailor-instructions",
    "/docs/guides/resume-from-file",
    "/privacy-policy",
    "/terms-and-conditions",
  ];

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE.baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE.baseUrl}/library`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...staticPages.slice(1).map((path) => ({
      url: `${SITE.baseUrl}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path.includes("privacy") || path.includes("terms") ? 0.3 : 0.8,
    })),
  ];

  const resumeEntries: MetadataRoute.Sitemap = resumes.map(({ slug, updatedAt }) => ({
    url: `${SITE.baseUrl}/resume/${slug}`,
    lastModified: new Date(updatedAt),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...resumeEntries];
}
