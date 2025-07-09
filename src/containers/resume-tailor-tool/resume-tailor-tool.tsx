/** biome-ignore-all lint/a11y/noStaticElementInteractions: <fix later> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <fix later> */
'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import {
  AlertTriangle,
  FileText as BriefcaseIcon,
  FileText,
  Upload as FileUpIcon,
  Palette,
  Upload,
  // @ts-ignore - it does have one
  Wand,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { usePdfDownloader } from '@/hooks/use-pdf-downloader';
import type { EnhancedParsedResume } from '@/lib/resume-parser/enhanced-schema'; // Import EnhancedParsedResume
import ColorPicker from '@/src/components/color-picker/color-picker';
import ResumeDisplayButtons from '@/src/components/resume-display-buttons/resume-display-buttons';
import ResumeTailorCommentary from '@/src/components/resume-tailor-commentary/resume-tailor-commentary';
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

// Add proper typing for partial data
interface PartialResumeData {
  name?: string;
  title?: string;
  experience?: Array<{
    title?: string;
    company?: string;
    duration?: string;
    details?: string[];
  }>;
  skills?: string[];
  [key: string]: unknown; // For other dynamic fields during parsing
}

interface ParseInfo {
  resumeId?: string;
  resumeSlug?: string;
  method: string;
  confidence: number;
  filename: string;
  fileType: string;
  fileSize: number;
  aiTailorCommentary?: string; // Rename aiSummary to aiTailorCommentary here
}

interface StreamUpdate {
  status?: 'analyzing' | 'processing' | 'saving' | 'completed' | 'error';
  message?: string;
  progress?: number;
  partialData?: PartialResumeData; // Replace 'any' with proper type
  data?: EnhancedParsedResume;
  meta?: ParseInfo;
}

interface ResumeTailorToolProps {
  onResumeCreated: (data: EnhancedParsedResume, info: ParseInfo) => void; // Update to EnhancedParsedResume
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
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const [showColorDialog, setShowColorDialog] = useState(false);
  const [aiTailorCommentary, setAiTailorCommentary] = useState<string | null>(
    null
  ); // Rename aiSummary to aiTailorCommentary

  // Streaming states
  const [streamingProgress, setStreamingProgress] = useState(0);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [partialResumeData, setPartialResumeData] =
    useState<PartialResumeData | null>(null);

  // Customization states
  const [profileImage, setProfileImage] = useState('');
  const [customColors, setCustomColors] = useState<Record<string, string>>({});
  // Toggle to enable/disable the job tailoring panel
  const [tailorEnabled, setTailorEnabled] = useState(false);
  // Track created resume slug for redirect
  const [_createdResumeSlug, setCreatedResumeSlug] = useState<string | null>(
    null
  );
  const [localResumeData, setLocalResumeData] =
    useState<EnhancedParsedResume | null>(
      // Changed to EnhancedParsedResume
      null
    );
  const [viewLocalResume, setViewLocalResume] = useState(false);

  //  usePdfDownloader hook
  const { downloadPdf } = usePdfDownloader();

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

    // --- LOGGING: Log all form data fields before sending ---
    const formDataLog: Record<string, string | File> = {};
    formData.forEach((value, key) => {
      formDataLog[key] =
        value instanceof File
          ? `[File: ${value.name}, size: ${value.size}]`
          : value;
    });
    console.log('[TailorTool] Submitting resume:', formDataLog);
    // --- END LOGGING ---

    try {
      const response = await fetch('/api/parse-resume-enhanced', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error || 'Failed to parse resume';
        if (response.status === 401) {
          throw new Error(
            'Authentication required. Please sign in to continue.'
          );
        }
        throw new Error(errorMsg);
      }

      // Check if response is streaming (Server-Sent Events)
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('text/plain')) {
        // Handle streaming response using SSE format
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('Failed to read stream');
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const streamUpdate = JSON.parse(
                    line.slice(6)
                  ) as StreamUpdate;

                  // Update progress and message
                  if (streamUpdate.progress !== undefined) {
                    setStreamingProgress(streamUpdate.progress);
                  }
                  if (streamUpdate.message) {
                    setStreamingMessage(streamUpdate.message);
                  }
                  if (streamUpdate.partialData) {
                    setPartialResumeData(streamUpdate.partialData);
                  }

                  // Handle final completion
                  if (
                    streamUpdate.status === 'completed' &&
                    streamUpdate.data
                  ) {
                    const parsedData: EnhancedParsedResume = streamUpdate.data;
                    const uploadInfo: ParseInfo = {
                      method: streamUpdate.meta?.method || 'ai_enhanced',
                      confidence: streamUpdate.meta?.confidence || 98,
                      filename:
                        streamUpdate.meta?.filename || uploadedFile.name,
                      resumeId: streamUpdate.meta?.resumeId,
                      resumeSlug: streamUpdate.meta?.resumeSlug,
                      aiTailorCommentary: streamUpdate.meta?.aiTailorCommentary,
                      fileType: uploadedFile.type,
                      fileSize: uploadedFile.size,
                    };

                    onResumeCreated(parsedData, uploadInfo);
                    setLocalResumeData(parsedData);
                    setAiTailorCommentary(
                      uploadInfo.aiTailorCommentary || null
                    );

                    if (uploadInfo.resumeSlug) {
                      setCreatedResumeSlug(uploadInfo.resumeSlug);
                      console.log(
                        '[TailorTool] Routing to:',
                        `/resume/${uploadInfo.resumeSlug}`
                      );
                      router.push(`/resume/${uploadInfo.resumeSlug}`);
                    } else {
                      console.log(
                        '[TailorTool] No resumeSlug returned, showing local preview'
                      );
                      setViewLocalResume(true);
                    }
                    return;
                  }

                  // Handle errors
                  if (streamUpdate.status === 'error') {
                    throw new Error(
                      streamUpdate.message || 'Stream processing failed'
                    );
                  }
                } catch (_parseError) {
                  console.warn(
                    '[TailorTool] Failed to parse stream chunk:',
                    line
                  );
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      } else {
        // Handle regular JSON response
        const result = await response.json();

        if (result?.error) {
          throw new Error(result.error || 'Parsing failed.');
        }

        // Fallback for non-streaming response
        const parsedData: EnhancedParsedResume = result.data;
        const uploadInfo: ParseInfo = {
          method: result.meta?.method || 'ai_enhanced',
          confidence: result.meta?.confidence || 98,
          filename: result.meta?.filename || uploadedFile.name,
          resumeId: result.meta?.resumeId,
          resumeSlug: result.meta?.resumeSlug,
          aiTailorCommentary: result.meta?.aiTailorCommentary,
          fileType: uploadedFile.type,
          fileSize: uploadedFile.size,
        };

        onResumeCreated(parsedData, uploadInfo);
        setLocalResumeData(parsedData);
        setAiTailorCommentary(uploadInfo.aiTailorCommentary || null);
        setViewLocalResume(true);
      }

      setError('');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      setModalErrorMessage(errorMessage);
      setShowErrorModal(true);
      setError('');
    } finally {
      setIsLoading(false);
      // Reset streaming states
      setStreamingProgress(0);
      setStreamingMessage('');
      setPartialResumeData(null);
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
            {streamingMessage || 'Extracting data from your resume...'}
          </p>
          <p className={styles.loadingSubtitle}>
            {streamingProgress > 0
              ? `Progress: ${streamingProgress}%`
              : 'AI is analyzing the job specifications and tailoring your resume...'}
          </p>
          {streamingProgress > 0 && (
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${streamingProgress}%` }}
              />
            </div>
          )}
          {partialResumeData && (
            <div className={styles.partialPreview}>
              <p className={styles.previewTitle}>Partial Resume Data:</p>
              <div className={styles.previewContent}>
                {partialResumeData.name && (
                  <p>
                    <strong>Name:</strong> {partialResumeData.name}
                  </p>
                )}
                {partialResumeData.title && (
                  <p>
                    <strong>Title:</strong> {partialResumeData.title}
                  </p>
                )}
                {Array.isArray(partialResumeData.experience) &&
                  partialResumeData.experience.length > 0 && (
                    <p>
                      <strong>Experience sections:</strong>{' '}
                      {partialResumeData.experience.length}
                    </p>
                  )}
                {Array.isArray(partialResumeData.skills) &&
                  partialResumeData.skills.length > 0 && (
                    <p>
                      <strong>Skills found:</strong>{' '}
                      {partialResumeData.skills.length}
                    </p>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (viewLocalResume && localResumeData) {
    return (
      <div className={styles.container}>
        <ResumeDisplayButtons
          onDownloadPdf={() => {
            // Use the usePdfDownloader hook instead of window.print()
            downloadPdf(
              document.getElementById('resume-content') as HTMLElement,
              `${localResumeData.name?.replace(/ /g, '_') || 'resume'}.pdf`
            );
          }}
          onEditResume={() => setViewLocalResume(false)}
          onUploadNew={() => setViewLocalResume(false)}
        />
        <ResumeTailorCommentary aiTailorCommentary={aiTailorCommentary} />{' '}
        {/* Render AI tailoring commentary */}
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

          {/* Profile Image Uploader */}
          <div className={styles.customizationSection}>
            <h3 className={styles.sectionTitle}>Profile Picture (Optional)</h3>
            <ProfileImageUploader
              onImageChange={handleProfileImageChange}
              showPrompt={false}
            />
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
