declare module 'pdfjs-dist' {
  // Re-export key types so they can be imported directly from 'pdfjs-dist'.
  import type { PDFDocumentProxy as _PDFDocumentProxy } from 'pdfjs-dist/types/src/pdf';

  export type PDFDocumentProxy = _PDFDocumentProxy;

  // Re-export the rest of the public types API for convenience.
  export * from 'pdfjs-dist/types/src/pdf';
}