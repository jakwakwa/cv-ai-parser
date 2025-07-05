"use client";

import type React from 'react';
import { useState, useCallback } from 'react';
import { Eye, FileText, Download, Check } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import styles from './FigmaPreview.module.css';

interface FigmaPreviewProps {
  componentName: string;
  jsxCode: string;
  cssCode: string;
  rawFigma?: Record<string, unknown>;
}

type TabType = 'preview' | 'jsx' | 'css';

const FigmaPreview: React.FC<FigmaPreviewProps> = ({
  componentName,
  jsxCode,
  cssCode,
  rawFigma
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('preview');
  const [copied, setCopied] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  // Validate props after hooks
  const hasValidData = componentName && jsxCode && cssCode;

  const handleCopy = useCallback(async (content: string, type: string) => {
    if (!content.trim()) {
      setCopyError('No content to copy');
      setTimeout(() => setCopyError(null), 3000);
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      setCopyError(null);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyError('Failed to copy to clipboard');
      setTimeout(() => setCopyError(null), 3000);
    }
  }, []);

  const handleDownload = useCallback(async (content: string, filename: string) => {
    if (!content.trim()) {
      setCopyError('No content to download');
      setTimeout(() => setCopyError(null), 3000);
      return;
    }

    setIsDownloading(filename);
    setCopyError(null);

    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download:', err);
      setCopyError('Failed to download file');
      setTimeout(() => setCopyError(null), 3000);
    } finally {
      setIsDownloading(null);
    }
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setCopyError(null);
  }, []);

  if (!hasValidData) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Error: Invalid Component Data</h3>
          <p className={styles.subtitle}>
            Missing required component information. Please try generating the component again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Generated Component: {componentName}</h3>
        <p className={styles.subtitle}>
          Preview and download your generated resume component
        </p>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'preview' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('preview')}
          aria-label="View component preview"
        >
          <Eye className={styles.tabIcon} />
          Preview
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'jsx' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('jsx')}
          aria-label="View JSX code"
        >
          <FileText className={styles.tabIcon} />
          JSX
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'css' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('css')}
          aria-label="View CSS code"
        >
          <FileText className={styles.tabIcon} />
          CSS
        </button>
      </div>

      {copyError && (
        <div className={styles.errorMessage}>
          {copyError}
        </div>
      )}

      <div className={styles.content}>
        {activeTab === 'preview' && (
          <div className={styles.previewContainer}>
            <div className={styles.previewFrame}>
              <div className={styles.previewPlaceholder}>
                <Eye className={styles.previewIcon} />
                <h4>Component Preview</h4>
                <p>
                  Component <strong>{componentName}</strong> saved to <code>src/generated-resumes/</code>
                </p>
                <div className={styles.fileList}>
                  <div className={styles.fileItem}>
                    <FileText className={styles.fileIcon} />
                    <code>{componentName}.tsx</code>
                    <span className={styles.fileSize}>({jsxCode.length} chars)</span>
                  </div>
                  <div className={styles.fileItem}>
                    <FileText className={styles.fileIcon} />
                    <code>{componentName}.module.css</code>
                    <span className={styles.fileSize}>({cssCode.length} chars)</span>
                  </div>
                </div>
                <p className={styles.previewNote}>
                  Open the generated files in your editor to see the actual component.
                  The preview will be available once you import and use the component in your app.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jsx' && (
          <div className={styles.codeContainer}>
            <div className={styles.codeHeader}>
              <span className={styles.codeTitle}>{componentName}.tsx</span>
              <div className={styles.codeActions}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(jsxCode, 'jsx')}
                  className={styles.actionButton}
                >
                  {copied === 'jsx' ? <Check className={styles.actionIcon} /> : <FileText className={styles.actionIcon} />}
                  {copied === 'jsx' ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(jsxCode, `${componentName}.tsx`)}
                  className={styles.actionButton}
                  disabled={isDownloading === `${componentName}.tsx`}
                >
                  <Download className={styles.actionIcon} />
                  {isDownloading === `${componentName}.tsx` ? 'Downloading...' : 'Download'}
                </Button>
              </div>
            </div>
            <pre className={styles.codeBlock}>
              <code>{jsxCode}</code>
            </pre>
          </div>
        )}

        {activeTab === 'css' && (
          <div className={styles.codeContainer}>
            <div className={styles.codeHeader}>
              <span className={styles.codeTitle}>{componentName}.module.css</span>
              <div className={styles.codeActions}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(cssCode, 'css')}
                  className={styles.actionButton}
                >
                  {copied === 'css' ? <Check className={styles.actionIcon} /> : <FileText className={styles.actionIcon} />}
                  {copied === 'css' ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(cssCode, `${componentName}.module.css`)}
                  className={styles.actionButton}
                  disabled={isDownloading === `${componentName}.module.css`}
                >
                  <Download className={styles.actionIcon} />
                  {isDownloading === `${componentName}.module.css` ? 'Downloading...' : 'Download'}
                </Button>
              </div>
            </div>
            <pre className={styles.codeBlock}>
              <code>{cssCode}</code>
            </pre>
          </div>
        )}
      </div>

      {rawFigma && (
        <details className={styles.rawData}>
          <summary className={styles.rawDataSummary}>
            View Raw Figma Data (Debug)
          </summary>
          <pre className={styles.rawDataContent}>
            <code>{JSON.stringify(rawFigma, null, 2)}</code>
          </pre>
        </details>
      )}
    </div>
  );
};

export default FigmaPreview;