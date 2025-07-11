// Import the enhanced schema
// import { enhancedResumeSchema } from './enhanced-schema';

const _RESUME_JSON_SCHEMA = `
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Full name of the individual."
    },
    "title": {
      "type": "string",
      "description": "Current or most recent job title."
    },
    "summary": {
      "type": "string"
    },
    "profileImage": {
      "type": "string"
    },
    "customColors": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      },
      "description": "A map of custom color names to their hexadecimal or named CSS color values."
    },
    "contact": {
      "type": "object",
      "properties": {
        "email": {
          "type": "string"
        },
        "phone": {
          "type": "string"
        },
        "location": {
          "type": "string"
        },
        "website": {
          "type": "string"
        },
        "github": {
          "type": "string"
        },
        "linkedin": {
          "type": "string"
        }
      }
    },
    "experience": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "company": {
            "type": "string"
          },
          "duration": {
            "type": "string",
            "description": "e.g., 'Jan 2020 - Present'"
          },
          "details": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "details"
        ]
      }
    },
    "education": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "degree": {
            "type": "string"
          },
          "institution": {
            "type": "string"
          },
          "duration": {
            "type": "string"
          },
          "note": {
            "type": "string"
          }
        },
        "required": [
          "degree",
          "institution"
        ]
      }
    },
    "certifications": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "issuer": {
            "type": "string"
          },
          "date": {
            "type": "string"
          },
          "id": {
            "type": "string"
          }
        },
        "required": [
          "name",
          "issuer"
        ]
      }
    },
    "skills": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "name",
    "title",
    "experience",
    "skills"
  ]
}
`;

export const getResumeParsingPrompt = (content: string): string => `
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

${content ? `Resume content to parse:\n---\n${content}\n---` : ''}
`;

// export const getTailoredResumeParsingPrompt = (resumeContent: string, jobSpec: string, tone?: string) => `
// You are an expert resume writer and AI assistant. Your task is to extract information from the provided resume content, tailor it to the given job specification, and return a structured JSON object.
//
// ** Your Task & Instructions:**
// **Critical Rule:** Do not include any text or explanations outside of the final JSON object.
//
// **1. Job Specification for Tailoring:**
// ---
// ${jobSpec}
// ---
//
// **2. Desired Tone:** ${tone}
// ${RESUME_JSON_SCHEMA}
//
//
// ${resumeContent}
//
// 1. PERSONAL INFORMATION:
//    - Extract full name and current job title
//    - Parse contact information with maximum detail
//    - Split addresses into components (street, city, state, country, zipCode)
//    - Identify all social media links and extract platform names and usernames
//
// 2. PROFESSIONAL SUMMARY:
//    - Extract professional summary or objective
//    - If over 500 characters, create a concise version while preserving key points
//    - Maintain professional tone and key achievements
//
//
// 3. SKILLS (CRITICAL FOR VISUALISATION):
//   - **Comprehensive Extraction**: Scan the *entire* resume document (including work experience, projects, education, and any other sections) to identify ALL relevant skills. Do not limit extraction to a dedicated "Skills" section.
//   - **Format**: Provide these as a flat array of distinct string keywords. Each skill should be a single, concise term.
//   - **Types of Skills**: Include, but are not limited to:
//     * Technical abilities (programming languages, frameworks, software, tools)
//     * Soft skills (communication, teamwork, problem-solving, leadership, adaptability)
//     * Language proficiencies
//     * Management skills
//     * Any other relevant professional competencies.
//   - **Limit**: Do not list more than 20 unique skill keywords to ensure conciseness.
//   - **Examples**: ["React", "UI/UX Design", "Project Management", "Python", "Spanish", "Mentorship", "Data Analysis"].
//
// 4. WORK EXPERIENCE (Enhanced Structure):
//    - For each position, extract:
//      * Job title, company name, location, duration
//      * Start and end dates in YYYY-MM format
//      * Separate responsibilities from achievements
//      * Extract quantifiable metrics (percentages, dollar amounts, team sizes)
//      * Identify technologies, tools, and methodologies mentioned
//      * Parse bullet points into structured categories
//
// 4. EDUCATION (Detailed Extraction):
//    - Degree, institution, location, dates
//    - GPA if mentioned (format as string)
//    - Honors, awards, dean's list mentions
//    - Relevant coursework if listed
//    - Thesis or capstone project titles
//
// 6. CERTIFICATIONS (Complete Details):
//    - Certification name and issuing organization
//    - Issue date and expiry date if mentioned
//    - Credential IDs or URLs
//    - Verification links
//
// 7. ADDITIONAL SECTIONS:
//    - Projects: name, description, technologies, URLs, dates, highlights
//    - Awards: name, issuer, date, description
//    - Publications: title, publisher, date, co-authors, URLs
//    - Volunteering: organization, role, duration, key contributions
//
// 8. METADATA AND MAPPING HINTS:
//    - Identify which sections appear most prominent in the original layout
//    - Note any color schemes or design preferences mentioned
//    - Determine content priority based on space allocation and emphasis
//    - Extract any specific formatting preferences
//    - **Generate a short, human-readable summary or commentary about the resume parsing result and include it in the output as metadata.aiTailorCommentary. This should highlight the overall strengths, unique aspects, and any notable findings from the resume.**
//
// 9. DATA TRANSFORMATION:
//    - Normalize all dates to consistent formats
//    - Standardize phone number formats
//    - Clean and validate email addresses
//    - Extract and normalize URLs
//    - Convert relative dates ("2 years ago") to absolute dates
//
// 10. QUALITY ASSURANCE:
//     - Ensure all required fields are present
//     - Provide meaningful fallbacks for optional fields
//     - Maintain data type consistency
//     - Validate array structures
//
// OUTPUT REQUIREMENTS:
// - Provide only the JSON object, no additional text
// - Ensure strict adherence to the enhanced schema
// - Prioritize data completeness and structure
// - Focus on creating mappable, visualization-ready data
// `;

// New prompt specifically for PDF parsing
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

export const getTailoredResumeParsingPrompt = (
  _resumeContent: string,
  jobSpec: string,
  tone: string
): string => `
You are an expert resume writer and AI assistant. Your task is to extract information from the provided resume content, tailor it to the given job specification, and return a structured JSON object.

**1. Job Specification for Tailoring:**
---
${jobSpec}
---

**2. Desired Tone:** ${tone}

**3. Resume Content to Process:**
---

**4. Your Task & Instructions:**

*   **Analyze and Extract:** Carefully read the resume content and extract all key information.
*   **Tailor Content:** Rewrite the 'summary' and 'experience.details' to align with the job specification, using the specified **tone**.
*   **Generate AI Commentary:** Create a concise commentary on the tailoring process and store it in \`metadata.aiTailorCommentary\`.
*   **Format Output as JSON:** The final output must be a single JSON object.

**5. Example JSON Output Structure:**
\`\`\`json
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
\`\`\`

**Critical Rule:** Do not include any text or explanations outside of the final JSON object.
`;
