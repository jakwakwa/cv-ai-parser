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
Parse the resume document provided into a structured JSON object. 

IMPORTANT INSTRUCTIONS:
- Document Analysis: Analyze the entire PDF document, understanding its layout, sections, and visual hierarchy
- Contact Details: Extract all contact information carefully, including emails, phone numbers, addresses, and social media links
- Section Recognition: Identify and parse sections like Experience, Education, Skills, Certifications, etc.
- Layout Understanding: Use the document's visual structure (headings, bullet points, spacing) to understand content organization
- Summary Processing: If the professional summary is over 600 characters, rewrite it to be concise and professional under 600 characters
- Experience Details: For each job, extract and summarize responsibilities into 2-3 clear bullet points
- Skills Extraction: Identify both hard and soft skills, technical proficiencies, and certifications
- Date Parsing: Extract and standardize all dates (employment periods, education, certifications)

Please parse this resume document and return the structured data according to the provided schema.
`;
