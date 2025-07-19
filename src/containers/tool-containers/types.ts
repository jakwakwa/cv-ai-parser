import type { ParsedResumeSchema } from "@/lib/tools-lib/shared-parsed-resume-schema";

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
  status: 'analyzing' | 'processing' | 'saving' | 'completed' | 'error';
  message?: string;
  progress?: number;
  partialData?: PartialResumeData;
  data?: ParsedResumeSchema;
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
  
  // UI states
  showErrorModal: boolean;
  modalErrorMessage: string;
  showColorDialog: boolean;
  aiTailorCommentary: string | null;
  
  // Streaming states
  streamingProgress: number;
  streamingMessage: string;
  partialResumeData: PartialResumeData | null;
  
  // Profile customization states
  profileImage?: string | null;
  customColors: Record<string, string>;
  
  // Result state
  localResumeData: ParsedResumeSchema | null;
  
  // Processing state
  isProcessing: boolean;
}


export interface ResumeGeneratorState {
  // File upload states
  uploadedFile: File | null;
  error: string;
  
  // UI states
  showErrorModal: boolean;
  modalErrorMessage: string;
  showColorDialog: boolean;
  
  // Streaming states
  streamingProgress: number;
  streamingMessage: string;
  partialResumeData: PartialResumeData | null;
  
  // Profile customization states
  profileImage: string | null;
  customColors: Record<string, string>;
  
  // Result state
  localResumeData: ParsedResumeSchema | null;
  
  // Processing state
  isProcessing: boolean;
}

export interface ResumeTailorToolProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isAuthenticated: boolean;
}