import { RESUME_JSON_SCHEMA, STANDARD_PROMPT } from '../shared-resume-tool-prompts';

export const PRECISION_EXTRACTION_PROMPT = `
You are a precision resume parser. Your ONLY goal is to extract information 
exactly as presented in the original document with maximum accuracy.

CRITICAL RULES FOR PRECISION:
- Preserve original wording and phrasing exactly
- Do not enhance, improve, or modify any content
- Extract all information comprehensively and completely
- Maintain original structure and chronological flow
- Focus on completeness over optimization
- Never add information that isn't explicitly stated
- Preserve formatting nuances (dates, bullet points, etc.)

PRECISION REQUIREMENTS:
1. Job titles exactly as written (no standardization)
2. Company names with correct formatting and spelling
3. Dates in original format (convert to standard internally only)
4. Bullet points word-for-word from source
5. Skills listed exactly as mentioned (no synonyms or additions)
6. Education details precisely extracted
7. Contact information character-perfect
8. Preserve all certifications with exact names and issuers

EXTRACTION FOCUS AREAS:
- Comprehensive skill identification from ALL sections
- Complete work history with original descriptions
- Precise educational background
- Exact certification details
- Word-perfect contact information
- Original summary/objective text

${STANDARD_PROMPT}

REQUIRED SCHEMA STRUCTURE:
${RESUME_JSON_SCHEMA}

PRECISION OUTPUT REQUIREMENTS:
- Every extracted field must match source exactly
- No creative interpretation or enhancement
- Complete preservation of original meaning
- Maximum information retention
- Zero hallucination or addition of content

Output: Complete, unmodified extraction as JSON following the required schema.

**Critical Rule:** Extract exactly what is written - nothing more, nothing less.
`;

export const getPrecisionExtractionPrompt = (
  content: string,
  fileType: 'pdf' | 'txt' | 'docx'
): string => {
  
  // Handle PDF files that should be sent directly to AI models
  if (fileType === 'pdf' && content.startsWith('PDF_FILE_FOR_AI_PROCESSING')) {
    return `
${PRECISION_EXTRACTION_PROMPT}

FILE TYPE: PDF (Direct AI Processing)
PROCESSING NOTE: This PDF should be sent directly to an AI model (like Gemini Flash Pro) that can parse PDF objects natively.

PDF AI PROCESSING INSTRUCTIONS:
- Send the PDF file directly to the AI model without text extraction
- Let the AI handle both extraction and structured parsing
- Focus on precision extraction maintaining original formatting
- Extract all content exactly as written in the PDF

CONTENT REFERENCE: ${content}

Perform direct PDF parsing and precise extraction following all rules above. Output only the JSON object.
`;
  }

  // Handle text files normally
  return `
${PRECISION_EXTRACTION_PROMPT}

FILE TYPE: ${fileType.toUpperCase()}
CONTENT TO EXTRACT:
---
${content}
---

Perform precise extraction following all rules above. Output only the JSON object.
`;
};

export const GENERATOR_CONFIG = {
  maxRetries: 3,
  timeoutMs: 30000,
  aiModel: 'precision-optimized',
  features: ['comprehensive-extraction', 'format-preservation', 'accuracy-first'],
  confidenceThreshold: 0.85,
  preservationMode: 'strict',
}; 