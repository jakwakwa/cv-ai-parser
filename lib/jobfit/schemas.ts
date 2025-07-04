import { z } from 'zod';

export const jobSpecSchema = z.object({
  positionTitle: z.string().min(1).max(100),
  requiredSkills: z.array(z.string()).min(1).max(50),
  yearsExperience: z.number().int().min(0).max(50).optional(),
  responsibilities: z.array(z.string()).max(20).optional(),
  companyValues: z.array(z.string()).max(10).optional(),
  industryType: z.string().max(50).optional(),
  teamSize: z.enum(['small', 'medium', 'large', 'enterprise']).optional(),
});

export const userAdditionalContextSchema = z
  .object({
    jobSpecSource: z.enum(['upload', 'pasted']),
    jobSpecText: z.string().max(1000).optional(),
    jobSpecFileUrl: z.string().url().optional(),
    tone: z.enum(['Formal', 'Neutral', 'Creative']),
    extraPrompt: z.string().max(300).optional(),
  })
  .refine((data) => data.jobSpecText || data.jobSpecFileUrl, {
    message: 'Either jobSpecText or jobSpecFileUrl must be provided',
  });

export type ParsedJobSpec = z.infer<typeof jobSpecSchema>;
export type UserAdditionalContext = z.infer<typeof userAdditionalContextSchema>;
