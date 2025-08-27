export const STANDARD_PROMPT = `

1. PERSONAL INFORMATION:
   - Extract full name and current job title
   - Parse contact information with maximum detail
   - Split addresses into components (street, city, state, country, zipCode)
   - Identify all social media links and extract platform names and usernames

2. PROFESSIONAL SUMMARY:
  - Summary Processing: Extract professional introduction, coverletter, summary, OR objective, OR short bio.
    * If the professional summary is over 600 characters rewrite it to be a concise, professional summary under 600 characters, but do not reduce it to less than 400 characters.

  2. PROFESSIONAL IMAGE:
  - Image Processing: DO NOT EXTRACT PROFILE IMAGE. ommit image for json and set as null value ALWAYS.

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
- Accuracy: Prioritise accurate extraction of information as presented in the resume.
- Ensure strict adherence to the enhanced schema
- Focus on creating mappable, visualisation-ready data
- experience: For each work experience entry, extract the title, company,- duration (e.g., "Jan 2020 - Present"), and ALL relevant bullet points, responsibilities, and achievements into the details (a list of strings). Ensure no significant details are missed.
 * Arrays: Ensure array fields (experience, education, certifications, skills, customColors, details within experience) are ALWAYS arrays, even if empty.
The goal is to create a comprehensive data structure that can be seamlessly mapped to any design template while preserving all nuances and details from the original resume.

Output as a valid JSON object following REQUIRED SCHEMA STRUCTURE:

**Critical Rule:** Do not include any text or explanations outside of the final JSON object.
`

export const RESUME_JSON_SCHEMA = `
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
`

export const getResumeParsingPromptForTXT = (uploadedTxtFile: File): string => `
You are an expert resume parser that extracts comprehensive structured data from text - optimised for design mapping and visualisation.
Your task is to extract information from the provided resume as .txt  and format it as a detailed JSON object.

REQUIRED SCHEMA STRUCTURE:
${RESUME_JSON_SCHEMA}

ENHANCED EXTRACTION REQUIREMENTS:
${STANDARD_PROMPT}

${uploadedTxtFile ? `Resume content to parse:\n---\n${uploadedTxtFile}\n---` : ""}
`

export const getResumeParsingPromptForPDF = (uploadedPdf: File): Blob | string => `
You are an expert resume parser that extracts comprehensive structured data from text - optimised for design mapping and visualisation.
Your task is to extract information from the provided resume as .txt  and format it as a detailed JSON object.

REQUIRED SCHEMA STRUCTURE:
${RESUME_JSON_SCHEMA}

ENHANCED EXTRACTION REQUIREMENTS:
${STANDARD_PROMPT}


${uploadedPdf ? `Resume content to parse:\n---\n${uploadedPdf}\n---` : ""}
`
