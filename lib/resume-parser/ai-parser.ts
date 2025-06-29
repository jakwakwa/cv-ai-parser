import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { AI_MODEL } from '@/lib/config';
import { getResumeParsingPrompt } from './prompts';
import { type ParsedResume, resumeSchema } from './schema';

export async function parseWithAI(content: string): Promise<ParsedResume> {
  console.log(`Starting AI parsing with model: ${AI_MODEL}`);

  const { object } = await generateObject({
    model: google(AI_MODEL),
    schema: resumeSchema,
    prompt: getResumeParsingPrompt(content),
  });

  console.log('AI parsing completed successfully.');
  return object;
}
