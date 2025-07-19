'use client';

import { useResumeTailor } from '@/src/hooks/use-resume-tailor';
import { LoadingState } from './components/loading-state';
import { ErrorModal } from './components/error-modal';
import { ResumeUploadPanel } from './components/resume-upload-panel';
import { JobDescriptionPanel } from './components/job-description-panel';
import styles from './resume-tailor-tool.module.css';
import type { ResumeTailorToolProps } from './types';

const ResumeTailorTool = ({
  isLoading,
  setIsLoading,
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
    setTailorEnabled,
    setProfileImage,
    setCustomColors,
    setShowColorDialog,
    setShowErrorModal,
  } = useResumeTailor(isAuthenticated);

  if (isLoading) {
    return (
      <LoadingState
        streamingMessage={state.streamingMessage}
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

      <div className={styles.toolGrid}>
        <ResumeUploadPanel
          state={state}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          onRemoveFile={handleRemoveFile}
          onDrag={handleDrag}
          onDrop={handleDrop}
          onTailorToggle={() => setTailorEnabled(!state.tailorEnabled)}
          onProfileImageChange={setProfileImage}
          onColorsChange={setCustomColors}
          onShowColorDialog={() => setShowColorDialog(true)}
          onHideColorDialog={() => setShowColorDialog(false)}
          onCreateResume={handleCreateResume}
          isLoading={isLoading}
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
