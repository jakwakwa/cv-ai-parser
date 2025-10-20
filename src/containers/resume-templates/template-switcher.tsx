"use client";

import type React from "react";
import styles from "./template-switcher.module.css";
import { useTemplate } from "@/src/stores/template-context";

/**
 * TemplateSwitcher
 *
 * A vertical template selector for the resume display view that:
 * - Allows users to switch templates in REAL-TIME after resume generation
 * - Positioned on the side of the resume display
 * - Vertical/column layout (unlike the horizontal picker in the form)
 * - Syncs with TemplatePicker via Context
 * - Shows visual previews in a compact vertical format
 */
const TemplateSwitcher: React.FC = () => {
    const { selectedTemplate, setSelectedTemplate } = useTemplate();

    const templates = [
        {
            id: "original",
            name: "Original",
            shortName: "Original",
        },
        {
            id: "template-1",
            name: "Modern Two-Column",
            shortName: "Modern",
        },
        {
            id: "template-2",
            name: "Timeline Vertical",
            shortName: "Timeline",
        },
        {
            id: "template-3",
            name: "Classic Centered",
            shortName: "Classic",
        },
    ];

    return (
        <div className={styles.templateSwitcher}>
            <div className={styles.switcherHeader}>
                <h4 className={styles.switcherTitle}>Templates</h4>
            </div>

            <div className={styles.templateStack}>
                {templates.map((template) => {
                    const isSelected = selectedTemplate === template.id;

                    return (
                        <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={`${styles.templateButton} ${isSelected ? styles.templateButtonSelected : ""
                                }`}
                            type="button"
                            title={template.name}
                        >
                            <div className={styles.templatePreview}>
                                {template.id === "original" && (
                                    <div className={styles.previewOriginal}>
                                        <div className={styles.previewSidebar}></div>
                                        <div className={styles.previewMain}>
                                            <div className={styles.previewLine}></div>
                                            <div className={styles.previewLine}></div>
                                        </div>
                                    </div>
                                )}
                                {template.id === "template-1" && (
                                    <div className={styles.previewTemplate1}>
                                        <div className={styles.previewSidebarLeft}>
                                            <div className={styles.previewCircle}></div>
                                        </div>
                                        <div className={styles.previewMain}>
                                            <div className={styles.previewLine}></div>
                                            <div className={styles.previewLine}></div>
                                        </div>
                                    </div>
                                )}
                                {template.id === "template-2" && (
                                    <div className={styles.previewTemplate2}>
                                        <div className={styles.previewHeader}></div>
                                        <div className={styles.previewBody}>
                                            <div className={styles.previewLine}></div>
                                            <div className={styles.previewTimelineDot}></div>
                                        </div>
                                    </div>
                                )}
                                {template.id === "template-3" && (
                                    <div className={styles.previewTemplate3}>
                                        <div className={styles.previewHeaderCentered}>
                                            <div className={styles.previewCircleSmall}></div>
                                        </div>
                                        <div className={styles.previewBody}>
                                            <div className={styles.previewLine}></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <span className={styles.templateLabel}>
                                {template.shortName}
                                {isSelected && (
                                    <span className={styles.selectedIndicator}>✓</span>
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TemplateSwitcher;

