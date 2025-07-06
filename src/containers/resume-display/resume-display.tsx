import type React from 'react';
import { useEffect, useRef } from 'react';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import CertificationsSection from '@/src/components/certification-section/certification-section';
import ContactSection from '@/src/components/contact-section/contact-section';
import EducationSection from '@/src/components/education-section/education-section';
import ExperienceSection from '@/src/components/experience-section/experience-section';
import ProfileHeader from '@/src/components/profile-header/profile-header';
import SkillsSection from '@/src/components/skills-section/skills-section';
import { resumeColors } from '@/src/utils/colors';

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
    <div id="resume-content" className="resumeContent" ref={resumeContainerRef}>
      <ProfileHeader
        profileImage={resumeData.profileImage || undefined}
        name={resumeData.name || ''}
        title={resumeData.title || ''}
        summary={resumeData.summary || ''}
        customColors={resumeData.customColors || {}}
      />
      <div className="resumeGrid">
        <div
          className="resumeSidebar"
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
          className="resumeMainContent"
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
    </div>
  );
};

export default ResumeDisplay;
