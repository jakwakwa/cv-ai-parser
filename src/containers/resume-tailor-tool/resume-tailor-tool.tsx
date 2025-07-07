/** biome-ignore-all lint/a11y/noStaticElementInteractions: <fix later> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <fix later> */
'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import {
  AlertTriangle,
  FileText as BriefcaseIcon,
  CheckCircle,
  FileText,
  Upload as FileUpIcon,
  Palette,
  Upload,
  // @ts-ignore - it does have one
  Wand,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import ColorPicker from '@/src/components/color-picker/color-picker';
import ResumeDisplayButtons from '@/src/components/resume-display-buttons/resume-display-buttons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Textarea } from '@/src/components/ui/textarea';
import { Button } from '@/src/components/ui/ui-button/button';
import ProfileImageUploader from '@/src/containers/profile-image-uploader/profile-image-uploader';
import ResumeDisplay from '@/src/containers/resume-display/resume-display';
import styles from './resume-tailor-tool.module.css';

interface ParseInfo {
  resumeId?: string;
  resumeSlug?: string;
  method: string;
  confidence: number;
  filename: string;
  fileType: string;
  fileSize: number;
}

interface ResumeTailorToolProps {
  onResumeCreated: (data: ParsedResume, info: ParseInfo) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isAuthenticated?: boolean;
}

const ResumeTailorTool = ({
  onResumeCreated,
  isLoading,
  setIsLoading,
  isAuthenticated = false,
}: ResumeTailorToolProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jobSpecFileInputRef = useRef<HTMLInputElement>(null);

  // File upload states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  // Job tailoring states
  const [jobSpecMethod, setJobSpecMethod] = useState<'paste' | 'upload'>(
    'paste'
  );
  const [jobSpecText, setJobSpecText] = useState('');
  const [jobSpecFile, setJobSpecFile] = useState<File | null>(null);
  const [tone, setTone] = useState<'Formal' | 'Neutral' | 'Creative'>(
    'Neutral'
  );
  const [extraPrompt, setExtraPrompt] = useState('');

  // UI states
  const [showProfileUploader, setShowProfileUploader] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const [showColorDialog, setShowColorDialog] = useState(false);

  // Customization states
  const [profileImage, setProfileImage] = useState('');
  const [customColors, setCustomColors] = useState<Record<string, string>>({});
  // Toggle to enable/disable the job tailoring panel
  const [tailorEnabled, setTailorEnabled] = useState(false);
  // Track created resume slug for redirect
  const [createdResumeSlug, setCreatedResumeSlug] = useState<string | null>(
    null
  );
  const [localResumeData, setLocalResumeData] = useState<ParsedResume | null>(
    null
  );
  const [viewLocalResume, setViewLocalResume] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    const fileType = file.type;
    if (!['application/pdf', 'text/plain'].includes(fileType)) {
      setError('Please upload a .txt or .pdf file');
      return;
    }

    setUploadedFile(file);
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleJobSpecFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setJobSpecFile(e.target.files[0]);
    }
  };

  const handleCreateResume = async () => {
    if (!uploadedFile) {
      setError('Please upload a resume file');
      return;
    }

    // Conditional validation when tailoring is enabled
    if (tailorEnabled) {
      if (jobSpecMethod === 'paste' && !jobSpecText.trim()) {
        setError('Please provide a job description');
        return;
      }

      if (jobSpecMethod === 'upload' && !jobSpecFile) {
        setError('Please upload a job description file');
        return;
      }

      if (jobSpecText.length > 4000) {
        setError(
          `Job description is too long (${jobSpecText.length}/4000 characters)`
        );
        return;
      }
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('isAuthenticated', String(isAuthenticated));

    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    if (customColors && Object.keys(customColors).length > 0) {
      formData.append('customColors', JSON.stringify(customColors));
    }

    // Add job tailoring fields only if enabled
    if (tailorEnabled) {
      formData.append('jobSpecMethod', jobSpecMethod);

      if (jobSpecMethod === 'paste') {
        formData.append('jobSpecText', jobSpecText);
      } else if (jobSpecFile) {
        formData.append('jobSpecFile', jobSpecFile);
      }

      formData.append('tone', tone);
      formData.append('extraPrompt', extraPrompt);
    }

    try {
      const response = await fetch('/api/parse-resume-enhanced', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error(
            'Authentication required. Please sign in to continue.'
          );
        }
        throw new Error(errorData.error || 'Failed to parse resume');
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error || 'Parsing failed.');
      }

      const parsedData: ParsedResume = result.data;
      const uploadInfo: ParseInfo = {
        ...result.meta,
        fileType: uploadedFile.type,
        fileSize: uploadedFile.size,
      };

      onResumeCreated(parsedData, uploadInfo);
      setLocalResumeData(parsedData);
      if (uploadInfo.resumeSlug) {
        setCreatedResumeSlug(uploadInfo.resumeSlug);
      }
      setShowProfileUploader(true);
      setError('');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
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

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingCard}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingTitle}>
            Creating your tailored resume...
          </p>
          <p className={styles.loadingSubtitle}>
            AI is analyzing the job description and optimizing your resume
          </p>
        </div>
      </div>
    );
  }

  if (viewLocalResume && localResumeData) {
    return (
      <div className={styles.container}>
        <ResumeDisplayButtons
          onDownloadPdf={() => {
            // trigger browser print as simple download (placeholder)
            window.print();
          }}
          onEditResume={() => setViewLocalResume(false)}
          onUploadNew={() => setViewLocalResume(false)}
        />
        <ResumeDisplay resumeData={localResumeData} isAuth={false} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent>
          <DialogTitle className={styles.errorTitle}>
            <AlertTriangle size={24} /> Error
          </DialogTitle>
          <DialogDescription className={styles.errorDescription}>
            {modalErrorMessage}
          </DialogDescription>
          <Button onClick={() => setShowErrorModal(false)}>Close</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfileUploader} onOpenChange={setShowProfileUploader}>
        <DialogContent
          className={styles.profileDialogContent}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogTitle className={styles.dialogTitle}>
            <CheckCircle size={24} /> Resume Tailored Successfully!
          </DialogTitle>
          <DialogDescription className={styles.dialogDescription}>
            Your resume has been tailored to the job description. Optionally
            upload a profile image or proceed to view your resume.
          </DialogDescription>
          <ProfileImageUploader
            onImageChange={handleProfileImageChange}
            showPrompt={true}
            onSkip={() => {
              setProfileImage(''); // Clear profile image if skipped
              if (createdResumeSlug) {
                router.push(`/resume/${createdResumeSlug}`);
              } else {
                setShowProfileUploader(false);
                setViewLocalResume(true);
              }
            }}
            onComplete={() => {
              // after selecting image or continue, go to view resume
              setShowProfileUploader(false);
              if (createdResumeSlug) {
                router.push(`/resume/${createdResumeSlug}`);
              } else {
                setViewLocalResume(true);
              }
            }}
          />
        </DialogContent>
      </Dialog>

      <div className={styles.toolGrid}>
        {/* Left Panel - Resume Upload */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <FileText className={styles.panelIcon} />
            <h2 className={styles.panelTitle}>Your Resume</h2>
          </div>
          <div
            className={styles.dropZone}
            onDrag={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <VisuallyHidden.Root>
              <label htmlFor="resume-upload">Upload your resume</label>
            </VisuallyHidden.Root>
            <input
              id="resume-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className={styles.fileInput}
              accept=".pdf,.txt"
            />

            {uploadedFile ? (
              <div className={styles.fileSelected}>
                <FileUpIcon size={32} className={styles.uploadIcon} />
                <p className={styles.fileName}>{uploadedFile.name}</p>
                <p className={styles.fileSize}>
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveFile}
                  className={styles.changeFileButton}
                >
                  Change File
                </Button>
              </div>
            ) : (
              <div className={styles.dropZoneContent}>
                <Upload size={40} className={styles.uploadIcon} />
                <p className={styles.dropText}>Drag & drop your resume here</p>
                <p className={styles.dropSubtext}>or click to browse</p>
                <span className={styles.fileTypes}>
                  Supports PDF and TXT files (Max 10MB)
                </span>
              </div>
            )}
          </div>

          {/* Color Customization & Tailor Toggle */}
          <div className={styles.customizationSection}>
            <Dialog open={showColorDialog} onOpenChange={setShowColorDialog}>
              <button
                type="button"
                onClick={() => setShowColorDialog(true)}
                className={styles.colorButton}
              >
                <Palette size={20} />
                Customize Colors
              </button>
              <DialogContent className={styles.colorDialogContent}>
                <VisuallyHidden.Root>
                  <DialogTitle>Choose Colors</DialogTitle>
                </VisuallyHidden.Root>
                <ColorPicker
                  currentColors={customColors}
                  onColorsChange={handleColorsChange}
                />
              </DialogContent>
            </Dialog>

            {/* Tailor to job spec toggle */}
            <label className={styles.tailorToggle} htmlFor="tailor-toggle">
              <input
                id="tailor-toggle"
                type="checkbox"
                checked={tailorEnabled}
                onChange={() => setTailorEnabled((prev) => !prev)}
              />
              <span>Tailor to job spec.</span>
            </label>
            {/* Action Button - Only show when tailor is disabled */}
            {!tailorEnabled && (
              <div className={styles.actionSection}>
                {error && (
                  <div className={styles.errorMessage}>
                    <AlertTriangle size={16} />
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleCreateResume}
                  disabled={isLoading || !uploadedFile}
                  className={styles.createButton}
                  variant="primary"
                  size="lg"
                >
                  <Wand size={20} />
                  Create Resume
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Job Description */}
        <div
          className={`${styles.panel} ${!tailorEnabled ? styles.disabledPanel : ''}`}
        >
          <div className={styles.panelHeader}>
            <BriefcaseIcon className={styles.panelIcon} />
            <h2 className={styles.panelTitle}>Job Description</h2>
          </div>

          <div className={styles.inputMethodToggle}>
            <button
              type="button"
              disabled={!tailorEnabled}
              className={`${styles.methodButton} ${tailorEnabled && jobSpecMethod === 'paste' ? styles.methodButtonActive : ''} ${!tailorEnabled ? styles.methodButtonDisabled : ''}`}
              onClick={() => setJobSpecMethod('paste')}
            >
              <FileText size={16} />
              Paste Text
            </button>
            <button
              type="button"
              disabled={!tailorEnabled}
              className={`${styles.methodButton} ${tailorEnabled && jobSpecMethod === 'upload' ? styles.methodButtonActive : ''} ${!tailorEnabled ? styles.methodButtonDisabled : ''}`}
              onClick={() => setJobSpecMethod('upload')}
            >
              <Upload size={16} />
              Upload File
            </button>
          </div>

          {jobSpecMethod === 'paste' ? (
            <div className={styles.textareaContainer}>
              <Textarea
                className={styles.jobSpecTextarea}
                placeholder="Paste the job description here..."
                maxLength={4000}
                value={jobSpecText}
                onChange={(e) => setJobSpecText(e.target.value)}
                disabled={!tailorEnabled}
              />
              <div className={styles.characterCount}>
                <span
                  className={
                    jobSpecText.length > 3800 ? styles.characterWarning : ''
                  }
                >
                  {jobSpecText.length}/4000 characters
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.fileUploadContainer}>
              <input
                type="file"
                ref={jobSpecFileInputRef}
                accept=".pdf,.txt"
                onChange={handleJobSpecFileChange}
                className={styles.fileInput}
              />
              <button
                type="button"
                onClick={() => jobSpecFileInputRef.current?.click()}
                className={styles.fileUploadButton}
              >
                {jobSpecFile ? (
                  <>
                    <FileUpIcon size={20} />
                    {jobSpecFile.name}
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Choose job description file
                  </>
                )}
              </button>
            </div>
          )}

          {/* Tone Selection */}
          <div className={styles.toneSection}>
            <h3 className={styles.sectionTitle}>Resume Tone</h3>
            <div className={styles.toneOptions}>
              {(['Formal', 'Neutral', 'Creative'] as const).map(
                (toneOption) => (
                  <button
                    key={toneOption}
                    type="button"
                    className={`${styles.toneButton} ${tone === toneOption ? styles.toneButtonActive : ''}`}
                    onClick={() => setTone(toneOption)}
                  >
                    <span className={styles.toneName}>{toneOption}</span>
                    <span className={styles.toneDescription}>
                      {toneOption === 'Formal' && 'Conservative, traditional'}
                      {toneOption === 'Neutral' && 'Balanced, professional'}
                      {toneOption === 'Creative' && 'Dynamic, engaging'}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Additional Instructions */}
          <div className={styles.instructionsSection}>
            <h3 className={styles.sectionTitle}>Additional Instructions</h3>
            <Textarea
              className={styles.instructionsTextarea}
              placeholder="Add any specific instructions for tailoring (optional)..."
              maxLength={500}
              value={extraPrompt}
              onChange={(e) => setExtraPrompt(e.target.value)}
              disabled={!tailorEnabled}
            />
            <div className={styles.characterCount}>
              <span
                className={
                  extraPrompt.length > 450 ? styles.characterWarning : ''
                }
              >
                {extraPrompt.length}/500 characters
              </span>
            </div>
          </div>
          {/* 2nd Action Button - Only show when tailor is enabled */}
          {tailorEnabled && (
            <div className={styles.actionSection}>
              {error && (
                <div className={styles.errorMessage}>
                  <AlertTriangle size={16} />
                  {error}
                </div>
              )}

              <Button
                onClick={handleCreateResume}
                disabled={
                  isLoading ||
                  !uploadedFile ||
                  (jobSpecMethod === 'paste'
                    ? !jobSpecText.trim()
                    : !jobSpecFile)
                }
                className={styles.createButton}
                variant="primary"
                size="lg"
              >
                <Wand size={20} />
                Tailor Resume
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeTailorTool;
