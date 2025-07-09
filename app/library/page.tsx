import { getServerSession } from 'next-auth/next';
import { Suspense } from 'react';
import { authOptions } from '@/lib/auth';
import { ResumeDatabase } from '@/lib/db';
import type { Resume } from '@/lib/types';
import { SiteHeader } from '@/src/components/site-header/site-header';
import LibraryPageContent from './page-content';

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  let initialResumes: Resume[] = [];

  if (userId) {
    try {
      initialResumes = await ResumeDatabase.getUserResumes(userId);
    } catch (error) {
      console.error('Failed to fetch resumes on server:', error);
      // Pass an empty array and let the client show an error.
    }
  }

  return (
    <div className="pageWrapper">
      <SiteHeader />
      <Suspense fallback={<div>Loading...</div>}>
        <LibraryPageContent initialResumes={initialResumes} />
      </Suspense>
    </div>
  );
}
