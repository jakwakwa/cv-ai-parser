import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { Suspense } from 'react';
import { authOptions } from '@/lib/auth';
import { ResumeDatabase } from '@/lib/db';
import type { Resume } from '@/lib/types';
import { SiteHeader } from '@/src/components/site-header/site-header';
import LibraryPageContent from './page-content';

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);

  // Server-side authentication protection
  if (!session?.user?.id) {
    redirect('/?auth=required');
  }

  const userId = session.user.id;
  let initialResumes: Resume[] = [];

  try {
    initialResumes = await ResumeDatabase.getUserResumes(userId);
  } catch (error) {
    // Pass an empty array and let the client show an error.
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
