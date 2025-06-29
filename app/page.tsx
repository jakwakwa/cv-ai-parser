'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthComponent from '@/components/AuthComponent';
import { useAuth } from '@/components/AuthProvider';
import ResumeEditor from '@/components/ResumeEditor';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import CertificationsSection from '@/src/components/CertificationsSection/CertificationsSection';
import ContactSection from '@/src/components/ContactSection/ContactSection';
import DownloadButton from '@/src/components/DownloadButton/DownloadButton';
import EducationSection from '@/src/components/EducationSection/EducationSection';
import ExperienceSection from '@/src/components/ExperienceSection/ExperienceSection';
import ProfileHeader from '@/src/components/ProfileHeader/ProfileHeader';
import ResumeUploader from '@/src/components/ResumeUploader/ResumeUploader';
import SkillsSection from '@/src/components/SkillsSection/SkillsSection';

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

  const [currentView, setCurrentView] = useState('upload'); // "upload" | "view" | "edit"
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [parseInfo, setParseInfo] = useState<ParseInfo | null>(null); // Stores ID and Slug from server
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    // TODO: Implement PDF download logic (e.g., using a serverless function to generate PDF from rendered HTML)
    alert('PDF download not yet implemented.');
  };

  const handleResumeUploaded = async (
    parsedData: ParsedResume,
    info: ParseInfo
  ) => {
    console.log('Resume Uploaded and Saved:', parsedData, info);
    setResumeData(parsedData);
    setParseInfo(info); // Store the full info including resumeId and resumeSlug
    setIsLoading(false); // Stop main loading

    if (info.resumeSlug) {
      // Redirect to the new resume view page
      router.push(`/resume/${info.resumeSlug}`);
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
        alert('Resume saved successfully!');

        // Redirect back to the view page after saving edits
        if (parseInfo.resumeSlug) {
          router.push(`/resume/${parseInfo.resumeSlug}`);
        } else {
          setCurrentView('view'); // Fallback if slug is somehow missing
        }
      } else {
        // This case should ideally not happen if initial parse always saves.
        // If a user edits a resume without it being saved (e.g. via direct upload not through parse flow),
        // this logic would need to save it for the first time.
        console.warn(
          'Attempted to save edits on an unsaved resume. This flow needs review.'
        );
        setResumeData(updatedData);
        alert('Edits applied locally. Resume was not saved to database.');
        setCurrentView('view');
      }
    } catch (err: unknown) {
      console.error('Error saving edits:', err);

      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
        <p className="ml-3 text-gray-700">Loading user session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <header className="w-full max-w-4xl mx-auto flex justify-between items-center py-4 px-6 md:px-0 bg-white rounded-b-lg shadow-sm border-b border-l border-r border-gray-200 z-10">
        <h1 className="text-xl font-bold text-gray-800">CV AI Parser</h1>
        <div className="flex space-x-4 items-center">
          <AuthComponent />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-6 w-full max-w-4xl">
        {!user && (
          <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mb-8 mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome!</h2>
            <p className="text-gray-600 mb-6">
              Please sign in or sign up to use the resume parser and manage your
              library.
            </p>
            <AuthComponent />
          </div>
        )}

        {user && (
          <div className="w-full max-w-4xl flex justify-center space-x-4 mb-8 mt-6">
            <button
              type="button"
              onClick={() => router.push('/')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${currentView === 'upload' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Upload New Resume
            </button>
            <button
              type="button"
              onClick={() => router.push('/library')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${currentView === 'library' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              My Resume Library
            </button>
          </div>
        )}

        {user && currentView === 'upload' && (
          <ResumeUploader
            onResumeUploaded={handleResumeUploaded}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}

        {/* The 'view' and 'edit' states will typically be handled by the /resume/[slug] page */}
        {/* However, if a user uploads and we don't redirect immediately (e.g., if there's no slug or for local testing), we can still show it here */}
        {user && currentView === 'view' && resumeData && (
          <div className="w-full">
            {error && <div className="text-red-600 mb-4">Error: {error}</div>}
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
            <div className="flex justify-center space-x-4 mt-6 p-4">
              <button
                type="button"
                onClick={handleEditResume}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
              >
                Edit Resume
              </button>
              <DownloadButton onClick={handleDownloadPdf} />
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition-colors"
              >
                Upload New
              </button>
            </div>
          </div>
        )}

        {user && currentView === 'edit' && resumeData && (
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
