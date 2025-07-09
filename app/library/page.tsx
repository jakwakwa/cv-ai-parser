'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Resume } from '@/lib/types';
import { SiteHeader } from '@/src/components/site-header/site-header';
import TabNavigation from '@/src/components/tab-navigation/TabNavigation';
import ResumeLibrary from '@/src/containers/resume-library/resume-library';
import styles from './layout.module.css';

// Component that handles URL parameters - needs to be wrapped in Suspense
function LibraryPageContent() {
  const router = useRouter();
  const { toast } = useToast();

  const searchParams = useSearchParams();

  const handleSelectResume = (resume: Resume) => {
    // Navigate to the resume view page using the slug
    if (resume?.slug) {
      router.push(`/resume/${resume.slug}`);
    } else {
      // Redirect back to library with an error toast message
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
      // Clean up the URL to prevent the toast from reappearing on refresh
      router.replace(window.location.pathname);
    }
  }, [searchParams, router, toast]);

  return (
    <main className={styles.libraryContainer}>
      <>
        <TabNavigation initialView="library" />
        <ResumeLibrary
          onSelectResume={handleSelectResume}
          userId="test-user-id"
        />
      </>
    </main>
  );
}

export default function LibraryPage() {
  return (
    <div className="pageWrapper">
      <SiteHeader />

      <Suspense fallback={<div>Loading...</div>}>
        <LibraryPageContent />
      </Suspense>
    </div>
  );
}
