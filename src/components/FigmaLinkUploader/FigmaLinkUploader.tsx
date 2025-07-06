import { AlertTriangle, CheckCircle, Palette } from 'lucide-react';
import type React from 'react';
import { useCallback, useState } from 'react';
import { resumeColors } from '@/src/utils/colors';
import ColorPickerDialog from '../color-picker/color-picker-dialog/color-picker-dialog';
import styles from './FigmaLinkUploader.module.css';

// Types for the Figma API response
interface FigmaApiResponse {
  jsx: string;
  css: string;
  componentName: string;
  rawFigma: Record<string, unknown>;
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
  rawFigma: Record<string, unknown>;
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

const FigmaLinkUploader: React.FC<FigmaLinkUploaderProps> = ({
  onResumeGenerated,
  isLoading,
  setIsLoading,
}) => {
  const [figmaLink, setFigmaLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationWarning, setValidationWarning] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [customColors, setCustomColors] =
    useState<Record<string, string>>(resumeColors);
  const [showColorDialog, setShowColorDialog] = useState(false);

  // Handle input change with real-time validation
  const handleLinkChange = useCallback((value: string) => {
    setFigmaLink(value);
    setError('');
    setSuccess('');
    setRetryCount(0);

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

      if (!['www.figma.com', 'figma.com'].includes(url.hostname)) {
        return {
          isValid: false,
          error:
            'Please provide a valid Figma link. The URL should start with https://www.figma.com/ or https://figma.com/',
        };
      }

      const pathParts = url.pathname.split('/');

      // Figma currently supports both /file/ and /design/ in the URL. Accept either.
      const fileSegmentIndex = pathParts.findIndex(
        (segment) => segment === 'file' || segment === 'design'
      );

      if (fileSegmentIndex === -1 || pathParts.length <= fileSegmentIndex + 1) {
        return {
          isValid: false,
          error:
            'Invalid Figma link format. Expected format: https://www.figma.com/file/FILE_ID/... or https://www.figma.com/design/FILE_ID/...',
        };
      }

      const fileKey = pathParts[fileSegmentIndex + 1];
      if (!fileKey || fileKey.length < 10) {
        return {
          isValid: false,
          error: 'Invalid Figma file ID in the link.',
        };
      }

      const nodeId = url.searchParams.get('node-id');

      return {
        isValid: true,
        fileKey,
        nodeId: nodeId || undefined,
      };
    } catch {
      return {
        isValid: false,
        error: 'Invalid URL format. Please provide a valid Figma link.',
      };
    }
  }, []);

  const handleGenerate = useCallback(
    async (isRetry = false) => {
      // Clear previous states
      setError('');
      setSuccess('');

      // Validate the Figma link
      const validation = validateFigmaLink(figmaLink);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid Figma link');
        return;
      }

      if (!isRetry) {
        setRetryCount(0);
      }

      setIsLoading(true);

      try {
        const requestBody = {
          figmaLink: figmaLink.trim(),
          customColors,
          fileKey: validation.fileKey,
          nodeId: validation.nodeId,
          retryAttempt: retryCount,
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch('/api/parse-figma-resume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseData: FigmaApiResponse | FigmaApiError =
          await response.json();

        if (!response.ok) {
          const errorData = responseData as FigmaApiError;

          // Handle specific error cases
          if (response.status === 429) {
            throw new Error(
              'Rate limit exceeded. Please wait a moment before trying again.'
            );
          }

          if (response.status === 401 || response.status === 403) {
            throw new Error(
              'Access denied. Please check if the Figma file is public or if you have permission to access it.'
            );
          }

          if (response.status >= 500) {
            throw new Error('Server error. Please try again in a few moments.');
          }

          throw new Error(
            errorData.error ||
              `HTTP ${response.status}: Failed to generate component`
          );
        }

        const data = responseData as FigmaApiResponse;

        if (!data.jsx || !data.css || !data.componentName) {
          throw new Error('Invalid response: Missing required component data');
        }

        // Handle both real and mock/fallback responses
        const successMessage =
          data.message ||
          `Successfully generated ${data.componentName} component!`;
        setSuccess(successMessage);
        setRetryCount(0);

        onResumeGenerated({
          componentName: data.componentName,
          jsxCode: data.jsx,
          cssCode: data.css,
          rawFigma: data.rawFigma,
        });
      } catch (err: unknown) {
        console.error('Figma generation error:', err);

        let errorMessage = 'An unexpected error occurred. Please try again.';
        let canRetry = false;

        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            errorMessage =
              'Request timed out. The Figma file might be too large or the server is busy.';
            canRetry = true;
          } else if (
            err.message.includes('fetch') ||
            err.message.includes('network')
          ) {
            errorMessage =
              'Network error: Unable to connect to the server. Please check your connection.';
            canRetry = true;
          } else if (err.message.includes('Invalid Figma API token')) {
            errorMessage =
              'Figma API token is invalid or expired. Please check the server configuration.';
            canRetry = false;
          } else if (err.message.includes('Access denied to Figma file')) {
            errorMessage =
              'Cannot access this Figma file. Make sure it\'s set to "Anyone with the link can view" or check your permissions.';
            canRetry = false;
          } else if (err.message.includes('Rate limit')) {
            errorMessage =
              'Figma API rate limit exceeded. Please wait a moment before trying again.';
            canRetry = false;
          } else if (err.message.includes('not found')) {
            errorMessage =
              'Figma file or node not found. Please check your link is correct.';
            canRetry = false;
          } else if (
            err.message.includes('Mock component generated') ||
            err.message.includes('Fallback component generated')
          ) {
            // These are actually successful responses with fallback content
            setSuccess(err.message);
            return;
          } else if (
            !canRetry &&
            !err.message.includes('Rate limit') &&
            !err.message.includes('Access denied')
          ) {
            errorMessage = err.message;
            canRetry = retryCount < 2; // Allow up to 3 attempts
          }
        }

        setError(errorMessage);

        // Auto-retry for certain types of errors
        if (
          canRetry &&
          retryCount < 2 &&
          (errorMessage.includes('timeout') || errorMessage.includes('network'))
        ) {
          setRetryCount((prev) => prev + 1);
          setTimeout(
            () => {
              handleGenerate(true);
            },
            2000 * (retryCount + 1)
          ); // Exponential backoff
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      figmaLink,
      customColors,
      validateFigmaLink,
      setIsLoading,
      onResumeGenerated,
      retryCount,
    ]
  );

  // Wrapper for button click handler
  const handleGenerateClick = useCallback(() => {
    handleGenerate(false);
  }, [handleGenerate]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        <span style={{ marginRight: '0.5rem' }}>🔗</span> Generate from Figma
        Design
      </h2>

      <div className={styles.inputContainer}>
        <input
          type="url"
          placeholder="https://www.figma.com/file/YOUR_FILE_ID/Your-Design-Name"
          value={figmaLink}
          onChange={(e) => handleLinkChange(e.target.value)}
          className={`${styles.input} ${error ? styles.inputError : ''} ${success ? styles.inputSuccess : ''}`}
          disabled={isLoading}
          aria-describedby={
            error
              ? 'figma-error'
              : validationWarning
                ? 'figma-warning'
                : undefined
          }
        />

        {validationWarning && !error && !success && (
          <div className={styles.warning} id="figma-warning">
            <AlertTriangle
              style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}
            />
            {validationWarning}
          </div>
        )}

        {error && (
          <div className={styles.error} id="figma-error">
            <AlertTriangle
              style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}
            />
            {error}
            {(error.includes('timeout') ||
              error.includes('network') ||
              error.includes('Server error')) &&
              !isLoading && (
                <button
                  type="button"
                  onClick={handleGenerateClick}
                  className={styles.retryButton}
                  disabled={isLoading}
                >
                  Retry
                </button>
              )}
          </div>
        )}

        {success && (
          <div className={styles.success}>
            <CheckCircle
              style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}
            />
            {success}
          </div>
        )}
      </div>

      <div className={styles.actionsRow}>
        <button
          type="button"
          onClick={handleGenerateClick}
          className={styles.generateBtn}
          disabled={isLoading || !figmaLink.trim()}
          aria-label={
            isLoading
              ? 'Generating component...'
              : 'Generate resume component from Figma design'
          }
        >
          {isLoading && (
            <span className={styles.loadingSpinner} aria-hidden="true" />
          )}
          {isLoading
            ? retryCount > 0
              ? `Retrying... (${retryCount}/3)`
              : 'Generating…'
            : 'Generate Resume'}
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
          <strong>Tip:</strong> For best results, select a frame or component
          that represents your complete resume layout. Make sure text layers are
          named descriptively (e.g., "name", "title", "summary", "email").
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
