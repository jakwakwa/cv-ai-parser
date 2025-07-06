import type { ParsedResume } from '@/lib/resume-parser/schema';
import type { ParsedJobSpec, UserAdditionalContext } from './schemas';

type ToneInstructions = {
  [K in UserAdditionalContext['tone']]: string;
};

const TONE_GUIDELINES: ToneInstructions = {
  Formal:
    'Use professional, conservative language. Emphasize stability, reliability, and proven track record. Avoid casual expressions.',
  Neutral:
    'Maintain a balanced, professional tone. Focus on clear, concise descriptions of achievements and capabilities.',
  Creative:
    'Use dynamic, engaging language. Highlight innovation, adaptability, and unique contributions. Show personality while remaining professional.',
};

export function buildTailorPrompt(args: {
  resume: ParsedResume;
  jobSpec: ParsedJobSpec;
  tone: UserAdditionalContext['tone'];
  extraPrompt?: string;
}): string {
  const { resume, jobSpec, tone, extraPrompt } = args;

  const systemPrompt = `
You are an expert resume writer specializing in ATS optimization and job-specific tailoring.

TASK: Rewrite the provided resume to better align with the target job specification while maintaining accuracy and chronological integrity.

TONE INSTRUCTIONS: ${TONE_GUIDELINES[tone]}

REQUIREMENTS:
1. Preserve all factual information (dates, company names, education)
2. Optimize bullet points to highlight relevant experience for the target role
3. Incorporate keywords from job specification naturally
4. Maintain professional formatting and structure
5. Ensure ATS compatibility with clean, parsed output
6. Return response in the exact JSON schema format as the original resume

RESPONSE FORMAT: Return only valid JSON matching the original resume schema. No explanatory text.
`;

  const userPrompt = `
TARGET JOB SPECIFICATION:
Position: ${jobSpec.positionTitle}
Required Skills: ${jobSpec.requiredSkills.join(', ')}
Experience Required: ${jobSpec.yearsExperience ? `${jobSpec.yearsExperience}+ years` : 'Not specified'}
Key Responsibilities: ${jobSpec.responsibilities?.join('; ') || 'Not specified'}
Company Values: ${jobSpec.companyValues?.join(', ') || 'Not specified'}

ORIGINAL RESUME:
${JSON.stringify(resume, null, 2)}

${extraPrompt ? `\nADDITIONAL INSTRUCTIONS:\n${extraPrompt}` : ''}

Rewrite this resume to optimize for the target position while following the tone guidelines above.
`;

  return `${systemPrompt}\n\n${userPrompt}`;
}
