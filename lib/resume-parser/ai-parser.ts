import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { AI_MODEL } from '@/lib/config';
import {
  getResumeParsingPrompt,
  getResumeParsingPromptForPDF,
} from './prompts';
import { type AIParsedResume, aiResumeSchema } from './schema';

export async function parseWithAI(content: string): Promise<AIParsedResume> {
  const { object } = await generateObject({
    model: google(AI_MODEL),
    schema: aiResumeSchema,
    prompt: getResumeParsingPrompt(content),
  });

  console.log('AI parsing completed successfully.');
  return object;
}

// New function for PDF parsing
export async function parseWithAIPDF(file: File): Promise<AIParsedResume> {
  console.log(`Starting PDF AI parsing with model: ${AI_MODEL}`);

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
