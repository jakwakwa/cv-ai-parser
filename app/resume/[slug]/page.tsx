'use client';

import { ArrowLeft, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ResumeEditor from '@/components/ResumeEditor';
import { Button } from '@/components/ui/button';
import type { Resume } from '@/lib/supabase'; // Import the Resume type

export default function ViewResumePage() {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;

  const [resume, setResume] = useState<Resume | null>(null); // Change to 'resume' and Resume type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      alert('Resume saved successfully!');
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to save edits.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Simply navigate back or to library
    router.push('/library');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <p className="ml-3 text-gray-700">Loading resume...</p>
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

  return (
    <ResumeEditor
      resumeData={resume.parsed_data} // Pass parsed_data to ResumeEditor
      onSave={handleSaveEdits}
      onCancel={handleCancelEdit}
    />
  );
}
