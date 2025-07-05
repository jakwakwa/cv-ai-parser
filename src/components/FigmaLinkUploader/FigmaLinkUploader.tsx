import React, { useState } from 'react';
import { AlertTriangle, Palette, CheckCircle } from 'lucide-react';
import { resumeColors } from '@/src/utils/colors';
import ColorPickerDialog from '../color-picker/ColorPickerDialog';
import styles from './FigmaLinkUploader.module.css';

interface Props {
  onResumeGenerated: (params: {
    componentName: string;
    jsxCode: string;
    cssCode: string;
    rawFigma: unknown;
  }) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

const FigmaLinkUploader: React.FC<Props> = ({ onResumeGenerated, isLoading, setIsLoading }) => {
  const [figmaLink, setFigmaLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customColors, setCustomColors] = useState<Record<string, string>>(resumeColors);
  const [showColorDialog, setShowColorDialog] = useState(false);
  
  const isValidFigmaLink = (link: string) => {
    try {
      const url = new URL(link);
      return url.hostname === 'www.figma.com' && url.pathname.includes('/file/');
    } catch {
      return false;
    }
  };

  const handleGenerate = async () => {
    if (!figmaLink) {
      setError('Please provide a Figma link.');
      return;
    }

    if (!isValidFigmaLink(figmaLink)) {
      setError('Please provide a valid Figma link (e.g., https://www.figma.com/file/...)');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/parse-figma-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ figmaLink, customColors }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate code');
      }

      const data = await res.json();
      setSuccess(`Successfully generated ${data.componentName} component!`);
      onResumeGenerated({
        componentName: data.componentName,
        jsxCode: data.jsx,
        cssCode: data.css,
        rawFigma: data.rawFigma,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        <span style={{ marginRight: '0.5rem' }}>🔗</span> Generate from Figma Design
      </h2>
      <input
        type="url"
        placeholder="Paste Figma link to your resume design"
        value={figmaLink}
        onChange={(e) => setFigmaLink(e.target.value)}
        className={styles.input}
      />
      {error && (
        <div className={styles.error}>
          <AlertTriangle style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> {error}
        </div>
      )}
      {success && (
        <div className={styles.success}>
          <CheckCircle style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> {success}
        </div>
      )}
      <div className={styles.actionsRow}>
        <button type="button" onClick={handleGenerate} className={styles.generateBtn} disabled={isLoading}>
          {isLoading ? 'Generating…' : 'Generate Resume'}
        </button>
        <button type="button" className={styles.colorsBtn} onClick={() => setShowColorDialog(!showColorDialog)}>
          <Palette className={styles.colorsIcon} /> Colors
        </button>
      </div>

      <ColorPickerDialog
        open={showColorDialog}
        onOpenChange={setShowColorDialog}
        currentColors={customColors}
        onColorsChange={(c) => setCustomColors(c)}
      />
    </div>
  );
};

export default FigmaLinkUploader;