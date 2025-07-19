'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { EnhancedParsedResume } from '@/lib/resume-parser/enhanced-schema';
import { FooterAd, HeaderAd } from '@/src/components/adsense/AdBanner';
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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  const handleResumeCreated = async (
    _parsedData: EnhancedParsedResume,
    _info: ParseInfo
  ) => {
    // The tailor tool now handles navigation internally
    // This function can be used for any additional logic if needed
  };

  // Only show ads when we're sure the user is NOT authenticated
  // Don't show during loading to prevent flashing
  const shouldShowAds = status === 'unauthenticated';

  return (
    <div className={styles.pageContainer}>
      {shouldShowAds && <HeaderAd />}
      <div className={styles.headerSection}>
        <h1 className={styles.title}>AI Resume Tailor</h1>
        <p className={styles.subtitle}>
          Upload your resume and a job description to create a perfectly
          tailored resume
        </p>
      </div>

      <ResumeTailorTool
        onResumeCreated={handleResumeCreated}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isAuthenticated={!!session}
      />
      {shouldShowAds && <FooterAd />}
    </div>
  );
}
