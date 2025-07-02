'use client';

import { AlertTriangle, CheckCircle, ImageIcon, Palette } from 'lucide-react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useRef, useState } from 'react';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import { useAuth } from '@/src/components/auth-provider/AuthProvider';
import { resumeColors } from '@/src/utils/colors';
import ColorPicker from '../color-picker/ColorPicker';
import ProfileImageUploader from '../profile-image-uploader/ProfileImageUploader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
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
  resumeId?: string; // Optional for non-auth users
  resumeSlug?: string; // Optional for non-auth users
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
  isAuthenticated?: boolean;
}

const ResumeUploader = ({
  onResumeUploaded,
  isLoading,
  setIsLoading,
  isAuthenticated = false,
}: ResumeUploaderProps) => {
  const { supabase } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState('');
  const [showProfileUploader, setShowProfileUploader] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColors, setCustomColors] =
    useState<Record<string, string>>(resumeColors);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');

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

    // Validate file type (always allow both for all users now)
    const allowedTypes = ['text/plain', 'application/pdf'];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "For now, please upload a plain text (.txt) file or a PDF (.pdf). We're working on improving Word document parsing, which will be available soon! In the meantime, you can easily convert your Word document to a .txt file."
      );
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

  const handleCreateResume = async () => {
    if (!uploadedFile) {
      setError('Please upload a resume file first.');
      return;
    }

    setError('');
    setModalErrorMessage('');
    setShowErrorModal(false);
    setIsLoading(true);

    try {
      // Only check authentication for authenticated users
      if (isAuthenticated) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error('No active session found. Please sign in again.');
        }
      }

      // Create FormData to send file directly
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('customColors', JSON.stringify(customColors));
      formData.append('isAuthenticated', isAuthenticated.toString());

      // Send file directly to server for parsing
      const response = await fetch(
        `${window.location.origin}/api/parse-resume`,
        {
          method: 'POST',
          body: formData, // Send FormData instead of JSON
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

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
        throw new Error(result.error || 'Parsing failed.');
      }

      const parsedData: ParsedResume = result.data;

      // Combine server-provided metadata with client-side file info
      const uploadInfo: ParseInfo = {
        ...result.meta,
        fileType: uploadedFile.type,
        fileSize: uploadedFile.size,
      };

      // Pass the parsed data and the full info object to the parent
      const parsedResume: ParsedResume = {
        name: parsedData.name || '',
        title: parsedData.title || '',
        summary: parsedData.summary || '',
        profileImage: profileImage,
        contact: parsedData.contact || {},
        experience: parsedData.experience || [],
        education: parsedData.education || [],
        certifications: parsedData.certifications || [],
        skills: parsedData.skills || [],
        customColors: customColors,
      };

      // Set parsing method and confidence based on success
      const method =
        parsedResume.experience && parsedResume.experience.length > 0
          ? 'AI Parser'
          : 'Regex Fallback';
      const confidence = 0.8; // Assuming a default confidence, or get from result.meta if available

      // Update uploadInfo with additional information
      const uploadInfoWithMethodAndConfidence: ParseInfo = {
        ...uploadInfo,
        method: method,
        confidence: confidence,
      };

      // Pass the parsed data and the full info object to the parent
      onResumeUploaded(parsedResume, uploadInfoWithMethodAndConfidence);

      setShowProfileUploader(true); // Move to next step
      setError('');
    } catch (err: unknown) {
      // Provide more helpful error messages
      let errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';

      if (errorMessage.includes('PDF')) {
        errorMessage +=
          '\n\nTips for PDF files:\n• Make sure the PDF contains selectable text (not just images)\n• Try saving the PDF from a different source\n• Consider converting to a Word document or text file for best results.';
      }

      if (errorMessage.includes('quota')) {
        errorMessage =
          'You exceeded your Google Gemini quota. Please check your Google AI Studio billing details or try again later.';
      } else if (
        errorMessage.includes('Request too large') ||
        errorMessage.includes('INVALID_ARGUMENT')
      ) {
        errorMessage =
          'The resume is too large for the AI model. Please try a shorter resume or use a plain text file if available.';
      } else if (errorMessage.includes('PDF parsing failed')) {
        errorMessage =
          'Failed to parse the PDF document. This might be due to a very poor quality scan, an unsupported PDF format, or an issue with the AI model. Please ensure the PDF contains selectable text or try a plain text file.';
      } else if (errorMessage.includes('Could not extract meaningful text')) {
        errorMessage =
          'Could not extract meaningful text from the file. The file might be corrupted, password-protected, or contain only images. Please ensure the document contains clear, selectable text.';
      } else if (errorMessage.includes('No active session found')) {
        errorMessage =
          'Your session has expired. Please sign in again to save your resume.';
      }

      setModalErrorMessage(errorMessage);
      setShowErrorModal(true);
      setError('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageChange = (imageUrl: string) => {
    setProfileImage(imageUrl);
  };

  const handleColorsChange = (colors: Record<string, string>) => {
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
      <div className={styles.fullScreenLoading}>
        <div className={styles.loadingCard}>
          <div className={styles.textCenter}>
            <div className={styles.spinningLoader} />
            <p className={styles.grayText900}>
              Creating your resume...
            </p>
            <p className={styles.grayText600Small}>
              Extracting text and analyzing content with Google Gemini...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.fullWidthRounded}>
      <div className={styles.uploaderContainer}>
        <div className={styles.marginTop8}>
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
                accept=".txt, .pdf" // Always accept both
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
                Supports text files and PDFs (max 10MB)
              </p>

              <div className={styles.fileContainer}>
                <button
                  type="button"
                  className={styles.uploadButton}
                  onClick={onButtonClick}
                >
                  Choose File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/resume-upload-text.txt';
                    link.download = 'resume-upload-text.txt';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className={styles.downloadLink}
                >
                  📄 Download Starter Resume Text File (optional)
                </button>
                <Dialog>
                  <DialogTrigger asChild>
                    <p
                      className={styles.fileTypes}
                      style={{
                        fontSize: '0.8rem',
                        marginTop: '0.5rem',
                        opacity: 0.7,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      Click for detailed instructions on converting Word to .txt
                    </p>
                  </DialogTrigger>
                  <DialogContent className={styles.dialogMaxWidth}>
                    <DialogTitle>
                      To export a Word document as a plain text file (.txt):
                    </DialogTitle>
                    <DialogDescription>
                      Follow these steps to convert your Word file to plain
                      text. 1. Open the document in Word.
                      <br />
                      2. Go to "File" then "Save As".
                      <br />
                      3. Choose "Plain Text (.txt)" as the file type.
                      <br />
                      4. Select a location, and click "Save".
                      <br />
                      5. If prompted with a "File Conversion" dialog, ensure
                      "Windows (Default)" is selected and click "OK".
                      <br />
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ) : (
            <div className={styles.paddingTop8Md}>
              <div className={styles.fileUploadedCard}>
                <div className={styles.fileInfoRow}>
                  <div className={styles.fileInfoLeft}>
                    <CheckCircle className={styles.greenCheckIcon} />
                    <div className={styles.fileIconAndInfo}>
                      <p className={styles.fileName}>
                        {uploadedFile.name}
                      </p>
                      <p className={styles.fileDetails}>
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB •{' '}
                        {uploadedFile.type}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Optional Profile Image */}
        {uploadedFile && (
          <div className={styles.marginTop8}>
            <h2 className={styles.sectionHeader}>
              <ImageIcon className={styles.sectionIcon} />
              Profile Picture (Optional)
            </h2>

            <div className={styles.sectionCard}>
              <div className={styles.sectionCardContent}>
                <p className={styles.sectionDescription}>
                  Add a professional profile picture to your resume
                </p>
                <button
                  type="button"
                  onClick={() => setShowProfileUploader(!showProfileUploader)}
                  className={styles.sectionButton}
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
                <div className={styles.fileInfoLeft}>
                  {/** biome-ignore lint/performance/noImgElement: <> */}
                  <img
                    src={profileImage || '/placeholder.svg'}
                    alt="Profile preview"
                    className={styles.profilePreview}
                  />
                  <div>
                    <p className={styles.fileName}>
                      Profile picture added
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowProfileUploader(true)}
                      className={styles.sectionButton}
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
          <div className={styles.marginTop8}>
            <h2 className={styles.sectionHeader}>
              <Palette className={styles.sectionIcon} />
              Customize Colors (Optional)
            </h2>

            <div className={styles.colorCustomizationCard}>
              <div className={styles.colorCardContent}>
                <p className={styles.sectionDescription}>
                  Personalize your resume with custom colors and themes
                </p>
              </div>
              <div className={styles.colorPreviewContainer}>
                {showColorPicker && (
                  <ColorPicker
                    currentColors={customColors}
                    onColorsChange={handleColorsChange}
                  />
                )}

                {!showColorPicker && (
                  <div className={styles.colorPreviewDots}>
                    <div className={styles.colorDots}>
                      <div
                        className={styles.colorDot}
                        style={{
                          backgroundColor:
                            customColors['--resume-sidebar-background'],
                        }}
                      />
                      <div
                        className={styles.colorDot}
                        style={{
                          backgroundColor: customColors['--resume-main-icons'],
                        }}
                      />
                      <div
                        className={styles.colorDot}
                        style={{
                          backgroundColor: customColors['--resume-job-title'],
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className={styles.colorCustomizeButton}
              >
                {showColorPicker ? 'Hide' : 'Customize Colors'}
              </button>
            </div>
          </div>
        )}

        {/* Create Resume Button */}
        {uploadedFile && (
          <>
            <div className={styles.createResumeSection}>
              <button
                type="button"
                onClick={handleCreateResume}
                disabled={isLoading}
                className={styles.createResumeButton}
              >
                {isLoading
                  ? 'Creating Resume...'
                  : isAuthenticated
                    ? 'Create Resume'
                    : 'Create Resume'}
              </button>
              {!isAuthenticated && (
                <p className={styles.signInPrompt}>
                  💡 Sign in to save your resume to your library and edit it
                  later
                </p>
              )}
            </div>
            <div className={styles.bottomPadding} />
          </>
        )}

        {error && (
          <div className={styles.error}>
            <AlertTriangle className={styles.sectionIcon} />
            <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
          </div>
        )}

        {/* Error Modal */}
        <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
          <DialogContent className={styles.dialogMaxWidth}>
            <DialogTitle>
              <div className={styles.errorModalTitle}>
                <AlertTriangle className={styles.errorModalIcon} />
                Parsing Error
              </div>
            </DialogTitle>
            <DialogDescription className="whitespace-pre-line">
              {modalErrorMessage}
            </DialogDescription>
            <div className={styles.errorModalActions}>
              <button
                type="button"
                className={styles.errorModalButton}
                onClick={() => setShowErrorModal(false)}
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ResumeUploader;
