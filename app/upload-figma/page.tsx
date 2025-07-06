'use client';

import { Palette, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/ui-button/button';

export default function UploadFigmaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                <Palette className="w-10 h-10 text-purple-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Create Resume from Figma Design
            </h1>
            
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              This feature is coming soon! You'll be able to import your resume design directly from Figma 
              and convert it into a functional resume with our AI-powered parser.
            </p>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">How it will work:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Share your Figma resume design link</li>
                  <li>• Our AI will extract text and structure</li>
                  <li>• Get an editable, downloadable resume</li>
                  <li>• Preserve your design's color scheme</li>
                </ul>
              </div>
              
              <Button variant="primary" className="w-full" disabled>
                Coming Soon
              </Button>
              
              <Link href="/upload-file">
                <Button variant="ghost" className="w-full">
                  Use File Upload Instead
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}