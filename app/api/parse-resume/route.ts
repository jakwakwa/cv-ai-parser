import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ResumeDatabase } from '@/lib/db';
import { parseWithAI, parseWithAIPDF } from '@/lib/resume-parser/ai-parser';
import type { EnhancedParsedResume } from '@/lib/resume-parser/enhanced-schema'; // Use EnhancedParsedResume
import type { Resume } from '@/lib/types';
import { createSlug } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const customColors = JSON.parse(
      (formData.get('customColors') as string) || '{}'
    );
    const profileImage = formData.get('profileImage') as string | null;

    if (!file) {
      return Response.json(
        { error: 'Resume file is required' },
        { status: 400 }
      );
    }

    let resumeContent = '';
    let parseMethod = 'ai';
    let confidence = 0;
    let parsedResume: EnhancedParsedResume; // Change to EnhancedParsedResume

    if (file.type === 'application/pdf') {
      // Use direct PDF parsing with Gemini 2.0 Flash
      parsedResume = await parseWithAIPDF(file);
      parseMethod = 'ai_pdf';
      confidence = 98; // Higher confidence for direct PDF parsing
    } else {
      resumeContent = await file.text();
      
      // Validate content before AI parsing
      if (resumeContent.trim().length < 20) {
        return Response.json(
          {
            error: 'Insufficient content detected',
            details: 'The uploaded file appears to be empty or contains too little text to analyze. Please ensure your resume contains meaningful content with sections like experience, education, or skills.',
            redirectTo: '/tools/tailor'
          },
          { status: 400 }
        );
      }
      
      // Use AI parsing for text files
      parsedResume = await parseWithAI(resumeContent);
      parseMethod = 'ai';
      confidence = 90; // Default confidence for AI parsing
    }

    // Merge custom colors and profile image
    const finalParsedData = {
      ...parsedResume,
      customColors: customColors || {},
      profileImage: profileImage || parsedResume.profileImage,
    };

    // Save to database if authenticated
    let savedResume: Resume | undefined;
    if (session?.user?.id) {
      const resumeTitle: string =
        finalParsedData.name || file.name.split('.')[0] || 'Untitled Resume';
      const slug = `${createSlug(resumeTitle)}-${Math.floor(1000 + Math.random() * 9000)}`;

      savedResume = await ResumeDatabase.saveResume({
        userId: session.user.id,
        title: resumeTitle,
        originalFilename: file.name,
        fileType: file.type,
        fileSize: file.size,
        parsedData: finalParsedData,
        parseMethod: parseMethod,
        confidenceScore: confidence,
        isPublic: true,
        slug,
      });
    }

    return Response.json({
      data: finalParsedData,
      meta: {
        method: parseMethod,
        confidence: confidence,
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        resumeId: savedResume?.id,
        resumeSlug: savedResume?.slug,
        // No aiTailorCommentary here as this is the regular parse endpoint
      },
    });
  } catch (error) {
    // Handle specific AI-related errors
    if (error instanceof Error) {
      if (error.message.includes('quota')) {
        return Response.json(
          {
            error:
              'AI parsing failed: You exceeded your Google Gemini quota. Please check your Google AI Studio billing details.',
          },
          { status: 500 }
        );
      }
      if (
        error.message.includes('Request too large') ||
        error.message.includes('INVALID_ARGUMENT')
      ) {
        return Response.json(
          {
            error:
              'AI parsing failed: The resume is too large for the AI model. Please try a shorter resume or use the text analysis fallback.',
          },
          { status: 400 }
        );
      }
      if (error.message.includes('PDF parsing failed')) {
        return Response.json(
          {
            error:
              'Failed to parse the PDF document. This might be due to a very poor quality scan or an unsupported PDF format. Please ensure the PDF contains selectable text.',
          },
          { status: 400 }
        );
      }
      if (error.message.includes('Could not extract meaningful text')) {
        return Response.json(
          {
            error:
              'Could not extract meaningful text from the file. The file might be corrupted, password-protected, or contain only images. Please ensure the document contains clear, selectable text.',
          },
          { status: 400 }
        );
      }
      if (error.message.includes('No active session found')) {
        return Response.json(
          {
            error:
              'Your session has expired. Please sign in again to save your resume.',
          },
          { status: 401 }
        );
      }
    }

    return Response.json(
      {
        error: 'Failed to process resume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
