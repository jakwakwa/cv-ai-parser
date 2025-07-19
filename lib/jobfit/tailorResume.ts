import { google } from '@ai-sdk/google';
import { generateObject, streamObject } from 'ai';
import { AI_MODEL } from '@/lib/config';
import { aiResumeSchema, type ParsedResume } from '@/lib/resume-parser/schema';
import { buildTailorPrompt } from './dynamicPromptGenerator';
import type { ParsedJobSpec, UserAdditionalContext } from './schemas';

export interface TailorResumeParams {
  originalResume: ParsedResume;
  jobSpec: ParsedJobSpec;
  tone: UserAdditionalContext['tone'];
  extraPrompt?: string;
  enableStreaming?: boolean;
}

export async function tailorResume(
  params: TailorResumeParams
): Promise<ParsedResume> {
  const {
    originalResume,
    jobSpec,
    tone,
    extraPrompt,
    enableStreaming = false,
  } = params;

  console.log(`Starting resume tailoring with tone: ${tone}`);

  const prompt = buildTailorPrompt({
    resume: originalResume,
    jobSpec,
    tone,
    extraPrompt,
  });

  try {
    if (enableStreaming) {
      return await tailorResumeStreaming(prompt);
    }
    return await tailorResumeStandard(prompt);
  } catch (error) {
    console.error('Resume tailoring failed:', error);

    // Return original resume as fallback
    console.log('Falling back to original resume due to tailoring failure');
    return originalResume;
  }
}

async function tailorResumeStandard(prompt: string): Promise<ParsedResume> {
  const { object } = await generateObject({
    model: google(AI_MODEL),
    schema: aiResumeSchema,
    prompt,
    temperature: 0.3, // Slightly creative but controlled
  });

  // Add back customColors as empty object (will be merged with original later)
  const tailoredResume = object as ParsedResume;
  return {
    ...tailoredResume,
    customColors: {},
  };
}

async function tailorResumeStreaming(prompt: string): Promise<ParsedResume> {
  const stream = await streamObject({
    model: google(AI_MODEL),
    schema: aiResumeSchema,
    prompt,
    temperature: 0.3,
  });

  // For streaming, we need to collect the full object
  // Implementation depends on how you want to handle partial updates
  // Add back customColors as empty object
  const streamedResume = (await stream.object) as ParsedResume;
  return {
    ...streamedResume,
    customColors: {},
  };
}
