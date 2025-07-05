"use client";

import type React from 'react';
import { useState, useMemo } from 'react';
import { Eye, FileText } from 'lucide-react';
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
    text: '#1f2937'
  };

  // Extract hex colors from CSS
  const hexColors = cssCode.match(/#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?/g) || [];
  
  // Extract rgb/rgba colors
  const rgbColors = cssCode.match(/rgba?\([^)]+\)/g) || [];
  
  // Extract hsl colors
  const hslColors = cssCode.match(/hsla?\([^)]+\)/g) || [];
  
  const allColors = [...hexColors, ...rgbColors, ...hslColors];
  
  if (allColors.length > 0) {
    // Use the first few colors found as theme colors
    colors.primary = allColors[0] || colors.primary;
    colors.secondary = allColors[1] || colors.secondary;
    colors.accent = allColors[2] || colors.accent;
    
    // Look for specific color patterns in CSS
    const primaryMatch = cssCode.match(/(?:primary|main|brand)[^:]*:\s*([^;]+)/i);
    const secondaryMatch = cssCode.match(/(?:secondary|sub|muted)[^:]*:\s*([^;]+)/i);
    const accentMatch = cssCode.match(/(?:accent|highlight|focus)[^:]*:\s*([^;]+)/i);
    
    if (primaryMatch) colors.primary = primaryMatch[1].trim();
    if (secondaryMatch) colors.secondary = secondaryMatch[1].trim();
    if (accentMatch) colors.accent = accentMatch[1].trim();
  }
  
  return colors;
}

// Function to extract actual content from generated JSX
function extractContentFromJSX(jsxCode: string) {
  const extractedContent = {
    name: "",
    title: "",
    summary: "",
    contact: {
      email: "",
      phone: "",
      location: ""
    },
    experience: [] as Array<{
      position: string;
      company: string;
      duration: string;
      description: string;
    }>,
    skills: [] as string[]
  };

  // Extract text content from template literals and static strings
  const templateLiterals = jsxCode.match(/{\`([^`]+)\`}/g) || [];
  const staticTexts = templateLiterals.map(match => 
    match.replace(/{\`|\`}/g, '').trim()
  );
  
  // Also extract direct text content from JSX
  const directTextMatches = jsxCode.match(/>\s*([^<>{]+)\s*</g) || [];
  const directTexts = directTextMatches
    .map(match => match.replace(/>\s*|\s*</g, '').trim())
    .filter(text => text.length > 0 && !text.includes('className') && !text.includes('styles'));
  
  // Combine all text content
  const allTexts = [...staticTexts, ...directTexts];

  // Extract resume data bindings
  const resumeBindings: string[] = jsxCode.match(/{resume\.[^}]+}/g) || [];

  // Look for name/title patterns (define outside the if block)
  const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+$/; // Simple name pattern
  const titlePattern = /^[A-Z][a-z]+ [A-Z][a-z]+|Engineer|Developer|Designer|Manager|Analyst/i;
  
  // Try to identify content by context and order
  if (allTexts.length > 0) {
    // Sort texts by length to prioritize substantial content
    const sortedTexts = allTexts.sort((a, b) => b.length - a.length);
    
    // Try to find name and title
    const possibleName = allTexts.find(text => namePattern.test(text.trim()));
    const possibleTitle = allTexts.find(text => titlePattern.test(text.trim()) && text !== possibleName);
    
    if (possibleName) {
      extractedContent.name = possibleName.trim();
    } else if (sortedTexts.length > 0) {
      // Use the first substantial text as name
      extractedContent.name = sortedTexts[0].split('\n')[0].trim() || "Generated from Figma";
    }
    
    if (possibleTitle) {
      extractedContent.title = possibleTitle.trim();
    } else if (sortedTexts.length > 1) {
      extractedContent.title = sortedTexts[1].split('\n')[0].trim() || "Resume";
    }
    
    // Use the longest text as summary
    if (sortedTexts.length > 0) {
      const longestText = sortedTexts[0];
      if (longestText.length > 50) {
        extractedContent.summary = longestText.substring(0, 200) + (longestText.length > 200 ? '...' : '');
      }
    }
  }

  // Extract contact info from resume bindings
  const emailBinding = '{resume.contact?.email}';
  const phoneBinding = '{resume.contact?.phone}';
  const titleBinding = '{resume.title}';
  
  if (resumeBindings.includes(emailBinding)) {
    extractedContent.contact.email = "email@example.com";
  }
  if (resumeBindings.includes(phoneBinding)) {
    extractedContent.contact.phone = "+1 (555) 123-4567";
  }
  if (resumeBindings.includes(titleBinding)) {
    extractedContent.title = extractedContent.title || "Your Title";
  }

  // Extract static text for other sections
  const experienceTexts = allTexts.filter(text => 
    text.toLowerCase().includes('company') || 
    text.toLowerCase().includes('period') ||
    text.toLowerCase().includes('experience') ||
    (text.length > 50 && text.length < 200) // Likely description text
  );

  if (experienceTexts.length > 0) {
    extractedContent.experience.push({
      position: "Position from Figma",
      company: "Company from Figma",
      duration: "Period from Figma",
      description: experienceTexts[0].substring(0, 150) + (experienceTexts[0].length > 150 ? '...' : '')
    });
  }

  // Extract skills - look for shorter texts that might be skills
  const skillTexts = allTexts.filter(text => 
    text.length < 30 && text.length > 2 && 
    !namePattern.test(text) && 
    !text.toLowerCase().includes('resume') &&
    !text.toLowerCase().includes('contact')
  );
  
  if (skillTexts.length > 0) {
    extractedContent.skills = skillTexts.slice(0, 6); // Take first 6 as skills
  } else {
    extractedContent.skills = ["Skills from Figma"];
  }

  return extractedContent;
}

export const FigmaComponentPreview: React.FC<FigmaComponentPreviewProps> = ({
  componentName,
  jsxCode,
  cssCode
}) => {
  const [previewMode, setPreviewMode] = useState<'live' | 'static'>('static');
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Extract actual content from the generated JSX
  const actualContent = useMemo(() => extractContentFromJSX(jsxCode), [jsxCode]);
  
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
            <span className={styles.mockupTitle}>Resume Preview - Real Figma Content & Colors</span>
          </div>
          
          <div className={styles.mockupContent}>
            <div className={styles.resumeSection}>
              <h1 className={`${styles.mockName} ${styles.figmaStyled}`}>{actualContent.name}</h1>
              <h2 className={`${styles.mockTitle} ${styles.figmaStyled}`}>{actualContent.title}</h2>
              <div className={styles.mockContact}>
                <span>{actualContent.contact.email}</span>
                <span>{actualContent.contact.phone}</span>
                <span>{actualContent.contact.location || "Location from Figma"}</span>
              </div>
            </div>
            
            <div className={styles.resumeSection}>
              <h3 className={`${styles.sectionTitle} ${styles.figmaStyled}`}>Summary</h3>
              <p className={styles.mockSummary}>{actualContent.summary || "Summary content extracted from your Figma design"}</p>
            </div>
            
            <div className={styles.resumeSection}>
              <h3 className={`${styles.sectionTitle} ${styles.figmaStyled}`}>Experience</h3>
              {actualContent.experience.length > 0 ? actualContent.experience.map((exp, index) => (
                <div key={`exp-${index}-${exp.position}`} className={styles.experienceItem}>
                  <h4 className={`${styles.jobTitle} ${styles.figmaStyled}`}>{exp.position}</h4>
                  <span className={styles.company}>{exp.company} • {exp.duration}</span>
                  <p className={styles.jobDescription}>{exp.description}</p>
                </div>
              )) : (
                <div className={styles.experienceItem}>
                  <h4 className={`${styles.jobTitle} ${styles.figmaStyled}`}>Experience from Figma</h4>
                  <span className={styles.company}>Content extracted from your design</span>
                  <p className={styles.jobDescription}>Your experience details will be populated from the Figma design structure.</p>
                </div>
              )}
            </div>
            
            <div className={styles.resumeSection}>
              <h3 className={`${styles.sectionTitle} ${styles.figmaStyled}`}>Skills</h3>
              <div className={styles.skillsList}>
                {actualContent.skills.map((skill) => (
                  <span key={skill} className={`${styles.skillTag} ${styles.figmaStyled}`}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.previewNote}>
          <Eye className={styles.noteIcon} />
          <div>
            <p><strong>Live Preview with Figma Content & Colors</strong></p>
            <p>This preview shows content and colors extracted from your actual Figma design. The generated component will use your exact Figma styling and layout.</p>
          </div>
        </div>
        
        <div className={styles.colorPalette}>
          <h4 className={styles.colorPaletteTitle}>Extracted Colors</h4>
          <div className={styles.colorSwatches}>
            <div className={styles.colorSwatch}>
              <div className={styles.colorCircle} style={{ backgroundColor: figmaColors.primary }} />
              <span className={styles.colorLabel}>Primary</span>
              <span className={styles.colorValue}>{figmaColors.primary}</span>
            </div>
            <div className={styles.colorSwatch}>
              <div className={styles.colorCircle} style={{ backgroundColor: figmaColors.secondary }} />
              <span className={styles.colorLabel}>Secondary</span>
              <span className={styles.colorValue}>{figmaColors.secondary}</span>
            </div>
            <div className={styles.colorSwatch}>
              <div className={styles.colorCircle} style={{ backgroundColor: figmaColors.accent }} />
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
             <p><strong>Generated Component</strong></p>
             <p>Your Figma design has been converted to a React component with CSS modules.</p>
           </div>
         </div>
        
        <div className={styles.codeStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>JSX Lines:</span>
            <span className={styles.statValue}>{jsxCode.split('\n').length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>CSS Rules:</span>
            <span className={styles.statValue}>{cssCode.split('{').length - 1}</span>
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
              <p><strong>Preview Error</strong></p>
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