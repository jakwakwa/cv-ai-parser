import type { Metadata } from 'next';
import { ResumeDatabase } from '@/lib/database';
import { createClient } from '@/lib/supabase/server';
import type { Resume } from '@/lib/types';

interface ResumeLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    
    // Fetch resume data for metadata
    const supabase = await createClient();
    const resume: Resume | null = await ResumeDatabase.getPublicResume(supabase, slug);
    
    if (!resume || !resume.parsed_data) {
      return {
        title: 'Resume Not Found | CV AI Parser',
        description: 'The requested resume could not be found.',
      };
    }
    
    const { parsed_data } = resume;
    const name = parsed_data.name || 'Professional Resume';
    const title = parsed_data.title || 'Career Professional';
    const location = parsed_data.contact?.location || '';
    const experienceCount = parsed_data.experience?.length || 0;
    const skillsCount = parsed_data.skills?.length || 0;
    
    // Create dynamic metadata
    const pageTitle = `${name} - ${title} | CV AI Parser`;
    const description = `View ${name}'s professional resume${title ? ` as ${title}` : ''}${location ? ` based in ${location}` : ''}. ${experienceCount > 0 ? `${experienceCount} work experience${experienceCount !== 1 ? 's' : ''}.` : ''} ${skillsCount > 0 ? `${skillsCount} professional skill${skillsCount !== 1 ? 's' : ''}.` : ''} Created with CV AI Parser.`;
    
    const resumeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/resume/${slug}`;
    
    return {
      title: pageTitle,
      description: description,
      keywords: [
        'resume',
        'CV',
        'professional profile',
        name,
        title,
        ...(parsed_data.skills || []),
        'AI generated resume',
        'career profile',
      ].filter(Boolean),
      openGraph: {
        title: pageTitle,
        description: description,
        url: resumeUrl,
        siteName: 'CV AI Parser',
        type: 'profile',
        locale: 'en_US',
        // The opengraph-image.tsx file will automatically be used
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: description,
        creator: '@your_twitter_handle', // Replace with your actual Twitter handle
        // The twitter-image.tsx file will automatically be used if we create one
      },
      alternates: {
        canonical: resumeUrl,
      },
      other: {
        'profile:first_name': parsed_data.name?.split(' ')[0] || '',
        'profile:last_name': parsed_data.name?.split(' ').slice(1).join(' ') || '',
        'profile:username': slug,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for resume:', error);
    return {
      title: 'Resume | CV AI Parser',
      description: 'Professional resume created with CV AI Parser.',
    };
  }
}

export default function ResumeLayout({ children }: ResumeLayoutProps) {
  return <>{children}</>;
}