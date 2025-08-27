import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { AI_MODEL_FLASH } from '@/lib/config';
import type { ParsedResumeSchema } from '../shared-parsed-resume-schema';
import { AI_MODEL_LITE } from '@/lib/config';

// SAFE ADDITION: Centralized limits and a post-processing helper that does not
// interfere with the main parsing/tailoring logic. If the lightweight model is
// unavailable or fails, we fall back to a simple string slice to prevent errors.

export const SUMMARY_MAX_CHARS = 860;
// Target a slightly lower limit so there is buffer for any whitespace changes
export const SUMMARY_TARGET_CHARS = 850;

/**
 * Ensure resume.summary respects SUMMARY_MAX_CHARS.
 * If it exceeds the limit, attempt a lightweight AI rewrite to <= SUMMARY_TARGET_CHARS.
 * Falls back to a safe slice on any failure. Returns a new object (non-mutating).
 */
export async function enforceSummaryLimit(
  resume: ParsedResumeSchema
): Promise<ParsedResumeSchema> {
  const currentSummary = resume.summary || '';
  if (currentSummary.length <= SUMMARY_MAX_CHARS) {
    return resume;
  }

  // Build rewrite prompt. Keep it narrow to avoid changing meaning.
  const prompt = `Rewrite the following professional summary to be no longer than ${SUMMARY_TARGET_CHARS} characters. Preserve the original meaning, tone, and proper nouns. Do not add new information. Keep a professional, concise style. Output only the rewritten summary text with no quotes, no markdown, and no explanations.\n\n---\n${currentSummary}\n---`;

  // Prefer a lightweight model; fall back to FLASH if needed at runtime.
  const modelName = AI_MODEL_LITE || AI_MODEL_FLASH;

  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        '[SummaryLimiter] Summary too long; invoking lightweight rewrite'
      );
    }

    const { text } = await generateText({
      model: google(modelName),
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    let rewritten = (text || '').trim();
    // Defensive trims to ensure final length. If somehow still over, slice.
    if (rewritten.length > SUMMARY_MAX_CHARS) {
      rewritten = rewritten.slice(0, SUMMARY_TARGET_CHARS);
    }

    // Return a new object to avoid mutating upstream data
    return {
      ...resume,
      summary: rewritten,
    };
  } catch (_error) {
    // SAFE FALLBACK: if rewrite fails for any reason, just slice to max
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[SummaryLimiter] Rewrite failed; falling back to simple slice'
      );
    }
    return {
      ...resume,
      summary: currentSummary.slice(0, SUMMARY_MAX_CHARS),
    };
  }
}
