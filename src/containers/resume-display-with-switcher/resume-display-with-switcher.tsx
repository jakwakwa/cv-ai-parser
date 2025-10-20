"use client";

import type React from "react";
import styles from "./resume-display-with-switcher.module.css";
import type { ParsedResumeSchema } from "@/lib/tools-lib/shared-parsed-resume-schema";
import ResumeDisplayController from "@/src/containers/resume-display-controller/resume-display-controller";
import TemplateSwitcher from "@/src/containers/resume-templates/template-switcher";
import ResumeTailorCommentary from "@/src/components/resume-tailor-commentary/resume-tailor-commentary";

/**
 * ResumeDisplayWithSwitcher
 *
 * Three-column grid layout:
 * - Left: Template switcher (sticky)
 * - Center: Resume display
 * - Right: AI Insights (sticky)
 * - Responsive: collapses to single column on mobile
 */

interface ResumeDisplayWithSwitcherProps {
    resumeData: ParsedResumeSchema;
    isAuth?: boolean;
    aiTailorCommentary?: string | null;
}

const ResumeDisplayWithSwitcher: React.FC<ResumeDisplayWithSwitcherProps> = ({
    resumeData,
    isAuth = false,
    aiTailorCommentary = null,
}) => {
    return (
        <div className={styles.displayWrapper}>
            <aside className={styles.switcherSidebar}>
                <TemplateSwitcher />
            </aside>
            <div className={styles.resumeContent}>
                <ResumeDisplayController resumeData={resumeData} isAuth={isAuth} />
            </div>
            <aside className={styles.insightsSidebar}>
                <ResumeTailorCommentary aiTailorCommentary={aiTailorCommentary} />
            </aside>
        </div>
    );
};

export default ResumeDisplayWithSwitcher;

