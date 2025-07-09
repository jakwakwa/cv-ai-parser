import type { EnhancedParsedResume } from './resume-parser/enhanced-schema';

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserAdditionalContext {
  jobSpecSource: 'upload' | 'pasted';
  jobSpecText?: string;
  jobSpecFileUrl?: string;
  tone: 'Formal' | 'Neutral' | 'Creative';
  extraPrompt?: string;
}

export interface Resume {
  id: string;
  title: string;
  originalFilename: string | null;
  fileType: string | null;
  fileSize: number | null;
  parsedData: any;
  parseMethod: string | null;
  confidenceScore: number | null;
  isPublic: boolean;
  slug: string | null;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  customColors: Record<string, string>;
  additionalContext?: UserAdditionalContext;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  versionNumber: number;
  parsedData: unknown;
  changesSummary: string | null;
  createdAt: string;
}
