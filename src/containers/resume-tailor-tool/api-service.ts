import type { StreamUpdate, ResumeTailorState } from './types';

export class ResumeParsingService {
  static async parseResume(
    formData: FormData,
    onStreamUpdate?: (update: StreamUpdate) => void
  ): Promise<StreamUpdate> {
    const response = await fetch('/api/parse-resume-enhanced', {
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
        throw new Error(`${errorMsg}\n\n${errorData.details || ''}\n\nPlease try uploading a different file with more content.`);
      }

      throw new Error(errorMsg);
    }

    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('text/plain')) {
      return this.handleStreamingResponse(response, onStreamUpdate);
    } else {
      return this.handleRegularResponse(response);
    }
  }

  private static async handleStreamingResponse(
    response: Response,
    onStreamUpdate?: (update: StreamUpdate) => void
  ): Promise<StreamUpdate> {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Failed to read stream');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const streamUpdate = JSON.parse(line.slice(6)) as StreamUpdate;
              
              onStreamUpdate?.(streamUpdate);

              if (streamUpdate.status === 'completed' && streamUpdate.data) {
                return streamUpdate;
              }

              if (streamUpdate.status === 'error') {
                throw new Error(streamUpdate.message || 'Stream processing failed');
              }
            } catch (_parseError) {
              console.warn('[ResumeParsingService] Failed to parse stream chunk:', line);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    throw new Error('Stream ended without completion');
  }

  private static async handleRegularResponse(response: Response): Promise<StreamUpdate> {
    const result = await response.json();

    if (result?.error) {
      throw new Error(result.error || 'Parsing failed.');
    }

    return {
      status: 'completed',
      data: result.data,
      meta: result.meta,
    };
  }

  static createFormData(state: ResumeTailorState, isAuthenticated: boolean): FormData {
    const formData = new FormData();
    
    if (!state.uploadedFile) {
      throw new Error('No file uploaded');
    }

    formData.append('file', state.uploadedFile);
    formData.append('isAuthenticated', String(isAuthenticated));

    if (state.profileImage) {
      formData.append('profileImage', state.profileImage);
    }

    if (state.customColors && Object.keys(state.customColors).length > 0) {
      formData.append('customColors', JSON.stringify(state.customColors));
    }

    if (state.tailorEnabled) {
      formData.append('jobSpecMethod', state.jobSpecMethod);

      if (state.jobSpecMethod === 'paste') {
        formData.append('jobSpecText', state.jobSpecText);
      } else if (state.jobSpecFile) {
        formData.append('jobSpecFile', state.jobSpecFile);
      }

      formData.append('tone', state.tone);
      formData.append('extraPrompt', state.extraPrompt);
    }

    return formData;
  }
} 