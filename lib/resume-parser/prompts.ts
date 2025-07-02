export const getResumeParsingPrompt = (content: string): string => `
Parse the following resume content into a structured JSON object.

IMPORTANT INSTRUCTIONS:
- Contact Details: Extract all contact information carefully. For location, find City and Country. For social links, extract the full URL.
- Section Handling: Treat "EMPLOYMENT HISTORY" and "WORK EXPERIENCE" as the same 'experience' section. Ignore any "PREFERENCES" or "REFERENCES" sections.
- Summary Processing: If the professional summary is over 600 characters, rewrite it to be a concise, professional summary under 600 characters, retaining the key skills and achievements.
- Experience Details: For each job, summarize responsibilities and achievements into a maximum of 2-3 concise bullet points, each as a separate string.

${content ? `Resume content to parse:\n---\n${content}\n---` : ''}
`;

// New prompt specifically for PDF parsing
export const getResumeParsingPromptForPDF = (): string => `
You are an expert at parsing resumes and converting them into structured JSON data.
Your task is to extract information from the provided resume (PDF content) and format it as a JSON object strictly adhering to the following schema:

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
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "The name of the custom color (e.g., 'primary', 'secondary')."
          },
          "value": {
            "type": "string",
            "description": "The hexadecimal or named CSS color value (e.g., '#FF0000', 'blue')."
          }
        },
        "required": [
          "name",
          "value"
        ]
      },
      "description": "A list of custom color definitions, each with a name and a value."
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

Instructions:
 * Strict Adherence: Ensure the output JSON strictly follows the provided schema, including data types and required fields.
 * Field Extraction:
   * name: Extract the full name of the individual.
   * title: Extract their current or most recent job title.
   * summary: If a summary or professional objective section is present, extract its content. If not, omit this field.
   * profileImage: If a URL or path to a profile image is explicitly mentioned or inferable, provide it. Otherwise, omit.
   * customColors: If the resume explicitly mentions a colour scheme (e.g., "Primary Colour: #123456"), extract these as an array of objects with name and value. Otherwise, omit this field.
   * contact: Extract contact details (email, phone, location, website, GitHub, LinkedIn). Omit any sub-fields that are not found.
   * experience: For each work experience entry, extract the title, company, duration (e.g., "Jan 2020 - Present"), and ALL relevant bullet points, responsibilities, and achievements into the details (a list of strings). Ensure no significant details are missed.
   * education: For each educational entry, extract the degree, institution, duration, and any note.
   * certifications: For each certification, extract the name, issuer, date of issuance, and any id or credential ID.
   * skills: Extract a comprehensive list of skills.
 * Optional Fields: If an optional field or sub-field is not found in the resume, omit it from the JSON output. Do not include empty strings or nulls for optional fields that are not present.
 * Arrays: Ensure array fields (experience, education, certifications, skills, customColors, details within experience) are always arrays, even if empty.
 * Accuracy: Prioritise accurate extraction of information as presented in the resume.
 * Output: Provide only the JSON object. Do not include any conversational text or explanations outside the JSON.
<!-- end list -->
`;
