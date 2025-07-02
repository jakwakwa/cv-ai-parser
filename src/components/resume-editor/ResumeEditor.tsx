'use client';

import { Eye, EyeOff, Plus, Save, Trash2, X } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import ColorPicker from '../color-picker/ColorPicker';
import ProfileImageUploader from '../profile-image-uploader/ProfileImageUploader';
import styles from './ResumeEditor.module.css';

type IncomingExperience = {
  id?: string;
  company?: string;
  title?: string;
  position?: string;
  duration?: string;
  details?: string | string[];
  description?: string | string[];
};

interface ResumeEditorProps {
  resumeData: ParsedResume;
  onSave: (data: ParsedResume) => void;
  onCancel: () => void;
  onCustomColorsChange?: (colors: Record<string, string>) => void;
}

// Memoized ExperienceItem subcomponent
interface ExperienceItemProps {
  job: NonNullable<ParsedResume['experience']>[number];
  index: number;
  onChange: <
    Field extends keyof NonNullable<ParsedResume['experience']>[number],
  >(
    index: number,
    field: Field,
    value: NonNullable<ParsedResume['experience']>[number][Field]
  ) => void;
  onRemove: (index: number) => void;
}

const ExperienceItem = memo(function ExperienceItem({
  job,
  index,
  onChange,
  onRemove,
}: ExperienceItemProps) {
  return (
    <div className={styles.experienceItem}>
      <div className={styles.experienceItemHeader}>
        <h3 className={styles.experienceItemTitle}>Job #{index + 1}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className={styles.removeExperienceButton}
        >
          <Trash2 className={styles.iconMd} />
        </Button>
      </div>
      <div className={styles.formGridFull}>
        <div className={styles.formField}>
          <Label htmlFor={`experience-title-${index}`} className={styles.label}>
            Job Title
          </Label>
          <Input
            id={`experience-title-${index}`}
            value={job.title || ''}
            onChange={(e) => onChange(index, 'title', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formField}>
          <Label
            htmlFor={`experience-company-${index}`}
            className={styles.label}
          >
            Company
          </Label>
          <Input
            id={`experience-company-${index}`}
            value={job.company || ''}
            onChange={(e) => onChange(index, 'company', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formField}>
          <Label
            htmlFor={`experience-duration-${index}`}
            className={styles.label}
          >
            Duration
          </Label>
          <Input
            id={`experience-duration-${index}`}
            value={job.duration || ''}
            onChange={(e) => onChange(index, 'duration', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formField}>
          <Label
            htmlFor={`experience-details-${index}`}
            className={styles.label}
          >
            Details (one per line)
          </Label>
          <Textarea
            id={`experience-details-${index}`}
            value={job.details?.join('\n') || ''}
            onChange={(e) =>
              onChange(index, 'details', e.target.value.split('\n'))
            }
            className={styles.textarea}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
});

// Memoized EducationItem subcomponent
interface EducationItemProps {
  edu: NonNullable<ParsedResume['education']>[number];
  index: number;
  onChange: <
    Field extends keyof NonNullable<ParsedResume['education']>[number],
  >(
    index: number,
    field: Field,
    value: NonNullable<ParsedResume['education']>[number][Field]
  ) => void;
  onRemove: (index: number) => void;
}
const EducationItem = memo(function EducationItem({
  edu,
  index,
  onChange,
  onRemove,
}: EducationItemProps) {
  return (
    <div className={styles.experienceItem}>
      <div className={styles.experienceItemHeader}>
        <h3 className={styles.experienceItemTitle}>Education #{index + 1}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className={styles.removeExperienceButton}
        >
          <Trash2 className={styles.iconMd} />
        </Button>
      </div>
      <div className={styles.formGridFull}>
        <div className={styles.formField}>
          <Label htmlFor={`education-degree-${index}`} className={styles.label}>
            Degree
          </Label>
          <Input
            id={`education-degree-${index}`}
            value={edu.degree || ''}
            onChange={(e) => onChange(index, 'degree', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formField}>
          <Label
            htmlFor={`education-institution-${index}`}
            className={styles.label}
          >
            Institution
          </Label>
          <Input
            id={`education-institution-${index}`}
            value={edu.institution || ''}
            onChange={(e) => onChange(index, 'institution', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formField}>
          <Label
            htmlFor={`education-duration-${index}`}
            className={styles.label}
          >
            Duration
          </Label>
          <Input
            id={`education-duration-${index}`}
            value={edu.duration || ''}
            onChange={(e) => onChange(index, 'duration', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formField}>
          <Label htmlFor={`education-note-${index}`} className={styles.label}>
            Note (Optional)
          </Label>
          <Textarea
            id={`education-note-${index}`}
            value={edu.note || ''}
            onChange={(e) => onChange(index, 'note', e.target.value)}
            className={styles.textarea}
            rows={2}
          />
        </div>
      </div>
    </div>
  );
});

// Memoized CertificationItem subcomponent
interface CertificationItemProps {
  cert: NonNullable<ParsedResume['certifications']>[number];
  index: number;
  onChange: <
    Field extends keyof NonNullable<ParsedResume['certifications']>[number],
  >(
    index: number,
    field: Field,
    value: NonNullable<ParsedResume['certifications']>[number][Field]
  ) => void;
  onRemove: (index: number) => void;
}
const CertificationItem = memo(function CertificationItem({
  cert,
  index,
  onChange,
  onRemove,
}: CertificationItemProps) {
  return (
    <div className={styles.experienceItem}>
      <div className={styles.experienceItemHeader}>
        <h3 className={styles.experienceItemTitle}>
          Certification #{index + 1}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className={styles.removeExperienceButton}
        >
          <Trash2 className={styles.iconMd} />
        </Button>
      </div>
      <div className={styles.formGridFull}>
        <div className={styles.formField}>
          <Label htmlFor={`cert-name-${index}`} className={styles.label}>
            Certification Name
          </Label>
          <Input
            id={`cert-name-${index}`}
            value={cert.name || ''}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formField}>
          <Label htmlFor={`cert-issuer-${index}`} className={styles.label}>
            Issuer
          </Label>
          <Input
            id={`cert-issuer-${index}`}
            value={cert.issuer || ''}
            onChange={(e) => onChange(index, 'issuer', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formField}>
          <Label htmlFor={`cert-date-${index}`} className={styles.label}>
            Date (Optional)
          </Label>
          <Input
            id={`cert-date-${index}`}
            value={cert.date || ''}
            onChange={(e) => onChange(index, 'date', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formField}>
          <Label htmlFor={`cert-id-${index}`} className={styles.label}>
            Credential ID (Optional)
          </Label>
          <Input
            id={`cert-id-${index}`}
            value={cert.id || ''}
            onChange={(e) => onChange(index, 'id', e.target.value)}
            className={styles.input}
          />
        </div>
      </div>
    </div>
  );
});

// Memoized SkillBadge subcomponent
interface SkillBadgeProps {
  skill: string;
  onRemove: (skill: string) => void;
}
const SkillBadge = memo(function SkillBadge({
  skill,
  onRemove,
}: SkillBadgeProps) {
  return (
    <Badge className={styles.skillBadge}>
      {skill}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(skill)}
        className={styles.removeSkillButton}
      >
        <X className={styles.iconSm} />
      </Button>
    </Badge>
  );
});

const ResumeEditor = ({
  resumeData,
  onSave,
  onCancel,
  onCustomColorsChange,
}: ResumeEditorProps) => {
  const normalizeExperienceData = (
    experience: IncomingExperience[]
  ): ParsedResume['experience'] => {
    return experience.map((exp) => ({
      id: exp.id || uuidv4(),
      company: exp.company || '',
      title: exp.title || exp.position || '',
      duration: exp.duration || '',
      details: Array.isArray(exp.details)
        ? exp.details.map(String)
        : Array.isArray(exp.description)
          ? exp.description.map(String)
          : exp.details
            ? [String(exp.details)]
            : exp.description
              ? [String(exp.description)]
              : [],
    }));
  };

  const [editedData, setEditedData] = useState<ParsedResume>({
    ...resumeData,
    experience: normalizeExperienceData(resumeData.experience || []),
    education: (resumeData.education || []).map((edu) => ({
      ...edu,
      id: edu.id || uuidv4(),
    })),
    certifications: (resumeData.certifications || []).map((cert) => ({
      ...cert,
      id: cert.id || uuidv4(),
    })),
  });
  const [showPreview, setShowPreview] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = <Field extends keyof ParsedResume>(
    field: Field,
    value: ParsedResume[Field]
  ) => {
    setEditedData((prev: ParsedResume) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = <
    Section extends keyof ParsedResume,
    Field extends keyof NonNullable<ParsedResume[Section]>,
  >(
    section: Section,
    field: Field,
    value: NonNullable<ParsedResume[Section]>[Field]
  ) => {
    setEditedData((prev: ParsedResume) => {
      const prevSectionData = prev[section];
      let currentSectionData: NonNullable<ParsedResume[Section]>;

      if (
        typeof prevSectionData === 'object' &&
        prevSectionData !== null &&
        !Array.isArray(prevSectionData)
      ) {
        currentSectionData = prevSectionData as NonNullable<
          ParsedResume[Section]
        >;
      } else if (section === 'contact') {
        currentSectionData = {} as NonNullable<ParsedResume[Section]>;
      } else {
        currentSectionData = {} as NonNullable<ParsedResume[Section]>;
      }

      const updatedSection = Object.assign({}, currentSectionData, {
        [field]: value,
      });
      return {
        ...prev,
        [section]: updatedSection,
      };
    });
  };

  // Memoize handlers for ExperienceItem
  const handleExperienceChange = useCallback(
    <Field extends keyof (typeof editedData.experience)[number]>(
      index: number,
      field: Field,
      value: (typeof editedData.experience)[number][Field]
    ) => {
      const updatedExperience = [...(editedData.experience || [])];
      updatedExperience[index] = {
        ...updatedExperience[index],
        [field]: value,
      };
      setEditedData((prev: ParsedResume) => ({
        ...prev,
        experience: updatedExperience,
      }));
    },
    [editedData.experience]
  );

  const removeExperience = useCallback(
    (index: number) => {
      const updatedExperience = (editedData.experience || []).filter(
        (__, i: number) => i !== index
      );
      setEditedData((prev: ParsedResume) => ({
        ...prev,
        experience: updatedExperience,
      }));
    },
    [editedData.experience]
  );

  const addExperience = () => {
    const newExperience = {
      id: uuidv4(),
      company: '',
      title: '',
      duration: '',
      details: [],
    };
    setEditedData((prev: ParsedResume) => ({
      ...prev,
      experience: [...(prev.experience || []), newExperience],
    }));
  };

  const handleSkillAdd = () => {
    if (
      newSkill.trim() &&
      !(editedData.skills || []).includes(newSkill.trim())
    ) {
      setEditedData((prev: ParsedResume) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setEditedData((prev: ParsedResume) => ({
      ...prev,
      skills: (prev.skills || []).filter(
        (skill: string) => skill !== skillToRemove
      ),
    }));
  };

  const handleProfileImageChange = (imageUrl: string) => {
    setEditedData((prev: ParsedResume) => ({
      ...prev,
      profileImage: imageUrl,
    }));
  };

  const handleColorsChange = (colors: Record<string, string>) => {
    setEditedData((prev: ParsedResume) => ({
      ...prev,
      customColors: colors,
    }));
    if (onCustomColorsChange) {
      onCustomColorsChange(colors);
    }
  };

  const handleSave = () => {
    onSave(editedData);
  };

  // Memoize handlers for EducationItem
  const handleEducationChange = useCallback(
    <Field extends keyof NonNullable<ParsedResume['education']>[number]>(
      index: number,
      field: Field,
      value: NonNullable<ParsedResume['education']>[number][Field]
    ) => {
      const updatedEducation = [...(editedData.education || [])];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value,
      };
      setEditedData((prev) => ({
        ...prev,
        education: updatedEducation,
      }));
    },
    [editedData.education]
  );
  const removeEducation = useCallback(
    (index: number) => {
      const updatedEducation = (editedData.education || []).filter(
        (__, i) => i !== index
      );
      setEditedData((prev) => ({
        ...prev,
        education: updatedEducation,
      }));
    },
    [editedData.education]
  );

  // Memoize handlers for CertificationItem
  const handleCertificationChange = useCallback(
    <Field extends keyof NonNullable<ParsedResume['certifications']>[number]>(
      index: number,
      field: Field,
      value: NonNullable<ParsedResume['certifications']>[number][Field]
    ) => {
      const updatedCerts = [...(editedData.certifications || [])];
      updatedCerts[index] = {
        ...updatedCerts[index],
        [field]: value,
      };
      setEditedData((prev) => ({
        ...prev,
        certifications: updatedCerts,
      }));
    },
    [editedData.certifications]
  );
  const removeCertification = useCallback(
    (index: number) => {
      const updatedCerts = (editedData.certifications || []).filter(
        (__, i) => i !== index
      );
      setEditedData((prev) => ({
        ...prev,
        certifications: updatedCerts,
      }));
    },
    [editedData.certifications]
  );

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
              <Button
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
              </Button>
              <Button variant="default" onClick={onCancel}>
                <X className={`${styles.iconMd} ${styles.gap2}`} />
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                className={styles.saveButton}
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
          <div className={styles.editorPanel}>
            <Card className={styles.card}>
              <CardHeader>
                <CardTitle className={styles.cardTitle}>
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileImageUploader
                  currentImage={editedData.profileImage}
                  onImageChange={handleProfileImageChange}
                />
              </CardContent>
            </Card>

            <Card className={styles.card}>
              <CardHeader>
                <CardTitle className={styles.cardTitle}>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.formGridFull}>
                  <div className={styles.formField}>
                    <Label htmlFor="name" className={styles.label}>
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={editedData.name || ''}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <Label htmlFor="title" className={styles.label}>
                      Professional Title
                    </Label>
                    <Input
                      id="title"
                      value={editedData.title || ''}
                      onChange={(e) =>
                        handleInputChange('title', e.target.value)
                      }
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <Label htmlFor="summary" className={styles.label}>
                      Summary
                    </Label>
                    <Textarea
                      id="summary"
                      value={editedData.summary || ''}
                      onChange={(e) =>
                        handleInputChange('summary', e.target.value)
                      }
                      className={styles.textarea}
                      rows={5}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={styles.card}>
              <CardHeader>
                <CardTitle className={styles.cardTitle}>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <Label htmlFor="email" className={styles.label}>
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedData.contact?.email || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'contact',
                          'email',
                          e.target.value
                        )
                      }
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <Label htmlFor="phone" className={styles.label}>
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={editedData.contact?.phone || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'contact',
                          'phone',
                          e.target.value
                        )
                      }
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <Label htmlFor="location" className={styles.label}>
                      Location (City, Country)
                    </Label>
                    <Input
                      id="location"
                      value={editedData.contact?.location || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'contact',
                          'location',
                          e.target.value
                        )
                      }
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <Label htmlFor="linkedin" className={styles.label}>
                      LinkedIn Profile URL
                    </Label>
                    <Input
                      id="linkedin"
                      value={editedData.contact?.linkedin || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'contact',
                          'linkedin',
                          e.target.value
                        )
                      }
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <Label htmlFor="github" className={styles.label}>
                      GitHub Profile URL
                    </Label>
                    <Input
                      id="github"
                      value={editedData.contact?.github || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'contact',
                          'github',
                          e.target.value
                        )
                      }
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <Label htmlFor="website" className={styles.label}>
                      Personal Website URL
                    </Label>
                    <Input
                      id="website"
                      value={editedData.contact?.website || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'contact',
                          'website',
                          e.target.value
                        )
                      }
                      className={styles.input}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={styles.card}>
              <CardHeader className={styles.experienceHeader}>
                <CardTitle className={styles.cardTitle}>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.skillsInputGroup}>
                  <Input
                    type="text"
                    placeholder="Add a new skill (e.g., React, Node.js)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSkillAdd();
                      }
                    }}
                    className={styles.input}
                  />
                  <Button
                    onClick={handleSkillAdd}
                    className={styles.addSkillButton}
                  >
                    <Plus className={styles.iconMd} />
                  </Button>
                </div>
                <div className={`${styles.skillsList} ${styles.mt2}`}>
                  {editedData.skills?.map((skill) => (
                    <SkillBadge
                      key={skill}
                      skill={skill}
                      onRemove={handleSkillRemove}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={styles.card}>
              <CardHeader className={styles.experienceHeader}>
                <CardTitle className={styles.cardTitle}>Experience</CardTitle>
                <Button
                  onClick={addExperience}
                  className={styles.addExperienceButton}
                >
                  <Plus className={styles.iconMd} />
                </Button>
              </CardHeader>
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
              <CardHeader className={styles.experienceHeader}>
                <CardTitle className={styles.cardTitle}>Education</CardTitle>
                <Button
                  onClick={() => {
                    setEditedData((prev) => ({
                      ...prev,
                      education: [
                        ...(prev.education || []),
                        {
                          id: uuidv4(),
                          degree: '',
                          institution: '',
                          duration: '',
                        },
                      ],
                    }));
                  }}
                  className={styles.addExperienceButton}
                >
                  <Plus className={styles.iconMd} />
                </Button>
              </CardHeader>
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
              <CardHeader className={styles.experienceHeader}>
                <CardTitle className={styles.cardTitle}>
                  Certifications
                </CardTitle>
                <Button
                  onClick={() => {
                    setEditedData((prev) => ({
                      ...prev,
                      certifications: [
                        ...(prev.certifications || []),
                        { id: uuidv4(), name: '', issuer: '' },
                      ],
                    }));
                  }}
                  className={styles.addExperienceButton}
                >
                  <Plus className={styles.iconMd} />
                </Button>
              </CardHeader>
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

            <Card className={styles.card}>
              <CardHeader>
                <CardTitle>Color Scheme</CardTitle>
              </CardHeader>
              <CardContent>
                <ColorPicker
                  currentColors={editedData.customColors || {}}
                  onColorsChange={handleColorsChange}
                />
              </CardContent>
            </Card>
          </div>

          {showPreview && (
            <div className={styles.previewContainer}>
              <Card className={styles.card}>
                <CardHeader>
                  <CardTitle className={styles.cardTitle}>
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className={styles.previewContent}>
                  <div className={styles.previewHeader}>
                    {editedData.profileImage && (
                      <div className={styles.previewImageContainer}>
                        {/** biome-ignore lint/performance/noImgElement: expected */}
                        <img
                          src={editedData.profileImage}
                          alt="Profile"
                          className={styles.previewImage}
                        />
                      </div>
                    )}
                    <div className={styles.previewName}>
                      {editedData.name || 'Your Name'}
                    </div>
                    <div className={styles.previewTitle}>
                      {editedData.title || 'Professional Title'}
                    </div>
                    <div className={styles.previewSummary}>
                      {editedData.summary ||
                        'Your professional summary will appear here.'}
                    </div>
                  </div>

                  <div className={styles.previewSection}>
                    <div className={styles.previewSectionTitle}>Contact</div>
                    <div className={styles.previewContactInfo}>
                      {editedData.contact?.email && (
                        <div>Email: {editedData.contact.email}</div>
                      )}
                      {editedData.contact?.phone && (
                        <div>Phone: {editedData.contact.phone}</div>
                      )}
                      {editedData.contact?.location && (
                        <div>Location: {editedData.contact.location}</div>
                      )}
                      {editedData.contact?.linkedin && (
                        <div>LinkedIn: {editedData.contact.linkedin}</div>
                      )}
                      {editedData.contact?.github && (
                        <div>GitHub: {editedData.contact.github}</div>
                      )}
                    </div>
                  </div>

                  <div className={styles.previewSection}>
                    <div className={styles.previewSectionTitle}>Skills</div>
                    <div className={styles.previewSkillsList}>
                      {editedData.skills && editedData.skills.length > 0 ? (
                        editedData.skills.slice(0, 5).map((skill) => (
                          <span key={skill} className={styles.previewSkill}>
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className={styles.previewMoreSkills}>
                          No skills listed.
                        </span>
                      )}
                      {editedData.skills && editedData.skills.length > 5 && (
                        <span className={styles.previewMoreSkills}>
                          + {editedData.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.previewSection}>
                    <div className={styles.previewSectionTitle}>Experience</div>
                    {editedData.experience &&
                    editedData.experience.length > 0 ? (
                      editedData.experience.slice(0, 3).map((job) => (
                        <div
                          key={job.id}
                          className={styles.previewExperienceItem}
                        >
                          <div className={styles.previewExperienceTitle}>
                            {job.title || ''}
                          </div>
                          <div className={styles.previewExperienceCompany}>
                            {job.company || ''}
                          </div>
                          <div className={styles.previewExperienceDuration}>
                            {job.duration || ''}
                          </div>
                          {job.details && job.details.length > 0 && (
                            <ul className={styles.mt1}>
                              {job.details.slice(0, 2).map((detail) => (
                                <li key={detail} className={styles.textSm}>
                                  {detail}
                                </li>
                              ))}
                              {job.details.length > 2 && (
                                <li className={styles.textSm}>...</li>
                              )}
                            </ul>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className={styles.previewMoreExperience}>
                        No experience listed.
                      </span>
                    )}
                    {editedData.experience &&
                      editedData.experience.length > 3 && (
                        <span className={styles.previewMoreExperience}>
                          + {editedData.experience.length - 3} more
                        </span>
                      )}
                  </div>

                  <div className={styles.previewSection}>
                    <div className={styles.previewSectionTitle}>Education</div>
                    {editedData.education && editedData.education.length > 0 ? (
                      editedData.education.slice(0, 2).map((edu) => (
                        <div key={edu.id} className={styles.mb2}>
                          <div className={styles.fontSemibold}>
                            {edu.degree}
                          </div>
                          <div className={styles.textSm}>{edu.institution}</div>
                          {edu.duration && (
                            <div className={styles.textXs}>{edu.duration}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className={styles.textSm}>
                        No education listed.
                      </span>
                    )}
                    {editedData.education &&
                      editedData.education.length > 2 && (
                        <span className={styles.textSm}>
                          + {editedData.education.length - 2} more
                        </span>
                      )}
                  </div>

                  <div className={styles.previewSection}>
                    <div className={styles.previewSectionTitle}>
                      Certifications
                    </div>
                    {editedData.certifications &&
                    editedData.certifications.length > 0 ? (
                      editedData.certifications.slice(0, 2).map((cert) => (
                        <div key={cert.id} className={styles.mb2}>
                          <div className={styles.fontSemibold}>{cert.name}</div>
                          <div className={styles.textSm}>{cert.issuer}</div>
                          {cert.date && (
                            <div className={styles.textXs}>{cert.date}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className={styles.textSm}>
                        No certifications listed.
                      </span>
                    )}
                    {editedData.certifications &&
                      editedData.certifications.length > 2 && (
                        <span className={styles.textSm}>
                          + {editedData.certifications.length - 2} more
                        </span>
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
