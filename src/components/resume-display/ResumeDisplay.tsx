import type React from 'react';
import { useEffect, useRef } from 'react';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import AdSense from '@/src/components/adsense/AdSense';
import CertificationsSection from '@/src/components/CertificationsSection/CertificationsSection';
import ContactSection from '@/src/components/ContactSection/ContactSection';
import EducationSection from '@/src/components/EducationSection/EducationSection';
import ExperienceSection from '@/src/components/ExperienceSection/ExperienceSection';
import ProfileHeader from '@/src/components/ProfileHeader/ProfileHeader';
import SkillsSection from '@/src/components/SkillsSection/SkillsSection';
import { resumeColors } from '@/src/utils/colors';
import pageStyles from '../../../app/page.module.css';
import styles from './ResumeDisplay.module.css';

interface ResumeDisplayProps {
  resumeData: ParsedResume;
  isAuth: boolean;
}

const ResumeDisplay: React.FC<ResumeDisplayProps> = ({ resumeData }) => {
  const resumeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Apply custom colors directly to the container for non-authenticated users
    // For authenticated users, colors are likely handled by database integration
    if (resumeData?.customColors && resumeContainerRef.current) {
      for (const [key, value] of Object.entries(resumeData.customColors)) {
        resumeContainerRef.current.style.setProperty(key, value);
      }
    }
  }, [resumeData?.customColors]);

  return (
    <div
      id="resume-content"
      className={pageStyles.resumeContent}
      ref={resumeContainerRef}
    >
      <ProfileHeader
        profileImage={resumeData.profileImage || ''}
        name={resumeData.name || ''}
        title={resumeData.title || ''}
        summary={resumeData.summary || ''}
        customColors={resumeData.customColors || {}}
      />
      <div className={styles.resumeGrid}>
        <div
          className={styles.resumeSidebar}
          style={{
            backgroundColor:
              resumeData.customColors?.['--resume-sidebar-background'] ||
              resumeColors['--resume-sidebar-background'],
          }}
        >
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
            skills={resumeData.skills}
            customColors={resumeData.customColors || {}}
          />
        </div>
        <div
          className={styles.resumeMainContent}
          style={{
            color:
              resumeData.customColors?.['--resume-body-text'] ||
              resumeColors['--resume-body-text'],
          }}
        >
          <ExperienceSection
            experience={resumeData.experience}
            customColors={resumeData.customColors || {}}
          />
        </div>
      </div>
      {/* Content Ad - Between resume sections */}
      <AdSense adSlot="3456789012" adFormat="horizontal" className={styles.adSection} />
    </div>
  );
};

export default ResumeDisplay;
