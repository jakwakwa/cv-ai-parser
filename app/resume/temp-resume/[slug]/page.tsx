'use client';

import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePdfDownloader } from '@/hooks/use-pdf-downloader';
import { useToast } from '@/hooks/use-toast';
import { KEEP_TEMP_RESUMES_FOR_TESTING } from '@/lib/config';
import type { ParsedResumeSchema } from '@/lib/tools-lib/shared-parsed-resume-schema';
import ResumeDisplayButtons from '@/src/components/resume-display-buttons/resume-display-buttons';
import ResumeTailorCommentary from '@/src/components/resume-tailor-commentary/resume-tailor-commentary';
import { Button } from '@/src/components/ui/ui-button/button';
import ResumeDisplay from '@/src/containers/resume-display/resume-display';
import { useTempResumeStore } from '@/src/hooks/use-temp-resume-store';
import styles from '../../[slug]/layout.module.css';

export default function TempResumePage() {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;
  const { isDownloading, downloadPdf } = usePdfDownloader();
  const { toast } = useToast();
  const { getTempResume, removeTempResume } = useTempResumeStore();

  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState<ParsedResumeSchema | null>(null);
  const [aiTailorCommentary, setAiTailorCommentary] = useState<string | null>(
    null
  );

  const searchParams = useSearchParams();

  useEffect(() => {
    const toastMessage = searchParams.get('toast');

    if (toastMessage) {
      switch (toastMessage) {
        case 'resume_uploaded':
          toast({
            title: 'Success!',
            description: 'Resume uploaded and parsed successfully!',
          });
          break;
        case 'resume_saved':
          toast({
            title: 'Success!',
            description: 'Resume saved successfully!',
          });
          break;
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

  useEffect(() => {
    if (typeof slug === 'string') {
      const tempResume = getTempResume(slug);

      if (tempResume) {
        setResumeData(tempResume.resumeData);
        setAiTailorCommentary(tempResume.aiTailorCommentary || null);
      } else {
        setResumeData(null);
        setAiTailorCommentary(null);
      }
    }
    setLoading(false);
  }, [slug, getTempResume]);

  // Configurable cleanup - only cleanup when testing flag is disabled
  useEffect(() => {
    if (KEEP_TEMP_RESUMES_FOR_TESTING) {
      // Don't auto-cleanup when testing flag is enabled
      return;
    }

    const handleBeforeUnload = () => {
      // Only cleanup on actual page unload when testing flag is disabled
      if (typeof slug === 'string') {
        removeTempResume(slug);
      }
    };

    // Add listener for page unload (production only)
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [slug, removeTempResume]);

  const handleDownloadPdf = () => {
    if (resumeData) {
      downloadPdf(
        document.getElementById('resume-content') as HTMLElement,
        `${resumeData.name?.replace(/ /g, '_') || 'resume'}.pdf`
      );
    }
  };

  if (loading) {
    return (
      <div className="loadingContainer">
        <div className="loadingSpinner" />
        <p className="loadingText">Loading Resume...</p>
      </div>
    );
  }

  if (isDownloading) {
    return (
      <div className="loadingContainer">
        <div className="loadingSpinner" />
        <p className="loadingText">Downloading PDF...</p>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Resume Not Found. The temporary resume may have expired.
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Please create a new resume or sign up to save resumes permanently.
        </p>
        <Button
          onClick={() => {
            // Only auto-cleanup when testing flag is disabled
            if (!KEEP_TEMP_RESUMES_FOR_TESTING && typeof slug === 'string') {
              removeTempResume(slug);
            }
            router.push('/tools/ai-resume-tailor');
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tailor Tool
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.resumeContainer}>
      <div className={styles.container}>
        {/* Development helper - only show when testing flag is enabled */}
        {KEEP_TEMP_RESUMES_FOR_TESTING && (
          <div
            style={{
              padding: '8px 12px',
              background: '#fef3cd',
              border: '1px solid #ffc107',
              borderRadius: '4px',
              fontSize: '12px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              🧪 Testing Mode: Resume data persists
              (KEEP_TEMP_RESUMES_FOR_TESTING = true)
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (typeof slug === 'string') {
                  removeTempResume(slug);
                  router.push('/tools/ai-resume-tailor');
                }
              }}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              Clear & Return
            </Button>
          </div>
        )}

        <ResumeDisplayButtons
          onDownloadPdf={handleDownloadPdf}
          onUploadNew={() => {
            // Only auto-cleanup when testing flag is disabled
            if (!KEEP_TEMP_RESUMES_FOR_TESTING && typeof slug === 'string') {
              removeTempResume(slug);
            }
            router.push('/tools/ai-resume-tailor');
          }}
          showDownload={true}
          showUploadNew={true}
          showEdit={false}
          showLibrary={false}
          isAuthenticated={false}
          maxMobileButtons={2}
        />
        <ResumeTailorCommentary aiTailorCommentary={aiTailorCommentary} />
        <ResumeDisplay resumeData={resumeData} isAuth={false} />
      </div>
    </div>
  );
}
