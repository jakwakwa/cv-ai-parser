import { type NextRequest, NextResponse } from 'next/server';
import { IS_AI_PARSING_ENABLED } from '@/lib/config';
import { ResumeDatabase } from '@/lib/database';
import { parseWithAI } from '@/lib/resume-parser/ai-parser';
import { parseWithRegex } from '@/lib/resume-parser/regex-parser';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import { supabase } from '@/lib/supabase';
import { createSlug } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text: fileContent, filename } = body;

    if (!fileContent) {
      return NextResponse.json(
        { error: 'No text content provided.' },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      );
    }

    console.log(`Processing resume: ${filename} for user: ${user.id}`);

    let parsedResume: ParsedResume;
    let parseMethod: 'ai' | 'regex' | 'regex_fallback' = 'regex';
    let confidence = 0;

    if (IS_AI_PARSING_ENABLED) {
      try {
        parsedResume = await parseWithAI(fileContent);
        parseMethod = 'ai';
        confidence = 95; // AI parsing is high-confidence
      } catch (aiError) {
        console.warn('AI parsing failed. Falling back to regex.', aiError);
        const regexResult = parseWithRegex(fileContent);
        parsedResume = regexResult.data;
        confidence = regexResult.confidence;
        parseMethod = 'regex_fallback';
      }
    } else {
      console.log('AI parsing is disabled. Using regex parser.');
      const regexResult = parseWithRegex(fileContent);
      parsedResume = regexResult.data;
      confidence = regexResult.confidence;
      parseMethod = 'regex';
    }

    const resumeTitle =
      parsedResume.name || filename.split('.')[0] || 'Untitled Resume';
    const generatedSlug = createSlug(resumeTitle);

    const savedResume = await ResumeDatabase.saveResume({
      userId: user.id,
      title: resumeTitle,
      originalFilename: filename,
      fileType: body.fileType,
      fileSize: body.fileSize,
      parsedData: parsedResume,
      parseMethod: parseMethod,
      confidenceScore: confidence,
      isPublic: true,
      slug: generatedSlug,
    });

    return NextResponse.json({
      data: parsedResume,
      meta: {
        method: parseMethod,
        confidence,
        filename,
        resumeId: savedResume.id,
        resumeSlug: savedResume.slug,
      },
    });
  } catch (error) {
    console.error('An unexpected error occurred in parse-resume route:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      { error: 'Failed to parse resume.', details: errorMessage },
      { status: 500 }
    );
  }
}
