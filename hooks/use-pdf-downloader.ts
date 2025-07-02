import { useState } from 'react';
import { useToast } from './use-toast';

interface Html2PdfOptions {
  margin: number;
  filename: string;
  image: { type: string; quality: number };
  html2canvas: { scale: number; useCORS: boolean };
  jsPDF: { unit: string; format: string; orientation: string };
  pagebreak: { mode: string };
}

// Define the html2pdf function on the window object
declare global {
  interface Window {
    html2pdf: () => {
      from: (element: HTMLElement) => {
        set: (options: Html2PdfOptions) => {
          save: () => Promise<void>;
        };
      };
    };
  }
}

export const usePdfDownloader = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const ensureHtml2PdfLoaded = async () => {
    if (typeof window === 'undefined') return;

    // If the global helper already exists, nothing to do.
    if (typeof window.html2pdf !== 'undefined') return;

    // Dynamically import the lightweight ES module version on demand.
    // This falls back gracefully if the CDN script failed for some reason.
    try {
      await import('html2pdf.js');
    } catch (err) {
      console.error('Failed to dynamically import html2pdf:', err);
    }
  };

  const downloadPdf = async (
    element: HTMLElement | null,
    filename = 'resume.pdf'
  ) => {
    if (!element) {
      toast({
        title: 'Error',
        description: 'Content to download not found.',
        variant: 'destructive',
      });
      return;
    }

    setIsDownloading(true);

    try {
      await ensureHtml2PdfLoaded();

      if (typeof window.html2pdf === 'undefined') {
        toast({
          title: 'Error',
          description:
            "PDF generation library not loaded. Please try again or use your browser's print to PDF function (Ctrl+P/Cmd+P).",
          variant: 'destructive',
        });
        return;
      }

      const options = {
        margin: 5,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: 'css' },
      };
      await window.html2pdf().from(element).set(options).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. See console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, downloadPdf };
};
