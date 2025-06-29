import { type NextRequest, NextResponse } from 'next/server';
import { ResumeDatabase } from '@/lib/database';
import { supabase } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { parsedData } = await request.json();

  if (!id || !parsedData) {
    return NextResponse.json(
      { error: 'Resume ID and parsed data are required.' },
      { status: 400 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Ensure the user owns the resume before updating
    const existingResume = await ResumeDatabase.getResume(id);
    if (!existingResume || existingResume.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access or resume not found.' },
        { status: 403 }
      );
    }

    const updatedResume = await ResumeDatabase.updateResume(id, {
      parsed_data: parsedData,
      updated_at: new Date().toISOString(), // Update timestamp
    });

    return NextResponse.json({ data: updatedResume });
  } catch (error) {
    console.error('Error updating resume:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      { error: 'Failed to update resume.', details: errorMessage },
      { status: 500 }
    );
  }
}
