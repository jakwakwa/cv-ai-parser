export const AI_MODEL_PRO = "gemini-2.5-pro"
// export const AI_MODE = 'gemini-2.5-flash-lite-preview-06-17';
export const AI_MODEL_FLASH = "gemini-2.5-flash"

// SAFE ADDITION: Lightweight model for small post-processing tasks (e.g., summary rewrite)
// If unavailable at runtime, code falls back to AI_MODEL_FLASH and then to simple slice.
export const AI_MODEL_LITE = "gemini-2.5-flash-lite-preview-06-17"

export const KEEP_TEMP_RESUMES_FOR_TESTING = false
