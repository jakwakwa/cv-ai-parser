/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Resume } from './types';

export class ResumeDatabase {
  // Save a new resume
  static async saveResume(
    supabase: SupabaseClient,
    {
      title,
      originalFilename,
      fileType,
      fileSize,
      parsedData,
      parseMethod,
      confidenceScore,
      isPublic = false,
      userId,
      slug,
      customColors,
    }: {
      title: string;
      originalFilename?: string;
      fileType?: string;
      fileSize?: number;
      parsedData: unknown;
      parseMethod?: string;
      confidenceScore?: number;
      isPublic?: boolean;
      userId: string;
      slug: string;
      customColors?: Record<string, string>;
    }
  ) {
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: userId,
        title: title,
        original_filename: originalFilename,
        file_type: fileType,
        file_size: fileSize,
        parsed_data: parsedData,
        parse_method: parseMethod,
        confidence_score: confidenceScore,
        is_public: isPublic,
        slug: slug,
        custom_colors: customColors,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving resume:', error);
      throw new Error(error.message);
    }
    return data;
  }

  // Get user's resumes
  static async getUserResumes(supabase: SupabaseClient) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch resumes: ${error.message}`);
    }

    return data;
  }

  // Get a specific resume
  static async getResume(supabase: SupabaseClient, id: string) {
    const { data, error } = await supabase
      .from('resumes')
      .select('*, custom_colors')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch resume: ${error.message}`);
    }
    const resumeData = {
      ...data,
      parsed_data: {
        ...data.parsed_data,
        customColors: data.parsed_data.customColors || {},
      },
    };
    return resumeData;
  }

  // Get public resume by slug
  static async getPublicResume(supabase: SupabaseClient, slug: string) {
    console.log('🔍 [DEBUG] getPublicResume called with slug:', slug);

    const startTime = Date.now();
    const { data, error } = await supabase
      .from('resumes')
      .select('*, custom_colors')
      .eq('slug', slug)
      .eq('is_public', true)
      .single();

    const endTime = Date.now();
    console.log('⏱️ [DEBUG] Query execution time:', endTime - startTime, 'ms');

    if (error) {
      console.error('❌ [DEBUG] getPublicResume error:', error);
      throw new Error(`Failed to fetch public resume: ${error.message}`);
    }

    console.log('✅ [DEBUG] getPublicResume success, found resume:', {
      id: data.id,
      title: data.title,
      slug: data.slug,
      is_public: data.is_public,
    });

    // Increment view count
    await supabase
      .from('resumes')
      .update({ view_count: data.view_count + 1 })
      .eq('id', data.id);

    const resumeData = {
      ...data,
      parsed_data: {
        ...data.parsed_data,
        customColors: data.parsed_data.customColors || {},
      },
    };
    return resumeData;
  }

  // Update resume
  static async updateResume(
    supabase: SupabaseClient,
    id: string,
    updates: Partial<Resume> & { customColors?: Record<string, string> }
  ) {
    const { data, error } = await supabase
      .from('resumes')
      .update({
        ...updates,
        custom_colors: updates.customColors,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update resume: ${error.message}`);
    }

    return data;
  }

  // Delete resume
  static async deleteResume(supabase: SupabaseClient, id: string) {
    const { error } = await supabase.from('resumes').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete resume: ${error.message}`);
    }
  }

  // Save resume version

  static async saveResumeVersion(
    supabase: SupabaseClient,
    resumeId: string,
    // biome-ignore lint/suspicious/noExplicitAny: <s>
    parsedData: any,
    changesSummary?: string
  ) {
    // Get current version count
    const { data: versions } = await supabase
      .from('resume_versions')
      .select('version_number')
      .eq('resume_id', resumeId)
      .order('version_number', { ascending: false })
      .limit(1);

    const nextVersion =
      versions && versions.length > 0 ? versions[0].version_number + 1 : 1;

    const { data, error } = await supabase
      .from('resume_versions')
      .insert({
        resume_id: resumeId,
        version_number: nextVersion,
        parsed_data: parsedData,
        changes_summary: changesSummary,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save resume version: ${error.message}`);
    }

    return data;
  }

  // Get resume versions
  static async getResumeVersions(supabase: SupabaseClient, resumeId: string) {
    const { data, error } = await supabase
      .from('resume_versions')
      .select('*')
      .eq('resume_id', resumeId)
      .order('version_number', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch resume versions: ${error.message}`);
    }

    return data;
  }

  // Increment download count
  static async incrementDownloadCount(supabase: SupabaseClient, id: string) {
    const { data } = await supabase
      .from('resumes')
      .select('download_count')
      .eq('id', id)
      .single();

    if (data) {
      await supabase
        .from('resumes')
        .update({ download_count: data.download_count + 1 })
        .eq('id', id);
    }
  }
}
