/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <ecperimental feature. when tested it will get typed> */

import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
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

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;


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
      // --- LOGGING: Log data before saving ---
      console.log('[DB] Saving resume:', {
        userId,
        title,
        originalFilename,
        fileType,
        fileSize,
        parsedData,
        parseMethod,
        confidenceScore,
        isPublic,
        slug,
        customColors,
        additionalContext,
      });
      const resume = await prisma.resume.create({
        data: {
          title,
          originalFilename,
          fileType,
          fileSize,
          parsedData: parsedData as string,
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
      // --- LOGGING: Log result after saving ---
      console.log('[DB] Resume saved:', resume);
      return resume as unknown as Resume;
    } catch (error) {
      console.error('Error saving resume:', error);
      throw new Error('Failed to save resume.');
    }
  }

  // Get user's resumes
  static async getUserResumes(userId: string): Promise<Resume[]> {
    try {
      const resumes = await prisma.resume.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return resumes as unknown as Resume[];
    } catch (error) {
      console.error('Error fetching user resumes:', error);
      throw new Error('Failed to fetch user resumes.');
    }
  }

  // Get a specific resume
  static async getResume(id: string): Promise<Resume | null> {
    try {
      const resume = await prisma.resume.findUnique({
        where: { id },
      });
      return resume as unknown as Resume | null;
    } catch (error) {
      console.error('Error fetching resume:', error);
      throw new Error('Failed to fetch resume.');
    }
  }

  // New method for retrieving context
  static async getResumeWithContext(id: string): Promise<Resume | null> {
    try {
      const resume = await prisma.resume.findUnique({
        where: { id },
      });
      return resume as unknown as Resume | null;
    } catch (error) {
      console.error('Error fetching resume with context:', error);
      throw new Error('Failed to fetch resume with context.');
    }
  }

  // Get public resume by slug
  static async getPublicResume(slug: string): Promise<Resume | null> {
    try {
      const resume = await prisma.resume.findUnique({
        where: { slug, isPublic: true },
      });
      return resume as unknown as Resume | null;
    } catch (error) {
      console.error('Error fetching public resume:', error);
      throw new Error('Failed to fetch public resume.');
    }
  }

  // Get all public resumes for sitemap
  static async getAllPublicResumes(): Promise<
    { slug: string; updatedAt: string }[]
  > {
    try {
      const resumes = await prisma.resume.findMany({
        where: { isPublic: true },
        select: { slug: true, updatedAt: true },
      });
      return resumes.map((r: { slug: string; updatedAt: Date }) => ({
        ...r,
        updatedAt: r.updatedAt.toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching public resumes:', error);
      throw new Error('Failed to fetch public resumes.');
    }
  }

  // Update resume
  static async updateResume(
    id: string,
    updates: Partial<Resume> & { customColors?: Record<string, string> }
  ): Promise<Resume> {
    try {
      // biome-ignore lint/correctness/noUnusedVariables: <any>
      const { slug, additionalContext, ...restOfUpdates } = updates;
      const resume = await prisma.resume.update({
        where: { id },
        data: {
          ...restOfUpdates,
          customColors: updates.customColors as any,
         
          parsedData: updates.parsedData as any,
        },
      });
      return resume as unknown as Resume;
    } catch (error) {
      console.error('Error updating resume:', error);
      throw new Error('Failed to update resume.');
    }
  }

  // Delete resume
  static async deleteResume(id: string) {
    try {
      await prisma.resume.delete({
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
      const latestVersion = await prisma.resumeVersion.findFirst({
        where: { resumeId },
        orderBy: { versionNumber: 'desc' },
      });

      const nextVersion = latestVersion ? latestVersion.versionNumber + 1 : 1;

      const version = await prisma.resumeVersion.create({
        data: {
          resumeId,
          versionNumber: nextVersion,
         
          parsedData: parsedData as any,
          changesSummary: changesSummary,
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
      const versions = await prisma.resumeVersion.findMany({
        where: { resumeId },
        orderBy: { versionNumber: 'desc' },
      });
      return versions;
    } catch (error) {
      console.error('Error fetching resume versions:', error);
      throw new Error('Failed to fetch resume versions.');
    }
  }

  // Increment view count
  static async incrementViewCount(id: string) {
    try {
      await prisma.resume.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
      throw new Error('Error incrementing view count.');
    }
  }
}
