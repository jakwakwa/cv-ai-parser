import type { ParsedJobSpec } from '../jobfit/schemas';
import type { UserAdditionalContext } from '../types';
import type { ParsedResume } from './schema';

export function getResumeParsingPrompt(content: string): string {
  return `
You are an expert resume parser that extracts comprehensive structured data optimised for design mapping and visualisation.
Your task is to extract information from the provided resume PDF and format it as a detailed JSON object.

RESUME CONTENT:
---
---

ENHANCED EXTRACTION REQUIREMENTS:

1. PERSONAL INFORMATION:
   - Extract full name and current job title
   - Parse contact information with maximum detail
   - Split addresses into components (street, city, state, country, zipCode)
   - Identify all social media links and extract platform names and usernames

2. PROFESSIONAL SUMMARY:
  - Summary Processing: Extract professional introduction, coverletter, summary, OR objective, OR short bio.
    * If the professional summary is over 600 characters rewrite it to be a concise, professional summary under 600 characters, but do not reduce it to less than 400 characters.

  2. PROFESSIONAL IMAGE:
  - Image Processing: Omit extraction of profile images.

3. SKILLS (CRITICAL FOR VISUALISATION):
  - **Comprehensive Extraction**: Scan the *entire* resume document (including work experience, projects, education, and any other sections) to identify ALL relevant skills. Do not limit extraction to a dedicated "Skills" section.
  - **Format**: Provide these as a flat array of distinct string keywords. Each skill should be a single, concise term.
  - **Types of Skills**: Include, but are not limited to:
    * Technical abilities (programming languages, frameworks, software, tools)
    * Soft skills (communication, teamwork, problem-solving, leadership, adaptability)
    * Language proficiencies
    * Management skills
    * Any other relevant professional competencies.
  - **Limit**: Do not list more than 20 unique skill keywords to ensure conciseness.
  - **Examples**: ["React", "UI/UX Design", "Project Management", "Python", "Spanish", "Mentorship", "Data Analysis"].

4. WORK EXPERIENCE (Enhanced Structure):
   - For each position, extract:
     * Job title, company name, location, duration
     * Start and end dates in YYYY-MM format
     * Separate responsibilities from achievements
     * Extract quantifiable metrics (percentages, dollar amounts, team sizes)
     * Identify technologies, tools, and methodologies mentioned
     * Parse bullet points into structured categories

5. EDUCATION (Detailed Extraction):
   - Degree, institution, location, dates
   - GPA if mentioned (format as string)
   - Honours, awards, dean's list mentions
   - Relevant coursework if listed
   - Thesis or capstone project titles

6. CERTIFICATIONS (Complete Details):
   - Certification name and issuing organisation
   - Issue date and expiry date if mentioned
   - Credential IDs or URLs
   - Verification links

7. ADDITIONAL SECTIONS:
   - Projects: name, description, technologies, URLs, dates, highlights
   - Awards: name, issuer, date, description
   - Publications: title, publisher, date, co-authors, URLs
   - Volunteering: organisation, role, duration, key contributions

9. DATA TRANSFORMATION:
   - Normalise all dates to consistent formats
   - Standardise phone number formats
   - Clean and validate email addresses
   - Extract and normalise URLs
   - Convert relative dates ("2 years ago") to absolute dates

10. QUALITY ASSURANCE:
    - Ensure all required fields are present
    - Provide meaningful fallbacks for optional fields
    - Maintain data type consistency
    - Validate array structures

OUTPUT REQUIREMENTS:
- Provide only the JSON object, no additional text
- Accuracy: Prioritise accurate extraction of information as presented in the resume.
- Ensure strict adherence to the enhanced schema
- Focus on creating mappable, visualisation-ready data
- experience: For each work experience entry, extract the title, company,- duration (e.g., "Jan 2020 - Present"), and ALL relevant bullet points, responsibilities, and achievements into the details (a list of strings). Ensure no significant details are missed.
 * Arrays: Ensure array fields (experience, education, certifications, skills, customColors, details within experience) are ALWAYS arrays, even if empty.
The goal is to create a comprehensive data structure that can be seamlessly mapped to any design template while preserving all nuances and details from the original resume.

`;
}

export const getResumeParsingPromptForPDF = (): string => `
You are an expert resume parser that extracts comprehensive structured data optimised for design mapping and visualisation.
Your task is to extract information from the provided resume PDF and format it as a detailed JSON object.


ENHANCED EXTRACTION REQUIREMENTS:

1. PERSONAL INFORMATION:
   - Extract full name and current job title
   - Parse contact information with maximum detail
   - Split addresses into components (street, city, state, country, zipCode)
   - Identify all social media links and extract platform names and usernames

2. PROFESSIONAL SUMMARY:
  - Summary Processing: Extract professional introduction, coverletter, summary, OR objective, OR short bio.
    * If the professional summary is over 600 characters rewrite it to be a concise, professional summary under 600 characters, but do not reduce it to less than 400 characters.

  2. PROFESSIONAL IMAGE:
  - Image Processing: Omit extraction of profile images.

3. SKILLS (CRITICAL FOR VISUALISATION):
  - **Comprehensive Extraction**: Scan the *entire* resume document (including work experience, projects, education, and any other sections) to identify ALL relevant skills. Do not limit extraction to a dedicated "Skills" section.
  - **Format**: Provide these as a flat array of distinct string keywords. Each skill should be a single, concise term.
  - **Types of Skills**: Include, but are not limited to:
    * Technical abilities (programming languages, frameworks, software, tools)
    * Soft skills (communication, teamwork, problem-solving, leadership, adaptability)
    * Language proficiencies
    * Management skills
    * Any other relevant professional competencies.
  - **Limit**: Do not list more than 20 unique skill keywords to ensure conciseness.
  - **Examples**: ["React", "UI/UX Design", "Project Management", "Python", "Spanish", "Mentorship", "Data Analysis"].

4. WORK EXPERIENCE (Enhanced Structure):
   - For each position, extract:
     * Job title, company name, location, duration
     * Start and end dates in YYYY-MM format
     * Separate responsibilities from achievements
     * Extract quantifiable metrics (percentages, dollar amounts, team sizes)
     * Identify technologies, tools, and methodologies mentioned
     * Parse bullet points into structured categories

5. EDUCATION (Detailed Extraction):
   - Degree, institution, location, dates
   - GPA if mentioned (format as string)
   - Honours, awards, dean's list mentions
   - Relevant coursework if listed
   - Thesis or capstone project titles

6. CERTIFICATIONS (Complete Details):
   - Certification name and issuing organisation
   - Issue date and expiry date if mentioned
   - Credential IDs or URLs
   - Verification links

7. ADDITIONAL SECTIONS:
   - Projects: name, description, technologies, URLs, dates, highlights
   - Awards: name, issuer, date, description
   - Publications: title, publisher, date, co-authors, URLs
   - Volunteering: organisation, role, duration, key contributions

9. DATA TRANSFORMATION:
   - Normalise all dates to consistent formats
   - Standardise phone number formats
   - Clean and validate email addresses
   - Extract and normalise URLs
   - Convert relative dates ("2 years ago") to absolute dates

10. QUALITY ASSURANCE:
    - Ensure all required fields are present
    - Provide meaningful fallbacks for optional fields
    - Maintain data type consistency
    - Validate array structures

OUTPUT REQUIREMENTS:
- Provide only the JSON object, no additional text
- Accuracy: Prioritise accurate extraction of information as presented in the resume.
- Ensure strict adherence to the enhanced schema
- Focus on creating mappable, visualisation-ready data
- experience: For each work experience entry, extract the title, company,- duration (e.g., "Jan 2020 - Present"), and ALL relevant bullet points, responsibilities, and achievements into the details (a list of strings). Ensure no significant details are missed.
 * Arrays: Ensure array fields (experience, education, certifications, skills, customColors, details within experience) are ALWAYS arrays, even if empty.
The goal is to create a comprehensive data structure that can be seamlessly mapped to any design template while preserving all nuances and details from the original resume.
`;

export function buildTailorPrompt(args: {
  resume: ParsedResume;
  jobSpec: ParsedJobSpec;
  tone: UserAdditionalContext['tone'];
  // extraPrompt?: string;
}): string {
  const { resume, jobSpec, tone } = args;

  const toneInstructions = {
    Formal: 'Use professional, conservative language. Emphasize stability, reliability, and proven track record. Avoid casual expressions.',
    Neutral: 'Maintain a balanced, professional tone. Focus on clear, concise descriptions of achievements and capabilities.',
    Creative: 'Use dynamic, engaging language. Highlight innovation, adaptability, and unique contributions. Show personality while remaining professional.'
  };

  return `
You are an expert resume writer and AI assistant. Your task is to extract information from the provided resume content, tailor it to the given job specification, and return a structured JSON object.

**1. Job Specification for Tailoring:**

CURRENT RESUME:
---
${JSON.stringify(resume, null, 2)}
---

TARGET JOB SPECIFICATION:
---
${jobSpec || 'Not specified'}
---

TONE INSTRUCTIONS:
${toneInstructions[tone]}

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

{
  "name": "Jane Doe",
  "title": "Software Engineer",
  "summary": "...",
  "experience": [
    {
      "title": "Senior Developer",
      "company": "Tech Corp",
      "details": ["Optimized API performance by 30%.", "Led a team of 5 engineers."]
    }
  ],
  "metadata": {
    "aiTailorCommentary": "The candidate's experience in API optimization is a strong match for the role. The resume was updated to highlight leadership skills and quantify achievements, aligning with the job description's emphasis on team collaboration."
  }
}

**Critical Rule:** Do not include any text or explanations outside of the final JSON object.
`;
} 

