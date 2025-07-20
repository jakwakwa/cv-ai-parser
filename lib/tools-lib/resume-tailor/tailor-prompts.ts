import { RESUME_JSON_SCHEMA } from "../shared-resume-tool-prompts";

// Enhanced tailoring prompt for job-specific optimization
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

// Original resume parsing (first step of tailoring process)
export const getOriginalResumeParsingPrompt = (resumeContent: string): string => `
You are an expert resume parser. Extract information from the provided resume content exactly as presented, without any modifications or enhancements.

REQUIRED SCHEMA STRUCTURE:
${RESUME_JSON_SCHEMA}

ORIGINAL EXTRACTION RULES:
- Extract information precisely as written
- Maintain original structure and order
- Preserve exact wording and phrasing
- Do not optimize or enhance content
- Focus on complete and accurate extraction

RESUME CONTENT:
---
${resumeContent}
---

Output as a valid JSON object following REQUIRED SCHEMA STRUCTURE.
**Critical Rule:** Do not include any text or explanations outside of the final JSON object.
`;

// Job specification analysis prompt
export const getJobSpecAnalysisPrompt = (jobSpec: string): string => `
Analyze the following job specification and extract key requirements:

JOB SPECIFICATION:
---
${jobSpec}
---

Extract and identify:
1. Required skills and technologies
2. Key responsibilities
3. Experience requirements
4. Industry-specific keywords
5. Soft skills mentioned
6. Preferred qualifications

Return as a structured analysis that can be used for resume tailoring.
`;

// Tailoring strategy configuration based on tone
export const getTailoringStrategy = (tone: string) => {
  const strategies = {
    Formal: {
      language: 'professional and conservative',
      keywordDensity: 'moderate',
      bulletStyle: 'action-oriented with quantifiable results',
      summaryStyle: 'concise and achievement-focused',
    },
    Neutral: {
      language: 'balanced professional tone',
      keywordDensity: 'optimal',
      bulletStyle: 'clear achievements with balanced technical and soft skills',
      summaryStyle: 'comprehensive yet focused on key qualifications',
    },
    Creative: {
      language: 'dynamic and engaging',
      keywordDensity: 'high',
      bulletStyle: 'impactful statements with innovative achievements',
      summaryStyle: 'compelling narrative highlighting unique value proposition',
    },
  };
  
  return strategies[tone as keyof typeof strategies] || strategies.Neutral;
};

// Tailor-specific configuration
export const TAILOR_CONFIG = {
  maxRetries: 2,
  timeoutMs: 45000,
  aiModel: 'creativity-optimized',
  features: ['job-matching', 'keyword-optimization', 'tone-adjustment', 'ats-optimization'],
  confidenceThreshold: 0.75,
  optimizationLevel: 'moderate',
  keywordIntegration: 'natural',
}; 