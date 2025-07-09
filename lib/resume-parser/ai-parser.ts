import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { AI_MODEL } from '@/lib/config';
import { type EnhancedParsedResume, enhancedResumeSchema } from './enhanced-schema';
import {
  getResumeParsingPrompt,
  getResumeParsingPromptForPDF,
  getTailoredResumeParsingPrompt,
} from './prompts';

// Extended options for parsing with tailoring support
interface ParseOptions {
  jobSpec?: string;
  tone?: string;
}

export async function streamableParseWithAI(
  content: string,
  options?: ParseOptions
) {
  const hasOptions = options?.tone;
  const hasJobSpec = options?.jobSpec;
  const hasTailoringParameters = hasJobSpec && hasOptions;

  const prompt = hasTailoringParameters
    ? getTailoredResumeParsingPrompt(
        content,
        options.jobSpec as string,
        options.tone as string
      )
    : getResumeParsingPrompt(content);

  const stream = await streamObject({
    model: google(AI_MODEL),
    schema: enhancedResumeSchema,
    prompt,
  });

  return stream;
}

// Existing parseWithAI and parseWithAIPDF for non-streaming use cases
export async function parseWithAI(
  content: string,
  options?: ParseOptions
): Promise<EnhancedParsedResume> {
  const stream = await streamableParseWithAI(content, options);
  return await stream.object;
}

export async function parseWithAIPDF(
  file: File,
  options?: ParseOptions
): Promise<EnhancedParsedResume> {
  const stream = await streamableParseWithAIPDF(file, options);
  return await stream.object;
}

export async function streamableParseWithAIPDF(
  file: File,
  options?: ParseOptions
) {
  const hasJobSpec = options?.jobSpec;
  const hasTone = options?.tone;
  const hasTailoringParameters = hasJobSpec && hasTone;

  if (hasTailoringParameters) {
    const stream = await streamObject({
      model: google(AI_MODEL),
      schema: enhancedResumeSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `${getResumeParsingPromptForPDF()}

ADDITIONAL TAILORING INSTRUCTIONS:
This resume should be tailored for the following job specification:
---
${options.jobSpec as string}
---

Desired tone: ${options.tone as string}

Please tailor the summary, experience descriptions, and skills to emphasize elements most relevant to this job specification while using the specified tone.

IMPORTANT: Generate a short, human-readable commentary about the tailoring process and include it in metadata.aiTailorCommentary. This should highlight how well the resume matches the job, key strengths, and any notable optimizations made.`,
            },
            {
              type: 'file',
              data: await file.arrayBuffer(),
              mimeType: file.type,
            },
          ],
        },
      ],
    });
    return stream;
  }

  // Standard PDF parsing
  const stream = await streamObject({
    model: google(AI_MODEL),
    schema: enhancedResumeSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: getResumeParsingPromptForPDF(),
          },
          {
            type: 'file',
            data: await file.arrayBuffer(),
            mimeType: file.type,
          },
        ],
      },
    ],
  });
  return stream;
}
