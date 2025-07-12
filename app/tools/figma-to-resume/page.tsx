'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import FigmaToResumeTool from '@/src/containers/figma-to-resume-tool/figma-to-resume-tool';
import styles from './page.module.css';

interface FigmaGenerationInfo {
  componentName: string;
  jsxCode: string;
  cssCode: string;
  rawFigma?: Record<string, unknown>;
  customColors?: Record<string, string>;
  extractedColors?: {
    primary: string;
    secondary: string;
    accent: string;
    all: string[];
  };
}

export default function FigmaToResumePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleResumeGenerated = (info: FigmaGenerationInfo) => {
    // Enhanced handler with more detailed feedback
    const successMessage = info.extractedColors
      ? `Component ${info.componentName} was created with ${info.extractedColors.all.length} extracted colors.`
      : `Component ${info.componentName} was created successfully from your Figma design.`;

    toast({
      title: 'Resume Generated',
      description: successMessage,
    });

    // Log generation details for debugging
    console.log('Figma component generated:', {
      name: info.componentName,
      colors: info.extractedColors?.all.length || 0,
      hasCustomColors: !!info.customColors,
    });
  };

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
