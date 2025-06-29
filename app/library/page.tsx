'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Resume } from '@/lib/types';
import AuthComponent from '@/src/components/auth-component/AuthComponent';
import { useAuth } from '@/src/components/auth-provider/AuthProvider';
import ResumeLibrary from '@/src/components/resume-library/ResumeLibrary';
import { SiteHeader } from '@/src/components/site-header/SiteHeader';
import TabNavigation from '@/src/components/tab-navigation/TabNavigation';
import styles from '../page.module.css';

export default function LibraryPage() {
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
    console.log('Toast message from URL (Library Page):', toastMessage);

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
    <div className={styles.pageWrapper}>
      <SiteHeader />
      <main className={styles.mainUserContainer}>
        {!user && (
          <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome!</h2>
            <p className="text-gray-600 mb-6">
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
    </div>
  );
}
