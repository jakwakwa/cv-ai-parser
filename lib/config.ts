/**
 * Feature flag to enable or disable AI-powered resume parsing.
 * Defaults to true if the necessary API key is present.
 */
// export const IS_AI_PARSING_ENABLED = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;

export const IS_AI_PARSING_ENABLED = true;

/**
 * The specific Google Gemini model to be used for AI parsing.
 * Gemini 2.0 Flash supports direct PDF processing
 */
// export const AI_MODEL = 'gemini-2.5-pro';
export const AI_MODEL = 'gemini-2.0-flash-lite';

/**
 * A confidence score threshold. If the regex parser's confidence is below this,
 * we might consider the result unreliable.
 */
export const REGEX_CONFIDENCE_THRESHOLD = 30;

/**
 * The maximum confidence score the regex parser can assign.
 * This ensures that AI-parsed results are always considered more reliable.
 */
export const MAX_REGEX_CONFIDENCE = 85;

export const IS_JOB_TAILORING_ENABLED = true;
