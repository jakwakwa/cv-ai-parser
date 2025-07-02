'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Resume } from '@/lib/types';
import AdSense from '@/src/components/adsense/AdSense';
import AuthComponent from '@/src/components/auth-component/AuthComponent';
import { useAuth } from '@/src/components/auth-provider/AuthProvider';
import ResumeLibrary from '@/src/components/resume-library/ResumeLibrary';
import { SiteHeader } from '@/src/components/site-header/SiteHeader';
import TabNavigation from '@/src/components/tab-navigation/TabNavigation';
import styles from '../page.module.css';
import libraryStyles from './library.module.css';

// Component that handles URL parameters - needs to be wrapped in Suspense
function LibraryPageContent() {
  const router = useRouter();
  const { user } = useAuth();
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
    <main className={styles.mainUserContainer}>
      {!user && (
        <div className={libraryStyles.welcomeCard}>
          <h2 className={libraryStyles.welcomeTitle}>Welcome!</h2>
          <p className={libraryStyles.welcomeText}>
            Please sign in or sign up to use the resume parser and manage your
            library.
          </p>
          <AuthComponent />
        </div>
      )}
      {user && (
        <>
          <TabNavigation initialView="library" />
          <ResumeLibrary onSelectResume={handleSelectResume} />
        </>
      )}
    </main>
  );
}

export default function LibraryPage() {
  return (
    <div className={styles.pageWrapper}>
      <SiteHeader />

      {/* Header Ad */}
      <AdSense
        adSlot="5678901234"
        adFormat="horizontal"
        className={libraryStyles.adContainer}
      />

      <Suspense fallback={<div>Loading...</div>}>
        <LibraryPageContent />
      </Suspense>

      {/* Footer Ad */}
      <AdSense
        adSlot="6789012345"
        adFormat="horizontal"
        className={libraryStyles.adContainerLarge}
      />
    </div>
  );
}
