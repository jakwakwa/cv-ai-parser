import { NextResponse } from 'next/server';
import { ResumeDatabase } from '@/lib/database';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required.' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const resume = await ResumeDatabase.getPublicResume(supabase, slug);

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found.' }, { status: 404 });
    }

    return NextResponse.json({ data: resume });
  } catch (error) {
    console.error('Error fetching resume by slug:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      { error: 'Failed to retrieve resume.', details: errorMessage },
      { status: 500 }
    );
  }
}
