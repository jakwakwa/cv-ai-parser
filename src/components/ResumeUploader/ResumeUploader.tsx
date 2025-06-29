'use client';

import {
  AlertTriangle,
  Bot,
  CheckCircle,
  FileText,
  ImageIcon,
  Palette,
  Upload,
} from 'lucide-react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import { Progress } from '@/components/ui/progress';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import ColorPicker from '../../../components/ColorPicker';
import ProfileImageUploader from '../../../components/ProfileImageUploader';
import styles from './ResumeUploader.module.css';

declare global {
  interface Window {
    pdfjsLib: {
      getDocument: (args: {
        data: ArrayBuffer;
        verbosity?: number;
        disableAutoFetch?: boolean;
        disableStream?: boolean;
      }) => { promise: Promise<PDFDocumentProxy> };
      GlobalWorkerOptions: {
        workerSrc: string;
      };
    };
  }
}

interface ParseInfo {
  method: string;
  confidence: number;
  filename: string;
  fileType: string;
  fileSize: number;
}

interface ResumeUploaderProps {
  onResumeUploaded: (data: ParsedResume, info: ParseInfo) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const ResumeUploader = ({
  onResumeUploaded,
  isLoading,
  setIsLoading,
}: ResumeUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState('');
  const [showProfileUploader, setShowProfileUploader] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColors, setCustomColors] = useState<Record<string, string>>({
    '--mint-light': '#d8b08c',
    '--teal-dark': '#1f3736',
    '--charcoal': '#565854',
    '--mint-background': '#c4f0dc',
    '--bronze-dark': '#a67244',
    '--peach': '#f9b87f',
    '--coffee': '#3e2f22',
    '--teal-main': '#116964',
    '--light-grey-background': '#f5f5f5',
    '--off-white': '#faf4ec',
    '--light-brown-border': '#a49990c7',
    '--light-grey-border': '#cecac6',
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setError('');

    console.log(
      `File selected: ${file.name}, type: ${file.type}, size: ${file.size} bytes`
    );

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, Word document, or text file.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    // Check for empty files
    if (file.size < 100) {
      setError('File appears to be empty or too small.');
      return;
    }

    setUploadedFile(file);
  };

  // Enhanced client-side PDF text extraction with better CDN handling and OCR fallback
  const extractTextFromPDF = async (file: File) => {
    console.log('Starting PDF text extraction...');
    let pdfjsLib: typeof window.pdfjsLib | null = null;
    let fullText = '';

    try {
      // Try to load PDF.js from multiple sources
      try {
        // Use dynamic import with ssr: false
        const pdfjs = await import('pdfjs-dist');
        pdfjsLib = pdfjs as unknown as typeof window.pdfjsLib; // Type assertion
      } catch (e) {
        console.warn(
          'Failed to load pdfjs-dist directly, attempting CDN fallback.',
          e
        );
        // Fallback to CDN if dynamic import fails
        await loadPDFJSFromCDN();
        pdfjsLib = window.pdfjsLib;
      }

      if (!pdfjsLib) {
        throw new Error('PDF.js library could not be loaded.');
      }

      // Set worker source - try multiple CDN options
      if (pdfjsLib.GlobalWorkerOptions) {
        const workerSources = [
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
          'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
          'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
        ];

        for (const workerSrc of workerSources) {
          try {
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
            break;
          } catch (workerError) {
            console.warn(
              `Failed to set worker source ${workerSrc}:`,
              workerError
            );
          }
        }
      }

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        verbosity: 0, // Reduce console noise
        disableAutoFetch: true,
        disableStream: true,
      });

      const pdf = await loadingTask.promise;
      console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);

      // Extract text from each page
      for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 10); pageNum++) {
        // Limit to 10 pages for performance
        console.log(`Extracting text from page ${pageNum}`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Combine all text items from the page with proper spacing
        const pageText = textContent.items
          .map((item) => {
            // Add space after each text item to prevent words from running together
            // Check if item is a TextItem before accessing its properties
            if ('str' in item && 'hasEOL' in item) {
              return `${item.str}${item.hasEOL ? '\\n' : ' '}`;
            }
            return '';
          })
          .join('');

        fullText += `${pageText}\\n\\n`;
      }

      const cleanText = fullText.trim();
      console.log(`Extracted ${cleanText.length} characters from PDF`);

      if (cleanText.length > 100) {
        return cleanText;
      }
      console.warn(
        'PDF.js extracted very little text, attempting OCR fallback.'
      );
    } catch (pdfError: unknown) {
      console.warn(
        'PDF.js extraction failed or resulted in little text:',
        pdfError
      );
      // Fall through to OCR if PDF.js fails or extracts insufficient text
    }

    // OCR Fallback with Tesseract.js for scanned/image-based PDFs
    try {
      if (!pdfjsLib) {
        throw new Error(
          'PDF.js library was not loaded, cannot perform OCR fallback.'
        );
      }

      setIsLoading(true); // Indicate OCR loading
      setError(
        'No selectable text found. Attempting OCR (Optical Character Recognition) which may take a moment...'
      );
      console.log('Attempting OCR with Tesseract.js...');

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pagesToProcess = Math.min(pdf.numPages, 3); // Limit OCR to first 3 pages for speed

      let ocrText = '';
      for (let i = 1; i <= pagesToProcess; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Increased scale for better OCR accuracy
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not get 2D context for canvas.');
        }
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport })
          .promise;
        const imageData = canvas.toDataURL('image/png');

        console.log(`Running OCR on page ${i}/${pagesToProcess}...`);
        const {
          data: { text },
        } = await Tesseract.recognize(imageData, 'eng', {
          logger: (m: { status: string; progress: number }) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100)); // Update OCR progress
              setError(`OCR in progress: ${Math.round(m.progress * 100)}%`);
            }
          },
        });
        ocrText += `${text}\\n\\n`;
      }

      const cleanOcrText = ocrText.trim();
      console.log(`OCR extracted ${cleanOcrText.length} characters.`);

      if (cleanOcrText.length < 100) {
        throw new Error(
          'OCR could not extract meaningful text from the PDF. It might be a very poor quality scan.'
        );
      }
      return cleanOcrText;
    } catch (ocrError: unknown) {
      console.error(
        'Tesseract.js OCR failed:',
        ocrError instanceof Error ? ocrError.message : ocrError
      );
      throw new Error(
        `Could not extract text from PDF even with OCR. This might be due to a very poor quality scan or an unsupported PDF format. Details: ${
          ocrError instanceof Error ? ocrError.message : String(ocrError)
        }`
      );
    } finally {
      setIsLoading(false); // Reset loading after OCR attempt
      setError(''); // Clear error
    }
  };

  // Function to load PDF.js from CDN as fallback
  const loadPDFJSFromCDN = () => {
    return new Promise((resolve, reject) => {
      if (window.pdfjsLib) {
        resolve(window.pdfjsLib);
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        if (window.pdfjsLib) {
          resolve(window.pdfjsLib);
        } else {
          reject(new Error('PDF.js failed to load from CDN'));
        }
      };
      script.onerror = () =>
        reject(new Error('Failed to load PDF.js from CDN'));
      document.head.appendChild(script);
    });
  };

  // Client-side text extraction for different file types
  const extractTextFromFile = async (file: File) => {
    console.log(`Extracting text from file: ${file.name} (${file.type})`);

    if (file.type === 'application/pdf') {
      return await extractTextFromPDF(file);
    }
    if (file.type === 'text/plain') {
      console.log('Reading text file...');
      const text = await file.text();
      if (text.length < 50) {
        throw new Error('Text file appears to be empty or too short');
      }
      return text;
    }
    if (
      file.type === 'application/msword' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      console.log('Attempting to read Word document...');
      try {
        // Try to read as text (this works for some Word docs)
        const text = await file.text();
        if (text.length > 50) {
          return text;
        }
        throw new Error('Could not extract readable text from Word document');
      } catch (_wordError: unknown) {
        throw new Error(
          'Word document parsing not fully supported. Please save as PDF or text file for best results.'
        );
      }
    } else {
      throw new Error(
        `Unsupported file type: ${file.type}. Please use PDF, Word document, or text file.`
      );
    }
  };

  const handleCreateResume = async () => {
    if (!uploadedFile) {
      setError('Please upload a resume file first.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Extract text from the uploaded file
      console.log('Starting text extraction...');
      const extractedText = await extractTextFromFile(uploadedFile);
      console.log(`Successfully extracted ${extractedText.length} characters`);
      console.log(`Text preview: ${extractedText.substring(0, 300)}...`);

      if (!extractedText || extractedText.trim().length < 50) {
        throw new Error(
          'Could not extract meaningful text from the file. The file might be corrupted, password-protected, or contain only images.'
        );
      }

      // Basic validation - check if it looks like resume content
      const lowerText = extractedText.toLowerCase();
      const hasResumeKeywords =
        lowerText.includes('experience') ||
        lowerText.includes('education') ||
        lowerText.includes('skills') ||
        lowerText.includes('work') ||
        lowerText.includes('job') ||
        lowerText.includes('university') ||
        lowerText.includes('college');

      if (!hasResumeKeywords) {
        console.warn("Text doesn't appear to contain typical resume content");
        // Don't fail here, just warn - let the parsing attempt continue
      }

      // Send extracted text to server for parsing
      console.log('Sending text to server for parsing...');
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: extractedText,
          filename: uploadedFile.name,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response Error:', errorText);

        let errorData: { error?: string }; // Explicitly type errorData
        try {
          errorData = JSON.parse(errorText);
        } catch {
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        if (errorData.error) {
          if (
            errorData.error.includes('quota') ||
            errorData.error.includes('QUOTA_EXCEEDED')
          ) {
            throw new Error(
              'AI parsing failed: You exceeded your Google Gemini quota. Please check your Google AI Studio billing details.'
            );
          }
          if (
            errorData.error.includes('Request too large') ||
            errorData.error.includes('INVALID_ARGUMENT')
          ) {
            throw new Error(
              'AI parsing failed: The resume is too large for the AI model. Please try a shorter resume or use the text analysis fallback.'
            );
          }
          throw new Error(errorData.error || 'Failed to parse resume');
        }
        throw new Error('Server error while parsing resume');
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      // Check if we have valid data
      if (!result.data) {
        throw new Error('No resume data returned from parser');
      }

      console.log(
        `Parsing completed using ${result.method} with ${result.confidence}% confidence`
      );

      // Add profile image and custom colors to parsed data
      const finalResumeData = {
        ...result.data,
        profileImage: profileImage || '', // Empty string means no profile image
        customColors: customColors, // Add custom colors to the resume data
      };

      const parseInfo = {
        method: result.method,
        confidence: result.confidence,
        filename: uploadedFile.name,
        fileType: uploadedFile.type,
        fileSize: uploadedFile.size,
      };

      // Reset states
      setUploadedFile(null);
      setProfileImage('');
      setShowProfileUploader(false);
      setShowColorPicker(false);
      setError('');
      setIsLoading(false);

      // Call the parent callback
      onResumeUploaded(finalResumeData, parseInfo);
    } catch (err: unknown) {
      console.error(
        'Error processing resume:',
        err instanceof Error ? err.message : err
      );

      // Provide more helpful error messages
      let errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';

      if (errorMessage.includes('PDF')) {
        errorMessage +=
          '\n\nTips for PDF files:\n• Make sure the PDF contains selectable text (not just images)\n• Try saving the PDF from a different source\n• Consider converting to a Word document or text file for best results.';
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleProfileImageChange = (imageUrl: string) => {
    console.log('Profile image changed:', imageUrl);
    setProfileImage(imageUrl);
  };

  const handleColorsChange = (colors: Record<string, string>) => {
    console.log('Colors changed:', colors);
    setCustomColors(colors);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4" />
            <p className="text-gray-900 font-medium mb-2">
              Creating your resume...
            </p>
            <p className="text-gray-600 text-sm">
              Extracting text and analyzing content with Google Gemini...
            </p>
            {ocrProgress > 0 && ocrProgress < 100 && (
              <div className="w-full mt-4">
                <p className="text-gray-600 text-sm mb-2">
                  OCR Progress: {ocrProgress}%
                </p>
                <Progress
                  value={ocrProgress}
                  className="w-full h-2 bg-gray-200 rounded-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-4xl bg-[#fff]/50 rounded">
      <div className={styles.uploaderContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Resume Parser</h1>
          <p className={styles.subtitle}>
            Upload your existing resume and we'll create a beautiful online
            version
          </p>
        </div>

        {/* Step 1: Upload Resume File */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Step 1: Upload Your Resume
          </h2>

          {!uploadedFile ? (
            // biome-ignore lint/a11y/noStaticElementInteractions: <>
            <div
              className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className={styles.fileInput}
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleChange}
              />

              <div className={styles.uploadIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-label="Upload icon"
                  role="img"
                >
                  <title>Upload icon</title>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17,8 12,3 7,8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>

              <p className={styles.dropText}>
                <strong>Click to upload</strong> or drag and drop your resume
              </p>
              <p className={styles.fileTypes}>
                Supports PDF, Word documents, and text files (max 10MB)
              </p>
              <p
                className={styles.fileTypes}
                style={{
                  fontSize: '0.8rem',
                  marginTop: '0.5rem',
                  opacity: 0.7,
                }}
              >
                For best results with PDFs, ensure they contain selectable text
                (not scanned images)
              </p>

              <button
                type="button"
                className={styles.uploadButton}
                onClick={onButtonClick}
              >
                Choose File
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB •{' '}
                      {uploadedFile.type}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Optional Profile Image */}
        {uploadedFile && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Step 2: Add Profile Picture (Optional)
            </h2>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">
                  Add a professional profile picture to your resume
                </p>
                <button
                  type="button"
                  onClick={() => setShowProfileUploader(!showProfileUploader)}
                  className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                >
                  {showProfileUploader ? 'Hide' : 'Add Photo'}
                </button>
              </div>

              {showProfileUploader && (
                <ProfileImageUploader
                  currentImage={profileImage}
                  onImageChange={handleProfileImageChange}
                  showPrompt={false}
                />
              )}

              {profileImage && !showProfileUploader && (
                <div className="flex items-center">
                  {/** biome-ignore lint/performance/noImgElement: <> */}
                  <img
                    src={profileImage || '/placeholder.svg'}
                    alt="Profile preview"
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Profile picture added
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowProfileUploader(true)}
                      className="text-sm text-teal-600 hover:text-teal-700"
                    >
                      Change photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Optional Color Customization */}
        {uploadedFile && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Step 3: Customize Colors (Optional)
            </h2>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">
                  Personalize your resume with custom colors and themes
                </p>
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                >
                  {showColorPicker ? 'Hide' : 'Customize Colors'}
                </button>
              </div>

              {showColorPicker && (
                <ColorPicker
                  currentColors={customColors}
                  onColorsChange={handleColorsChange}
                />
              )}

              {!showColorPicker && (
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: customColors['--teal-main'] }}
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: customColors['--bronze-dark'] }}
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: customColors['--charcoal'] }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Color scheme selected
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(true)}
                      className="text-sm text-teal-600 hover:text-teal-700"
                    >
                      Change colors
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Resume Button */}
        {uploadedFile && (
          <div className="mb-8">
            <button
              type="button"
              onClick={handleCreateResume}
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200"
            >
              {isLoading ? 'Creating Resume...' : 'Create Resume'}
            </button>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
          </div>
        )}
      </div>
      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>
            <Bot size={28} />
          </div>
          <h3>Smart Parsing</h3>
          <p>
            Google Gemini AI-powered parsing when available, with intelligent
            fallback text analysis
          </p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>
            <FileText size={28} />
          </div>
          <h3>Beautiful Design</h3>
          <p>Your resume gets transformed into a modern, professional layout</p>
        </div>
        {/* <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <Smartphone size={28} />
            </div>
            <h3>Responsive</h3>
            <p>Looks great on all devices and can be downloaded as PDF</p>
          </div> */}
      </div>
    </div>
  );
};

export default ResumeUploader;
