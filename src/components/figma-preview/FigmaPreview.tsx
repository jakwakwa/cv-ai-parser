"use client";

import React, { useState } from 'react';
import { Eye, FileText, Download, Check } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import styles from './FigmaPreview.module.css';

interface FigmaPreviewProps {
  componentName: string;
  jsxCode: string;
  cssCode: string;
  rawFigma?: unknown;
}

const FigmaPreview: React.FC<FigmaPreviewProps> = ({
  componentName,
  jsxCode,
  cssCode,
  rawFigma
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'jsx' | 'css'>('preview');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          onClick={() => setActiveTab('preview')}
        >
          <Eye className={styles.tabIcon} />
          Preview
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'jsx' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('jsx')}
        >
          <FileText className={styles.tabIcon} />
          JSX
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'css' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('css')}
        >
          <FileText className={styles.tabIcon} />
          CSS
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'preview' && (
          <div className={styles.previewContainer}>
            <div className={styles.previewFrame}>
              <div className={styles.previewPlaceholder}>
                <Eye className={styles.previewIcon} />
                <h4>Component Preview</h4>
                <p>
                  Component saved to <code>src/generated-resumes/</code>
                </p>
                <p className={styles.previewNote}>
                  Open the generated files in your editor to see the actual component.
                  The preview will be available once you import and use the component.
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
                >
                  <Download className={styles.actionIcon} />
                  Download
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
                >
                  <Download className={styles.actionIcon} />
                  Download
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
            <code>{JSON.stringify(rawFigma as any, null, 2)}</code>
          </pre>
        </details>
      )}
    </div>
  );
};

export default FigmaPreview;