import { supabase } from "./supabase"
import type { Resume } from "./supabase"

// Resume database operations
export class ResumeDatabase {
  // Save a new resume
  static async saveResume(resumeData: {
    title: string
    originalFilename?: string
    fileType?: string
    fileSize?: number
    parsedData: any
    parseMethod?: string
    confidenceScore?: number
    isPublic?: boolean
  }) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    // Generate a unique slug for public sharing
    const slug = resumeData.isPublic ? `${resumeData.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}` : null

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title: resumeData.title,
        original_filename: resumeData.originalFilename,
        file_type: resumeData.fileType,
        file_size: resumeData.fileSize,
        parsed_data: resumeData.parsedData,
        parse_method: resumeData.parseMethod,
        confidence_score: resumeData.confidenceScore,
        is_public: resumeData.isPublic || false,
        slug,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to save resume: ${error.message}`)
    }

    return data
  }

  // Get user's resumes
  static async getUserResumes() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch resumes: ${error.message}`)
    }

    return data
  }

  // Get a specific resume
  static async getResume(id: string) {
    const { data, error } = await supabase.from("resumes").select("*").eq("id", id).single()

    if (error) {
      throw new Error(`Failed to fetch resume: ${error.message}`)
    }

    return data
  }

  // Get public resume by slug
  static async getPublicResume(slug: string) {
    const { data, error } = await supabase.from("resumes").select("*").eq("slug", slug).eq("is_public", true).single()

    if (error) {
      throw new Error(`Failed to fetch public resume: ${error.message}`)
    }

    // Increment view count
    await supabase
      .from("resumes")
      .update({ view_count: data.view_count + 1 })
      .eq("id", data.id)

    return data
  }

  // Update resume
  static async updateResume(id: string, updates: Partial<Resume>) {
    const { data, error } = await supabase.from("resumes").update(updates).eq("id", id).select().single()

    if (error) {
      throw new Error(`Failed to update resume: ${error.message}`)
    }

    return data
  }

  // Delete resume
  static async deleteResume(id: string) {
    const { error } = await supabase.from("resumes").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete resume: ${error.message}`)
    }
  }

  // Save resume version
  static async saveResumeVersion(resumeId: string, parsedData: any, changesSummary?: string) {
    // Get current version count
    const { data: versions } = await supabase
      .from("resume_versions")
      .select("version_number")
      .eq("resume_id", resumeId)
      .order("version_number", { ascending: false })
      .limit(1)

    const nextVersion = versions && versions.length > 0 ? versions[0].version_number + 1 : 1

    const { data, error } = await supabase
      .from("resume_versions")
      .insert({
        resume_id: resumeId,
        version_number: nextVersion,
        parsed_data: parsedData,
        changes_summary: changesSummary,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to save resume version: ${error.message}`)
    }

    return data
  }

  // Get resume versions
  static async getResumeVersions(resumeId: string) {
    const { data, error } = await supabase
      .from("resume_versions")
      .select("*")
      .eq("resume_id", resumeId)
      .order("version_number", { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch resume versions: ${error.message}`)
    }

    return data
  }

  // Increment download count
  static async incrementDownloadCount(id: string) {
    const { data } = await supabase.from("resumes").select("download_count").eq("id", id).single()

    if (data) {
      await supabase
        .from("resumes")
        .update({ download_count: data.download_count + 1 })
        .eq("id", id)
    }
  }
}
