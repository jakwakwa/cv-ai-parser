/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <ecperimental feature. when tested it will get typed> */

import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
// Learn more about instantiating PrismaClient in Next.js here: https://www.prisma.io/docs/data-platform/accelerate/getting-started

import type { Resume, UserAdditionalContext } from './types';

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

const prismaClient = prismaClientSingleton();

declare global {
  // Augment the global object with a typed prisma instance
  // This avoids use of 'any'
  var prismaGlobal: typeof prismaClient | undefined;
}

const prisma = global.prismaGlobal ?? prismaClient;

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export class ResumeDatabase {
  /**
   * Save a new resume to the database
   */
  static async saveResume(data: {
    userId: string;
    title: string;
    originalFilename: string;
    fileType: string;
    fileSize: number;
    parsedData: any; // EnhancedParsedResume
    parseMethod: string;
    confidenceScore: number;
    isPublic: boolean;
    slug: string;
    additionalContext?: UserAdditionalContext;
  }): Promise<Resume> {
    try {
      const resume = await db.resume.create({
        data: {
          userId: data.userId,
          title: data.title,
          originalFilename: data.originalFilename,
          fileType: data.fileType,
          fileSize: data.fileSize,
          parsedData: data.parsedData as Prisma.JsonValue,
          parseMethod: data.parseMethod,
          confidenceScore: data.confidenceScore,
          isPublic: data.isPublic,
          slug: data.slug,
          additionalContext: data.additionalContext as Prisma.JsonValue,
          viewCount: 0,
          downloadCount: 0,
        },
      });

      return resume;
    } catch (error) {
      throw new Error('Error saving resume');
    }
  }

  /**
   * Get all resumes for a specific user
   */
  static async getUserResumes(userId: string): Promise<Resume[]> {
    try {
      const resumes = await db.resume.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return resumes;
    } catch (error) {
      throw new Error('Error fetching user resumes');
    }
  }

  /**
   * Get a specific resume by ID
   */
  static async getResume(id: string): Promise<Resume | null> {
    try {
      const resume = await db.resume.findUnique({
        where: { id },
      });
      return resume;
    } catch (error) {
      throw new Error('Error fetching resume');
    }
  }

  /**
   * Get a resume with additional context
   */
  static async getResumeWithContext(id: string): Promise<Resume | null> {
    try {
      const resume = await db.resume.findUnique({
        where: { id },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });
      return resume;
    } catch (error) {
      throw new Error('Error fetching resume with context');
    }
  }

  /**
   * Get a public resume by slug
   */
  static async getPublicResume(slug: string): Promise<Resume | null> {
    try {
      const resume = await db.resume.findFirst({
        where: { slug, isPublic: true },
      });
      return resume;
    } catch (error) {
      throw new Error('Error fetching public resume');
    }
  }

  /**
   * Get all public resumes (for sitemap generation)
   */
  static async getAllPublicResumes(): Promise<
    Array<{ slug: string; updatedAt: Date }>
  > {
    try {
      const resumes = await db.resume.findMany({
        where: { isPublic: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
      });
      return resumes;
    } catch (error) {
      return [];
    }
  }

  /**
   * Update a resume
   */
  static async updateResume(
    id: string,
    data: Partial<{
      title: string;
      parsedData: any;
      isPublic: boolean;
      slug: string;
    }>
  ): Promise<Resume> {
    try {
      const updatedResume = await db.resume.update({
        where: { id },
        data: {
          ...data,
          parsedData: data.parsedData
            ? (data.parsedData as Prisma.JsonValue)
            : undefined,
        },
      });
      return updatedResume;
    } catch (error) {
      throw new Error('Error updating resume');
    }
  }

  /**
   * Delete a resume
   */
  static async deleteResume(id: string): Promise<void> {
    try {
      await db.resume.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error('Error deleting resume');
    }
  }

  /**
   * Save a resume version for tracking
   */
  static async saveResumeVersion(data: {
    resumeId: string;
    versionNumber: number;
    parsedData: any;
    changesSummary: string;
  }): Promise<any> {
    try {
      const version = await db.resumeVersion.create({
        data: {
          resumeId: data.resumeId,
          versionNumber: data.versionNumber,
          parsedData: data.parsedData as Prisma.JsonValue,
          changesSummary: data.changesSummary,
        },
      });
      return version;
    } catch (error) {
      throw new Error('Error saving resume version');
    }
  }

  /**
   * Get all versions for a resume
   */
  static async getResumeVersions(resumeId: string): Promise<any[]> {
    try {
      const versions = await db.resumeVersion.findMany({
        where: { resumeId },
        orderBy: { versionNumber: 'desc' },
      });
      return versions;
    } catch (error) {
      throw new Error('Error fetching resume versions');
    }
  }

  /**
   * Increment view count for a resume
   */
  static async incrementViewCount(id: string): Promise<void> {
    try {
      await db.resume.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    } catch (error) {
      throw new Error('Error incrementing view count');
    }
  }
}
