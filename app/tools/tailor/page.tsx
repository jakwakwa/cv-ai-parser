'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { EnhancedParsedResume } from '@/lib/resume-parser/enhanced-schema'; // Import EnhancedParsedResume
// import type { ParsedResume } from '@/lib/resume-parser/schema';
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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleResumeCreated = async (
    _parsedData: EnhancedParsedResume, // Update to EnhancedParsedResume
    _info: ParseInfo
  ) => {
    toast({
      title: 'Resume Created',
      description: 'Your tailored resume has been created.',
    });
  };

  return (
    <div className={styles.pageContainer}>
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
        isAuthenticated={true}
      />
    </div>
  );
}
