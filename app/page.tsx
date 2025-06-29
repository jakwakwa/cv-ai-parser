'use client';
import { Bot, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import AuthComponent from '@/components/AuthComponent';
import { useAuth } from '@/components/AuthProvider';
import ResumeEditor from '@/components/ResumeEditor';
import { SiteHeader } from '@/components/SiteHeader';
import TabNavigation from '@/components/TabNavigation';
import { usePdfDownloader } from '@/hooks/use-pdf-downloader';
import { useToast } from '@/hooks/use-toast';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import CertificationsSection from '@/src/components/CertificationsSection/CertificationsSection';
import ContactSection from '@/src/components/ContactSection/ContactSection';
import DownloadButton from '@/src/components/DownloadButton/DownloadButton';
import EducationSection from '@/src/components/EducationSection/EducationSection';
import ExperienceSection from '@/src/components/ExperienceSection/ExperienceSection';
import ProfileHeader from '@/src/components/ProfileHeader/ProfileHeader';
import ResumeUploader from '@/src/components/ResumeUploader/ResumeUploader';
import SkillsSection from '@/src/components/SkillsSection/SkillsSection';
import styles from './page.module.css';

interface ParseInfo {
  resumeId: string;
  resumeSlug: string;
  method: string;
  confidence: number;
  filename: string;
}

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const resumeContainerRef = useRef<HTMLDivElement>(null);
  const { isDownloading, downloadPdf } = usePdfDownloader();
  const { toast } = useToast();

  const [currentView, setCurrentView] = useState('upload'); // "upload" | "view" | "edit"
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [parseInfo, setParseInfo] = useState<ParseInfo | null>(null); // Stores ID and Slug from server
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    if (resumeData) {
      downloadPdf(
        resumeContainerRef as React.RefObject<HTMLElement>,
        `${resumeData.name?.replace(/ /g, '_') || 'resume'}.pdf`
      );
    }
  };

  const handleResumeUploaded = async (
    parsedData: ParsedResume,
    info: ParseInfo
  ) => {
    setResumeData(parsedData);
    setParseInfo(info); // Store the full info including resumeId and resumeSlug
    setIsLoading(false); // Stop main loading

    if (info.resumeSlug) {
      // Redirect to the new resume view page with a success message
      router.push(`/resume/${info.resumeSlug}?toast=resume_uploaded`);
    } else {
      // Fallback if slug is not returned for some reason
      setCurrentView('view'); // Stay on current page, show the new resume
    }
  };

  const handleReset = () => {
    setResumeData(null);
    setParseInfo(null);
    setCurrentView('upload');
    setError(null);
  };

  const handleEditResume = () => {
    setCurrentView('edit');
  };

  const handleSaveEdits = async (updatedData: ParsedResume) => {
    setIsLoading(true);
    setError(null);

    try {
      // If resume was pulled from library or just uploaded and has an ID/slug
      if (parseInfo?.resumeId) {
        // Call your API to update the resume in the database
        const response = await fetch(`/api/resumes/${parseInfo.resumeId}`, {
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
        setResumeData(result.data); // Update local state with saved data (full resume object)

        // Redirect back to the view page after saving edits
        if (parseInfo.resumeSlug) {
          router.push(`/resume/${parseInfo.resumeSlug}?toast=resume_saved`);
        } else {
          setCurrentView('view'); // Fallback if slug is somehow missing
        }
      } else {
        console.warn(
          'Attempted to save edits on an unsaved resume. This flow needs review.'
        );
        setResumeData(updatedData);
        toast({
          title: 'Info',
          description:
            'Edits applied locally. Resume was not saved to database.',
        });
        setCurrentView('view');
      }
    } catch (err: unknown) {
      console.error('Error saving edits:', err);

      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setCurrentView('view');
    setError(null);
  };

  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading user session...</p>
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

  return (
    <div className={styles.pageWrapper}>
      <SiteHeader />

      <main className={!user ? styles.mainContainer : styles.mainUserContainer}>
        {!user && (
          <>
            <div className={styles.authContainer}>
              <h2 className={styles.authTitle}>Magic AI Resume Converter</h2>
              <p className={styles.authDescription}>
                Please sign in or sign up to use the resume parser and manage
                your library.
              </p>
              <AuthComponent />
            </div>{' '}
          </>
        )}

        {user && <TabNavigation initialView="upload" />}

        {user && currentView === 'upload' && (
          <ResumeUploader
            onResumeUploaded={handleResumeUploaded}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}

        <div className={!user ? styles.features : styles.userFeatures}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <Bot size={28} />
            </div>
            <h3>Smart Parsing</h3>
            <p>
              Google Gemini AI-powered parsing when available, with intelligent
              fallback text analysis
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FileText size={28} />
            </div>
            <h3>Beautiful Design</h3>
            <p>
              Your resume gets transformed into a modern, professional layout
            </p>
          </div>
          {/* <div className={styles.feature}>
               <div className={styles.featureIcon}>
                 <Smartphone size={28} />
               </div>
               <h3>Responsive</h3>
               <p>Looks great on all devices and can be downloaded as PDF</p>
             </div> */}
        </div>

        {/* The 'view' and 'edit' states will typically be handled by th  e /resume/[slug] page */}
        {/* However, if a user uploads and we don't redirect immediately (e.g., if there's no slug or for local testing), we can still show it here */}
        {user && currentView === 'view' && resumeData && (
          <div className={styles.resumeContainer} ref={resumeContainerRef}>
            {error && <div className={styles.errorMessage}>Error: {error}</div>}
            <ProfileHeader
              profileImage={resumeData.profileImage || ''}
              name={resumeData.name || ''}
              title={resumeData.title || ''}
              summary={resumeData.summary || ''}
              customColors={resumeData.customColors || {}} // Ensure customColors is an object
            />
            <ContactSection
              contact={resumeData.contact || {}}
              customColors={resumeData.customColors || {}}
            />
            <ExperienceSection
              experience={resumeData.experience}
              customColors={resumeData.customColors || {}}
            />
            <EducationSection
              education={resumeData.education}
              customColors={resumeData.customColors || {}}
            />
            <SkillsSection
              skills={resumeData.skills}
              customColors={resumeData.customColors || {}}
            />
            <CertificationsSection
              certifications={resumeData.certifications}
              customColors={resumeData.customColors || {}}
            />
            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={handleEditResume}
                className={styles.editButton}
              >
                Edit Resume
              </button>
              <DownloadButton onClick={handleDownloadPdf} />
              <button
                type="button"
                onClick={handleReset}
                className={styles.resetButton}
              >
                Upload New
              </button>
            </div>
          </div>
        )}

        {currentView === 'edit' && resumeData && (
          <ResumeEditor
            resumeData={resumeData}
            onSave={handleSaveEdits}
            onCancel={handleCancelEdit}
          />
        )}
      </main>
    </div>
  );
}
