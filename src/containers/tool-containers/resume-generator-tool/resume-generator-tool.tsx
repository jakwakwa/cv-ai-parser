'use client';

import { ErrorModal } from '@/src/components/error-modal';
import { LoadingState } from '@/src/components/loading-state';
import { ResumeUploadPanel } from '@/src/components/resume-upload-panel';
import { useResumeTailor } from '@/src/hooks/use-resume-tailor';
import styles from '../shared-tool.module.css';

const ResumeGeneratorTool = ({
  isLoading = false,
  isAuthenticated = false,
}) => {
  const {
    state,
    fileInputRef,
    handleFileChange,
    handleRemoveFile,
    handleDrag,
    handleDrop,
    handleCreateResume,
    resetToInitialState,
    setProfileImage,
    setCustomColors,
    setShowColorDialog,
    setShowErrorModal,
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

      <div className={styles.toolGenerator}>
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
        />
      </div>
    </div>
  );
};

export default ResumeGeneratorTool;
