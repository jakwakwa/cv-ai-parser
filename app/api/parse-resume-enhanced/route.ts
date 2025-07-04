import { NextRequest } from 'next/server';
import { IS_JOB_TAILORING_ENABLED } from '@/lib/config';
import { ResumeDatabase } from '@/lib/database';
import { extractJobSpecification } from '@/lib/jobfit/jobSpecExtractor';
import { userAdditionalContextSchema } from '@/lib/jobfit/schemas';
import { tailorResume } from '@/lib/jobfit/tailorResume';
import { parseWithAI, parseWithAIPDF } from '@/lib/resume-parser/ai-parser';
import { createClient } from '@/lib/supabase/server';
import type { UserAdditionalContext } from '@/lib/types';
import { createSlug } from '@/lib/utils';

// Feature flag guard
if (!IS_JOB_TAILORING_ENABLED) {
  throw new Error('JobFit Tailor feature is not enabled');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract existing fields
    const file = formData.get('file') as File;
    const customColors = JSON.parse(
      (formData.get('customColors') as string) || '{}'
    );
    const isAuthenticated = formData.get('isAuthenticated') === 'true';

    // Extract new JobFit fields
    const jobSpecFile = formData.get('jobSpecFile') as File | null;
    const jobSpecText = formData.get('jobSpecText') as string | null;
    const tone = formData.get('tone') as string;
    const extraPrompt = formData.get('extraPrompt') as string | null;

    // Validate inputs
    if (!file) {
      return Response.json(
        { error: 'Resume file is required' },
        { status: 400 }
      );
    }

    // Build additional context object
    let additionalContext: UserAdditionalContext | undefined = undefined;
    const hasJobSpec = jobSpecFile || jobSpecText;

    if (hasJobSpec && tone) {
      const contextData = {
        jobSpecSource: jobSpecFile ? 'upload' : ('pasted' as const),
        jobSpecText: jobSpecText || undefined,
        jobSpecFileUrl: undefined, // TODO: Handle file upload to storage
        tone: tone as 'Formal' | 'Neutral' | 'Creative',
        extraPrompt: extraPrompt || undefined,
      };

      // Validate context structure
      const validation = userAdditionalContextSchema.safeParse(contextData);
      if (!validation.success) {
        return Response.json(
          {
            error: 'Invalid additional context',
            details: validation.error.issues,
          },
          { status: 400 }
        );
      }
      additionalContext = validation.data;
    }

    // Authentication check
    const supabase = await createClient();
    let user = null;
    if (isAuthenticated) {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();
      if (error || !authUser) {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      user = authUser;
    }

    // PARALLEL PROCESSING: Parse resume and job spec simultaneously
    const parseResumePromise =
      file.type === 'application/pdf'
        ? parseWithAIPDF(file)
        : parseWithAI(await file.text());

    const jobSpecPromise = hasJobSpec
      ? extractJobSpecification(jobSpecText || (await jobSpecFile!.text()))
      : Promise.resolve(null);

    const [parsedResume, jobSpecResult] = await Promise.all([
      parseResumePromise,
      jobSpecPromise,
    ]);

    // Tailor resume if job spec provided
    let finalResume = parsedResume;
    let tailoringMetadata = {};

    if (jobSpecResult && additionalContext) {
      console.log('Tailoring resume to job specification...');

      const tailoredResume = await tailorResume({
        originalResume: parsedResume,
        jobSpec: jobSpecResult.data,
        tone: additionalContext.tone,
        extraPrompt: additionalContext.extraPrompt,
        enableStreaming: false, // TODO: Implement streaming in Phase 5
      });

      finalResume = tailoredResume;
      tailoringMetadata = {
        jobSpecConfidence: jobSpecResult.confidence,
        tailoringApplied: true,
        tone: additionalContext.tone,
      };
    }

    // Merge custom colors
    const finalParsedData = {
      ...finalResume,
      customColors: customColors || {},
    };

    // Save to database if authenticated
    let savedResume;
    if (isAuthenticated && user) {
      const resumeTitle: string =
        parsedResume.name || file.name.split('.')[0] || 'Untitled Resume';
      const slug = `${createSlug(resumeTitle)}-${Math.floor(1000 + Math.random() * 9000)}`;

      savedResume = await ResumeDatabase.saveResume(supabase, {
        userId: user.id,
        title: resumeTitle,
        originalFilename: file.name,
        fileType: file.type,
        fileSize: file.size,
        parsedData: finalParsedData,
        parseMethod: 'ai_enhanced',
        confidenceScore: 98,
        isPublic: true,
        slug,
        additionalContext,
      });
    }

    return Response.json({
      data: finalParsedData,
      meta: {
        method: 'ai_enhanced',
        filename: file.name,
        resumeId: savedResume?.id,
        resumeSlug: savedResume?.slug,
        ...tailoringMetadata,
      },
    });
  } catch (error) {
    console.error('Enhanced resume parsing failed:', error);
    return Response.json(
      {
        error: 'Failed to process resume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
