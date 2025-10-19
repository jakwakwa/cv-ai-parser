import type React from "react";
import { useEffect, useRef } from "react";
import type { ParsedResumeSchema } from "@/lib/tools-lib/shared-parsed-resume-schema";
import CertificationsSection from "@/src/components/certification-section/certification-section";
import ContactSection from "@/src/components/contact-section/contact-section";
import EducationSection from "@/src/components/education-section/education-section";
import ExperienceSection from "@/src/components/experience-section/experience-section";
import SkillsSection from "@/src/components/skills-section/skills-section";
import { resumeColors } from "@/src/utils/colors";
import styles from "./resume-template-2.module.css";

interface ResumeTemplate2Props {
  resumeData: ParsedResumeSchema;
  isAuth: boolean;
}

const ResumeTemplate2: React.FC<ResumeTemplate2Props> = ({ resumeData }) => {
  const resumeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resumeContainerRef.current) {
      const finalColors = { ...resumeColors, ...resumeData.customColors };
      for (const [key, value] of Object.entries(finalColors)) {
        resumeContainerRef.current.style.setProperty(key, value);
      }
    }
  }, [resumeData?.customColors]);

  const lowerImg = resumeData.profileImage ? resumeData.profileImage.toLowerCase() : "";
  const omittedProfileImage = resumeData.profileImage === "omitted";
  const hasProfileImage =
    resumeData.profileImage &&
    lowerImg.trim() !== "" &&
    !lowerImg.includes("placeholder") &&
    !lowerImg.includes("placehold.co");

  return (
    <div
      id="resume-content"
      className={styles.resumeContent}
      ref={resumeContainerRef}
    >
      {/* Header Section */}
      <header className={styles.headerSection}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1
              className={styles.name}
              style={{
                color:
                  resumeData.customColors?.["--resume-profile-name"] ||
                  "var(--resume-profile-name)",
              }}
            >
              {resumeData.name || ""}
            </h1>
            <p
              className={styles.title}
              style={{
                color:
                  resumeData.customColors?.["--resume-job-title"] ||
                  "var(--resume-job-title)",
              }}
            >
              {resumeData.title || ""}
            </p>
          </div>
          {hasProfileImage && !omittedProfileImage && (
            <div className={styles.headerRight}>
              <div className={styles.profileImageWrapper}>
                <img
                  src={resumeData.profileImage}
                  alt={resumeData.name || ""}
                  className={styles.profileImage}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.contactBar}>
          <ContactSection
            contact={resumeData.contact || {}}
            customColors={resumeData.customColors || {}}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Summary Section */}
        {resumeData.summary && (
          <section className={styles.summarySection}>
            <h2
              className={styles.sectionTitle}
              style={{
                color:
                  resumeData.customColors?.["--resume-section-titles"] ||
                  "var(--resume-section-titles)",
              }}
            >
              Professional Summary
            </h2>
            <p
              className={styles.summaryText}
              style={{
                color:
                  resumeData.customColors?.["--resume-body-text"] ||
                  "var(--resume-body-text)",
              }}
            >
              {resumeData.summary.slice(0, 860)}
            </p>
          </section>
        )}

        {/* Skills Section */}
        <div className={styles.skillsWrapper}>
          <SkillsSection
            skills={resumeData.skills || []}
            customColors={resumeData.customColors || {}}
          />
        </div>

        {/* Experience Section with Timeline */}
        <div className={styles.timelineSection}>
          <ExperienceSection
            experience={resumeData?.experience ? resumeData?.experience : null}
            customColors={resumeData.customColors || {}}
          />
        </div>

        {/* Two Column Layout for Education and Certifications */}
        <div className={styles.bottomGrid}>
          <div className={styles.educationWrapper}>
            <EducationSection
              education={resumeData.education}
              customColors={resumeData.customColors || {}}
            />
          </div>
          <div className={styles.certificationsWrapper}>
            <CertificationsSection
              certifications={resumeData.certifications}
              customColors={resumeData.customColors || {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate2;
