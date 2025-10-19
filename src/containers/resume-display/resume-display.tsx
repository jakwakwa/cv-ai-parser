import type React from "react";
import { useEffect, useRef } from "react";
import type { ParsedResumeSchema } from "@/lib/tools-lib/shared-parsed-resume-schema";
import CertificationsSection from "@/src/components/certification-section/certification-section";
import ContactSection from "@/src/components/contact-section/contact-section";
import EducationSection from "@/src/components/education-section/education-section";
import ExperienceSection from "@/src/components/experience-section/experience-section";
import ProfileHeader from "@/src/components/profile-header/profile-header";
import SkillsSection from "@/src/components/skills-section/skills-section";
import { resumeColors } from "@/src/utils/colors";
import styles from "./resume-display.module.css";

interface ResumeDisplayProps {
  resumeData: ParsedResumeSchema;
  isAuth: boolean;
}

const ResumeDisplay: React.FC<ResumeDisplayProps> = ({ resumeData }) => {
  const resumeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resumeContainerRef.current) {
      // Combine default and custom colors, with custom colors taking precedence
      const finalColors = { ...resumeColors, ...resumeData.customColors };

      // Apply the final set of colors as CSS variables to the container
      for (const [key, value] of Object.entries(finalColors)) {
        resumeContainerRef.current.style.setProperty(key, value);
      }
    }
  }, [resumeData?.customColors]);

  return (
    <div
      id="resume-content"
      className={styles.resumeContent}
      ref={resumeContainerRef}
    >
      <ProfileHeader
        profileImage={resumeData.profileImage || undefined}
        name={resumeData.name || ""}
        title={resumeData.title || ""}
        summary={resumeData.summary || ""}
        customColors={resumeData.customColors || {}}
      />
      <div className={styles.resumeGrid}>
        <div className={styles.resumeSidebar}>
          <ContactSection
            contact={resumeData.contact || {}}
            customColors={resumeData.customColors || {}}
          />
          <EducationSection
            education={resumeData.education}
            customColors={resumeData.customColors || {}}
          />
          <CertificationsSection
            certifications={resumeData.certifications}
            customColors={resumeData.customColors || {}}
          />
          <SkillsSection
            skills={resumeData.skills || []} // Pass skills
            customColors={resumeData.customColors || {}}
          />
        </div>
        <div className={styles.resumeMainContent}>
          <ExperienceSection
            experience={resumeData?.experience ? resumeData?.experience : null}
            customColors={resumeData.customColors || {}}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeDisplay;
