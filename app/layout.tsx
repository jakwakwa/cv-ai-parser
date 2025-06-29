import type { Metadata } from 'next';
import type React from 'react';
import '../styles/globals.css';
import '../src/index.css';
import { ToastProvider } from '@/hooks/use-toast';
import { AuthProvider } from '@/src/components/auth-provider/AuthProvider';
import { Toaster } from '@/src/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Resume Parser & Generator',
  description: 'Upload your resume and generate a beautiful online version',
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
