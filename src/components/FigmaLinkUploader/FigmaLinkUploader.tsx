import React, { useState, useCallback } from 'react';
import { AlertTriangle, Palette, CheckCircle } from 'lucide-react';
import { resumeColors } from '@/src/utils/colors';
import ColorPickerDialog from '../color-picker/ColorPickerDialog';
import styles from './FigmaLinkUploader.module.css';

// Types for the Figma API response
interface FigmaApiResponse {
  jsx: string;
  css: string;
  componentName: string;
  rawFigma: Record<string, any>;
  customColors: Record<string, string>;
  success: boolean;
  message: string;
}

interface FigmaApiError {
  error: string;
  details?: string;
}

interface FigmaGeneratedComponent {
  componentName: string;
  jsxCode: string;
  cssCode: string;
  rawFigma: Record<string, any>;
}

interface FigmaLinkUploaderProps {
  onResumeGenerated: (params: FigmaGeneratedComponent) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Validation utilities
interface FigmaLinkValidation {
  isValid: boolean;
  error?: string;
  fileKey?: string;
  nodeId?: string;
}

const FigmaLinkUploader: React.FC<FigmaLinkUploaderProps> = ({ onResumeGenerated, isLoading, setIsLoading }) => {
  const [figmaLink, setFigmaLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationWarning, setValidationWarning] = useState('');
  const [customColors, setCustomColors] = useState<Record<string, string>>(resumeColors);
  const [showColorDialog, setShowColorDialog] = useState(false);

  // Handle input change with real-time validation
  const handleLinkChange = useCallback((value: string) => {
    setFigmaLink(value);
    setError('');
    setSuccess('');
    
    // Show validation warning for incomplete links
    if (value.trim() && !value.includes('figma.com')) {
      setValidationWarning('Please enter a valid Figma link');
    } else {
      setValidationWarning('');
    }
  }, []);
  
  // Enhanced Figma link validation
  const validateFigmaLink = useCallback((link: string): FigmaLinkValidation => {
    if (!link.trim()) {
      return { isValid: false, error: 'Please provide a Figma link.' };
    }

    try {
      const url = new URL(link.trim());
      
      if (url.hostname !== 'www.figma.com') {
        return { 
          isValid: false, 
          error: 'Please provide a valid Figma link. The URL should start with https://www.figma.com/' 
        };
      }

      const pathParts = url.pathname.split('/');
      const fileIndex = pathParts.indexOf('file');
      
      if (fileIndex === -1 || pathParts.length <= fileIndex + 1) {
        return { 
          isValid: false, 
          error: 'Invalid Figma link format. Expected format: https://www.figma.com/file/FILE_ID/...' 
        };
      }

      const fileKey = pathParts[fileIndex + 1];
      if (!fileKey || fileKey.length < 10) {
        return { 
          isValid: false, 
          error: 'Invalid Figma file ID in the link.' 
        };
      }

      const nodeId = url.searchParams.get('node-id');
      
      return {
        isValid: true,
        fileKey,
        nodeId: nodeId || undefined
      };
    } catch {
      return { 
        isValid: false, 
        error: 'Invalid URL format. Please provide a valid Figma link.' 
      };
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    // Clear previous states
    setError('');
    setSuccess('');

    // Validate the Figma link
    const validation = validateFigmaLink(figmaLink);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid Figma link');
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        figmaLink: figmaLink.trim(),
        customColors,
        fileKey: validation.fileKey,
        nodeId: validation.nodeId
      };

      const response = await fetch('/api/parse-figma-resume', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

      const responseData: FigmaApiResponse | FigmaApiError = await response.json();

      if (!response.ok) {
        const errorData = responseData as FigmaApiError;
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate component`);
      }

      const data = responseData as FigmaApiResponse;
      
      if (!data.jsx || !data.css || !data.componentName) {
        throw new Error('Invalid response: Missing required component data');
      }

      setSuccess(data.message || `Successfully generated ${data.componentName} component!`);
      
      onResumeGenerated({
        componentName: data.componentName,
        jsxCode: data.jsx,
        cssCode: data.css,
        rawFigma: data.rawFigma,
      });

    } catch (err: unknown) {
      console.error('Figma generation error:', err);
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Network error: Unable to connect to the server. Please check your connection and try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [figmaLink, customColors, validateFigmaLink, setIsLoading, onResumeGenerated]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        <span style={{ marginRight: '0.5rem' }}>🔗</span> Generate from Figma Design
      </h2>
      
      <div className={styles.inputContainer}>
        <input
          type="url"
          placeholder="https://www.figma.com/file/YOUR_FILE_ID/Your-Design-Name"
          value={figmaLink}
          onChange={(e) => handleLinkChange(e.target.value)}
          className={`${styles.input} ${error ? styles.inputError : ''} ${success ? styles.inputSuccess : ''}`}
          disabled={isLoading}
          aria-describedby={error ? 'figma-error' : validationWarning ? 'figma-warning' : undefined}
        />
        
        {validationWarning && !error && !success && (
          <div className={styles.warning} id="figma-warning">
            <AlertTriangle style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> 
            {validationWarning}
          </div>
        )}
        
        {error && (
          <div className={styles.error} id="figma-error">
            <AlertTriangle style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> 
            {error}
          </div>
        )}
        
        {success && (
          <div className={styles.success}>
            <CheckCircle style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> 
            {success}
          </div>
        )}
      </div>

      <div className={styles.actionsRow}>
        <button 
          type="button" 
          onClick={handleGenerate} 
          className={styles.generateBtn} 
          disabled={isLoading || !figmaLink.trim()}
          aria-label={isLoading ? 'Generating component...' : 'Generate resume component from Figma design'}
        >
          {isLoading && (
            <span className={styles.loadingSpinner} aria-hidden="true" />
          )}
          {isLoading ? 'Generating…' : 'Generate Resume'}
        </button>
        
        <button 
          type="button" 
          className={styles.colorsBtn} 
          onClick={() => setShowColorDialog(!showColorDialog)}
          disabled={isLoading}
          aria-label="Customize color scheme"
        >
          <Palette className={styles.colorsIcon} /> Colors
        </button>
      </div>

      <div className={styles.helpText}>
        <p>
          <strong>Tip:</strong> For best results, select a frame or component that represents your complete resume layout.
          Make sure text layers are named descriptively (e.g., "name", "title", "summary", "email").
        </p>
      </div>

      <ColorPickerDialog
        open={showColorDialog}
        onOpenChange={setShowColorDialog}
        currentColors={customColors}
        onColorsChange={(colors) => setCustomColors(colors)}
      />
    </div>
  );
};

export default FigmaLinkUploader;