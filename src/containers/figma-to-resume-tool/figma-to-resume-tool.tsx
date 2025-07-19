'use client';

import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Palette,
  Plus,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import ColorPickerDialog from '@/src/components/color-picker/color-picker-dialog/color-picker-dialog';
import FigmaPreview from '@/src/components/figma-preview/FigmaPreview';
import { Button } from '@/src/components/ui/ui-button/button';
import { resumeColors } from '@/src/utils/colors';
import styles from './library-tool.module.css';

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
  rawFigma?: Record<string, unknown>;
}

interface FigmaToResumeToolProps {
  onResumeGenerated: (params: FigmaGeneratedComponent) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

interface FigmaLinkValidation {
  isValid: boolean;
  error?: string;
  fileKey?: string;
  nodeId?: string;
}

const FigmaToResumeTool = ({
  onResumeGenerated,
  isLoading,
  setIsLoading,
}: FigmaToResumeToolProps) => {
  const [figmaLink, setFigmaLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationWarning, setValidationWarning] = useState('');
  const [customColors, setCustomColors] =
    useState<Record<string, string>>(resumeColors);
  const [showColorDialog, setShowColorDialog] = useState(false);
  const [generatedComponent, setGeneratedComponent] =
    useState<FigmaGeneratedComponent | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  const handleLinkChange = useCallback((value: string) => {
    setFigmaLink(value);
    setError('');
    setSuccess('');

    if (value.trim() && !value.includes('figma.com')) {
      setValidationWarning('Please enter a valid Figma link');
    } else {
      setValidationWarning('');
    }
  }, []);

  const validateFigmaLink = useCallback((link: string): FigmaLinkValidation => {
    if (!link.trim()) {
      return { isValid: false, error: 'Please provide a Figma link.' };
    }

    try {
      const url = new URL(link.trim());

      if (!['www.figma.com', 'figma.com'].includes(url.hostname)) {
        return {
          isValid: false,
          error: 'Please provide a valid Figma link.',
        };
      }

      const pathParts = url.pathname.split('/');
      const fileSegmentIndex = pathParts.findIndex(
        (segment) => segment === 'file' || segment === 'design'
      );

      if (fileSegmentIndex === -1 || pathParts.length <= fileSegmentIndex + 1) {
        return {
          isValid: false,
          error: 'Invalid Figma link format.',
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
        error: 'Invalid URL format.',
      };
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    setError('');
    setSuccess('');

    const validation = validateFigmaLink(figmaLink);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid Figma link');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/parse-figma-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          figmaLink: figmaLink.trim(),
          customColors,
          fileKey: validation.fileKey,
          nodeId: validation.nodeId,
        }),
      });

      const responseData: FigmaApiResponse | FigmaApiError =
        await response.json();

      if (!response.ok) {
        const errorData = responseData as FigmaApiError;
        throw new Error(errorData.error || 'Failed to generate component');
      }

      const data = responseData as FigmaApiResponse;

      if (!data.jsx || !data.css || !data.componentName) {
        throw new Error('Invalid response: Missing required component data');
      }

      const component: FigmaGeneratedComponent = {
        componentName: data.componentName,
        jsxCode: data.jsx,
        cssCode: data.css,
        rawFigma: data.rawFigma,
      };

      setSuccess(`Successfully generated ${data.componentName} component!`);
      setGeneratedComponent(component);
      onResumeGenerated(component);
    } catch (err: unknown) {
      console.error('Figma generation error:', err);
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [
    figmaLink,
    customColors,
    validateFigmaLink,
    setIsLoading,
    onResumeGenerated,
  ]);

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingCard}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingTitle}>
            Generating your resume component...
          </p>
          <p className={styles.loadingSubtitle}>
            Extracting design elements from Figma
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        <div className={styles.inputCard}>
          <div className={styles.inputHeader}>
            <FileText className={styles.figmaIcon} />
            <h2 className={styles.inputTitle}>Figma Design Link</h2>
          </div>

          <div className={styles.inputWrapper}>
            <div className={styles.inputGroup}>
              <ArrowRight className={styles.inputIcon} />
              <input
                type="url"
                placeholder="https://www.figma.com/file/YOUR_FILE_ID/Your-Design-Name"
                value={figmaLink}
                onChange={(e) => handleLinkChange(e.target.value)}
                className={styles.input}
                disabled={isLoading}
              />
            </div>

            {validationWarning && !error && !success && (
              <div className={styles.warning}>
                <AlertTriangle size={16} />
                {validationWarning}
              </div>
            )}

            {error && (
              <div className={styles.error}>
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div className={styles.success}>
                <CheckCircle size={16} />
                {success}
              </div>
            )}
          </div>

          <div className={styles.helpSection}>
            <h3 className={styles.helpTitle}>How to get your Figma link:</h3>
            <ol className={styles.helpList}>
              <li>Open your resume design in Figma</li>
              <li>Select the frame or component containing your resume</li>
              <li>Click "Share" in the top-right corner</li>
              <li>Set permission to "Anyone with the link can view"</li>
              <li>Copy and paste the link here</li>
            </ol>
          </div>
        </div>

        <div className={styles.customizationCard}>
          <button
            type="button"
            className={styles.colorButton}
            onClick={() => setShowColorDialog(true)}
            disabled={isLoading}
          >
            <Palette size={20} />
            Customize Colors
          </button>

          <p className={styles.colorHint}>
            Choose colors to match your personal brand
          </p>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading || !figmaLink.trim()}
          className={styles.generateButton}
          size="lg"
        >
          <Plus size={20} />
          Generate Resume Component
        </Button>
      </div>

      {generatedComponent && (
        <div className={styles.resultsSection}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>Generated Component</h2>
            <div className={styles.viewToggle}>
              <button
                type="button"
                className={`${styles.viewButton} ${showPreview ? styles.viewButtonActive : ''}`}
                onClick={() => setShowPreview(true)}
              >
                <Eye size={16} />
                Preview
              </button>
              <button
                type="button"
                className={`${styles.viewButton} ${!showPreview ? styles.viewButtonActive : ''}`}
                onClick={() => setShowPreview(false)}
              >
                <FileText size={16} />
                Code
              </button>
            </div>
          </div>

          {showPreview ? (
            <div className={styles.previewContainer}>
              <FigmaPreview
                componentName={generatedComponent.componentName}
                jsxCode={generatedComponent.jsxCode}
                cssCode={generatedComponent.cssCode}
              />
            </div>
          ) : (
            <div className={styles.codeContainer}>
              <div className={styles.codeSection}>
                <h3 className={styles.codeTitle}>React Component (TSX)</h3>
                <pre className={styles.codeBlock}>
                  <code>{generatedComponent.jsxCode}</code>
                </pre>
              </div>

              <div className={styles.codeSection}>
                <h3 className={styles.codeTitle}>CSS Module</h3>
                <pre className={styles.codeBlock}>
                  <code>{generatedComponent.cssCode}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      <ColorPickerDialog
        open={showColorDialog}
        onOpenChange={setShowColorDialog}
        currentColors={customColors}
        onColorsChange={setCustomColors}
      />
    </div>
  );
};

export default FigmaToResumeTool;
