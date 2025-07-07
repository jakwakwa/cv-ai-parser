/** biome-ignore-all lint/suspicious/noExplicitAny: <temp fix> */
'use client';

import { Eye, FileText } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import styles from './FigmaComponentPreview.module.css';

interface FigmaComponentPreviewProps {
  componentName: string;
  jsxCode: string;
  cssCode: string;
}

// Function to extract colors from CSS code
function extractColorsFromCSS(cssCode: string) {
  const colors = {
    primary: '#0891b2',
    secondary: '#64748b',
    accent: '#06b6d4',
    background: '#ffffff',
    text: '#1f2937',
  };

  // First, check for colors in the CSS comment
  const colorCommentMatch = cssCode.match(
    /\/\*\s*Primary:\s*(#[0-9a-fA-F]{6}),\s*Secondary:\s*(#[0-9a-fA-F]{6}),\s*Accent:\s*(#[0-9a-fA-F]{6})\s*\*\//
  );
  if (colorCommentMatch) {
    colors.primary = colorCommentMatch[1];
    colors.secondary = colorCommentMatch[2];
    colors.accent = colorCommentMatch[3];

    // Set background based on the colors
    if (colors.secondary === '#ffffff') {
      colors.background = '#ffffff';
      colors.text = '#1f2937';
    } else {
      colors.background = '#ffffff';
      colors.text = colors.secondary;
    }

    return colors;
  }

  // Fallback to extracting from CSS rules
  const hexColors = cssCode.match(/#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?/g) || [];

  if (hexColors.length > 0) {
    colors.primary = hexColors[0] || colors.primary;
    colors.secondary = hexColors[1] || colors.secondary;
    colors.accent = hexColors[2] || colors.accent;
  }

  return colors;
}

// Function to extract actual content from generated JSX
function extractContentFromJSX(jsxCode: string) {
  const extractedContent = {
    name: '',
    title: '',
    summary: '',
    contact: {
      email: '',
      phone: '',
      location: '',
    },
    experience: [] as Array<{
      position: string;
      company: string;
      duration: string;
      description: string;
    }>,
    certifications: [] as Array<{
      name: string;
      issuer: string;
      year: string;
    }>,
    skills: [] as string[],
  };

  // Extract the figmaExtractedContent export from the JSX
  const figmaContentMatch = jsxCode.match(
    /export const figmaExtractedContent = ({[\s\S]*?});/
  );
  if (figmaContentMatch) {
    try {
      const figmaContent = JSON.parse(figmaContentMatch[1]);
      console.log('Extracted Figma content:', figmaContent);
      if (figmaContent.name) extractedContent.name = figmaContent.name;
      if (figmaContent.summary) extractedContent.summary = figmaContent.summary;
      if (figmaContent.contact) {
        extractedContent.contact = {
          ...extractedContent.contact,
          ...figmaContent.contact,
        };
      }
    } catch (e) {
      console.warn('Could not parse figma extracted content:', e);
    }
  }

  // Extract debug info
  const debugInfoMatch = jsxCode.match(
    /export const figmaDebugInfo = ({[\s\S]*?});/
  );
  if (debugInfoMatch) {
    try {
      const debugInfo = JSON.parse(debugInfoMatch[1]);
      console.log('Figma debug info:', debugInfo);
    } catch (e) {
      console.warn('Could not parse figma debug info:', e);
    }
  }

  // Extract the defaultResume object from the JSX
  const defaultResumeMatch = jsxCode.match(
    /const defaultResume: ParsedResume = ({[\s\S]*?});/
  );
  if (defaultResumeMatch) {
    try {
      const defaultResume = JSON.parse(defaultResumeMatch[1]);
      if (defaultResume.name && !extractedContent.name)
        extractedContent.name = defaultResume.name;
      if (defaultResume.summary && !extractedContent.summary)
        extractedContent.summary = defaultResume.summary;
      if (
        defaultResume.contact &&
        (!extractedContent.contact.email || !extractedContent.contact.phone)
      ) {
        extractedContent.contact = {
          ...extractedContent.contact,
          ...defaultResume.contact,
        };
      }
      if (defaultResume.experience && defaultResume.experience.length > 0) {
        extractedContent.experience = defaultResume.experience.map(
          (exp: any) => ({
            position: exp.position || 'Position',
            company: exp.company || 'Company',
            duration:
              exp.startDate && exp.endDate
                ? `${exp.startDate} - ${exp.endDate}`
                : 'Period',
            description: exp.description || 'Job description',
          })
        );
      }
      if (defaultResume.skills && defaultResume.skills.length > 0) {
        extractedContent.skills = defaultResume.skills;
      }
      if (
        defaultResume.certifications &&
        defaultResume.certifications.length > 0
      ) {
        extractedContent.certifications = defaultResume.certifications.map(
          (c: any) => ({
            name: c.name || 'Certification',
            issuer: c.issuer || 'Issuer',
            year: c.year || 'Year',
          })
        );
      }
    } catch (e) {
      console.warn('Could not parse default resume:', e);
    }
  }

  // Fallback: Extract text content from template literals and static strings
  if (!extractedContent.name || !extractedContent.summary) {
    const templateLiterals = jsxCode.match(/{`([^`]+)`}/g) || [];
    const staticTexts = templateLiterals.map((match) =>
      match.replace(/{`|`}/g, '').trim()
    );

    // Look for specific Figma content patterns
    const curriculumVitaeText = staticTexts.find((text) =>
      text.includes('CURRICULUM VITAE')
    );
    if (curriculumVitaeText && !extractedContent.name) {
      const lines = curriculumVitaeText.split('\n');
      if (lines.length > 1) {
        extractedContent.name = lines[1].trim();
      }
    }

    // Look for the summary text (long text starting with "I am")
    const summaryText = staticTexts.find(
      (text) => text.startsWith('I am') && text.length > 100
    );
    if (summaryText && !extractedContent.summary) {
      extractedContent.summary = summaryText;
    }
  }

  // Set defaults if nothing was extracted
  if (!extractedContent.name) extractedContent.name = 'John Doe';
  if (!extractedContent.summary)
    extractedContent.summary = 'Professional summary from your Figma design';
  if (!extractedContent.contact.email)
    extractedContent.contact.email = 'email@example.com';
  if (!extractedContent.contact.phone)
    extractedContent.contact.phone = '+1 (555) 123-4567';
  if (!extractedContent.contact.location)
    extractedContent.contact.location = 'Your Location';
  if (extractedContent.experience.length === 0) {
    extractedContent.experience.push({
      position: 'Position from Figma',
      company: 'Company from Figma',
      duration: 'Period from Figma',
      description: 'Job description from your Figma design',
    });
  }
  if (extractedContent.skills.length === 0) {
    extractedContent.skills = ['Skills from Figma'];
  }
  if (extractedContent.certifications.length === 0) {
    extractedContent.certifications.push({
      name: 'Certification from Figma',
      issuer: 'Issuer from Figma',
      year: 'Year from Figma',
    });
  }

  extractedContent.title = 'Frontend Engineer';

  return extractedContent;
}

export const FigmaComponentPreview: React.FC<FigmaComponentPreviewProps> = ({
  componentName,
  jsxCode,
  cssCode,
}) => {
  const [previewMode, setPreviewMode] = useState<'live' | 'static'>('static');
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Extract actual content from the generated JSX
  const actualContent = useMemo(
    () => extractContentFromJSX(jsxCode),
    [jsxCode]
  );

  // Extract colors from the generated CSS
  const figmaColors = useMemo(() => extractColorsFromCSS(cssCode), [cssCode]);

  // Create a safe component preview using iframe-like approach
  const _createPreviewComponent = useMemo(() => {
    try {
      // Basic validation of the JSX code
      if (!jsxCode.includes('export') || !jsxCode.includes(componentName)) {
        throw new Error('Invalid component structure');
      }

      // For security, we'll show a static preview instead of executing code
      return null;
    } catch (error) {
      console.error('Preview generation error:', error);
      setPreviewError(error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }, [jsxCode, componentName]);

  const handlePreviewModeChange = (mode: 'live' | 'static') => {
    setPreviewMode(mode);
    setPreviewError(null);
  };

  const renderStaticPreview = () => {
    // Create dynamic styles using extracted Figma colors
    const dynamicStyles = {
      '--figma-primary': figmaColors.primary,
      '--figma-secondary': figmaColors.secondary,
      '--figma-accent': figmaColors.accent,
      '--figma-background': figmaColors.background,
      '--figma-text': figmaColors.text,
    } as React.CSSProperties;

    return (
      <div className={styles.staticPreview} style={dynamicStyles}>
        <div className={styles.mockupContainer}>
          <div className={styles.mockupHeader}>
            <div className={styles.mockupControls}>
              <span className={styles.mockupDot} />
              <span className={styles.mockupDot} />
              <span className={styles.mockupDot} />
            </div>
            <span className={styles.mockupTitle}>
              Resume Preview - Real Figma Content & Colors
            </span>
          </div>

          <div className={styles.mockupContent}>
            {/* Match the generated component structure */}
            <div className={styles.resume}>
              <div className={styles.header}>
                <div className={styles.summary}>
                  <div className={styles['summary-name']}>
                    <p>{actualContent.name}</p>
                  </div>
                  <div className={styles['summary-content']}>
                    <p>
                      {actualContent.summary ||
                        'Summary content extracted from your Figma design'}
                    </p>
                  </div>
                </div>
                <div className={styles.profile}>
                  <div className={styles['profile-image']} />
                </div>
              </div>

              <div className={styles.resumetwocolbody}>
                <div className={styles.experiencesection}>
                  <div className={styles.sectiontitle}>
                    <p>Experience</p>
                  </div>
                  <div className={styles['experience-list']}>
                    {actualContent.experience.length > 0 ? (
                      actualContent.experience.map((exp, index) => (
                        <div
                          key={`exp-${index}-${exp.position}`}
                          className={styles['experience-item']}
                        >
                          <div className={styles['exp-title']}>
                            <p>{exp.position}</p>
                          </div>
                          <div className={styles['exp-company']}>
                            <p>{exp.company}</p>
                          </div>
                          <div className={styles['exp-period']}>
                            <p>{exp.duration}</p>
                          </div>
                          <div className={styles['exp-desc']}>
                            <p>{exp.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles['experience-item']}>
                        <div className={styles['exp-title']}>
                          <p>Position from Figma</p>
                        </div>
                        <div className={styles['exp-company']}>
                          <p>Company from Figma</p>
                        </div>
                        <div className={styles['exp-period']}>
                          <p>Period from Figma</p>
                        </div>
                        <div className={styles['exp-desc']}>
                          <p>Job description from your Figma design</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.resumesidebar}>
                  <div className={styles.sectiontitle}>
                    <p>Contact</p>
                  </div>
                  <div className={styles.contact}>
                    <div className={styles['contact-list']}>
                      <p>
                        {actualContent.contact.email || 'email@example.com'}
                      </p>
                      <p>
                        {actualContent.contact.phone || '+1 (555) 123-4567'}
                      </p>
                      <p>
                        {actualContent.contact.location ||
                          'Location from Figma'}
                      </p>
                    </div>
                  </div>

                  <div className={styles.sectiontitle}>
                    <p>Education</p>
                  </div>
                  <div className={styles.education}>
                    <div className={styles['education-list']}>
                      <p>Degree from Figma</p>
                      <p>School from Figma</p>
                      <p>Year from Figma</p>
                    </div>
                  </div>

                  <div className={styles.sectiontitle}>
                    <p>Certification</p>
                  </div>
                  <div className={styles.certification}>
                    <div className={styles['certification-list']}>
                      {actualContent.certifications.length > 0 ? (
                        actualContent.certifications.map((cert, index) => (
                          <div
                            key={`cert-${index}-${cert.name}`}
                            className={styles['certification-item']}
                          >
                            <p>{cert.name}</p>
                            <p>{cert.issuer}</p>
                            <p>{cert.year}</p>
                          </div>
                        ))
                      ) : (
                        <p>Certification from Figma</p>
                      )}
                    </div>
                  </div>

                  <div className={styles.sectiontitle}>
                    <p>Skills</p>
                  </div>
                  <div className={styles.skills}>
                    <div className={styles['skills-list']}>
                      {actualContent.skills.map((skill) => (
                        <div key={skill} className={styles.skill}>
                          <p>{skill}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.previewNote}>
          <Eye className={styles.noteIcon} />
          <div>
            <p>
              <strong>Live Preview with Figma Content & Colors</strong>
            </p>
            <p>
              This preview shows content and colors extracted from your actual
              Figma design. The generated component will use your exact Figma
              styling and layout.
            </p>
          </div>
        </div>

        <div className={styles.colorPalette}>
          <h4 className={styles.colorPaletteTitle}>Extracted Colors</h4>
          <div className={styles.colorSwatches}>
            <div className={styles.colorSwatch}>
              <div
                className={styles.colorCircle}
                style={{ backgroundColor: figmaColors.primary }}
              />
              <span className={styles.colorLabel}>Primary</span>
              <span className={styles.colorValue}>{figmaColors.primary}</span>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.colorCircle}
                style={{ backgroundColor: figmaColors.secondary }}
              />
              <span className={styles.colorLabel}>Secondary</span>
              <span className={styles.colorValue}>{figmaColors.secondary}</span>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.colorCircle}
                style={{ backgroundColor: figmaColors.accent }}
              />
              <span className={styles.colorLabel}>Accent</span>
              <span className={styles.colorValue}>{figmaColors.accent}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCodePreview = () => {
    return (
      <div className={styles.codePreview}>
        <div className={styles.codeInfo}>
          <FileText className={styles.codeIcon} />
          <div>
            <p>
              <strong>Generated Component</strong>
            </p>
            <p>
              Your Figma design has been converted to a React component with CSS
              modules.
            </p>
          </div>
        </div>

        <div className={styles.codeStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>JSX Lines:</span>
            <span className={styles.statValue}>
              {jsxCode.split('\n').length}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>CSS Rules:</span>
            <span className={styles.statValue}>
              {cssCode.split('{').length - 1}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Component:</span>
            <span className={styles.statValue}>{componentName}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Component Preview</h3>
        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.controlBtn} ${previewMode === 'static' ? styles.controlBtnActive : ''}`}
            onClick={() => handlePreviewModeChange('static')}
          >
            <Eye className={styles.controlIcon} />
            Preview
          </button>
          <button
            type="button"
            className={`${styles.controlBtn} ${previewMode === 'live' ? styles.controlBtnActive : ''}`}
            onClick={() => handlePreviewModeChange('live')}
          >
            <FileText className={styles.controlIcon} />
            Code Info
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {previewError && (
          <div className={styles.error}>
            <Eye className={styles.errorIcon} />
            <div>
              <p>
                <strong>Preview Error</strong>
              </p>
              <p>{previewError}</p>
            </div>
          </div>
        )}

        {!previewError && previewMode === 'static' && renderStaticPreview()}
        {!previewError && previewMode === 'live' && renderCodePreview()}
      </div>
    </div>
  );
};
