'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Suspense, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Resume } from '@/lib/types';
import TabNavigation from '@/src/components/tab-navigation/TabNavigation';
import ResumeLibrary from '@/src/containers/resume-library/resume-library';
import styles from './layout.module.css';

export default function LibraryPageContent({
  initialResumes,
}: {
  initialResumes: Resume[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [resumes, setResumes] = useState<Resume[]>(initialResumes);
  const searchParams = useSearchParams();

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

  return (
    <main className={styles.libraryContainer}>
      <TabNavigation initialView="library" />
      {session?.user?.id && (
        <ResumeLibrary
          initialResumes={resumes}
          onSelectResume={handleSelectResume}
          onResumesUpdate={handleResumeUpdate}
          userId={session.user.id}
        />
      )}
    </main>
  );
}
