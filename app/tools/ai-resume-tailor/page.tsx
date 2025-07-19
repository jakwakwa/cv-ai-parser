'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FooterAd, HeaderAd } from '@/src/components/adsense/AdBanner';
import ResumeTailorTool from '@/src/containers/tool-containers/resume-tailor-tool/resume-tailor-tool';
import styles from './page.module.css';

export default function AiResumeTailorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

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
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isAuthenticated={!!session}
      />
      {shouldShowAds && <FooterAd />}
    </div>
  );
}
