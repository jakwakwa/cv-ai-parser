import React, { useState } from 'react';
import { AlertTriangle, Palette } from 'lucide-react';
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
  const [customColors, setCustomColors] = useState<Record<string, string>>(resumeColors);
  const [showColorDialog, setShowColorDialog] = useState(false);

  const handleGenerate = async () => {
    if (!figmaLink) {
      setError('Please provide a Figma link.');
      return;
    }

    setIsLoading(true);
    setError('');

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
        <span className="mr-2">🔗</span> Generate from Figma Design
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
          <AlertTriangle className="w-4 h-4 mr-1" /> {error}
        </div>
      )}
      <div className="flex items-center gap-2 mt-4">
        <button type="button" onClick={handleGenerate} className={styles.generateBtn} disabled={isLoading}>
          {isLoading ? 'Generating…' : 'Generate Resume'}
        </button>
        <button
          type="button"
          className="text-teal-600 text-xs hover:text-teal-700 font-medium md:text-sm flex items-center gap-1"
          onClick={() => setShowColorDialog(!showColorDialog)}
        >
          <Palette className="w-4 h-4" /> Colors
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