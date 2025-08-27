// Define an explicit output shape for the model to return a data object, not a schema
const TAILORED_OUTPUT_SHAPE = `
Return one JSON object with the following keys and types (no extra keys):
{
  "name": string,
  "title": string,
  "summary"?: string,
  "profileImage"?: string | null,
  "customColors"?: { [name: string]: string },
  "contact"?: {
    "email"?: string,
    "phone"?: string,
    "location"?: string,
    "website"?: string,
    "github"?: string,
    "linkedin"?: string
  },
  "skills"?: string[],
  "education"?: Array<{ "degree": string, "institution": string, "duration"?: string, "note"?: string }>,
  "certifications"?: Array<{ "name": string, "issuer": string, "date"?: string, "id"?: string }>,
  "experience": Array<{
    "title"?: string,
    "company"?: string,
    "duration"?: string,
    "details": string[]
  }>,
  "metadata"?: { "aiTailorCommentary"?: string }
}

Rules:
- Output ONLY a JSON data object. Do NOT output a JSON Schema, types, or a "properties" wrapper.
- Do NOT include keys like "type", "properties", or "required".
- Do NOT include markdown code fences.
- Ensure arrays are arrays; ensure "experience[].details" is always an array of strings.
`;

// Enhanced tailoring prompt for job-specific optimization
export const getTailoredResumeParsingPrompt = (
  resumeContent: string,
  jobSpec: string,
  tone: string
): string => {
  
  // Handle regular content normally
  return `
You are an expert resume writer and AI assistant. Your task is to extract information from the provided resume content, tailor it to the given job specification, and return a structured JSON object.

REQUIRED OUTPUT SHAPE:
${TAILORED_OUTPUT_SHAPE}

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

Output as a valid JSON object following REQUIRED OUTPUT SHAPE.

**Critical Rule:** Do not include any text or explanations outside of the final JSON object.
`;
};

// Original resume parsing (first step of tailoring process)
export const getOriginalResumeParsingPrompt = (resumeContent: string): string => {
  
  // Handle text content normally
  return `
You are an expert resume parser. Extract information from the provided resume content exactly as presented, without any modifications or enhancements.

REQUIRED OUTPUT SHAPE:
${TAILORED_OUTPUT_SHAPE}

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

Output as a valid JSON object following REQUIRED OUTPUT SHAPE.
**Critical Rule:** Do not include any text or explanations outside of the final JSON object.
`;
};

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