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
export const AI_MODEL = 'gemini-2.5-pro';
// export const AI_MODEL = 'gemini-2.5-flash-lite-preview-06-17';
// export const AI_MODEL = 'gemini-1.5-flash-8b'

export const IS_JOB_TAILORING_ENABLED = true;

/**
 * Development helper: Keep temp resumes persistent for testing.
 * When true, temp resumes won't be auto-cleaned up, making development easier.
 * Set to false to test production-like cleanup behavior.
 *
 * Usage:
 * - true: Resume data persists across browser refreshes, navigation, etc. (great for testing)
 * - false: Resume data gets cleaned up like in production (auto-cleanup on page unload, etc.)
 */
export const KEEP_TEMP_RESUMES_FOR_TESTING = false;
