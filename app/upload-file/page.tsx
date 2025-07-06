'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import { useAuth } from '@/src/components/auth-provider/auth-provider';
import { Button } from '@/src/components/ui/ui-button/button';
import ResumeUploader from '@/src/containers/resume-uploader/resume-uploader';
import { useToast } from '@/hooks/use-toast';

interface ParseInfo {
  resumeId?: string;
  resumeSlug?: string;
  method: string;
  confidence: number;
  filename: string;
  fileType: string;
  fileSize: number;
}

export default function UploadFilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleResumeUploaded = async (
    parsedData: ParsedResume,
    info: ParseInfo
  ) => {
    // For authenticated users with a slug, redirect to the resume page
    if (user && info.resumeSlug) {
      router.push(`/resume/${info.resumeSlug}?toast=resume_uploaded`);
    } else {
      // For non-auth users, show success and redirect to home
      toast({
        title: 'Resume Uploaded Successfully',
        description: 'Your resume has been parsed and is ready to view.',
      });
      
      // Store the parsed data in sessionStorage for non-auth users
      if (!user) {
        sessionStorage.setItem('parsedResume', JSON.stringify(parsedData));
        sessionStorage.setItem('parseInfo', JSON.stringify(info));
      }
      
      // Redirect to home where they can view/edit the resume
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Resume from File
          </h1>
          <p className="text-gray-600 mb-8">
            Upload your existing resume in PDF or text format and we'll parse it using AI
          </p>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <ResumeUploader 
              onResumeUploaded={handleResumeUploaded}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              isAuthenticated={!!user}
            />
          </div>
        </div>
      </main>
    </div>
  );
}