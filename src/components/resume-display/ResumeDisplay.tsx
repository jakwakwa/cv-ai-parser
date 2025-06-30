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
import styles from '../../../app/page.module.css';

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
      className={styles.resumeContent}
      ref={resumeContainerRef}
    >
      <ProfileHeader
        profileImage={resumeData.profileImage || ''}
        name={resumeData.name || ''}
        title={resumeData.title || ''}
        summary={resumeData.summary || ''}
        customColors={resumeData.customColors || {}}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        <div
          className="flex flex-col h-full md:col-span-1 p-6 md:p-8"
          style={{ backgroundColor: 'var(--off-white)' }}
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
          className="p-6 md:p-8 md:col-span-2"
          style={{ color: 'var(--coffee)' }}
        >
          <ExperienceSection
            experience={resumeData.experience}
            customColors={resumeData.customColors || {}}
          />
        </div>
      </div>
      {/* Content Ad - Between resume sections */}
      <AdSense adSlot="3456789012" adFormat="horizontal" className="my-6" />
    </div>
  );
};

export default ResumeDisplay;
