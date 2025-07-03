import type { MetadataRoute } from 'next';
import { ResumeDatabase } from '@/lib/database';
import { createClient } from '@/lib/supabase/server';
import type { Resume } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const resumes = await ResumeDatabase.getAllPublicResumes(supabase);

  const resumeEntries: MetadataRoute.Sitemap = resumes.map(
    ({ slug, updated_at }: Partial<Resume>) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/resume/${slug}`,
      lastModified: new Date(updated_at || new Date()),
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
