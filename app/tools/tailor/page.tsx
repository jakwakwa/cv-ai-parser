'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/src/components/auth-provider/auth-provider';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import ResumeTailorTool from '@/src/containers/resume-tailor-tool/resume-tailor-tool';
import styles from './page.module.css';

interface ParseInfo {
  resumeId?: string;
  resumeSlug?: string;
  method: string;
  confidence: number;
  filename: string;
  fileType: string;
  fileSize: number;
}

export default function ResumeTailorPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleResumeCreated = async (
    parsedData: ParsedResume,
    info: ParseInfo
  ) => {
    if (user && info.resumeSlug) {
      router.push(`/resume/${info.resumeSlug}?toast=resume_uploaded`);
    } else {
      // For non-auth users, show a toast and potentially redirect to a preview
      toast({
        title: 'Resume Created',
        description: 'Your tailored resume has been created. Sign in to save it to your library.',
      });
    }
  };

  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>AI Resume Tailor</h1>
        <p className={styles.subtitle}>
          Upload your resume and a job description to create a perfectly tailored resume
        </p>
      </div>
      
      <ResumeTailorTool
        onResumeCreated={handleResumeCreated}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isAuthenticated={!!user}
      />
    </div>
  );
}