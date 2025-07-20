import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { DefaultSession } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ResumeDatabase } from '@/lib/db';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
  }
}

export async function GET(_request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resumes = await ResumeDatabase.getUserResumes(session.user.id);
    return NextResponse.json(resumes);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const parsedData = await request.json();
    
    // Generate a unique slug
    const slug = `cv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Create the resume in the database
    const newResume = await ResumeDatabase.saveResume({
      userId: session.user.id,
      title: parsedData.title || 'Untitled Resume',
      originalFilename: 'api-generated.json',
      fileType: 'application/json',
      fileSize: JSON.stringify(parsedData).length,
      parsedData,
      parseMethod: parsedData.metadata?.source === 'tailored' ? 'ai-tailored' : 'ai-generated',
      confidenceScore: parsedData.metadata?.confidence || 0.9,
      isPublic: false,
      slug,
      additionalContext: parsedData.metadata?.source === 'tailored' ? 
        {
          jobSpecSource: 'pasted',
          jobSpecText: '',
          tone: 'Neutral',
          extraPrompt: parsedData.metadata?.aiTailorCommentary || ''
        } : undefined,
    });

    return NextResponse.json({
      id: newResume.id,
      slug: newResume.slug,
      message: 'Resume saved successfully',
    });
  } catch (error) {
    console.error('Failed to save resume:', error);
    return NextResponse.json(
      { error: 'Failed to save resume' },
      { status: 500 }
    );
  }
}
