'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Resume } from '@/lib/types';
import {
  // ContentAd,
  FooterAd,
  HeaderAd,
} from '@/src/components/adsense/AdBanner';
// import TabNavigation from '@/src/components/tab-navigation/TabNavigation';
import ResumeLibrary from '@/src/containers/resume-library/resume-library';
import styles from './layout.module.css';

export default function LibraryPageContent({
  initialResumes,
}: {
  initialResumes: Resume[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [resumes, setResumes] = useState<Resume[]>(initialResumes);
  const searchParams = useSearchParams();

  // Redirect unauthenticated users away from the library page (backup for client-side)
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/?auth=required');
      return;
    }
  }, [status, router]);

  const handleSelectResume = (resume: Resume) => {
    if (resume?.slug) {
      router.push(`/resume/${resume.slug}`);
    } else {
      router.push('/library?toast=view_error');
    }
  };

  useEffect(() => {
    const toastMessage = searchParams.get('toast');

    if (toastMessage) {
      switch (toastMessage) {
        case 'view_error':
          toast({
            title: 'Error',
            description:
              'Could not view resume: Missing necessary information.',
            variant: 'destructive',
          });
          break;
      }
      router.replace(window.location.pathname);
    }
  }, [searchParams, router, toast]);

  // This effect ensures the client state is updated if the initialResumes prop changes
  // for example, after a client-side mutation (delete, update).
  useEffect(() => {
    setResumes(initialResumes);
  }, [initialResumes]);

  const handleResumeUpdate = (updatedResumes: Resume[]) => {
    setResumes(updatedResumes);
  };

  // Don't render anything while checking authentication status
  if (status === 'loading') {
    return (
      <div className={styles.libraryWrapper}>
        <main className={styles.libraryContainer}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        </main>
      </div>
    );
  }

  // At this point, user should be authenticated due to server-side protection
  // But keep this as a backup safety check

  // Only render full content for authenticated users
  return (
    <>
      {/* Header ad outside container for full width */}
      <div style={{ width: '100%', maxWidth: 'none' }}>
        <HeaderAd />
      </div>

      <div className={styles.libraryWrapper}>
        <main className={styles.libraryContainer}>
          {/* <TabNavigation initialView="library" adSpace={<ContentAd />} /> */}

          {session?.user?.id && (
            <ResumeLibrary
              initialResumes={resumes}
              onSelectResume={handleSelectResume}
              onResumesUpdate={handleResumeUpdate}
              userId={session.user.id}
            />
          )}
        </main>
      </div>

      {/* Footer ad outside container for full width */}
      <div style={{ width: '100%', maxWidth: 'none' }}>
        <FooterAd />
      </div>
    </>
  );
}
