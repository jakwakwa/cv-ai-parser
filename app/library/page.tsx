'use client';

import { useRouter } from 'next/navigation';
import ResumeLibrary from '@/components/ResumeLibrary';
import type { Resume } from '@/lib/supabase';

export default function LibraryPage() {
  const router = useRouter();

  const handleSelectResume = (resume: Resume) => {
    // Navigate to the resume view page using the slug
    if (resume?.slug) {
      router.push(`/resume/${resume.slug}`);
    } else {
      console.error('Resume data missing slug for navigation.', resume);
      // Optionally, show an error message to the user
      alert('Could not view resume: Missing necessary information.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Your Resume Library
      </h1>
      <ResumeLibrary onSelectResume={handleSelectResume} />
    </div>
  );
}
