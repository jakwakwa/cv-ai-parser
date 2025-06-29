import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { type RefObject, useState } from 'react';
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

  const downloadPdf = async (
    elementRef: RefObject<HTMLElement>,
    filename = 'resume.pdf'
  ) => {
    const element = elementRef.current;
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
      if (typeof jsPDF === 'undefined' || typeof html2canvas === 'undefined') {
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
