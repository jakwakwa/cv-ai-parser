'use client';

import { Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { usePdfDownloader } from '@/hooks/use-pdf-downloader';
import { useToast } from '@/hooks/use-toast';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import { useAuth } from '@/src/components/auth-provider/auth-provider';
import FigmaLinkUploader from '@/src/components/FigmaLinkUploader/FigmaLinkUploader';
import FigmaPreview from '@/src/components/figma-preview/FigmaPreview';
import ResumeDisplayButtons from '@/src/components/resume-display-buttons/resume-display-buttons';
import TabNavigation from '@/src/components/tab-navigation/TabNavigation';
import { Button } from '@/src/components/ui/ui-button/button';
import ResumeDisplay from '@/src/containers/resume-display/resume-display';
import ResumeEditor from '@/src/containers/resume-editor/resume-editor';
import ResumeUploader from '@/src/containers/resume-uploader/resume-uploader';
import { migrateOldResumeColorsToNew } from '@/src/utils/colors';

interface ParseInfo {
  resumeId?: string; // Optional for non-auth users
  resumeSlug?: string; // Optional for non-auth users
  method: string;
  confidence: number;
  filename: string;
}

export default function PageContent() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const uploaderRef = useRef<HTMLDivElement>(null);
  const { isDownloading, downloadPdf } = usePdfDownloader();
  const { toast } = useToast();

  const [currentView, setCurrentView] = useState('upload'); // "upload" | "view" | "edit"
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [parseInfo, setParseInfo] = useState<ParseInfo | null>(null); // Stores ID and Slug from server
  const [isLoading, setIsLoading] = useState(false); // global operations (saving edits, etc.)
  const [fileLoading, setFileLoading] = useState(false); // ResumeUploader specific
  const [figmaLoading, setFigmaLoading] = useState(false); // FigmaLinkUploader specific
  const [error, setError] = useState<string | null>(null);
  const [localCustomColors, setLocalCustomColors] = useState<
    Record<string, string>
  >({});
  const [figmaInfo, setFigmaInfo] = useState<{
    componentName: string;
    jsxCode: string;
    cssCode: string;
  } | null>(null);

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
          const parsed = JSON.parse(storedColors);
          setLocalCustomColors(migrateOldResumeColorsToNew(parsed));
        }
      } catch (e) {
        console.error('Failed to load custom colors from local storage', e);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user && Object.keys(localCustomColors).length > 0) {
      try {
        // Always save only the new variable names
        localStorage.setItem(
          'customResumeColors',
          JSON.stringify(migrateOldResumeColorsToNew(localCustomColors))
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

  const handleFigmaGenerated = (info: {
    componentName: string;
    jsxCode: string;
    cssCode: string;
  }) => {
    setFigmaInfo(info);
    toast({
      title: 'Design Generated',
      description: `Component ${info.componentName} was created in src/generated-resumes/`,
    });
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

  // Reset scroll position when loading state becomes active
  useEffect(() => {
    if (isLoading) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isLoading]);

  if (authLoading) {
    return (
      <div className="loadingContainer">
        <div className="loadingSpinner" />
        <p className="loadingText">Loading user session...</p>
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

  if (isLoading) {
    return (
      <div className="loadingContainer">
        <div className="loadingSpinner" />
        <p className="loadingText">Creating Resume...</p>
      </div>
    );
  }

  return (
    <main className="mainUserContainer">
      {/* Show tab navigation only for authenticated users */}
      {user && <TabNavigation initialView="upload" />}

      {/* Show uploader for both auth and non-auth users */}
      {currentView === 'upload' && (
        <>
          {!user && (
            <div className="hero">
              <div className="header">
                <h1 className="title">AI Resume Generator</h1>
                <div className="headerIcon">
                  <Bot size={28} />
                </div>
                <p className="text-xs">AI powered by Google Gemini</p>
                <p className="text-xl mt-4 max-w-md">
                  Upload your existing resume and we'll create a beautiful
                  online version within seconds!
                </p>
                <Button
                  className="mt-8"
                  type="button"
                  onClick={handleScrollToUploader}
                >
                  Try it out!
                </Button>
                <div className="flex flex-row gap-2 justify-start mt-2">
                  <span className="text-xs">Free to use</span>
                  <span className="text-xs">-</span>
                  <span className="text-xs">No sign in required</span>
                </div>
              </div>
              <div className="userFeatures">
                <div className="feature">
                  <div className="featureIcon">
                    <Bot size={28} />
                  </div>
                  <h3>Smart Ai Parsing</h3>
                  <p>
                    AI-powered parsing when available, with intelligent fallback
                    text analysis.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div ref={uploaderRef} style={{ width: '100%' }}>
            <ResumeUploader
              onResumeUploaded={handleResumeUploaded}
              isLoading={fileLoading}
              setIsLoading={setFileLoading}
              isAuthenticated={isAuthenticatedState}
            />

            {/* Optional Figma design uploader */}
            <FigmaLinkUploader
              onResumeGenerated={handleFigmaGenerated}
              isLoading={figmaLoading}
              setIsLoading={setFigmaLoading}
            />

            {/* Show Figma preview if component was generated */}
            {figmaInfo && (
              <FigmaPreview
                componentName={figmaInfo.componentName}
                jsxCode={figmaInfo.jsxCode}
                cssCode={figmaInfo.cssCode}
              />
            )}
          </div>
        </>
      )}

      {/* Show resume view for both auth and non-auth users */}
      {currentView === 'view' && resumeData && (
        <div className="resumeContainer">
          {error && <div className="errorMessage">Error: {error}</div>}
          <ResumeDisplayButtons
            onDownloadPdf={handleDownloadPdf}
            onEditResume={handleEditResume}
            onUploadNew={handleReset}
          />
          <ResumeDisplay
            resumeData={{
              ...resumeData,
              customColors: user ? resumeData.customColors : localCustomColors, // Prioritize resumeData's colors if user is authenticated, else use localCustomColors
            }}
            isAuth={!!user}
          />
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
  );
}
