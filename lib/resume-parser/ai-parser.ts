import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { AI_MODEL } from '@/lib/config';
import {
  getResumeParsingPrompt,
  getResumeParsingPromptForPDF,
  getTailoredResumeParsingPrompt,
} from './prompts';
import { type AIParsedResume, aiResumeSchema } from './schema';

// Extended options for parsing with tailoring support
interface ParseOptions {
  jobSpec?: string;
  tone?: string;
}

export async function parseWithAI(
  content: string,
  options?: ParseOptions
): Promise<AIParsedResume> {
  // Check if we have the required parameters for tailored parsing
  const hasOptions = options?.tone;
  const hasJobSpec = options?.jobSpec;
  const hasTailoringParameters = hasJobSpec && hasOptions;

  // Determine which prompt to use based on tailoring requirements
  const prompt = hasTailoringParameters
    ? getTailoredResumeParsingPrompt(
        content,
        options.jobSpec as string, // Assert that jobSpec is a string here
        options.tone as string // Assert that tone is a string here
      )
    : getResumeParsingPrompt(content);

  const { object } = await generateObject({
    model: google(AI_MODEL),
    schema: aiResumeSchema,
    prompt,
  });

  console.log('AI parsing completed successfully.');
  return object;
}

// New function for PDF parsing with tailoring support
export async function parseWithAIPDF(
  file: File,
  options?: ParseOptions
): Promise<AIParsedResume> {
  console.log(`Starting PDF AI parsing with model: ${AI_MODEL}`);

  // Check if we have the required parameters for tailored parsing
  const hasJobSpec = options?.jobSpec;
  const hasTone = options?.tone;
  const hasTailoringParameters = hasJobSpec && hasTone;

  // For PDF parsing with tailoring, we need to handle it differently
  // since we can't pass the content directly to getTailoredResumeParsingPrompt
  if (hasTailoringParameters) {
    // For tailored PDF parsing, we'll use a modified approach
    // First get the content using basic PDF prompt, then tailor it
    console.log(
      'PDF tailoring requested - using integrated tailoring approach'
    );

    const { object } = await generateObject({
      model: google(AI_MODEL),
      schema: aiResumeSchema,
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

Please tailor the summary, experience descriptions, and skills to emphasize elements most relevant to this job specification while using the specified tone.`,
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

    console.log('PDF AI parsing with tailoring completed successfully.');
    return object;
  }

  // Standard PDF parsing
  const { object } = await generateObject({
    model: google(AI_MODEL),
    schema: aiResumeSchema,
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

  console.log('PDF AI parsing completed successfully.');
  return object;
}
