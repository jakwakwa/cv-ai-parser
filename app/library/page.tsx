'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Resume } from '@/lib/types';
import AdSense from '@/src/components/adsense/AdSense';
import { useAuth } from '@/src/components/auth-provider/AuthProvider';
import { useAuthModal } from '@/src/components/auth-component/AuthModalContext';
import ResumeLibrary from '@/src/components/resume-library/ResumeLibrary';
import { Button } from '@/src/components/ui/button';
import { SiteHeader } from '@/src/components/site-header/SiteHeader';
import TabNavigation from '@/src/components/tab-navigation/TabNavigation';
import styles from '../page.module.css';

// Component that handles URL parameters - needs to be wrapped in Suspense
function LibraryPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const { setAuthModalOpen } = useAuthModal();

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

  // Auto-open the auth modal for unauthenticated users
  useEffect(() => {
    if (!user) {
      setAuthModalOpen(true);
    }
  }, [user, setAuthModalOpen]);

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
        <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Your Library!</h2>
          <p className="text-gray-600 mb-6">
            Please sign in or sign up to access your resume library and manage your documents.
          </p>
          <Button
            onClick={() => setAuthModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Sign In / Sign Up
          </Button>
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
        className="mx-auto my-4"
      />

      <Suspense fallback={<div>Loading...</div>}>
        <LibraryPageContent />
      </Suspense>

      {/* Footer Ad */}
      <AdSense
        adSlot="6789012345"
        adFormat="horizontal"
        className="mx-auto my-8"
      />
    </div>
  );
}
