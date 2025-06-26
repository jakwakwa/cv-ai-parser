import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  user_id: string
  title: string
  original_filename: string | null
  file_type: string | null
  file_size: number | null
  parsed_data: any
  parse_method: string | null
  confidence_score: number | null
  is_public: boolean
  slug: string | null
  view_count: number
  download_count: number
  created_at: string
  updated_at: string
}

export interface ResumeVersion {
  id: string
  resume_id: string
  version_number: number
  parsed_data: any
  changes_summary: string | null
  created_at: string
}
