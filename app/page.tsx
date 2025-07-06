'use client';

import { FileText, Palette } from 'lucide-react';
import Link from 'next/link';
import { AdBanner } from '@/src/components/adsense/AdBanner';
import { SiteHeader } from '@/src/components/site-header/site-header';
import { Button } from '@/src/components/ui/ui-button/button';

export default function Home() {
  return (
    <div className="pageWrapper">
      <SiteHeader onLogoClick={() => window.location.reload()} />
      <div
        className="container"
        style={{ maxWidth: '728px', margin: '0 auto', padding: '20px' }}
      >
        <AdBanner width="100%" height="90px" />
      </div>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Create Your Professional Resume
              </h1>
              <p className="text-xl text-gray-600">
                Choose how you want to create your resume
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* File Upload Option */}
              <Link href="/upload-file" className="block">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                    Upload from File
                  </h2>
                  
                  <p className="text-gray-600 mb-6 text-center">
                    Upload your existing resume in PDF or text format. Our AI will parse and structure it for you.
                  </p>
                  
                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    <li>✓ Supports PDF and TXT files</li>
                    <li>✓ AI-powered parsing</li>
                    <li>✓ Instant results</li>
                    <li>✓ No sign-in required</li>
                  </ul>
                  
                  <Button variant="primary" className="w-full">
                    Upload Resume File
                  </Button>
                </div>
              </Link>

              {/* Figma Upload Option */}
              <Link href="/upload-figma" className="block">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow cursor-pointer h-full relative">
                  <div className="absolute top-4 right-4">
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                  
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <Palette className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                    Import from Figma
                  </h2>
                  
                  <p className="text-gray-600 mb-6 text-center">
                    Convert your Figma resume design into a functional resume with AI extraction.
                  </p>
                  
                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    <li>✓ Direct Figma integration</li>
                    <li>✓ Preserve design colors</li>
                    <li>✓ AI text extraction</li>
                    <li>✓ Component mapping</li>
                  </ul>
                  
                  <Button variant="secondary" className="w-full" disabled>
                    Learn More
                  </Button>
                </div>
              </Link>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600">
                Free to use • No sign-in required • AI-powered
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
