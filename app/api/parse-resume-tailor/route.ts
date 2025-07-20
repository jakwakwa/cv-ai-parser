import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // TODO: Implement tailor-specific parsing logic
    console.log('Received request for resume-tailor');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobSpec = formData.get('jobSpec');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Placeholder response
    return NextResponse.json({
      message: 'Tailor: File received, processing not implemented yet.',
      fileName: file.name,
      jobSpecProvided: !!jobSpec,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      { error: 'Failed to process request.', details: errorMessage },
      { status: 500 }
    );
  }
} 