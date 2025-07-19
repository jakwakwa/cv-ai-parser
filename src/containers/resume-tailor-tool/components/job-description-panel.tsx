import { AlertTriangle, FileText, Upload as FileUpIcon, Upload } from 'lucide-react';
import { Textarea } from '@/src/components/ui/textarea';
import { Button } from '@/src/components/ui/ui-button/button';
import { TONE_OPTIONS } from '../constants';
import type { ResumeTailorState, JobSpecMethod, ToneOption } from '../types';
import styles from '../resume-tailor-tool.module.css';

interface JobDescriptionPanelProps {
  state: ResumeTailorState;
  jobSpecFileInputRef: React.RefObject<HTMLInputElement | null>;
  onJobSpecMethodChange: (method: JobSpecMethod) => void;
  onJobSpecTextChange: (text: string) => void;
  onJobSpecFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToneChange: (tone: ToneOption) => void;
  onExtraPromptChange: (prompt: string) => void;
  onCreateResume: () => void;
  isLoading: boolean;
}

export function JobDescriptionPanel({
  state,
  jobSpecFileInputRef,
  onJobSpecMethodChange,
  onJobSpecTextChange,
  onJobSpecFileChange,
  onToneChange,
  onExtraPromptChange,
  onCreateResume,
  isLoading,
}: JobDescriptionPanelProps) {
  return (
    <div className={`${styles.panel} ${!state.tailorEnabled ? styles.disabledPanel : ''}`}>
      <div className={styles.panelHeader}>
        <FileText className={styles.panelIcon} />
        <h2 className={styles.panelTitle}>Job Description</h2>
      </div>

      <div className={styles.inputMethodToggle}>
        <button
          type="button"
          disabled={!state.tailorEnabled}
          className={`${styles.methodButton} ${state.tailorEnabled && state.jobSpecMethod === 'paste' ? styles.methodButtonActive : ''} ${!state.tailorEnabled ? styles.methodButtonDisabled : ''}`}
          onClick={() => onJobSpecMethodChange('paste')}
        >
          <FileText size={16} />
          Paste Text
        </button>
        <button
          type="button"
          disabled={!state.tailorEnabled}
          className={`${styles.methodButton} ${state.tailorEnabled && state.jobSpecMethod === 'upload' ? styles.methodButtonActive : ''} ${!state.tailorEnabled ? styles.methodButtonDisabled : ''}`}
          onClick={() => onJobSpecMethodChange('upload')}
        >
          <Upload size={16} />
          Upload File
        </button>
      </div>

      {state.jobSpecMethod === 'paste' ? (
        <div className={styles.textareaContainer}>
          <Textarea
            className={styles.jobSpecTextarea}
            placeholder="Paste the job description here..."
            maxLength={4000}
            value={state.jobSpecText}
            onChange={(e) => onJobSpecTextChange(e.target.value)}
            disabled={!state.tailorEnabled}
          />
          <div className={styles.characterCount}>
            <span className={state.jobSpecText.length > 3800 ? styles.characterWarning : ''}>
              {state.jobSpecText.length}/4000 characters
            </span>
          </div>
        </div>
      ) : (
        <div className={styles.fileUploadContainer}>
          <input
            type="file"
            ref={jobSpecFileInputRef}
            accept=".pdf,.txt"
            onChange={onJobSpecFileChange}
            className={styles.fileInput}
          />
          <button
            type="button"
            onClick={() => jobSpecFileInputRef.current?.click()}
            className={styles.fileUploadButton}
            disabled={!state.tailorEnabled}
          >
            {state.jobSpecFile ? (
              <>
                <FileUpIcon size={20} />
                {state.jobSpecFile.name}
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

      <div className={styles.toneSection}>
        <h3 className={styles.sectionTitle}>Resume Tone</h3>
        <div className={styles.toneOptions}>
          {TONE_OPTIONS.map((toneOption) => (
            <button
              key={toneOption.value}
              type="button"
              disabled={!state.tailorEnabled}
              className={`${styles.toneButton} ${state.tone === toneOption.value ? styles.toneButtonActive : ''}`}
              onClick={() => onToneChange(toneOption.value)}
            >
              <span className={styles.toneName}>{toneOption.label}</span>
              <span className={styles.toneDescription}>{toneOption.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.instructionsSection}>
        <h3 className={styles.sectionTitle}>Additional Instructions</h3>
        <Textarea
          className={styles.instructionsTextarea}
          placeholder="Add any specific instructions for tailoring (optional)..."
          maxLength={500}
          value={state.extraPrompt}
          onChange={(e) => onExtraPromptChange(e.target.value)}
          disabled={!state.tailorEnabled}
        />
        <div className={styles.characterCount}>
          <span className={state.extraPrompt.length > 450 ? styles.characterWarning : ''}>
            {state.extraPrompt.length}/500 characters
          </span>
        </div>
      </div>

      {state.tailorEnabled && (
        <div className={styles.actionSection}>
          {state.error && (
            <div className={styles.errorMessage}>
              <AlertTriangle size={16} />
              {state.error}
            </div>
          )}

          <Button
            onClick={onCreateResume}
            disabled={
              isLoading ||
              !state.uploadedFile ||
              (state.jobSpecMethod === 'paste' ? !state.jobSpecText.trim() : !state.jobSpecFile)
            }
            className={styles.createButton}
            variant="primary"
            size="lg"
          >
            <Upload size={20} />
            Tailor Resume
          </Button>
        </div>
      )}
    </div>
  );
} 