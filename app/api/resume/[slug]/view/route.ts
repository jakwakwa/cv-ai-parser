import { NextResponse } from 'next/server';
import { ResumeDatabase } from '@/lib/db';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required.' }, { status: 400 });
  }

  try {
    const resume = await ResumeDatabase.getPublicResume(slug); // Fetch to get the ID
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found.' }, { status: 404 });
    }

    await ResumeDatabase.incrementViewCount(resume.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 }
    );
  }
} 