'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
// Ads temporarily removed until sufficient content is added
import ResumeGeneratorTool from '@/src/containers/tool-containers/resume-generator-tool/resume-generator-tool';
import styles from './page.module.css';

export default function AiResumeTailorPage() {
  const [isLoading, _setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  // Only show ads when we're sure the user is NOT authenticated
  // Don't show during loading to prevent flashing
  const _shouldShowAds = status === 'unauthenticated';

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>AI Resume Generator</h1>
        <p className={styles.subtitle}>
          Upload your PDF resume to generate a beautifully customised version
          from the original file
        </p>
      </div>

      <ResumeGeneratorTool isLoading={isLoading} isAuthenticated={!!session} />
    </div>
  );
}
