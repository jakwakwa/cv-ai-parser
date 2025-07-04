'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Resume } from '@/lib/types';
import { useAuthModal } from '@/src/components/auth-component/AuthModalContext';
import { useAuth } from '@/src/components/auth-provider/auth-provider';
import { SiteHeader } from '@/src/components/site-header/site-header';
import TabNavigation from '@/src/components/tab-navigation/TabNavigation';
import { Button } from '@/src/components/ui/ui-button/button';
import ResumeLibrary from '@/src/containers/resume-library/resume-library';

// Component that handles URL parameters - needs to be wrapped in Suspense
function LibraryPageContent() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { setAuthModalOpen } = useAuthModal();
  const [countdown, setCountdown] = useState(3);

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

  // Handle countdown timer for unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [user, authLoading]);

  // Handle redirect when countdown reaches 0
  useEffect(() => {
    if (!authLoading && !user && countdown === 0) {
      router.push('/');
    }
  }, [countdown, user, authLoading, router]);

  // Auto-open the auth modal for unauthenticated users

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
    <main className="mainUserContainer">
      {!user && !authLoading && (
        <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto mt-12">
          Redirecting to home screen.
          <br /> Login to view your content
          <div className="mt-4 text-lg font-semibold text-gray-700">
            Redirecting in {countdown} seconds...
          </div>
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
    <div className="pageWrapper">
      <SiteHeader />

      {/* Header Ad */}

      <Suspense fallback={<div>Loading...</div>}>
        <LibraryPageContent />
      </Suspense>

      {/* Footer Ad */}
    </div>
  );
}
