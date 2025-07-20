import { z } from 'zod';

export const parsedResumeSchema = z.object({
  name: z.string().describe('Full name of the individual.'),
  title: z.string().describe('Current or most recent job title.'),
  summary: z.string().optional(),
  profileImage: z.string().optional(),
  customColors: z.record(z.string(), z.string()).optional(),
  contact: z
    .object({
      email: z.string().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
      website: z.string().optional(),
      github: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
  skills: z.array(z.string()).optional(),
  education: z
    .array(
      z.object({
        id: z.string().optional(),
        degree: z.string(),
        institution: z.string(),
        duration: z.string().optional(),
        note: z.string().optional(),
      })
    )
    .optional(),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string(),
        date: z.string().optional(),
        id: z.string().optional(),
      })
    )
    .optional(),
  experience: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().optional(),
      company: z.string().optional(),
      role: z.string(),
      duration: z.string().optional(),
      details: z.array(z.string()),
    })
  ),
  metadata: z
    .object({
      lastUpdated: z.string().optional(),
      version: z.string().optional(),
      source: z.string().optional(),
      aiTailorCommentary: z.string().optional(), // AI-generated summary/commentary for UI
    })
    .optional(),
});

export type ParsedResumeSchema = z.infer<typeof parsedResumeSchema>;
