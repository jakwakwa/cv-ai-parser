import { type NextRequest, NextResponse } from 'next/server';
import { tailorProcessor } from '@/lib/tools-lib/resume-tailor/tailor-processor';
import type { UserAdditionalContext } from '@/lib/tools-lib/resume-tailor/tailor-schema';

export async function POST(request: NextRequest) {
  try {
    console.log('Received request for resume-tailor');
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Placeholder for the full file parse result
    const fileResult = {
      content: 'File content would be here',
      fileType: 'pdf' as const,
      fileName: file.name,
      fileSize: file.size,
    };

    // Placeholder for extracting tailor context
    const tailorContext: UserAdditionalContext = {
      jobSpecSource: 'pasted',
      jobSpecText: formData.get('jobSpecText') as string,
      tone: (formData.get('tone') as any) || 'Neutral',
      extraPrompt: formData.get('extraPrompt') as string,
    };

    const result = await tailorProcessor.process(fileResult, tailorContext);

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      { error: 'Failed to process request.', details: errorMessage },
      { status: 500 }
    );
  }
} 