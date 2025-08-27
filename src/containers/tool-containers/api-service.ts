import { ParsedResumeSchema } from '@/lib/tools-lib/shared-parsed-resume-schema';
import type {
  ResumeGeneratorState,
  ResumeTailorState,
  StreamUpdate,
} from './types';

// Resume Generator API Service
export async function parseResumeGenerator(
  formData: FormData,
  onStreamUpdate?: (update: StreamUpdate) => void
): Promise<StreamUpdate> {
  const response = await fetch('/api/parse-resume-generator', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMsg = errorData?.error || 'Failed to parse resume';

    if (response.status === 401) {
      throw new Error('Authentication required. Please sign in to continue.');
    }

    if (response.status === 400 && errorData?.redirectTo) {
      throw new Error(
        `${errorMsg}\n\n${errorData.details || ''}\n\nPlease try uploading a different file with more content.`
      );
    }

    throw new Error(errorMsg);
  }

  const contentType = response.headers.get('content-type');

  if (contentType?.includes('text/plain')) {
    return handleStreamingResponse(response, onStreamUpdate);
  }
  return handleRegularResponse(response);
}

// Resume Tailor API Service
export async function parseResumeTailor(
  formData: FormData,
  onStreamUpdate?: (update: StreamUpdate) => void
): Promise<StreamUpdate> {
  const response = await fetch('/api/parse-resume-tailor', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMsg = errorData?.error || 'Failed to tailor resume';

    if (response.status === 401) {
      throw new Error('Authentication required. Please sign in to continue.');
    }

    if (response.status === 400 && errorData?.redirectTo) {
      throw new Error(
        `${errorMsg}\n\n${errorData.details || ''}\n\nPlease try uploading a different file with more content.`
      );
    }

    throw new Error(errorMsg);
  }

  const contentType = response.headers.get('content-type');

  if (contentType?.includes('text/plain')) {
    return handleStreamingResponse(response, onStreamUpdate);
  }
  return handleRegularResponse(response);
}

// Legacy function for backward compatibility (can be removed later)
export async function parseResume(
  formData: FormData,
  onStreamUpdate?: (update: StreamUpdate) => void
): Promise<StreamUpdate> {
  // Default to tailor for backward compatibility
  return parseResumeTailor(formData, onStreamUpdate);
}

async function handleStreamingResponse(
  response: Response,
  onStreamUpdate?: (update: StreamUpdate) => void
): Promise<StreamUpdate> {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('Failed to read stream');
  }

  let buffer = '';
  let lastUpdate: StreamUpdate | null = null;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete lines
      const lines = buffer.split('\n');

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('data: ')) {
          try {
            const jsonStr = trimmedLine.slice(6);
            if (jsonStr) {
              const streamUpdate = JSON.parse(jsonStr) as StreamUpdate;
              lastUpdate = streamUpdate;

              onStreamUpdate?.(streamUpdate);

              if (streamUpdate.status === 'completed' && streamUpdate.data) {
                return streamUpdate;
              }

              if (streamUpdate.status === 'error') {
                throw new Error(
                  streamUpdate.message || 'Stream processing failed'
                );
              }
            }
          } catch (parseError) {
            console.warn(
              '[ResumeParsingService] Failed to parse stream chunk:',
              trimmedLine,
              parseError
            );
          }
        }
      }
    }

    // Process any remaining data in buffer
    if (buffer.trim()) {
      const trimmedBuffer = buffer.trim();
      if (trimmedBuffer.startsWith('data: ')) {
        try {
          const jsonStr = trimmedBuffer.slice(6);
          if (jsonStr) {
            const streamUpdate = JSON.parse(jsonStr) as StreamUpdate;
            lastUpdate = streamUpdate;

            onStreamUpdate?.(streamUpdate);

            if (streamUpdate.status === 'completed' && streamUpdate.data) {
              return streamUpdate;
            }
          }
        } catch {
          console.warn(
            '[ResumeParsingService] Failed to parse final buffer:',
            trimmedBuffer
          );
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  // If we have a last update that contains data, consider it completed
  if (lastUpdate?.data) {
    return {
      ...lastUpdate,
      status: 'completed',
    };
  }

  throw new Error('Stream ended without completion. Please try again.');
}

async function handleRegularResponse(
  response: Response
): Promise<StreamUpdate> {
  let result: unknown;
  try {
    result = await response.json();
  } catch (_error) {
    throw new Error(
      'Failed to parse response. The server may have returned invalid data.'
    );
  }

  const parsedResult = result as {
    error?: string;
    data?: ParsedResumeSchema;
    meta?: {
      method: string;
      confidence: number;
      filename?: string;
      fileType?: string;
      fileSize?: number;
      resumeId?: string;
      resumeSlug?: string;
      processingType?: 'generator' | 'tailor';
      aiTailorCommentary?: string;
      jobMatchScore?: number;
      optimizationLevel?: string;
      processingTime?: number;
    };
  };

  if (parsedResult?.error) {
    throw new Error(parsedResult.error || 'Parsing failed.');
  }

  if (!parsedResult?.data) {
    throw new Error('No data received from server. Please try again.');
  }

  return {
    status: 'completed',
    data: parsedResult.data,
    meta: parsedResult.meta,
  };
}

// Form data creation for Resume Generator
export function createGeneratorFormData(
  state: ResumeGeneratorState,
  isAuthenticated: boolean
): FormData {
  const formData = new FormData();

  if (state.uploadedFile) {
    formData.append('file', state.uploadedFile);
  }

  formData.append('isAuthenticated', String(isAuthenticated));

  if (state.profileImage) {
    formData.append('profileImage', state.profileImage);
  }

  if (Object.keys(state.customColors).length > 0) {
    formData.append('customColors', JSON.stringify(state.customColors));
  }

  return formData;
}

// Form data creation for Resume Tailor
export function createTailorFormData(
  state: ResumeTailorState,
  isAuthenticated: boolean
): FormData {
  const formData = new FormData();

  if (state.uploadedFile) {
    formData.append('file', state.uploadedFile);
  }

  formData.append('isAuthenticated', String(isAuthenticated));

  // Append job specification context
  formData.append('jobSpecMethod', state.jobSpecMethod);
  formData.append('jobSpecText', state.jobSpecText);
  if (state.jobSpecFile) {
    formData.append('jobSpecFile', state.jobSpecFile);
  }

  formData.append('tone', state.tone);
  formData.append('extraPrompt', state.extraPrompt);

  // Append customization options
  if (state.profileImage) {
    formData.append('profileImage', state.profileImage);
  }
  if (Object.keys(state.customColors).length > 0) {
    formData.append('customColors', JSON.stringify(state.customColors));
  }

  return formData;
}

// Legacy function for backward compatibility (can be removed later)
export function createFormData(
  state: ResumeTailorState,
  isAuthenticated: boolean
): FormData {
  return createTailorFormData(state, isAuthenticated);
}
