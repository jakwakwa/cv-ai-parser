import { ResumeDatabase } from '@/lib/database';
import { createClient } from '@/lib/supabase/server';

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

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response(
      JSON.stringify({
        error: 'Authentication required. Please sign in again.',
      }),
      { status: 401 }
    );
  }

  try {
    const existingResume = await ResumeDatabase.getResume(supabase, id);
    if (!existingResume || existingResume.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized access or resume not found.' }),
        { status: 403 }
      );
    }

    const updatedResume = await ResumeDatabase.updateResume(supabase, id, {
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
