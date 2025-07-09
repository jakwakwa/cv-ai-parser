/** biome-ignore-all lint/suspicious/noExplicitAny: <experimental will get typed soon> */
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { IS_JOB_TAILORING_ENABLED } from '@/lib/config';
import { ResumeDatabase } from '@/lib/db';
import { userAdditionalContextSchema } from '@/lib/jobfit/schemas';
import {
  streamableParseWithAI,
  streamableParseWithAIPDF,
} from '@/lib/resume-parser/ai-parser';
import type { EnhancedParsedResume } from '@/lib/resume-parser/enhanced-schema';
import type { UserAdditionalContext } from '@/lib/types';
import { createSlug } from '@/lib/utils';

// Feature flag guard
if (!IS_JOB_TAILORING_ENABLED) {
  throw new Error('JobFit Tailor feature is not enabled');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobSpecFile = formData.get('jobSpecFile') as File | null;
    const jobSpecText = formData.get('jobSpecText') as string | null;
    const tone = formData.get('tone') as string;
    const profileImage = formData.get('profileImage') as string | null;
    const customColors = JSON.parse(
      (formData.get('customColors') as string) || '{}'
    );

    if (!file) {
      return Response.json({ error: 'Resume file is required' }, { status: 400 });
    }

    let additionalContext: UserAdditionalContext | undefined;
    const hasJobSpec =
      (jobSpecFile?.size ?? 0) > 0 || (jobSpecText?.trim()?.length ?? 0) > 0;

    if (hasJobSpec) {
      let finalJobSpecText = jobSpecText;
      if (jobSpecFile && !jobSpecText) {
        finalJobSpecText = await jobSpecFile.text();
      }

      const validation = userAdditionalContextSchema.safeParse({
        jobSpecSource: jobSpecFile ? 'upload' : 'pasted',
        jobSpecText: finalJobSpecText,
        tone: tone,
      });

      if (validation.success) {
        additionalContext = validation.data;
      }
    }

    const parseOptions = additionalContext
      ? { jobSpec: additionalContext.jobSpecText, tone: additionalContext.tone }
      : undefined;

    const stream =
      file.type === 'application/pdf'
        ? await streamableParseWithAIPDF(file, parseOptions)
        : await streamableParseWithAI(await file.text(), parseOptions);

    // Create a custom stream for progress updates
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
      
        const writeUpdate = (update: any) => {
          const chunk = encoder.encode(`data: ${JSON.stringify(update)}\n\n`);
          controller.enqueue(chunk);
        };

        try {
          // Start streaming partial objects with progress updates
          writeUpdate({ 
            status: 'analyzing', 
            message: 'AI is analyzing your resume structure...',
            progress: 10 
          });

         
          let _partialData: any = null;
          let progressCount = 0;
          const progressMessages = [
            'Extracting personal information...',
            'Processing work experience...',
            'Analyzing skills and qualifications...',
            'Formatting resume sections...',
            'Finalizing resume structure...'
          ];

          // Stream partial objects and show progress
          for await (const partial of stream.partialObjectStream) {
            _partialData = partial;
            progressCount++;
            const progress = Math.min(20 + (progressCount * 15), 90);
            const messageIndex = Math.min(Math.floor(progressCount / 2), progressMessages.length - 1);
            
            writeUpdate({ 
              status: 'processing', 
              message: progressMessages[messageIndex],
              progress,
              partialData: partial 
            });
          }

          // Get final result
          const parsedResume: EnhancedParsedResume = await stream.object;
          
          // Merge custom colors and profile image
          const finalResume: EnhancedParsedResume = {
            ...parsedResume,
            customColors: customColors || {},
            profileImage: profileImage || parsedResume.profileImage,
          };
          
          writeUpdate({ 
            status: 'saving', 
            message: 'Saving your tailored resume...',
            progress: 95 
          });

          // Save to database
          const session = await getServerSession(authOptions);
          let savedResume = null;
          if (session?.user?.id) {
            const resumeTitle = finalResume.name || file.name.split('.')[0] || 'Untitled Resume';
            const slug = `${createSlug(resumeTitle)}-${Math.floor(1000 + Math.random() * 9000)}`;
            
            savedResume = await ResumeDatabase.saveResume({
              userId: session.user.id,
              title: resumeTitle,
              originalFilename: file.name,
              fileType: file.type,
              fileSize: file.size,
              parsedData: finalResume,
              parseMethod: 'ai_enhanced',
              confidenceScore: 98,
              isPublic: true,
              slug,
              additionalContext,
            });
          }

          // Final completion
          writeUpdate({ 
            status: 'completed', 
            message: 'Resume successfully created!',
            progress: 100,
            data: finalResume,
            meta: {
              method: 'ai_enhanced',
              confidence: 98,
              filename: file.name,
              fileType: file.type,
              fileSize: file.size,
              resumeId: savedResume?.id,
              resumeSlug: savedResume?.slug,
              aiTailorCommentary: finalResume.metadata?.aiTailorCommentary,
            }
          });

          controller.close();
        } catch (error) {
          writeUpdate({
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to process resume',
            progress: 0
          });
          controller.close();
        }
      }
    });

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to process resume', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
