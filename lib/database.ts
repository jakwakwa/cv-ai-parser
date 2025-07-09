/** biome-ignore-all lint/complexity/noStaticOnlyClass: <Catch> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <Catch as any to access message property safely> */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Resume, UserAdditionalContext } from './types';

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
      additionalContext,
    }: {
      title: string;
      originalFilename?: string;
      fileType?: string;
      fileSize?: number;
      // Modified parsedData type to accept string or object,
      // as Prisma expects Json type (object or array)
      parsedData: string | object;
      parseMethod?: string;
      confidenceScore?: number;
      isPublic?: boolean;
      userId: string;
      slug: string;
      customColors?: Record<string, string>;
      additionalContext?: UserAdditionalContext;
    }
  ) {
    // Ensure parsedData is an object for Prisma's Json type field
    let finalParsedData: object;
    if (typeof parsedData === 'string') {
      try {
        finalParsedData = JSON.parse(parsedData);
      } catch (e: any) { 
        throw new Error(`Failed to parse parsedData JSON string: ${e.message}`);
      }
    } else {
      finalParsedData = parsedData;
    }

    const { data, error } = await supabase
      .from('resumes')
      .insert({
        title,
        original_filename: originalFilename,
        file_type: fileType,
        file_size: fileSize,
        parsed_data: finalParsedData, // Use the potentially parsed data
        parse_method: parseMethod,
        confidence_score: confidenceScore,
        is_public: isPublic,
        user_id: userId,
        slug,
        custom_colors: customColors,
        additional_context: additionalContext,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save resume: ${error.message}`);
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

  // New method for retrieving context
  static async getResumeWithContext(
    supabase: SupabaseClient,
    id: string
  ): Promise<Resume & { additional_context: UserAdditionalContext | null }> {
    const { data, error } = await supabase
      .from('resumes')
      .select('*, additional_context')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch resume with context: ${error.message}`);
    }

    return data;
  }

  // Get public resume by slug
  static async getPublicResume(supabase: SupabaseClient, slug: string) {
    const { data, error } = await supabase
      .from('resumes')
      .select('*, custom_colors')
      .eq('slug', slug)
      .eq('is_public', true)
      .single();

    if (error) {
      throw new Error(`Failed to fetch public resume: ${error.message}`);
    }

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

  // Get all public resumes for sitemap
  static async getAllPublicResumes(
    supabase: SupabaseClient
  ): Promise<{ slug: string; updated_at: string }[]> {
    const { data, error } = await supabase
      .from('resumes')
      .select('slug, updated_at')
      .eq('is_public', true);

    if (error) {
      throw new Error(`Failed to fetch public resumes: ${error.message}`);
    }

    return data || [];
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
