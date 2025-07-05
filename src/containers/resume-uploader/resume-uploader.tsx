import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { AlertTriangle, CheckCircle, ImageIcon, Palette } from 'lucide-react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import React from 'react';
import { IS_JOB_TAILORING_ENABLED } from '@/lib/config';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import { useAuth } from '@/src/components/auth-provider/auth-provider';
import ColorPicker from '@/src/components/color-picker/color-picker';
import { Card } from '@/src/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/ui-button/button';
import ProfileImageUploader from '@/src/containers/profile-image-uploader/profile-image-uploader';
import { resumeColors } from '@/src/utils/colors';
import styles from './resume-uploader.module.css';

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

  // New state for JobFit Tailor fields
  const [isJobTailoringToggled, setIsJobTailoringToggled] =
    React.useState(false);
  const [jobSpecMethod, setJobSpecMethod] = React.useState<'paste' | 'upload'>(
    'paste'
  );
  const [jobSpecText, setJobSpecText] = React.useState('');
  const [jobSpecFile, setJobSpecFile] = React.useState<File | null>(null);
  const [tone, setTone] = React.useState<'Formal' | 'Neutral' | 'Creative'>(
    'Neutral'
  );
  const [extraPrompt, setExtraPrompt] = React.useState('');

  // Using the imported flag from lib/config.ts
  const isJobTailoringEnabled = IS_JOB_TAILORING_ENABLED;

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

  const handleJobSpecFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setJobSpecFile(e.target.files[0]);
    }
  };

  const handleJobSpecMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setJobSpecMethod(e.target.value as 'paste' | 'upload');
    // Clear previously selected job spec data when method changes
    setJobSpecText('');
    setJobSpecFile(null);
  };

  const handleToneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTone(e.target.value as 'Formal' | 'Neutral' | 'Creative');
  };

  const handleExtraPromptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setExtraPrompt(e.target.value);
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

    // Validation for JobFit Tailor fields when toggle is enabled
    if (isJobTailoringEnabled && isJobTailoringToggled) {
      if (jobSpecMethod === 'paste' && !jobSpecText.trim()) {
        setError(
          'Please provide a job description when job tailoring is enabled.'
        );
        return;
      }
      if (jobSpecMethod === 'paste' && jobSpecText.length > 4000) {
        setError(
          `Job description is too long (${jobSpecText.length}/4000 characters). Please shorten it.`
        );
        return;
      }
      if (jobSpecMethod === 'upload' && !jobSpecFile) {
        setError(
          'Please upload a job specification file when job tailoring is enabled.'
        );
        return;
      }
      if (extraPrompt && extraPrompt.length > 500) {
        setError(
          `Extra instructions are too long (${extraPrompt.length}/500 characters). Please shorten them.`
        );
        return;
      }
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

      // Append JobFit Tailor fields if enabled and toggled
      if (isJobTailoringEnabled && isJobTailoringToggled) {
        // Always send tone when job tailoring is enabled
        formData.append('tone', tone);
        if (extraPrompt) formData.append('extraPrompt', extraPrompt);
        
        if (jobSpecMethod === 'paste' && jobSpecText) {
          formData.append('jobSpecText', jobSpecText);
        } else if (jobSpecMethod === 'upload' && jobSpecFile) {
          formData.append('jobSpecFile', jobSpecFile);
        }
      }

      // Send file directly to server for parsing
      const response = await fetch(
        `${window.location.origin}/api/${isJobTailoringEnabled && isJobTailoringToggled ? 'parse-resume-enhanced' : 'parse-resume'}`,
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

  // Validation function to check if form can be submitted
  const isFormValid = () => {
    if (!uploadedFile) return false;
    
    if (isJobTailoringEnabled && isJobTailoringToggled) {
      // Check job spec is provided
      if (jobSpecMethod === 'paste' && !jobSpecText.trim()) return false;
      if (jobSpecMethod === 'upload' && !jobSpecFile) return false;
      
      // Check character limits
      if (jobSpecMethod === 'paste' && jobSpecText.length > 4000) return false;
      if (extraPrompt && extraPrompt.length > 500) return false;
    }
    
    return true;
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.uploaderContainer}>
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent>
          <DialogTitle className={styles.errorTitle}>
            <AlertTriangle size={24} /> Parsing Error
          </DialogTitle>
          <DialogDescription className={styles.errorDescription}>
            {modalErrorMessage}
          </DialogDescription>
          <Button onClick={() => setShowErrorModal(false)}>Close</Button>
        </DialogContent>
      </Dialog>

      <div
        className={styles.dropZone}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <button
          type="button"
          onClick={onButtonClick}
          className={styles.dropZoneButton}
        >
          <VisuallyHidden>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              className={styles.fileInput}
              accept=".pdf,.txt"
            />
          </VisuallyHidden>
          <div className={styles.uploadIcon}>
            <ImageIcon size={48} />
          </div>
          <p className={styles.dropText}>
            {uploadedFile ? (
              <>
                File selected: <strong>{uploadedFile.name}</strong>
                <br />
                <span className={styles.fileTypes}>
                  (Click to change or drag another file here)
                </span>
              </>
            ) : (
              'Drag & drop your resume here, or click to upload'
            )}
          </p>
          <span className={styles.fileTypes}>
            Supports .txt and .pdf files (Max 10MB)
          </span>
        </button>
        {error && (
          <p className={styles.error}>
            <AlertTriangle size={16} /> {error}
          </p>
        )}
        {/* Remove file button if file is selected */}
        {uploadedFile && (
          <Button
            size="sm"
            variant="destructive"
            onClick={handleRemoveFile}
            className={styles.removeFileButton}
          >
            x
          </Button>
        )}
      </div>

      {/* JobFit Tailor Toggle */}
      {isJobTailoringEnabled && (
        <div className={styles.jobTailoringToggle}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={isJobTailoringToggled}
              onChange={(e) => {
                setIsJobTailoringToggled(e.target.checked);
                // Reset job tailor fields when toggling off
                if (!e.target.checked) {
                  setJobSpecText('');
                  setJobSpecFile(null);
                  setTone('Neutral');
                  setExtraPrompt('');
                }
              }}
              className={styles.toggleCheckbox}
            />
            <span className={styles.toggleSlider} />
            <span className={styles.toggleText}>
              Tailor resume to job specification
            </span>
          </label>
          <p className={styles.toggleDescription}>
            Upload a job description to automatically optimize your resume for
            that specific role
          </p>
        </div>
      )}

      {/* JobFit Tailor Fields - Only show when toggled */}
      {isJobTailoringEnabled && isJobTailoringToggled && (
        // TODO: uploaderStepSections --> groupedInputContainer
        <div className={styles.uploaderStepSections}>
          <div
            className={styles.groupedInputs}
            style={{ width: '100%', marginTop: '0rem' }}
          >
            <h4 className={styles.extraPromptLabel}>Job Specification *</h4>

            <p>Provide a job description to tailor your resume automatically</p>
            <div className={styles.userSubmitResumeBtn}>
              <div className={styles.inputMethod}>
                <label>
                  <input
                    type="radio"
                    name="jobSpecMethod"
                    value="paste"
                    checked={jobSpecMethod === 'paste'}
                    onChange={handleJobSpecMethodChange}
                  />
                  Paste job description
                </label>
                <label>
                  <input
                    type="radio"
                    name="jobSpecMethod"
                    value="upload"
                    checked={jobSpecMethod === 'upload'}
                    onChange={handleJobSpecMethodChange}
                  />
                  Upload job description file
                </label>
              </div>

              {jobSpecMethod === 'paste' && (
                <div>
                  <textarea
                    className={styles.jobSpecTextarea}
                    placeholder="Paste job description here (max 4000 chars)..."
                    maxLength={4000}
                    value={jobSpecText}
                    onChange={(e) => setJobSpecText(e.target.value)}
                    required
                  />
                  <div className={styles.characterCount}>
                    <span className={
                      jobSpecText.length > 4000 
                        ? styles.characterCountError
                        : jobSpecText.length > 3600 
                        ? styles.characterCountWarning
                        : ''
                    }>
                      {jobSpecText.length}/4000 characters
                    </span>
                  </div>
                </div>
              )}

              {jobSpecMethod === 'upload' && (
                <input
                  type="file"
                  accept=".pdf,.txt"
                  className={styles.jobSpecFileInput}
                  onChange={handleJobSpecFileChange}
                  required
                />
              )}
            </div>
          </div>
          {/* TONE CHOICE */}
          <div className={styles.groupedInputs}>
            <h4 className={styles.toneSelector}>Resume Tone *</h4>
            <div className={styles.toneOptions}>
              <label className={styles.toneOption}>
                <input
                  type="radio"
                  name="tone"
                  value="Formal"
                  checked={tone === 'Formal'}
                  onChange={handleToneChange}
                />
                <span>Formal</span>
                <small>Conservative, traditional language</small>
              </label>
              <label className={styles.toneOption}>
                <input
                  type="radio"
                  name="tone"
                  value="Neutral"
                  checked={tone === 'Neutral'}
                  onChange={handleToneChange}
                />
                <span>Neutral</span>
                <small>Balanced, professional tone</small>
              </label>
              <label className={styles.toneOption}>
                <input
                  type="radio"
                  name="tone"
                  value="Creative"
                  checked={tone === 'Creative'}
                  onChange={handleToneChange}
                />
                <span>Creative</span>
                <small>Dynamic, engaging language</small>
              </label>
            </div>
          </div>
          <div className={styles.groupedInputs}>
            <h4 className={styles.extraPromptLabel}>
              Additional Instructions (Optional)
            </h4>
            <div>
              <textarea
                className={styles.extraPromptTextarea}
                placeholder="Add any extra instructions for the AI (e.g., 'Focus on leadership skills', 'Exclude projects before 2020'). Max 500 characters."
                maxLength={500}
                value={extraPrompt}
                onChange={handleExtraPromptChange}
              />
              <div className={styles.characterCount}>
                <span className={
                  extraPrompt.length > 500 
                    ? styles.characterCountError
                    : extraPrompt.length > 450 
                    ? styles.characterCountWarning
                    : ''
                }>
                  {extraPrompt.length}/500 characters
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.uploaderStepSections}>
        <Dialog open={showColorDialog} onOpenChange={setShowColorDialog}>
          <DialogTrigger asChild>
            <Button variant="default" className={styles.colorButton}>
              <Palette size={20} className={styles.buttonIcon} /> Choose Colors
            </Button>
          </DialogTrigger>
          <DialogContent>
            <VisuallyHidden>
              <DialogTitle>Choose Colors</DialogTitle>
            </VisuallyHidden>
            <ColorPicker
              currentColors={customColors}
              onColorsChange={handleColorsChange}
            />
          </DialogContent>
        </Dialog>

        {showProfileUploader && (
          <Dialog
            open={showProfileUploader}
            onOpenChange={setShowProfileUploader}
          >
            <DialogContent>
              <DialogTitle className={styles.dialogTitle}>
                <CheckCircle size={24} /> Resume Parsed Successfully!
              </DialogTitle>
              <DialogDescription className={styles.dialogDescription}>
                Your resume has been successfully parsed. Now, optionally upload
                a profile image or proceed to view your resume.
              </DialogDescription>
              <ProfileImageUploader onImageChange={handleProfileImageChange} />
              <Button
                onClick={() => setShowProfileUploader(false)}
                className={styles.viewResumeButton}
              >
                View My Resume
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className={styles.userSubmitResumeBtn}>
        <Button
          onClick={handleCreateResume}
          disabled={isLoading || !isFormValid()}
          className={styles.uploadButton}
        >
          {isLoading
            ? 'Processing...'
            : isJobTailoringEnabled && isJobTailoringToggled
              ? 'Create Tailored Resume'
              : 'Create My Resume'}
        </Button>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>
            <ImageIcon size={32} />
          </div>
          <h3>Visual Design</h3>
          <p>
            Choose from professional templates and customize colors to match
            your personal brand.
          </p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>
            <ImageIcon size={32} />
          </div>
          <h3>AI Optimization</h3>
          <p>
            Our AI analyzes your content for clarity, impact, and keyword
            optimization to improve your chances.
          </p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>
            <ImageIcon size={32} />
          </div>
          <h3>Instant Downloads</h3>
          <p>
            Download your tailored resume in various formats, ready to impress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploader;
