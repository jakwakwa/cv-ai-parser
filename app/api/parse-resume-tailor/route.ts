import { type NextRequest, NextResponse } from 'next/server';
import { tailorProcessor } from '@/lib/tools-lib/resume-tailor/tailor-processor';
import type { UserAdditionalContext } from '@/lib/tools-lib/resume-tailor/tailor-schema';
import { fileProcessor } from '@/lib/tools-lib/shared/file-parsers/file-processor';

export async function POST(request: NextRequest) {
  try {
    console.log('Received request for resume-tailor');
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    console.log(`[Tailor] Processing file: ${file.name} (${file.type}, ${file.size} bytes)`);

    // Extract additional customization data
    const profileImage = formData.get('profileImage') as string;
    const customColorsStr = formData.get('customColors') as string;
    let customColors = {};
    
    if (customColorsStr) {
      try {
        customColors = JSON.parse(customColorsStr);
      } catch (error) {
        console.warn('[Tailor] Failed to parse customColors:', error);
      }
    }

    // Process the actual file content
    const fileResult = await fileProcessor.validateAndProcessFile(file);
    
    console.log(`[Tailor] File processed successfully, content length: ${fileResult.content.length}`);
    console.log(`[Tailor] Profile image provided: ${!!profileImage}`);
    console.log(`[Tailor] Custom colors provided: ${Object.keys(customColors).length > 0}`);

    // Extract tailor context from form data
    const tailorContext: UserAdditionalContext = {
      jobSpecSource: 'pasted',
      jobSpecText: formData.get('jobSpecText') as string,
      tone: (formData.get('tone') as any) || 'Neutral',
      extraPrompt: formData.get('extraPrompt') as string,
    };

    console.log(`[Tailor] Job spec length: ${tailorContext.jobSpecText?.length || 0}, tone: ${tailorContext.tone}`);

    const result = await tailorProcessor.process(fileResult, tailorContext, {
      profileImage,
      customColors,
    });

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('[Tailor] Processing error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to process request.', details: errorMessage },
      { status: 500 }
    );
  }
} 