import { v4 as uuidv4 } from 'uuid';
import { IS_AI_PARSING_ENABLED } from '@/lib/config';
import { ResumeDatabase } from '@/lib/database';
import { parseWithAI, parseWithAIPDF } from '@/lib/resume-parser/ai-parser';
import { parseWithRegex } from '@/lib/resume-parser/regex-parser';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import { createClient } from '@/lib/supabase/server';
import { createSlug } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const customColors = JSON.parse(
      (formData.get('customColors') as string) || '{}'
    );
    const isAuthenticated = formData.get('isAuthenticated') === 'true';

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided.' }), {
        status: 400,
      });
    }

    const supabase = await createClient();
    let user = null;
    let userError = null;

    // Only check authentication if the user is supposed to be authenticated
    if (isAuthenticated) {
      const authResult = await supabase.auth.getUser();
      user = authResult.data.user;
      userError = authResult.error;

      if (userError || !user) {
        return new Response(
          JSON.stringify({
            error: 'Authentication required. Please sign in again.',
          }),
          { status: 401 }
        );
      }
    }

    let parsedResume: ParsedResume;
    let parseMethod: 'ai' | 'ai_pdf' | 'regex' | 'regex_fallback' = 'regex';
    let confidence = 0;

    if (IS_AI_PARSING_ENABLED) {
      try {
        if (file.type === 'application/pdf') {
          // Use direct PDF parsing with Gemini 2.0 Flash
          parsedResume = await parseWithAIPDF(file);
          parseMethod = 'ai_pdf';
          confidence = 98; // Higher confidence for direct PDF parsing
        } else {
          // For text files, extract content first
          const fileContent = await file.text();
          parsedResume = await parseWithAI(fileContent);
          parseMethod = 'ai';
          confidence = 95;
        }
      } catch (_aiError) {
        // Fallback to regex for text files only
        if (file.type === 'text/plain') {
          const fileContent = await file.text();
          const regexResult = parseWithRegex(fileContent);
          parsedResume = regexResult.data;
          confidence = regexResult.confidence;
          parseMethod = 'regex_fallback';
        } else {
          throw new Error(
            'PDF parsing failed and no fallback available for non-text files'
          );
        }
      }
    } else {
      // AI parsing disabled - only handle text files
      if (file.type !== 'text/plain') {
        throw new Error(
          'AI parsing is disabled. Only text files are supported.'
        );
      }
      const fileContent = await file.text();
      const regexResult = parseWithRegex(fileContent);
      parsedResume = regexResult.data;
      confidence = regexResult.confidence;
      parseMethod = 'regex';
    }

    // Ensure customColors are merged and create a plain JS object for database serialization
    const finalParsedData: ParsedResume = JSON.parse(
      JSON.stringify({
        ...parsedResume,
        customColors: customColors || {},
      })
    );

    // Only save to database for authenticated users
    let savedResume: { id: string; slug: string } | undefined;

    if (isAuthenticated && user) {
      const resumeTitle =
        parsedResume.name || file.name.split('.')[0] || 'Untitled Resume';
      let generatedSlug = `${createSlug(resumeTitle)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const MAX_RETRIES = 5;
      let retries = 0;

      while (retries < MAX_RETRIES) {
        try {
          savedResume = await ResumeDatabase.saveResume(supabase, {
            userId: user.id,
            title: resumeTitle,
            originalFilename: file.name,
            fileType: file.type,
            fileSize: file.size,
            parsedData: finalParsedData,
            parseMethod: parseMethod,
            confidenceScore: confidence,
            isPublic: true,
            slug: generatedSlug,
          });
          break; // If save is successful, break the loop
        } catch (dbError: unknown) {
          if (
            dbError instanceof Error &&
            dbError.message.includes(
              'duplicate key value violates unique constraint "resumes_slug_key"'
            )
          ) {
            // If a collision occurs, append a counter instead of a new uuid
            generatedSlug = `${createSlug(resumeTitle)}-${Math.floor(1000 + Math.random() * 9000)}-${retries + 1}`;
            retries++;
          } else {
            throw dbError; // Re-throw other database errors
          }
        }
      }

      if (!savedResume) {
        throw new Error(
          'Failed to save resume after multiple retries due to slug collision.'
        );
      }
    }

    return new Response(
      JSON.stringify({
        data: parsedResume,
        meta: {
          method: parseMethod,
          confidence,
          filename: file.name,
          resumeId: savedResume?.id,
          resumeSlug: savedResume?.slug,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return new Response(
      JSON.stringify({
        error: 'Failed to parse resume.',
        details: errorMessage,
      }),
      { status: 500 }
    );
  }
}
