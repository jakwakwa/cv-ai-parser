"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { ParsedResumeSchema } from "@/lib/tools-lib/shared-parsed-resume-schema";
import ResumeDisplay from "@/src/containers/resume-display/resume-display";
import {
  ResumeTemplate1,
  ResumeTemplate2,
  ResumeTemplate3,
  TemplateSelector,
} from "@/src/containers/resume-templates";

/**
 * Example Usage Component
 *
 * This component demonstrates how to integrate the resume templates
 * with a template selector into your application.
 *
 * You can drop this into any page that displays resumes (Resume Builder,
 * Resume Tailor, etc.)
 */

interface ExampleResumeDisplayProps {
  resumeData: ParsedResumeSchema;
  isAuth: boolean;
}

const ExampleResumeDisplay: React.FC<ExampleResumeDisplayProps> = ({
  resumeData,
  isAuth,
}) => {
  // State for selected template
  const [selectedTemplate, setSelectedTemplate] = useState<string>("original");

  // Load saved preference from localStorage on mount
  useEffect(() => {
    const savedTemplate = localStorage.getItem("userResumeTemplate");
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }
  }, []);

  // Save preference to localStorage when it changes
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    localStorage.setItem("userResumeTemplate", templateId);
  };

  // Render the appropriate template based on selection
  const renderResumeTemplate = () => {
    switch (selectedTemplate) {
      case "template-1":
        return <ResumeTemplate1 resumeData={resumeData} isAuth={isAuth} />;
      case "template-2":
        return <ResumeTemplate2 resumeData={resumeData} isAuth={isAuth} />;
      case "template-3":
        return <ResumeTemplate3 resumeData={resumeData} isAuth={isAuth} />;
      case "original":
      default:
        return <ResumeDisplay resumeData={resumeData} isAuth={isAuth} />;
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      {/* Template Selector UI */}
      <TemplateSelector
        selectedTemplate={selectedTemplate}
        onTemplateChange={handleTemplateChange}
      />

      {/* Resume Display with Selected Template */}
      <div style={{ marginTop: "2rem" }}>
        {renderResumeTemplate()}
      </div>

      {/* Optional: Show current selection for debugging */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            background: "#f0f0f0",
            borderRadius: "8px",
            fontSize: "0.9rem",
          }}
        >
          <strong>Current Template:</strong> {selectedTemplate}
        </div>
      )}
    </div>
  );
};

export default ExampleResumeDisplay;

/**
 * ALTERNATIVE APPROACH: Using a Map for Template Components
 *
 * This approach is more scalable if you have many templates
 */

export const ExampleResumeDisplayWithMap: React.FC<ExampleResumeDisplayProps> = ({
  resumeData,
  isAuth,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("original");

  // Map of template IDs to components
  const templateComponents = {
    original: ResumeDisplay,
    "template-1": ResumeTemplate1,
    "template-2": ResumeTemplate2,
    "template-3": ResumeTemplate3,
  };

  // Get the selected component
  const SelectedComponent =
    templateComponents[selectedTemplate as keyof typeof templateComponents] ||
    ResumeDisplay;

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    localStorage.setItem("userResumeTemplate", templateId);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <TemplateSelector
        selectedTemplate={selectedTemplate}
        onTemplateChange={handleTemplateChange}
      />

      <div style={{ marginTop: "2rem" }}>
        <SelectedComponent resumeData={resumeData} isAuth={isAuth} />
      </div>
    </div>
  );
};

/**
 * INTEGRATION EXAMPLE: For Resume Builder Page
 *
 * Replace your existing resume display with this pattern:
 */

// Before:
// <ResumeDisplay resumeData={resumeData} isAuth={isAuth} />

// After:
// <ExampleResumeDisplay resumeData={resumeData} isAuth={isAuth} />

/**
 * INTEGRATION EXAMPLE: For Resume Tailor Page
 *
 * Same replacement pattern:
 */

// Before:
// <ResumeDisplay resumeData={tailoredResume} isAuth={isAuth} />

// After:
// <ExampleResumeDisplay resumeData={tailoredResume} isAuth={isAuth} />

/**
 * CUSTOMIZATION OPTIONS:
 *
 * 1. Add template preference to user profile in database
 * 2. Add preview thumbnails to template selector
 * 3. Add animation when switching templates
 * 4. Add ability to compare templates side-by-side
 * 5. Add template-specific PDF export options
 */
