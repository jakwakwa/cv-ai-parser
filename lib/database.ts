/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
import { db } from './prisma';
import type { Resume, UserAdditionalContext } from './types';

export class ResumeDatabase {
  // Save a new resume
  static async saveResume({
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
    parsedData: unknown;
    parseMethod?: string;
    confidenceScore?: number;
    isPublic?: boolean;
    userId: string;
    slug: string;
    customColors?: Record<string, string>;
    additionalContext?: UserAdditionalContext;
  }) {
    try {
      const resume = await db.resume.create({
        data: {
          title,
          originalFilename,
          fileType,
          fileSize,
          parsedData: parsedData as any,
          parseMethod,
          confidenceScore,
          isPublic,
          slug,
          customColors: customColors as any,
          additionalContext: additionalContext as any,
          user: {
            connect: { id: userId },
          },
        },
      });
      return resume;
    } catch (error) {
      console.error('Error saving resume:', error);
      throw new Error('Failed to save resume.');
    }
  }

  // Get user's resumes
  static async getUserResumes(userId: string) {
    try {
      const resumes = await db.resume.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return resumes;
    } catch (error) {
      console.error('Error fetching user resumes:', error);
      throw new Error('Failed to fetch user resumes.');
    }
  }

  // Get a specific resume
  static async getResume(id: string) {
    try {
      const resume = await db.resume.findUnique({
        where: { id },
      });
      return resume;
    } catch (error) {
      console.error('Error fetching resume:', error);
      throw new Error('Failed to fetch resume.');
    }
  }

  // New method for retrieving context
  static async getResumeWithContext(id: string) {
    try {
      const resume = await db.resume.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          originalFilename: true,
          fileType: true,
          fileSize: true,
          parsedData: true,
          parseMethod: true,
          confidenceScore: true,
          isPublic: true,
          slug: true,
          customColors: true,
          additionalContext: true,
          view_count: true,
          download_count: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return resume;
    } catch (error) {
      console.error('Error fetching resume with context:', error);
      throw new Error('Failed to fetch resume with context.');
    }
  }

  // Get public resume by slug
  static async getPublicResume(slug: string) {
    try {
      const resume = await db.resume.findUnique({
        where: { slug, isPublic: true },
      });

      if (resume) {
        await db.resume.update({
          where: { id: resume.id },
          data: { view_count: { increment: 1 } },
        });
      }

      return resume;
    } catch (error) {
      console.error('Error fetching public resume:', error);
      throw new Error('Failed to fetch public resume.');
    }
  }

  // Get all public resumes for sitemap
  static async getAllPublicResumes(): Promise<{ slug: string; updatedAt: string }[]> {
    try {
      const resumes = await db.resume.findMany({
        where: { isPublic: true },
        select: { slug: true, updatedAt: true },
      });
      return resumes.map((r: { slug: string; updatedAt: Date }) => ({...r, updatedAt: r.updatedAt.toISOString()}));
    } catch (error) {
      console.error('Error fetching public resumes:', error);
      throw new Error('Failed to fetch public resumes.');
    }
  }

  // Update resume
  static async updateResume(
    id: string,
    updates: Partial<Resume> & { customColors?: Record<string, string> }
  ) {
    try {
      const resume = await db.resume.update({
        where: { id },
        data: {
          ...updates,
          customColors: updates.customColors as any,
        },
      });
      return resume;
    } catch (error) {
      console.error('Error updating resume:', error);
      throw new Error('Failed to update resume.');
    }
  }

  // Delete resume
  static async deleteResume(id: string) {
    try {
      await db.resume.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw new Error('Failed to delete resume.');
    }
  }

  // Save resume version
  static async saveResumeVersion(
    resumeId: string,
    parsedData: any,
    changesSummary?: string
  ) {
    try {
      const latestVersion = await db.resumeVersion.findFirst({
        where: { resumeId },
        orderBy: { version_number: 'desc' },
      });

      const nextVersion = latestVersion ? latestVersion.version_number + 1 : 1;

      const version = await db.resumeVersion.create({
        data: {
          resumeId,
          version_number: nextVersion,
          parsed_data: parsedData as any,
          changes_summary: changesSummary,
        },
      });
      return version;
    } catch (error) {
      console.error('Error saving resume version:', error);
      throw new Error('Failed to save resume version.');
    }
  }

  // Get resume versions
  static async getResumeVersions(resumeId: string) {
    try {
      const versions = await db.resumeVersion.findMany({
        where: { resumeId },
        orderBy: { version_number: 'desc' },
      });
      return versions;
    } catch (error) {
      console.error('Error fetching resume versions:', error);
      throw new Error('Failed to fetch resume versions.');
    }
  }

  // Increment download count
  static async incrementDownloadCount(id: string) {
    try {
      await db.resume.update({
        where: { id },
        data: { download_count: { increment: 1 } },
      });
    } catch (error) {
      console.error('Error incrementing download count:', error);
      throw new Error('Error incrementing download count.');
    }
  }
}
