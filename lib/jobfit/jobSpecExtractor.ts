import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { AI_MODEL } from '@/lib/config';
import { jobSpecSchema, type ParsedJobSpec } from './schemas';

const EXTRACTION_PROMPT = `
You are an expert HR analyst. Extract key hiring criteria from this job specification.
Focus on extracting:
- Exact position title
- Technical and soft skills (as individual items)
- Required years of experience
- Key responsibilities (as bullet points)
- Company values or culture mentions

Be precise and don't hallucinate information not present in the text.
`;

export async function extractJobSpecification(
  jobSpecText: string
): Promise<{ data: ParsedJobSpec; confidence: number }> {
  try {
    console.log('Starting job specification extraction...');

    const { object } = await generateObject({
      model: google(AI_MODEL),
      schema: jobSpecSchema,
      prompt: `${EXTRACTION_PROMPT}\n\nJob Specification:\n${jobSpecText}`,
      temperature: 0.1, // Low temperature for consistent extraction
    });

    // Calculate confidence based on extracted fields
    const confidence = calculateExtractionConfidence(object);

    console.log(`Job spec extraction completed with ${confidence}% confidence`);
    return { data: object, confidence };
  } catch (error) {
    console.error('Job spec extraction failed:', error);

    // Fallback to regex-based extraction
    const fallbackData = extractJobSpecWithRegex(jobSpecText);
    return { data: fallbackData, confidence: 30 };
  }
}

function calculateExtractionConfidence(spec: ParsedJobSpec): number {
  let confidence = 0;

  if (spec.positionTitle.length > 3) confidence += 25;
  if (spec.requiredSkills.length > 0) confidence += 35;
  if (spec.yearsExperience !== undefined) confidence += 15;
  if (spec.responsibilities && spec.responsibilities.length > 0)
    confidence += 15;
  if (spec.companyValues && spec.companyValues.length > 0) confidence += 10;

  return Math.min(confidence, 95); // Cap at 95% for AI extraction
}

// Regex fallback for offline/development
function extractJobSpecWithRegex(text: string): ParsedJobSpec {
  const titleMatch = text.match(
    /(?:position|role|job title|title):\s*([^\n]+)/i
  );
  const skillsMatch = text.match(
    /(?:skills|requirements|technologies):\s*([^\n]+)/i
  );
  const expMatch = text.match(
    /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?experience/i
  );

  return {
    positionTitle: titleMatch?.[1]?.trim() || 'Position Title Not Found',
    requiredSkills: skillsMatch?.[1]?.split(/[,;]/).map((s) => s.trim()) || [
      'Skills not specified',
    ],
    yearsExperience: expMatch ? Number.parseInt(expMatch[1]) : undefined,
  };
}
