import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import type { ParsedResumeSchema } from '@/lib/tools-lib/shared-parsed-resume-schema';
import { createFormData, parseResume } from '@/src/containers/tool-containers/api-service';
import { CHARACTER_LIMITS, ERROR_MESSAGES, FILE_UPLOAD_LIMITS } from '@/src/containers/tool-containers/resume-tailor-tool/constants';
import type {
  JobSpecMethod,
  ParseInfo,
  ResumeTailorState,
  StreamUpdate,
  ToneOption,
} from '@/src/containers/tool-containers/types';
import { useTempResumeStore } from './use-temp-resume-store';

const initialState: ResumeTailorState = {
  uploadedFile: null,
  error: '',
  jobSpecMethod: 'paste',
  jobSpecText: '',
  jobSpecFile: null,
  tone: 'Neutral',
  extraPrompt: '',
  showErrorModal: false,
  modalErrorMessage: '',
  showColorDialog: false,
  aiTailorCommentary: null,
  streamingProgress: 0,
  streamingMessage: '',
  partialResumeData: null,
  profileImage: '',
  customColors: {},
  localResumeData: null,
  isProcessing: false, // Add this field
};

export function useResumeTailor(isAuthenticated: boolean) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jobSpecFileInputRef = useRef<HTMLInputElement>(null);
  const { addTempResume, generateTempSlug } = useTempResumeStore();
  
  const [state, setState] = useState<ResumeTailorState>(initialState);

  // Update functions
  const updateState = (updates: Partial<ResumeTailorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetToInitialState = () => {
    setState(initialState);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (jobSpecFileInputRef.current) jobSpecFileInputRef.current.value = '';
  };

  // Validation
  const validateFileSelection = (file: File): string | null => {
    if (file.size > FILE_UPLOAD_LIMITS.MAX_SIZE) {
      return ERROR_MESSAGES.FILE_TOO_LARGE;
    }
    if (!(FILE_UPLOAD_LIMITS.ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
      return ERROR_MESSAGES.INVALID_FILE_TYPE;
    }
    return null;
  };

  const validateForm = (): string | null => {
    if (!state.uploadedFile) {
      return ERROR_MESSAGES.NO_FILE;
    }
   
      if (state.jobSpecMethod === 'paste' && !state.jobSpecText.trim()) {
        return ERROR_MESSAGES.NO_JOB_DESCRIPTION;
      }
      if (state.jobSpecMethod === 'upload' && !state.jobSpecFile) {
        return ERROR_MESSAGES.NO_JOB_FILE;
      }
      if (state.jobSpecText.length > CHARACTER_LIMITS.JOB_SPEC) {
        return ERROR_MESSAGES.JOB_SPEC_TOO_LONG(state.jobSpecText.length);
      }
  


    return null;
  };

  // File handling
  const handleFileSelection = (file: File) => {
    const error = validateFileSelection(file);
    if (error) {
      updateState({ error });
      return;
    }
    updateState({ uploadedFile: file, error: '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleJobSpecFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      updateState({ jobSpecFile: e.target.files[0] });
    }
  };

  const handleRemoveFile = () => {
    updateState({ uploadedFile: null, error: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Form updates
  const setJobSpecMethod = (method: JobSpecMethod) => updateState({ jobSpecMethod: method });
  const setJobSpecText = (text: string) => updateState({ jobSpecText: text });
  const setTone = (tone: ToneOption) => updateState({ tone });
  const setExtraPrompt = (prompt: string) => updateState({ extraPrompt: prompt });

  const setProfileImage = (image: string) => updateState({ profileImage: image });
  const setCustomColors = (colors: Record<string, string>) => updateState({ customColors: colors });
  const setShowColorDialog = (show: boolean) => updateState({ showColorDialog: show });
  const setShowErrorModal = (show: boolean) => updateState({ showErrorModal: show });

  // Drag and drop
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

  // Stream handling
  const handleStreamUpdate = (streamUpdate: StreamUpdate) => {
    if (streamUpdate.progress !== undefined) {
      updateState({ streamingProgress: streamUpdate.progress });
    }
    if (streamUpdate.message) {
      updateState({ streamingMessage: streamUpdate.message });
    }
    if (streamUpdate.partialData) {
      updateState({ partialResumeData: streamUpdate.partialData });
    }
  };

  // Success handling
  const handleSuccessfulParse = (parsedData: ParsedResumeSchema, uploadInfo?: ParseInfo) => {
    updateState({
      localResumeData: parsedData,
      aiTailorCommentary: uploadInfo?.aiTailorCommentary || null,
    });

    if (uploadInfo?.resumeSlug) {
      if (isAuthenticated) {
        console.log('[TailorTool] Authenticated user: Routing to /library');
        router.push('/library');
      } else {
        console.log('[TailorTool] Routing to:', `/resume/${uploadInfo.resumeSlug}`);
        router.push(`/resume/${uploadInfo.resumeSlug}`);
      }
    } else {
      console.log('[TailorTool] No resumeSlug returned, creating temp resume');
      const tempSlug = generateTempSlug();
      addTempResume(tempSlug, parsedData, uploadInfo?.aiTailorCommentary);
      router.push(`/resume/temp-resume/${tempSlug}`);
    }
  };

  // Main submit function
  const handleCreateResume = async () => {
    const validationError = validateForm();
    if (validationError) {
      updateState({ error: validationError });
      return;
    }

    updateState({ 
      error: '', 
      isProcessing: true, // Set processing to true when starting
      streamingProgress: 0,
      streamingMessage: 'Preparing your resume...'
    });

    try {
      const formData = createFormData(state, isAuthenticated);

      // Log form data for debugging
      const formDataLog: Record<string, string | File> = {};
      formData.forEach((value, key) => {
        formDataLog[key] = value instanceof File 
          ? `[File: ${value.name}, size: ${value.size}]` 
          : value;
      });
      console.log('[TailorTool] Submitting resume:', formDataLog);

      const result = await parseResume(formData, handleStreamUpdate);
      
      if (result.status === 'completed' && result.data) {
        handleSuccessfulParse(result.data, result.meta);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      
      const enhancedErrorMessage = `${errorMessage}\n\nDon't worry! You can try again with:
• A different resume file
• A simpler job description
• Checking your internet connection

Your progress has been saved and you can continue from where you left off.`;

      updateState({
        modalErrorMessage: enhancedErrorMessage,
        showErrorModal: true,
        error: '',
      });
    } finally {
      updateState({
        streamingProgress: 0,
        streamingMessage: '',
        partialResumeData: null,
        isProcessing: false, // Reset processing when done
      });
    }
  };

  return {
    // State
    state,
    
    // Refs
    fileInputRef,
    jobSpecFileInputRef,
    
    // Actions
    handleFileChange,
    handleJobSpecFileChange,
    handleRemoveFile,
    handleDrag,
    handleDrop,
    handleCreateResume,
    resetToInitialState,
    
    // Setters
    setJobSpecMethod,
    setJobSpecText,
    setTone,
    setExtraPrompt,
    setProfileImage,
    setCustomColors,
    setShowColorDialog,
    setShowErrorModal,
  };
} 