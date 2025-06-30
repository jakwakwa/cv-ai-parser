'use client';

import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { usePdfDownloader } from '@/hooks/use-pdf-downloader';
import { useToast } from '@/hooks/use-toast';
import type { Resume } from '@/lib/types'; // Import the Resume type
import AdSense from '@/src/components/adsense/AdSense';
import { useAuth } from '@/src/components/auth-provider/AuthProvider';
import CertificationsSection from '@/src/components/CertificationsSection/CertificationsSection';
import ContactSection from '@/src/components/ContactSection/ContactSection';
import DownloadButton from '@/src/components/DownloadButton/DownloadButton';
import EducationSection from '@/src/components/EducationSection/EducationSection';
import ExperienceSection from '@/src/components/ExperienceSection/ExperienceSection';
import ProfileHeader from '@/src/components/ProfileHeader/ProfileHeader';
import ResumeEditor from '@/src/components/resume-editor/ResumeEditor';
import SkillsSection from '@/src/components/SkillsSection/SkillsSection';
import { SiteHeader } from '@/src/components/site-header/SiteHeader';
import { Button } from '@/src/components/ui/button';
import styles from '../../page.module.css';

export default function ViewResumePage() {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;
  const { loading: authLoading } = useAuth();
  const resumeContainerRef = useRef<HTMLDivElement>(null);
  const { isDownloading, downloadPdf } = usePdfDownloader();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
  const [resume, setResume] = useState<Resume | null>(null); // Change to 'resume' and Resume type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchParams = useSearchParams();

  useEffect(() => {
    const toastMessage = searchParams.get('toast');
    console.log('Toast message from URL:', toastMessage);

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
    if (resume?.parsed_data?.customColors && resumeContainerRef.current) {
      for (const [key, value] of Object.entries(
        resume.parsed_data.customColors
      )) {
        resumeContainerRef.current.style.setProperty(key, value);
      }
    }
  }, [resume?.parsed_data?.customColors]);

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
        resumeContainerRef as React.RefObject<HTMLElement>,
        `${resume.parsed_data.name?.replace(/ /g, '_') || 'resume'}.pdf`
      );
    }
  };

  if (authLoading || loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading Resume...</p>
      </div>
    );
  }

  if (isDownloading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Downloading PDF...</p>
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
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <SiteHeader />
      
      {/* Header Ad */}
      <AdSense 
        adSlot="2345678901" 
        adFormat="horizontal"
        className="mx-auto my-4"
      />
      
      <div className={styles.buttonContainer}>
        <button
          type="button"
          onClick={handleEdit}
          className={styles.editButton}
        >
          Edit Resume
        </button>
        <DownloadButton onClick={handleDownloadPdf} />
        <button
          type="button"
          onClick={() => router.push('/')}
          className={styles.resetButton}
        >
          Upload New
        </button>
      </div>
      <main className={styles.mainUserContainer}>
        <div
          id="resume-content"
          className={styles.resumeContent}
          ref={resumeContainerRef}
        >
          <ProfileHeader
            profileImage={resume.parsed_data.profileImage || ''}
            name={resume.parsed_data.name || ''}
            title={resume.parsed_data.title || ''}
            summary={resume.parsed_data.summary || ''}
            customColors={resume.parsed_data.customColors || {}} // Ensure customColors is an object
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div
              className="flex flex-col md:col-span-1 p-6 md:p-8"
              style={{ backgroundColor: 'var(--off-white)' }}
            >
              <ContactSection
                contact={resume.parsed_data.contact || {}}
                customColors={resume.parsed_data.customColors || {}}
              />
              <EducationSection
                education={resume.parsed_data.education}
                customColors={resume.parsed_data.customColors || {}}
              />
              <CertificationsSection
                certifications={resume.parsed_data.certifications}
                customColors={resume.parsed_data.customColors || {}}
              />
              <SkillsSection
                skills={resume.parsed_data.skills}
                customColors={resume.parsed_data.customColors || {}}
              />
            </div>
            <div
              className="p-6 md:p-8 md:col-span-2"
              style={{ color: 'var(--coffee)' }}
            >
              <ExperienceSection
                experience={resume.parsed_data.experience}
                customColors={resume.parsed_data.customColors || {}}
              />
            </div>
          </div>
          
          {/* Content Ad - Between resume sections */}
          <AdSense 
            adSlot="3456789012" 
            adFormat="horizontal"
            className="my-6"
          />
          
        </div>
        
        {/* Footer Ad */}
        <AdSense 
          adSlot="4567890123" 
          adFormat="horizontal"
          className="mx-auto my-8"
        />
        
      </main>
    </div>
  );
}
