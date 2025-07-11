import type { Metadata } from 'next';
import { ResumeDatabase } from '@/lib/db';
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
    const resume: Resume | null = await ResumeDatabase.getPublicResume(slug);

    if (!resume || !resume.parsedData) {
      return {
        title: 'Resume Not Found | CV AI Parser',
        description: 'The requested resume could not be found.',
      };
    }

    const { parsedData } = resume;
    const name = parsedData.name || 'Professional Resume';
    const title = parsedData.title || 'Career Professional';
    const location = parsedData.contact?.location || '';
    const experienceCount = parsedData.experience?.length || 0;

    // Handle skills count for both legacy array and enhanced object formats
    const skillsCount = (() => {
      if (!parsedData.skills) return 0;

      // If it's an array (legacy format)
      if (Array.isArray(parsedData.skills)) {
        let count = 0;
        count = parsedData.skills.length;
        return count;
      }
      return 0;
    })();

    // Create dynamic metadata
    const pageTitle = `${name} - ${title} | CV AI Parser`;
    const description = `View ${name}'s professional resume${title ? ` as ${title}` : ''}${location ? ` based in ${location}` : ''}. ${experienceCount > 0 ? `${experienceCount} work experience${experienceCount !== 1 ? 's' : ''}.` : ''} ${skillsCount > 0 ? `${skillsCount} professional skill${skillsCount !== 1 ? 's' : ''}.` : ''} Created with CV AI Parser.`;

    const resumeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/resume/${slug}`;

    // Handle skills for keywords - support both legacy array and enhanced object formats
    const skillsForKeywords = (() => {
      if (!parsedData.skills) return [];
      return parsedData.skills;
    })();

    return {
      title: pageTitle,
      description: description,
      keywords: [
        'resume',
        'CV',
        'professional profile',
        name,
        title,
        ...skillsForKeywords,
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
        'profile:first_name': parsedData.name?.split(' ')[0] || '',
        'profile:last_name':
          parsedData.name?.split(' ').slice(1).join(' ') || '',
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
