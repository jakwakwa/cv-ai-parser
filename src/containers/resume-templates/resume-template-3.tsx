import type React from "react";
import { useEffect, useRef } from "react";
import type { ParsedResumeSchema } from "@/lib/tools-lib/shared-parsed-resume-schema";
import CertificationsSection from "@/src/components/certification-section/certification-section";
import ContactSection from "@/src/components/contact-section/contact-section";
import EducationSection from "@/src/components/education-section/education-section";
import ExperienceSection from "@/src/components/experience-section/experience-section";
import SkillsSection from "@/src/components/skills-section/skills-section";
import { resumeColors } from "@/src/utils/colors";
import styles from "./resume-template-3.module.css";

interface ResumeTemplate3Props {
  resumeData: ParsedResumeSchema;
  isAuth: boolean;
}

const ResumeTemplate3: React.FC<ResumeTemplate3Props> = ({ resumeData }) => {
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
      {/* Centered Header */}
      <header className={styles.centeredHeader}>
        {hasProfileImage && !omittedProfileImage && (
          <div className={styles.profileImageWrapper}>
            <img
              src={resumeData.profileImage}
              alt={resumeData.name || ""}
              className={styles.profileImage}
            />
          </div>
        )}
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
        <div className={styles.titleDivider}>
          <span className={styles.dividerLine}></span>
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
          <span className={styles.dividerLine}></span>
        </div>
        <div className={styles.contactWrapper}>
          <ContactSection
            contact={resumeData.contact || {}}
            customColors={resumeData.customColors || {}}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Summary */}
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
              <span className={styles.titleText}>Professional Summary</span>
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

        {/* Skills */}
        <div className={styles.skillsSection}>
          <SkillsSection
            skills={resumeData.skills || []}
            customColors={resumeData.customColors || {}}
          />
        </div>

        {/* Experience */}
        <section className={styles.experienceSection}>
          <ExperienceSection
            experience={resumeData?.experience ? resumeData?.experience : null}
            customColors={resumeData.customColors || {}}
          />
        </section>

        {/* Education and Certifications Side by Side */}
        <div className={styles.bottomSections}>
          <div className={styles.sectionWrapper}>
            <EducationSection
              education={resumeData.education}
              customColors={resumeData.customColors || {}}
            />
          </div>
          <div className={styles.sectionWrapper}>
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

export default ResumeTemplate3;
