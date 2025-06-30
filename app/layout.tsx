import type { Metadata } from 'next';
import type React from 'react';
import '../styles/globals.css';
import '../src/index.css';
import { ToastProvider } from '@/hooks/use-toast';
import { AuthProvider } from '@/src/components/auth-provider/AuthProvider';
import { Toaster } from '@/src/components/ui/toaster';

export const metadata: Metadata = {
  title:
    'AI Resume Parser & Online CV Generator - Convert to PDF with Custom Colors',
  description:
    'Effortlessly convert your text resumes into stunning online CVs using AI-powered parsing. Customize with beautiful colors, download as PDF, and manage your professional presence.',
  keywords: [
    'AI resume parser',
    'online resume generator',
    'CV builder',
    'PDF resume',
    'customizable resume',
    'AI resume converter',
    'professional CV',
    'resume template',
    'job application tool',
    'text to resume',
  ],
  openGraph: {
    title:
      'AI Resume Parser & Online CV Generator - Convert to PDF with Custom Colors',
    description:
      'Effortlessly convert your text resumes into stunning online CVs using AI-powered parsing. Customize with beautiful colors, download as PDF, and manage your professional presence.',
    url: 'https://www.airesumegen.com',
    siteName: 'Resume Parser & Generator',
    images: [
      {
        url: 'https://www.airesumegen.com/placeholder-logo.svg',
        width: 1200,
        height: 630,
        alt: 'AI Resume Parser and Online CV Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'AI Resume Parser & Online CV Generator - Convert to PDF with Custom Colors',
    description:
      'Effortlessly convert your text resumes into stunning online CVs using AI-powered parsing. Customize with beautiful colors, download as PDF, and manage your professional presence.',
    creator: '@your_twitter_handle', // Replace with your actual Twitter handle
    images: ['https://www.airesumegen.com/placeholder-logo.svg'], // Replace with a relevant image
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7169177467099391"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
