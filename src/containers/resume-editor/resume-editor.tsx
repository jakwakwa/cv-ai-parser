'use client';

import { Eye, EyeOff, Save, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { ParsedResumeSchema } from '@/lib/tools-lib/shared-parsed-resume-schema';
import { SUMMARY_MAX_CHARS } from '@/lib/tools-lib/shared/summary-limiter';
import CertificationItem from '@/src/components/certification-item/certification-item';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/ui-button/button';
import { useResumeEditor } from '@/src/hooks/use-resume-editor';
import EducationItem from './education-item/education-item';
import ExperienceItem from './experience-item/experience-item';
import ProfileEditorSection from './profile-section/profile-editor-section';
import styles from './resume-editor.module.css';
import ResumePreview from './resume-preview/resume-preview';
import SectionHeader from './section-header/section-header';
import SkillsEditorSection from './skills-section/skills-editor-section';

interface ResumeEditorProps {
  resumeData: ParsedResumeSchema;
  onSave: (data: ParsedResumeSchema) => void;
  onCancel: () => void;
  onCustomColorsChange?: (colors: Record<string, string>) => void;
}

const ResumeEditor = ({
  resumeData,
  onSave,
  onCancel,
  onCustomColorsChange,
}: ResumeEditorProps) => {
  const [showPreview, setShowPreview] = useState(false);

  const {
    editedData,
    handleInputChange,
    handleNestedInputChange,
    handleExperienceChange,
    removeExperience,
    addExperience,
    handleSkillAdd,
    handleSkillRemove,
    handleProfileImageChange,
    handleEducationChange,
    removeEducation,
    addEducation,
    handleCertificationChange,
    removeCertification,
    addCertification,
  } = useResumeEditor(resumeData, onCustomColorsChange);

  const handleContactChange = useCallback(
    <K extends keyof NonNullable<ParsedResumeSchema['contact']>>(
      field: K,
      value: NonNullable<ParsedResumeSchema['contact']>[K]
    ) => {
      handleNestedInputChange('contact', field, value);
    },
    [handleNestedInputChange]
  );

  const handleSummaryChange = useCallback(
    (value: string) => {
      handleInputChange('summary', value);
    },
    [handleInputChange]
  );

  const handleSave = () => {
    onSave(editedData);
  };

  // SAFE ADDITION: Check if summary exceeds character limit to disable save button
  const isSummaryValid =
    !editedData.summary || editedData.summary.length <= SUMMARY_MAX_CHARS;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.headerTitle}>Edit Resume</h1>
              <p className={styles.headerSubtitle}>
                Make changes to your resume information
              </p>
            </div>
            <div className={styles.headerActions}>
              {/* <Button
                variant="default"
                onClick={() => setShowPreview(!showPreview)}
                className={styles.previewButton}
              >
                {showPreview ? (
                  <EyeOff className={styles.iconMd} />
                ) : (
                  <Eye className={styles.iconMd} />
                )}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button> */}
              <Button variant="default" onClick={onCancel}>
                <X className={`${styles.iconMd} ${styles.gap2}`} />
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                className={styles.saveButton}
                disabled={!isSummaryValid}
              >
                <Save className={`${styles.iconMd} ${styles.gap2}`} />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <div
          className={`${styles.grid} ${showPreview ? styles.gridTwoColumns : styles.gridOneColumn}`}
        >
          {/* PROFILE Section */}
          <div className={styles.editorPanel}>
            <ProfileEditorSection
              profileImage={editedData.profileImage}
              summary={editedData.summary}
              contact={editedData.contact}
              onProfileImageChange={handleProfileImageChange}
              onSummaryChange={handleSummaryChange}
              onContactChange={handleContactChange}
            />

            <SkillsEditorSection
              skills={editedData.skills || []}
              onSkillAdd={handleSkillAdd}
              onSkillRemove={handleSkillRemove}
            />

            <Card className={styles.card}>
              <SectionHeader title="Experience" onAdd={addExperience} />
              <CardContent className={styles.spaceY4}>
                {editedData.experience?.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No experience added yet. Click "Add Experience" to start.
                  </p>
                )}
                {editedData.experience?.map((job, index) => (
                  <ExperienceItem
                    key={job.id}
                    job={job}
                    index={index}
                    onChange={handleExperienceChange}
                    onRemove={removeExperience}
                  />
                ))}
              </CardContent>
            </Card>

            <Card className={styles.card}>
              <SectionHeader title="Education" onAdd={addEducation} />
              <CardContent className={styles.spaceY4}>
                {editedData.education?.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No education added yet. Click "Add Education" to start.
                  </p>
                )}
                {editedData.education?.map((edu, index) => (
                  <EducationItem
                    key={edu.id}
                    edu={edu}
                    index={index}
                    onChange={handleEducationChange}
                    onRemove={removeEducation}
                  />
                ))}
              </CardContent>
            </Card>

            <Card className={styles.card}>
              <SectionHeader title="Certifications" onAdd={addCertification} />
              <CardContent className={styles.spaceY4}>
                {editedData.certifications?.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No certifications added yet. Click "Add Certification" to
                    start.
                  </p>
                )}
                {editedData.certifications?.map((cert, index) => (
                  <CertificationItem
                    key={cert.id}
                    cert={cert}
                    index={index}
                    onChange={handleCertificationChange}
                    onRemove={removeCertification}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
          {/* PREVIEW CHANGES */}
          {/* {showPreview && <ResumePreview resumeData={editedData} />} */}
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
