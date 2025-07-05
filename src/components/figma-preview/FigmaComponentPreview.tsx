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

// Mock resume data for preview
const mockResumeData = {
  name: "John Doe",
  title: "Senior Software Engineer",
  summary: "Experienced software engineer with 8+ years in full-stack development, specializing in React, Node.js, and cloud technologies.",
  contact: {
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    linkedin: "https://linkedin.com/in/johndoe"
  },
  experience: [
    {
      position: "Senior Software Engineer",
      company: "Tech Corp",
      duration: "2020 - Present",
      description: "Led development of microservices architecture, improving system performance by 40%."
    },
    {
      position: "Software Engineer",
      company: "StartupXYZ",
      duration: "2018 - 2020",
      description: "Built scalable web applications using React and Node.js."
    }
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Technology",
      year: "2018"
    }
  ],
  skills: [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker", "Kubernetes"
  ],
  customColors: {
    primary: "#0891b2",
    secondary: "#64748b",
    accent: "#06b6d4",
    background: "#ffffff",
    text: "#1f2937"
  }
};

export const FigmaComponentPreview: React.FC<FigmaComponentPreviewProps> = ({
  componentName,
  jsxCode,
  cssCode
}) => {
  const [previewMode, setPreviewMode] = useState<'live' | 'static'>('static');
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Create a safe component preview using iframe-like approach
  const createPreviewComponent = useMemo(() => {
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
    return (
      <div className={styles.staticPreview}>
        <div className={styles.mockupContainer}>
          <div className={styles.mockupHeader}>
            <div className={styles.mockupControls}>
                             <span className={styles.mockupDot} />
               <span className={styles.mockupDot} />
               <span className={styles.mockupDot} />
            </div>
            <span className={styles.mockupTitle}>Resume Preview</span>
          </div>
          
          <div className={styles.mockupContent}>
            <div className={styles.resumeSection}>
              <h1 className={styles.mockName}>{mockResumeData.name}</h1>
              <h2 className={styles.mockTitle}>{mockResumeData.title}</h2>
              <div className={styles.mockContact}>
                <span>{mockResumeData.contact.email}</span>
                <span>{mockResumeData.contact.phone}</span>
                <span>{mockResumeData.contact.location}</span>
              </div>
            </div>
            
            <div className={styles.resumeSection}>
              <h3 className={styles.sectionTitle}>Summary</h3>
              <p className={styles.mockSummary}>{mockResumeData.summary}</p>
            </div>
            
            <div className={styles.resumeSection}>
              <h3 className={styles.sectionTitle}>Experience</h3>
                           {mockResumeData.experience.map((exp) => (
               <div key={`${exp.company}-${exp.position}`} className={styles.experienceItem}>
                  <h4 className={styles.jobTitle}>{exp.position}</h4>
                  <span className={styles.company}>{exp.company} • {exp.duration}</span>
                  <p className={styles.jobDescription}>{exp.description}</p>
                </div>
              ))}
            </div>
            
            <div className={styles.resumeSection}>
              <h3 className={styles.sectionTitle}>Skills</h3>
              <div className={styles.skillsList}>
                               {mockResumeData.skills.map((skill) => (
                 <span key={skill} className={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.previewNote}>
          <Eye className={styles.noteIcon} />
          <div>
            <p><strong>Static Preview</strong></p>
            <p>This shows how your resume data will be displayed. The actual component uses your Figma design styling.</p>
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