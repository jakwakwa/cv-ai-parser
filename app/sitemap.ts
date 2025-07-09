import type { MetadataRoute } from 'next';
import { ResumeDatabase } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const resumes = await ResumeDatabase.getAllPublicResumes();

  const resumeEntries: MetadataRoute.Sitemap = resumes.map(
    ({ slug, updatedAt }) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/resume/${slug}`,
      lastModified: new Date(updatedAt),
      changeFrequency: 'daily',
      priority: 0.7,
    })
  );

  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/library`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...resumeEntries,
  ];
}
