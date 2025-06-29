export const getResumeParsingPrompt = (content: string): string => `
Parse the following resume content into a structured JSON object.

IMPORTANT INSTRUCTIONS:
- Contact Details: Extract all contact information carefully. For location, find City and Country. For social links, extract the full URL.
- Section Handling: Treat "EMPLOYMENT HISTORY" and "WORK EXPERIENCE" as the same 'experience' section. Ignore any "PREFERENCES" or "REFERENCES" sections.
- Summary Processing: If the professional summary is over 600 characters, rewrite it to be a concise, professional summary under 600 characters, retaining the key skills and achievements.
- Experience Details: For each job, summarize responsibilities and achievements into a maximum of 2-3 concise bullet points, each as a separate string.

Resume content to parse:
---
${content}
---
`;
