"use client";

import type React from "react";
import type { ParsedResumeSchema } from "@/lib/tools-lib/shared-parsed-resume-schema";
import ResumeDisplay from "@/src/containers/resume-display/resume-display";
import {
    ResumeTemplate1,
    ResumeTemplate2,
    ResumeTemplate3,
} from "@/src/containers/resume-templates";
import { useTemplate } from "@/src/stores/template-context";

interface ResumeDisplayControllerProps {
    resumeData: ParsedResumeSchema;
    isAuth: boolean;
}

/**
 * ResumeDisplayController
 *
 * This component acts as a smart controller that:
 * 1. Reads the selected template from Context
 * 2. Renders the appropriate template component based on selection
 * 3. Defaults to original ResumeDisplay if no template selected
 *
 * Usage: Replace <ResumeDisplay /> with <ResumeDisplayController />
 */
const ResumeDisplayController: React.FC<ResumeDisplayControllerProps> = ({
    resumeData,
    isAuth,
}) => {
    const { selectedTemplate } = useTemplate();

    // Render the selected template
    switch (selectedTemplate) {
        case "template-1":
            return <ResumeTemplate1 resumeData={resumeData} isAuth={isAuth} />;

        case "template-2":
            return <ResumeTemplate2 resumeData={resumeData} isAuth={isAuth} />;

        case "template-3":
            return <ResumeTemplate3 resumeData={resumeData} isAuth={isAuth} />;

        default:
            // Default to original template
            return <ResumeDisplay resumeData={resumeData} isAuth={isAuth} />;
    }
};

export default ResumeDisplayController;
