import { type NextRequest, NextResponse } from 'next/server';
import { generatorProcessor } from '@/lib/tools-lib/resume-generator/generator-processor';
import { fileProcessor } from '@/lib/tools-lib/shared/file-parsers/file-processor';

export async function POST(request: NextRequest) {
  try {
    console.log('Received request for resume-generator');
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    console.log(`[Generator] Processing file: ${file.name} (${file.type}, ${file.size} bytes)`);

    // Extract additional customization data
    const profileImage = formData.get('profileImage') as string;
    const customColorsStr = formData.get('customColors') as string;
    let customColors = {};
    
    if (customColorsStr) {
      try {
        customColors = JSON.parse(customColorsStr);
      } catch (error) {
        console.warn('[Generator] Failed to parse customColors:', error);
      }
    }

    // Process the actual file content
    const fileResult = await fileProcessor.validateAndProcessFile(file);
    
    console.log(`[Generator] File processed successfully, content length: ${fileResult.content.length}`);
    console.log(`[Generator] Profile image provided: ${!!profileImage}`);
    console.log(`[Generator] Custom colors provided: ${Object.keys(customColors).length > 0}`);

    const result = await generatorProcessor.process(fileResult, {
      profileImage,
      customColors,
    });

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('[Generator] Processing error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to process request.', details: errorMessage },
      { status: 500 }
    );
  }
} 