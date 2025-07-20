import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
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
    const session = await getServerSession(authOptions);
    let resume = null;

    // First, try to get user-owned resume if authenticated
    if (session?.user?.id) {
      resume = await ResumeDatabase.getUserResumeBySlug(slug, session.user.id);
    }

    // If not found and not authenticated user's resume, try public resume
    if (!resume) {
      resume = await ResumeDatabase.getPublicResume(slug);
    }

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found.' }, { status: 404 });
    }

    await ResumeDatabase.incrementViewCount(resume.id);
    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 }
    );
  }
}
