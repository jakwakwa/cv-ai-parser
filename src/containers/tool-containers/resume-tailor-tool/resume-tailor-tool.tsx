'use client';

import { ResumeUploadPanel } from '@/src/components/resume-upload-panel';
import { useResumeTailor } from '@/src/hooks/use-resume-tailor';
import { ErrorModal } from '../../../components/error-modal';
import { LoadingState } from '../../../components/loading-state';
import { Button } from '@/src/components/ui/ui-button/button';
import styles from '../shared-tool.module.css';
import type { ResumeTailorToolProps } from '../types';
import { JobDescriptionPanel } from './components/job-description-panel';

const ResumeTailorTool = ({
  isLoading,
  isAuthenticated = false,
}: ResumeTailorToolProps) => {
  const {
    state,
    fileInputRef,
    jobSpecFileInputRef,
    handleFileChange,
    handleJobSpecFileChange,
    handleRemoveFile,
    handleDrag,
    handleDrop,
    handleCreateResume,
    resetToInitialState,
    setJobSpecMethod,
    setJobSpecText,
    setTone,
    setExtraPrompt,
    setProfileImage,
    setCustomColors,
    setShowColorDialog,
    setShowErrorModal,
    setModalErrorMessage,
  } = useResumeTailor(isAuthenticated);

  // Show loading state if we have streaming progress, isLoading is true, or processing
  const shouldShowLoading =
    isLoading ||
    state.isProcessing ||
    state.streamingProgress > 0 ||
    state.streamingMessage !== '';

  if (shouldShowLoading) {
    return (
      <LoadingState
        streamingMessage={state.streamingMessage || 'Processing your resume...'}
        streamingProgress={state.streamingProgress}
        partialResumeData={state.partialResumeData}
      />
    );
  }

  return (
    <div className={styles.container}>
      <ErrorModal
        isOpen={state.showErrorModal}
        message={state.modalErrorMessage}
        onClose={() => setShowErrorModal(false)}
        onStartOver={() => {
          setShowErrorModal(false);
          resetToInitialState();
        }}
      />

      {/* Dev-only modal trigger removed */}

      <div className={styles.toolGrid}>
        <ResumeUploadPanel
          state={state}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          onRemoveFile={handleRemoveFile}
          onDrag={handleDrag}
          onDrop={handleDrop}
          onProfileImageChange={setProfileImage}
          onColorsChange={setCustomColors}
          onShowColorDialog={() => setShowColorDialog(true)}
          onHideColorDialog={() => setShowColorDialog(false)}
          onCreateResume={handleCreateResume}
          isLoading={isLoading}
          hideSubmitButton
        />

        <JobDescriptionPanel
          state={state}
          jobSpecFileInputRef={jobSpecFileInputRef}
          onJobSpecMethodChange={setJobSpecMethod}
          onJobSpecTextChange={setJobSpecText}
          onJobSpecFileChange={handleJobSpecFileChange}
          onToneChange={setTone}
          onExtraPromptChange={setExtraPrompt}
          onCreateResume={handleCreateResume}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ResumeTailorTool;
