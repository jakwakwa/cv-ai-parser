import type { Metadata } from 'next';
import type React from 'react';
import '../styles/globals.css';
import '../src/index.css';
import { Analytics } from '@vercel/analytics/next';
import { ToastProvider } from '@/hooks/use-toast';
import { AdSenseUnit } from '@/src/components/adsense/AdSenseUnit';
import { AuthModalProvider } from '@/src/components/auth-component/AuthModalContext';
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
        url: 'https://www.airesumegen.com/logo.svg',
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
    images: ['https://www.airesumegen.com/logo.svg'], // Replace with a relevant image
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
        <meta name="google-adsense-account" content="ca-pub-7169177467099391" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7169177467099391"
          crossOrigin="anonymous"
        />
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
          <AuthProvider>
            <AuthModalProvider>{children}</AuthModalProvider>
          </AuthProvider>
          <Toaster />
        </ToastProvider>
        <Analytics />
        <AdSenseUnit slot="1977334562" />
        <footer className="py-8 w-full shrink-0 items-center px-4 md:px-6 text-white bg-[#1f2937]">
          <nav className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center text-center text-sm">
            <a
              className="hover:underline underline-offset-4"
              href="/privacy-policy"
            >
              Privacy Policy
            </a>
            <a
              className="hover:underline underline-offset-4"
              href="/terms-and-conditions"
            >
              Terms and Conditions
            </a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
