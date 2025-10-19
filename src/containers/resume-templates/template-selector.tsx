"use client";

import React from "react";
import styles from "./template-selector.module.css";
import { templateMetadata } from "./index";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
}) => {
  const allTemplates = [
    {
      id: "original",
      name: "Original",
      description: "Default two-column layout with sidebar",
      component: "ResumeDisplay",
    },
    ...templateMetadata,
  ];

  return (
    <div className={styles.templateSelector}>
      <h3 className={styles.selectorTitle}>Choose Resume Template</h3>
      <p className={styles.selectorDescription}>
        Select a template to change how your resume is displayed. All templates
        use your data and colors.
      </p>

      <div className={styles.templateGrid}>
        {allTemplates.map((template) => {
          const isSelected = selectedTemplate === template.id;

          return (
            <button
              key={template.id}
              onClick={() => onTemplateChange(template.id)}
              className={`${styles.templateCard} ${
                isSelected ? styles.templateCardSelected : ""
              }`}
              aria-pressed={isSelected}
            >
              <div className={styles.templatePreview}>
                {template.id === "original" && (
                  <div className={styles.previewOriginal}>
                    <div className={styles.previewSidebar}></div>
                    <div className={styles.previewMain}>
                      <div className={styles.previewLine}></div>
                      <div className={styles.previewLine}></div>
                      <div className={styles.previewLine}></div>
                    </div>
                  </div>
                )}
                {template.id === "template-1" && (
                  <div className={styles.previewTemplate1}>
                    <div className={styles.previewSidebarLeft}>
                      <div className={styles.previewCircle}></div>
                      <div className={styles.previewSmallLine}></div>
                      <div className={styles.previewSmallLine}></div>
                    </div>
                    <div className={styles.previewMain}>
                      <div className={styles.previewLine}></div>
                      <div className={styles.previewLine}></div>
                      <div className={styles.previewLine}></div>
                    </div>
                  </div>
                )}
                {template.id === "template-2" && (
                  <div className={styles.previewTemplate2}>
                    <div className={styles.previewHeader}>
                      <div className={styles.previewSmallLine}></div>
                    </div>
                    <div className={styles.previewBody}>
                      <div className={styles.previewLine}></div>
                      <div className={styles.previewLine}></div>
                      <div className={styles.previewTimelineDot}></div>
                    </div>
                  </div>
                )}
                {template.id === "template-3" && (
                  <div className={styles.previewTemplate3}>
                    <div className={styles.previewHeaderCentered}>
                      <div className={styles.previewCircleSmall}></div>
                      <div className={styles.previewSmallLine}></div>
                    </div>
                    <div className={styles.previewBody}>
                      <div className={styles.previewLine}></div>
                      <div className={styles.previewLine}></div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.templateInfo}>
                <h4 className={styles.templateName}>
                  {template.name}
                  {isSelected && (
                    <span className={styles.selectedBadge}>✓</span>
                  )}
                </h4>
                <p className={styles.templateDescription}>
                  {template.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
