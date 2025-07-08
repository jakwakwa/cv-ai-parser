const RESUME_JSON_SCHEMA = `
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
You are an expert at parsing resumes and converting them into structured JSON data.
Your task is to extract information from the provided resume content and format it as a JSON object strictly adhering to the following schema:

${RESUME_JSON_SCHEMA}

Instructions:
 * Strict Adherence: Ensure the output JSON strictly follows the provided schema, including data types and required fields.
 * Field Extraction:
   * name: Extract the full name of the individual.
   * title: Extract their current or most recent job title.
   * summary: If a summary or professional objective section is present, extract its content. If not, omit this field. 
   * summary Processing: If the professional summary is over 600 characters, rewrite it to be a concise, professional summary under 600 characters, but do not reduce it to less than 500 characters.
   * profileImage: If a URL or path to a profile image is explicitly mentioned or inferable, provide it. Otherwise, omit.
   * customColors: If the resume explicitly mentions a colour scheme (e.g., "Primary Colour: #123456"), extract these as an array of objects with name and value. Otherwise, omit this field.
   * contact: Extract contact details (email, phone, location, website, GitHub, LinkedIn). Omit any sub-fields that are not found.
   * experience: For each work experience entry, extract the title, company, duration (e.g., "Jan 2020 - Present"), and ALL relevant bullet points, responsibilities, and achievements into the details (a list of strings). Ensure no significant details are missed.
   * education: For each educational entry, extract the degree, institution, duration, and any note.
   * certifications: For each certification, extract the name, issuer, date of issuance, and any id or credential ID.
   * skills: Extract each skill as a single keyword or short phrase (e.g., "React", "UI/UX Design", "Mentorship"). Do NOT include long descriptions or sentences. Each array item should be a concise skill term only.
 * Optional Fields: If an optional field or sub-field is not found in the resume, omit it from the JSON output. Do not include empty strings or nulls for optional fields that are not present.
 * Arrays: Ensure array fields (experience, education, certifications, skills, customColors, details within experience) are always arrays, even if empty.
 * Accuracy: Prioritise accurate extraction of information as presented in the resume.
 * Output: Provide only the JSON object. Do not include any conversational text or explanations outside the JSON.

${content ? `Resume content to parse:\n---\n${content}\n---` : ''}
`;

// New prompt specifically for PDF parsing
export const getResumeParsingPromptForPDF = (): string => `
You are an expert at parsing resumes and converting them into structured JSON data.
Your task is to extract information from the provided resume (PDF content) and format it as a JSON object strictly adhering to the following schema:

${RESUME_JSON_SCHEMA}

Instructions:
 * Strict Adherence: Ensure the output JSON strictly follows the provided schema, including data types and required fields.
 * Field Extraction:
   * name: Extract the full name of the individual.
   * title: Extract their current or most recent job title.
   * summary: If a summary or professional objective section is present, extract its content. If not, omit this field. 
   * summary Processing: If the professional summary is over 600 characters, rewrite it to be a concise, professional summary under 600 characters, 
   * summary Processing: when having to rewrite it to be under 600 characters do not reduce it to less than 500 characters with your edit.
   * profileImage: If a URL or path to a profile image is explicitly mentioned or inferable, provide it. Otherwise, omit.
   * customColors: If the resume explicitly mentions a colour scheme (e.g., "Primary Colour: #123456"), extract these as an array of objects with name and value. Otherwise, omit this field.
   * contact: Extract contact details (email, phone, location, website, GitHub, LinkedIn). Omit any sub-fields that are not found.
   * experience: For each work experience entry, extract the title, company, duration (e.g., "Jan 2020 - Present"), and ALL relevant bullet points, responsibilities, and achievements into the details (a list of strings). Ensure no significant details are missed.
   * education: For each educational entry, extract the degree, institution, duration, and any note.
   * certifications: For each certification, extract the name, issuer, date of issuance, and any id or credential ID.
   * skills: Extract each skill as a single keyword or short phrase (e.g., "React", "UI/UX Design", "Mentorship"). Do NOT include long descriptions or sentences. Each array item should be a concise skill term only.
 * Optional Fields: If an optional field or sub-field is not found in the resume, omit it from the JSON output. Do not include empty strings or nulls for optional fields that are not present.
 * Arrays: Ensure array fields (experience, education, certifications, skills, customColors, details within experience) are always arrays, even if empty.
 * Accuracy: Prioritise accurate extraction of information as presented in the resume.
 * Output: Provide only the JSON object. Do not include any conversational text or explanations outside the JSON.
<!-- end list -->
`;

export const getTailoredResumeParsingPrompt = (
  resumeContent: string,
  jobSpec: string,
  tone: string
): string => `
You are an expert resume writer and AI assistant. Your task is to extract and rewrite the provided resume content so that it is tailored to the following job specification and desired tone.

Job Specification:
---
${jobSpec}
---

Desired Tone: ${tone}

Instructions:
- Extract all relevant information from the resume.
- Rewrite the summary, experience, and skills sections to emphasize achievements, responsibilities, and skills that are most relevant to the job specification.
- Use the desired tone throughout (e.g., professional, enthusiastic, concise, etc.).
- For each experience entry, rephrase bullet points to highlight accomplishments and skills that match the job requirements.
- Remove or de-emphasize content that is not relevant to the job spec.
- Ensure the output strictly follows this JSON schema:
${RESUME_JSON_SCHEMA}

- If a summary is present, rewrite it to be under 600 characters, but not less than 500, and ensure it is highly relevant to the job spec.
- Omit optional fields if not present.
- Output only the JSON object, with extra commentary.

Resume content to tailor:
---
${resumeContent}
---
`;
