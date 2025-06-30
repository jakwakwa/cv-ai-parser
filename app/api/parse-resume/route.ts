import { v4 as uuidv4 } from 'uuid';
import { IS_AI_PARSING_ENABLED } from '@/lib/config';
import { ResumeDatabase } from '@/lib/database';
import { parseWithAI } from '@/lib/resume-parser/ai-parser';
import { parseWithRegex } from '@/lib/resume-parser/regex-parser';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import { createClient } from '@/lib/supabase/server';
import { createSlug } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text: fileContent, filename, customColors, isAuthenticated } = body;

    if (!fileContent) {
      return new Response(
        JSON.stringify({ error: 'No text content provided.' }),
        { status: 400 }
      );
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
    let parseMethod: 'ai' | 'regex' | 'regex_fallback' = 'regex';
    let confidence = 0;

    if (IS_AI_PARSING_ENABLED) {
      try {
        parsedResume = await parseWithAI(fileContent);
        parseMethod = 'ai';
        confidence = 95;
      } catch (_aiError) {
        const regexResult = parseWithRegex(fileContent);
        parsedResume = regexResult.data;
        confidence = regexResult.confidence;
        parseMethod = 'regex_fallback';
      }
    } else {
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
        parsedResume.name || filename.split('.')[0] || 'Untitled Resume';
      let generatedSlug = createSlug(resumeTitle);
      const MAX_RETRIES = 5;
      let retries = 0;

      while (retries < MAX_RETRIES) {
        try {
          savedResume = await ResumeDatabase.saveResume(supabase, {
            userId: user.id,
            title: resumeTitle,
            originalFilename: filename,
            fileType: body.fileType,
            fileSize: body.fileSize,
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
            generatedSlug = `${createSlug(resumeTitle)}-${uuidv4().substring(0, 8)}`;
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
          filename,
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
