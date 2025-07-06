import type { NextRequest } from 'next/server';
import { IS_JOB_TAILORING_ENABLED } from '@/lib/config';
import { ResumeDatabase } from '@/lib/database';
import { extractJobSpecification } from '@/lib/jobfit/jobSpecExtractor';
import { userAdditionalContextSchema } from '@/lib/jobfit/schemas';
import { tailorResume } from '@/lib/jobfit/tailorResume';
import { parseWithAI, parseWithAIPDF } from '@/lib/resume-parser/ai-parser';
import { createClient } from '@/lib/supabase/server';
import type { Resume, UserAdditionalContext } from '@/lib/types';
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

    // Debug logging
    console.log('Enhanced API called with:', {
      hasFile: !!file,
      hasJobSpecFile: !!jobSpecFile,
      hasJobSpecText: !!jobSpecText,
      jobSpecTextLength: jobSpecText?.length || 0,
      tone,
      hasExtraPrompt: !!extraPrompt,
      allFormDataKeys: Array.from(formData.keys()),
    });

    // Validate inputs
    if (!file) {
      return Response.json(
        { error: 'Resume file is required' },
        { status: 400 }
      );
    }

    // Build additional context object
    let additionalContext: UserAdditionalContext | undefined;
    const hasJobSpec =
      (jobSpecFile && jobSpecFile.size > 0) ||
      (jobSpecText && jobSpecText.trim().length > 0);

    // Enhanced endpoint expects job tailoring data, but allow graceful fallback to regular parsing
    if (hasJobSpec) {
      // Validate that tone is provided when job spec is given
      if (!tone || !['Formal', 'Neutral', 'Creative'].includes(tone)) {
        return Response.json(
          {
            error:
              'Valid tone (Formal, Neutral, or Creative) is required when job specification is provided',
          },
          { status: 400 }
        );
      }
      // Extract text from job spec file if uploaded
      let finalJobSpecText = jobSpecText;
      if (jobSpecFile && !jobSpecText) {
        try {
          finalJobSpecText = await jobSpecFile.text();
          if (!finalJobSpecText || finalJobSpecText.trim().length === 0) {
            return Response.json(
              {
                error:
                  'Job specification file is empty or contains no readable text',
              },
              { status: 400 }
            );
          }
        } catch (_error) {
          return Response.json(
            {
              error:
                "Failed to read job specification file. Please ensure it's a valid text or PDF file.",
            },
            { status: 400 }
          );
        }
      }

      // Validate job spec text length and content
      if (finalJobSpecText && finalJobSpecText.length > 4000) {
        return Response.json(
          {
            error:
              'Job specification text is too long. Maximum 4000 characters allowed.',
          },
          { status: 400 }
        );
      }

      // Ensure we have meaningful job spec text
      if (!finalJobSpecText || finalJobSpecText.trim().length < 50) {
        return Response.json(
          {
            error:
              'Job specification text is too short. Please provide at least 50 characters of meaningful job description.',
          },
          { status: 400 }
        );
      }

      const trimmedJobSpecText = finalJobSpecText.trim();
      const contextData = {
        jobSpecSource: jobSpecFile ? 'upload' : ('pasted' as const),
        jobSpecText: trimmedJobSpecText, // Always use the trimmed text (we already validated it's not empty)
        jobSpecFileUrl: undefined, // TODO: Handle file upload to storage in future
        tone: tone as 'Formal' | 'Neutral' | 'Creative',
        extraPrompt: extraPrompt?.trim() || undefined,
      };

      // Debug: Log what we're trying to validate
      console.log('About to validate contextData:', {
        ...contextData,
        jobSpecTextLength: contextData.jobSpecText?.length,
        jobSpecTextPreview: `${contextData.jobSpecText?.substring(0, 50)}...`,
      });

      // Validate context structure
      const validation = userAdditionalContextSchema.safeParse(contextData);
      if (!validation.success) {
        console.error('Validation failed for contextData:', contextData);
        console.error('Validation errors:', validation.error.issues);
        return Response.json(
          {
            error: 'Invalid job specification data',
            details: validation.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', '),
            received: contextData,
          },
          { status: 400 }
        );
      }
      additionalContext = validation.data;
    } else if (!hasJobSpec) {
      // Enhanced endpoint called without job tailoring - this is allowed
      // Just proceed with regular resume parsing
      console.log(
        'Enhanced API called without job specification - proceeding with regular parsing'
      );
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

    const jobSpecPromise =
      hasJobSpec && additionalContext?.jobSpecText
        ? extractJobSpecification(additionalContext.jobSpecText)
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

    // Merge custom colors (preserve original colors even after tailoring)
    const finalParsedData = {
      ...finalResume,
      customColors: customColors || {},
    };

    // Save to database if authenticated
    let savedResume: Resume | undefined;
    if (isAuthenticated && user) {
      try {
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
      } catch (error) {
        console.error('Database save failed (missing migration?), continuing without save:', error);
        // Continue without saving - user will still get the tailored resume
        // TODO: Remove this try-catch after running the database migration
      }
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
