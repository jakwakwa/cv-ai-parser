'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/src/components/auth-provider/auth-provider';
import FigmaToResumeTool from '@/src/containers/figma-to-resume-tool/figma-to-resume-tool';
import styles from './page.module.css';

export default function FigmaToResumePage() {
  const { loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleResumeGenerated = (info: {
    componentName: string;
    jsxCode: string;
    cssCode: string;
  }) => {
    toast({
      title: 'Resume Generated',
      description: `Component ${info.componentName} was created successfully from your Figma design.`,
    });
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
        <h1 className={styles.title}>Figma to Resume</h1>
        <p className={styles.subtitle}>
          Transform your Figma design directly into a deployable resume
          component
        </p>
      </div>

      <FigmaToResumeTool
        onResumeGenerated={handleResumeGenerated}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}
