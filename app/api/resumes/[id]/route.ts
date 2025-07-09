import { ResumeDatabase } from '@/lib/database';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { parsedData } = await request.json();

  if (!id || !parsedData) {
    return new Response(
      JSON.stringify({ error: 'Resume ID and parsed data are required.' }),
      { status: 400 }
    );
  }

  try {
    const updatedResume = await ResumeDatabase.updateResume(id, {
      parsed_data: parsedData,
      updated_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ data: updatedResume }), {
      status: 200,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return new Response(
      JSON.stringify({
        error: 'Failed to update resume.',
        details: errorMessage,
      }),
      { status: 500 }
    );
  }
}
