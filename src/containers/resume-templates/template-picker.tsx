"use client"

import type React from "react"
import { useTemplate } from "@/src/stores/template-context"
import styles from "./template-picker.module.css"

/**
 * TemplatePicker
 *
 * A simplified template selector for the upload panel that:
 * - Allows users to pick a template BEFORE resume generation
 * - Doesn't render the actual resume
 * - Saves selection to Context (persisted in localStorage)
 * - Shows visual previews of template layouts
 */
const TemplatePicker: React.FC = () => {
    const { selectedTemplate, setSelectedTemplate } = useTemplate()

    const templates = [
        {
            id: "original",
            name: "Original",
            description: "Default two-column layout",
        },
        {
            id: "template-1",
            name: "Modern Two-Column",
            description: "Clean sidebar with gradient background",
        },
        {
            id: "template-2",
            name: "Timeline Vertical",
            description: "Chronological emphasis with timeline",
        },
        {
            id: "template-3",
            name: "Classic Centered",
            description: "Elegant symmetric design",
        },
    ]

    return (
        <div className={styles.templatePicker}>
            <h3 className={styles.pickerTitle}>Choose From Multiple Resume Templates</h3>
            <p className={styles.pickerDescription}>Select how your resume will be displayed</p>

            <div className={styles.templateGrid}>
                {templates.map(template => {
                    const isSelected = selectedTemplate === template.id

                    return (
                        <button key={template.id} onClick={() => setSelectedTemplate(template.id)} className={`${styles.templateCard} ${isSelected ? styles.templateCardSelected : ""}`} type="button">
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

                            <div className={styles.templateInfo}>
                                <h4 className={styles.templateName}>
                                    {template.name}
                                    {isSelected && <span className={styles.selectedBadge}>✓</span>}
                                </h4>
                                <p className={styles.templateDescription}>{template.description}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default TemplatePicker
