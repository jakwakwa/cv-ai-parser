'use client';

import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { usePdfDownloader } from '@/hooks/use-pdf-downloader';
import { useToast } from '@/hooks/use-toast';
import type { Resume } from '@/lib/types'; // Import the Resume type
import { useAuth } from '@/src/components/auth-provider/auth-provider';
import ResumeDisplayButtons from '@/src/components/resume-display-buttons/resume-display-buttons';
import ResumeTailorCommentary from '@/src/components/resume-tailor-commentary/resume-tailor-commentary'; // Import the new component
import { SiteHeader } from '@/src/components/site-header/site-header';
import { Button } from '@/src/components/ui/ui-button/button';
import ResumeDisplay from '@/src/containers/resume-display/resume-display';
import ResumeEditor from '@/src/containers/resume-editor/resume-editor';

export default function ViewResumePage() {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;
  const { user, loading: authLoading } = useAuth();
  const { isDownloading, downloadPdf } = usePdfDownloader();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
  const [resume, setResume] = useState<Resume | null>(null); // Change to 'resume' and Resume type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiTailorCommentary, setAiTailorCommentary] = useState<string | null>(
    null
  ); // Rename aiSummary to aiTailorCommentary

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
        // Add more cases for other toast messages as needed
      }
      // Clean up the URL to prevent the toast from reappearing on refresh
      router.replace(window.location.pathname);
    }
  }, [searchParams, router, toast]);

  useEffect(() => {
    const fetchResume = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`/api/resume/${slug}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch resume.');
        }
        const result = await response.json();
        setResume(result.data); // Store the entire resume object
        // Extract AI tailoring commentary from parsed_data.metadata if available
        if (result.data?.parsed_data?.metadata?.aiTailorCommentary) {
          setAiTailorCommentary(
            result.data.parsed_data.metadata.aiTailorCommentary
          );
        } else {
          setAiTailorCommentary(null);
        }
      } catch (err: unknown) {
        setError(
          (err as Error).message ||
            'An error occurred while loading the resume.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [slug]);

  const handleSaveEdits = async (updatedData: Record<string, unknown>) => {
    if (!resume || !resume.id) {
      // Use 'resume' here
      setError('Cannot save: Resume ID is missing.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/resumes/${resume.id}`, {
        // Use 'resume.id' here
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parsedData: updatedData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save resume edits.');
      }

      const result = await response.json();
      setResume(result.data); // Update with saved data (entire resume object)
      setViewMode('view');
      router.push(`${window.location.pathname}?toast=resume_saved`);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to save edits.');
      toast({
        title: 'Error',
        description: (err as Error).message || 'Failed to save edits.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setViewMode('view');
  };

  const handleEdit = () => {
    setViewMode('edit');
  };

  const handleDownloadPdf = () => {
    if (resume) {
      downloadPdf(
        document.getElementById('resume-content') as HTMLElement,
        `${resume.parsed_data.name?.replace(/ /g, '_') || 'resume'}.pdf`
      );
    }
  };

  if (authLoading || loading) {
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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6 text-center">{error}</p>
        <Button onClick={() => router.push('/library')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
        </Button>
      </div>
    );
  }

  if (!resume) {
    // Check for 'resume' object
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Resume Not Found
        </h2>
        <p className="text-gray-700 mb-6 text-center">
          The resume you are looking for does not exist or is not public.
        </p>
        <Button onClick={() => router.push('/library')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
        </Button>
      </div>
    );
  }

  if (viewMode === 'edit') {
    return (
      <div className="pageWrapper">
        <SiteHeader />
        <main>
          <ResumeEditor
            resumeData={resume.parsed_data}
            onSave={handleSaveEdits}
            onCancel={handleCancelEdit}
            onCustomColorsChange={(colors) =>
              setResume((prevResume) => {
                if (!prevResume) return null;
                return {
                  ...prevResume,
                  parsed_data: {
                    ...prevResume.parsed_data,
                    customColors: colors,
                  },
                };
              })
            }
          />
        </main>
      </div>
    );
  }

  return (
    <div className="pageWrapper">
      <SiteHeader />

      <main className="mainUserContainer">
        <div className="resumeContainer">
          <ResumeDisplayButtons
            onDownloadPdf={handleDownloadPdf}
            onEditResume={handleEdit}
            isOnResumePage={true}
          />
          <ResumeTailorCommentary aiTailorCommentary={aiTailorCommentary} />{' '}
          {/* Render AI tailoring commentary */}
          <ResumeDisplay resumeData={resume.parsed_data} isAuth={!!user} />
        </div>
      </main>
    </div>
  );
}
