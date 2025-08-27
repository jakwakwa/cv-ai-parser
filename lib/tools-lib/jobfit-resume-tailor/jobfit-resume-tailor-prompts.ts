import { RESUME_JSON_SCHEMA } from '../shared-resume-tool-prompts';

// Parsed PDF gets tailored to new object
export const getTailoredResumeParsingPrompt = (
  resumeContent: string,
  jobSpec: string,
  tone: string
): string => `
You are an expert resume writer and AI assistant. Your task is to extract information from the provided resume content, tailor it to the given job specification, and return a structured JSON object.

REQUIRED SCHEMA STRUCTURE:
${RESUME_JSON_SCHEMA}

**1. Job Specification for Tailoring:**
---
${jobSpec}
---

**2. Desired Tone:** ${tone}

**3. Resume Content to Process:**
---
${resumeContent}
---

TAILORING REQUIREMENTS:
1. Preserve all factual information (dates, company names, education details)
2. Optimize bullet points to highlight relevant experience for the target role
3. Incorporate keywords from job specification naturally throughout the resume
4. Reorder and emphasize experiences that best match the job requirements
5. Adjust skill descriptions to align with job requirements
6. Maintain professional formatting and structure
7. Ensure ATS compatibility with clean, parsed output
8. Generate a human-readable commentary about the tailoring process in metadata.aiTailorCommentary

IMPORTANT: 
- Include a commentary in metadata.aiTailorCommentary explaining how the resume was optimized for this role
- Highlight key strengths and matches between the candidate and job requirements
- Note any significant changes or optimizations made

Output as a valid JSON object following REQUIRED SCHEMA STRUCTURE:

**Critical Rule:** Do not include any text or explanations outside of the final JSON object.
`;
