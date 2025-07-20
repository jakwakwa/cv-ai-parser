import { type NextRequest, NextResponse } from 'next/server';
import { generatorProcessor } from '@/lib/tools-lib/resume-generator/generator-processor';

export async function POST(request: NextRequest) {
  try {
    console.log('Received request for resume-generator');
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // This is a placeholder for the full file parse result
    const fileResult = {
      content: 'File content would be here',
      fileType: 'pdf' as const,
      fileName: file.name,
      fileSize: file.size,
    };

    const result = await generatorProcessor.process(fileResult);

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