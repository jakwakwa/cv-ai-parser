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
      // Dynamically import html2canvas and jsPDF only when needed
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import(/* webpackChunkName: "html2canvas" */ 'html2canvas'),
        import(/* webpackChunkName: "jspdf" */ 'jspdf'),
      ]);

      if (typeof jsPDF === 'undefined' || typeof html2canvas === 'undefined') {
        toast({
          title: 'Error',
          description:
            "PDF generation library not loaded. Please try again or use your browser's print to PDF function (Ctrl+P/Cmd+P).",
          variant: 'destructive',
        });
        return;
      }

      // Simple implementation without html2pdf wrapper
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Calculate dimensions to fit A4
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
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
