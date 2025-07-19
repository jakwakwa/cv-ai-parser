import type { EnhancedParsedResume } from '@/lib/resume-parser/enhanced-schema';

export interface PartialResumeData {
  name?: string;
  title?: string;
  experience?: Array<{
    title?: string;
    company?: string;
    duration?: string;
    details?: string[];
  }>;
  skills?: string[];
  [key: string]: unknown;
}

export interface ParseInfo {
  resumeId?: string;
  resumeSlug?: string;
  method: string;
  confidence: number;
  filename: string;
  fileType: string;
  fileSize: number;
  aiTailorCommentary?: string;
}

export interface StreamUpdate {
  status?: 'analyzing' | 'processing' | 'saving' | 'completed' | 'error';
  message?: string;
  progress?: number;
  partialData?: PartialResumeData;
  data?: EnhancedParsedResume;
  meta?: ParseInfo;
}

export type JobSpecMethod = 'paste' | 'upload';
export type ToneOption = 'Formal' | 'Neutral' | 'Creative';

export interface ResumeTailorState {
  // File upload states
  uploadedFile: File | null;
  error: string;
  
  // Job tailoring states
  jobSpecMethod: JobSpecMethod;
  jobSpecText: string;
  jobSpecFile: File | null;
  tone: ToneOption;
  extraPrompt: string;
  tailorEnabled: boolean;
  
  // UI states
  showErrorModal: boolean;
  modalErrorMessage: string;
  showColorDialog: boolean;
  aiTailorCommentary: string | null;
  
  // Streaming states
  streamingProgress: number;
  streamingMessage: string;
  partialResumeData: PartialResumeData | null;
  
  // Customization states
  profileImage: string;
  customColors: Record<string, string>;
  localResumeData: EnhancedParsedResume | null;
}

export interface ResumeTailorToolProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isAuthenticated?: boolean;
}