'use client';
import { Bot, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { usePdfDownloader } from '@/hooks/use-pdf-downloader';
import { useToast } from '@/hooks/use-toast';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import AdSense from '@/src/components/adsense/AdSense';
import { useAuth } from '@/src/components/auth-provider/AuthProvider';
import DownloadButton from '@/src/components/DownloadButton/DownloadButton';
import ResumeUploader from '@/src/components/ResumeUploader/ResumeUploader';
import ResumeDisplay from '@/src/components/resume-display/ResumeDisplay';
import ResumeEditor from '@/src/components/resume-editor/ResumeEditor';
import { SiteHeader } from '@/src/components/site-header/SiteHeader';
import TabNavigation from '@/src/components/tab-navigation/TabNavigation';
import { Button } from '@/src/components/ui/button';
import styles from './page.module.css';

interface ParseInfo {
  resumeId?: string; // Optional for non-auth users
  resumeSlug?: string; // Optional for non-auth users
  method: string;
  confidence: number;
  filename: string;
}

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const _resumeContainerRef = useRef<HTMLDivElement>(null);
  const uploaderRef = useRef<HTMLDivElement>(null);
  const { isDownloading, downloadPdf } = usePdfDownloader();
  const { toast } = useToast();

  const [currentView, setCurrentView] = useState('upload'); // "upload" | "view" | "edit"
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [parseInfo, setParseInfo] = useState<ParseInfo | null>(null); // Stores ID and Slug from server
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localCustomColors, setLocalCustomColors] = useState<
    Record<string, string>
  >({});
  // New state to explicitly manage isAuthenticated status for prop passing
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);

  useEffect(() => {
    // Update isAuthenticatedState whenever user or authLoading changes
    setIsAuthenticatedState(!!user && !authLoading);
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) {
      try {
        const storedColors = localStorage.getItem('customResumeColors');
        if (storedColors) {
          setLocalCustomColors(JSON.parse(storedColors));
        }
      } catch (e) {
        console.error('Failed to load custom colors from local storage', e);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user && Object.keys(localCustomColors).length > 0) {
      try {
        localStorage.setItem(
          'customResumeColors',
          JSON.stringify(localCustomColors)
        );
      } catch (e) {
        console.error('Failed to save custom colors to local storage', e);
      }
    }
  }, [localCustomColors, user]);

  const handleDownloadPdf = async () => {
    if (resumeData) {
      downloadPdf(
        document.getElementById('resume-content') as HTMLElement,
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

    // For authenticated users with a slug, redirect to the resume page
    if (user && info.resumeSlug) {
      router.push(`/resume/${info.resumeSlug}?toast=resume_uploaded`);
    } else {
      // For non-auth users or fallback, stay on current page and show the resume
      setCurrentView('view');
      // For non-authenticated users, save custom colors to local state/storage
      if (!user && parsedData.customColors) {
        setLocalCustomColors(parsedData.customColors);
      }
    }
  };

  const handleReset = () => {
    setResumeData(null);
    setParseInfo(null);
    setCurrentView('upload');
    setError(null);
  };

  const handleEditResume = () => {
    // Only allow editing for authenticated users
    if (!user) {
      toast({
        title: 'Sign in Required',
        description:
          'Please sign in to edit your resume and save it to your library.',
        variant: 'destructive',
      });
      return;
    }
    setCurrentView('edit');
  };

  const handleSaveEdits = async (updatedData: ParsedResume) => {
    setIsLoading(true);
    setError(null);

    try {
      // Only authenticated users can save edits to DB
      if (!user) {
        setResumeData(updatedData);
        if (updatedData.customColors) {
          setLocalCustomColors(updatedData.customColors);
        }
        toast({
          title: 'Info',
          description:
            'Edits applied locally. Sign in to save to your library.',
        });
        setCurrentView('view');
        return; // Exit here if not authenticated
      }

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

  const handleScrollToUploader = () => {
    uploaderRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
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
      <SiteHeader onLogoClick={handleReset} />

      {/* Header Ad */}
      <AdSense
        adSlot="1234567890"
        adFormat="horizontal"
        className="mx-auto my-4"
      />

      <main className={styles.mainUserContainer}>
        {/* Show tab navigation only for authenticated users */}
        {user && <TabNavigation initialView="upload" />}

        {/* Show uploader for both auth and non-auth users */}
        {currentView === 'upload' && (
          <>
            <div className={styles.header}>
              <h1 className={styles.title}>AI Resume Generator</h1>
              <div className={styles.featureIcon}>
                <Bot size={28} />
              </div>
              <p className="text-xs">AI powered by Google Gemini</p>

              <Button
                className="mt-8"
                type="button"
                onClick={handleScrollToUploader}
              >
                Free to try!
              </Button>
              <p className="text-sm my-2">
                Upload your existing resume and we'll create a beautiful online
                version ( no sign-up required )
              </p>
            </div>
            <div className={styles.userFeatures}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <Bot size={28} />
                </div>
                <h3>Smart Parsing</h3>
                <p>
                  Google Gemini AI-powered parsing when available, with
                  intelligent fallback text analysis
                </p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <FileText size={28} />
                </div>
                <h3>Beautiful Design</h3>
                <p>
                  Your resume gets transformed into a modern, professional
                  layout
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
            <div ref={uploaderRef} style={{ width: '100%' }}>
              <ResumeUploader
                onResumeUploaded={handleResumeUploaded}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                isAuthenticated={isAuthenticatedState}
              />
            </div>
          </>
        )}

        {/* Show resume view for both auth and non-auth users */}
        {currentView === 'view' && resumeData && (
          <div className={styles.resumeContainer}>
            {error && <div className={styles.errorMessage}>Error: {error}</div>}
            <ResumeDisplay
              resumeData={{
                ...resumeData,
                customColors: user
                  ? resumeData.customColors
                  : localCustomColors, // Prioritize resumeData's colors if user is authenticated, else use localCustomColors
              }}
              isAuth={!!user}
            />
            <div className={styles.buttonContainer}>
              {/* Show edit button only for authenticated users */}
              {user && (
                <button
                  type="button"
                  onClick={handleEditResume}
                  className={styles.editButton}
                >
                  Edit Resume
                </button>
              )}
              <DownloadButton onClick={handleDownloadPdf} />
              <button
                type="button"
                onClick={handleReset}
                className={styles.resetButton}
              >
                Upload New
              </button>
              {/* Show sign-in prompt for non-auth users */}
              {!user && (
                <button
                  type="button"
                  onClick={() => {
                    toast({
                      title: 'Sign in Required',
                      description:
                        'Please sign in using the button in the header to save your resume to your library.',
                      variant: 'default',
                    });
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Sign In to Save
                </button>
              )}
            </div>
          </div>
        )}

        {/* Show edit view only for authenticated users */}
        {user && currentView === 'edit' && resumeData && (
          <ResumeEditor
            resumeData={resumeData}
            onSave={handleSaveEdits}
            onCancel={handleCancelEdit}
            onCustomColorsChange={!user ? setLocalCustomColors : undefined}
          />
        )}
      </main>
    </div>
  );
}
