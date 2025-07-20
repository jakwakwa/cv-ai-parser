import type { ToneOption } from '../types';

export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: ['application/pdf'],
} as const;

export const CHARACTER_LIMITS = {
  JOB_SPEC: 4000,
  JOB_SPEC_WARNING: 3800,
  EXTRA_PROMPT: 500,
  EXTRA_PROMPT_WARNING: 450,
} as const;

export const TONE_OPTIONS: Array<{
  value: ToneOption;
  label: string;
  description: string;
}> = [
  { value: 'Formal', label: 'Formal', description: 'Conservative, traditional' },
  { value: 'Neutral', label: 'Neutral', description: 'Balanced, professional' },
  { value: 'Creative', label: 'Creative', description: 'Dynamic, engaging' },
] as const;

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size must be less than 10MB',
  INVALID_FILE_TYPE: 'Please upload a .pdf file',
  NO_FILE: 'Please upload a resume file',
  NO_JOB_DESCRIPTION: 'Please provide a job description',
  NO_JOB_FILE: 'Please upload a job description file',
  JOB_SPEC_TOO_LONG: (length: number) => 
    `Job description is too long (${length}/${CHARACTER_LIMITS.JOB_SPEC} characters)`,
} as const; 