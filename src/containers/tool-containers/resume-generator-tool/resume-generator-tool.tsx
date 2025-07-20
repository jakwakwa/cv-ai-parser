'use client';

import { ResumeUploadPanel } from '@/src/components/resume-upload-panel';
import { useResumeGenerator } from '@/src/hooks/use-resume-generator';
import { ErrorModal } from '../../../components/error-modal';
import { LoadingState } from '../../../components/loading-state';
import styles from '../shared-tool.module.css';

interface ResumeGeneratorToolProps {
  isLoading: boolean;
  isAuthenticated: boolean;
}

const ResumeGeneratorTool = ({
  isLoading = false,
  isAuthenticated = false,
}: ResumeGeneratorToolProps) => {
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
  } = useResumeGenerator(isAuthenticated);

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
