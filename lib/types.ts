import type { ParsedResume } from './resume-parser/schema';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
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
  user_id: string;
  title: string;
  original_filename: string | null;
  file_type: string | null;
  file_size: number | null;
  parsed_data: ParsedResume;
  parse_method: string | null;
  confidence_score: number | null;
  is_public: boolean;
  slug: string | null;
  view_count: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  custom_colors: Record<string, string>;
  additional_context?: UserAdditionalContext;
}

export interface ResumeVersion {
  id: string;
  resume_id: string;
  version_number: number;
  parsed_data: unknown;
  changes_summary: string | null;
  created_at: string;
}
