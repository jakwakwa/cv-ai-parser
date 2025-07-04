'use client';

import { AlertTriangle, CheckCircle, ImageIcon, Palette } from 'lucide-react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import React, { useRef, useState } from 'react';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import { useAuth } from '@/src/components/auth-provider/AuthProvider';
import { resumeColors } from '@/src/utils/colors';
import ColorPickerDialog from '../color-picker/ColorPickerDialog';
import ProfileImageUploader from '../profile-image-uploader/ProfileImageUploader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
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
  const [dragActive, setDragActive] = React.useState(false);
  const [error, setError] = React.useState('');
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [profileImage, setProfileImage] = React.useState('');
  const [showProfileUploader, setShowProfileUploader] = React.useState(false);
  const [showColorDialog, setShowColorDialog] = React.useState(false);
  const [customColors, setCustomColors] =
    React.useState<Record<string, string>>(resumeColors);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [modalErrorMessage, setModalErrorMessage] = React.useState('');

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
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingBox}>
          <div className={styles.loadingContent}>
            <div className={styles.loadingSpinner} />
            <p className={styles.loadingTitle}>
              Creating your resume...
            </p>
            <p className={styles.loadingDescription}>
              Extracting text and analyzing content with Google Gemini...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.uploaderContainer}>
        <div className={styles.contentSection}>
          {!uploadedFile ? (
            // biome-ignore lint/a11y/noStaticElementInteractions
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

              <div className={styles.buttonContainer}>
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
                  <DialogContent className={styles.maxWidthDialog}>
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
            <div className={styles.fileUploadedContainer}>
              <div className={styles.fileUploadedBox}>
                <div className={styles.fileInfo}>
                  <div className={styles.fileDetails}>
                    <CheckCircle className={styles.checkIcon} />
                    <div className={styles.fileNameContainer}>
                      <p className={styles.fileName}>
                        {uploadedFile.name}
                      </p>
                      <p className={styles.fileSize}>
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
          <div className={styles.contentSection}>
            <h2 className={styles.sectionHeader}>
              <ImageIcon className={styles.sectionIcon} />
              Profile Picture (Optional)
            </h2>

            <div className={styles.profileImageBox}>
              <div className={styles.profileImageContent}>
                <p className={styles.profileImageText}>
                  Add a professional profile picture to your resume
                </p>
                <button
                  type="button"
                  onClick={() => setShowProfileUploader(!showProfileUploader)}
                  className={styles.profileImageButton}
                >
                  {showProfileUploader ? 'Hide' : 'Add Photo'}
                </button>
              </div>

              {/* Profile image uploader modal */}
              <Dialog
                open={showProfileUploader}
                onOpenChange={setShowProfileUploader}
              >
                <DialogContent className={styles.transparentDialog}>
                  {/* Accessible title for screen readers */}
                  <VisuallyHidden>
                    <DialogTitle>Profile Image Uploader</DialogTitle>
                  </VisuallyHidden>
                  <ProfileImageUploader
                    currentImage={profileImage}
                    onImageChange={handleProfileImageChange}
                    showPrompt={false}
                  />
                  {/* Hide button to close the dialog */}
                  <button
                    type="button"
                    onClick={() => setShowProfileUploader(false)}
                    className={styles.hideButton}
                  >
                    Hide
                  </button>
                </DialogContent>
              </Dialog>

              {profileImage && !showProfileUploader && (
                <div className={styles.profilePreview}>
                  {/** biome-ignore lint/performance/noImgElement */}
                  <img
                    src={profileImage || '/placeholder.svg'}
                    alt="Profile preview"
                    className={styles.profileImage}
                  />
                  <div className={styles.profileImageInfo}>
                    <p className={styles.profileImageLabel}>
                      Profile picture added
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowProfileUploader(true)}
                      className={styles.changePhotoButton}
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
          <div className={styles.contentSection}>
            <h2 className={styles.sectionHeader}>
              <Palette className={styles.sectionIcon} />
              Customize Colors (Optional)
            </h2>

            <div className={styles.colorBox}>
              <div className={styles.colorContent}>
                <p className={styles.colorText}>
                  Personalize your resume with custom colors and themes
                </p>
              </div>
              <div className={styles.colorPreviewContainer}>
                <div className={styles.colorPreview}>
                  <div className={styles.colorSwatches}>
                    <div
                      className={styles.colorSwatch}
                      style={{
                        backgroundColor:
                          customColors['--resume-sidebar-background'],
                      }}
                    />
                    <div
                      className={styles.colorSwatch}
                      style={{
                        backgroundColor: customColors['--resume-main-icons'],
                      }}
                    />
                    <div
                      className={styles.colorSwatch}
                      style={{
                        backgroundColor: customColors['--resume-job-title'],
                      }}
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowColorDialog(true)}
                className={styles.colorButton}
              >
                Choose Custom Theme
              </button>
            </div>

            <ColorPickerDialog
              open={showColorDialog}
              onOpenChange={setShowColorDialog}
              currentColors={customColors}
              onColorsChange={handleColorsChange}
            />
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
                <p className={styles.signInHint}>
                  💡 Sign in to save your resume to your library and edit it
                  later
                </p>
              )}
            </div>
            <div className={styles.bottomSpacing} />
          </>
        )}

        {error && (
          <div className={styles.error}>
            <AlertTriangle className={styles.errorIcon} />
            <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
          </div>
        )}

        {/* Error Modal */}
        <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
          <DialogContent className={styles.maxWidthDialog}>
            <DialogTitle>
              <div className={styles.modalErrorHeader}>
                <AlertTriangle className={styles.modalErrorIcon} />
                Parsing Error
              </div>
            </DialogTitle>
            <DialogDescription className={styles.modalErrorText}>
              {modalErrorMessage}
            </DialogDescription>
            <div className={styles.modalButtonContainer}>
              <button
                type="button"
                className={styles.modalCloseButton}
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
