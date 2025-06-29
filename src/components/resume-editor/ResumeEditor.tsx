'use client';

import { Eye, EyeOff, Plus, Save, Trash2, X } from 'lucide-react';
import { useCallback, useState } from 'react';
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
  company?: string;
  title?: string;
  position?: string; // Add position
  duration?: string;
  details?: string | string[];
  description?: string | string[]; // Add description
};

interface ResumeEditorProps {
  resumeData: ParsedResume; // Use ParsedResume for consistency
  onSave: (data: ParsedResume) => void; // Ensure onSave expects ParsedResume
  onCancel: () => void;
  onCustomColorsChange?: (colors: Record<string, string>) => void; // Add this prop
}

const ResumeEditor = ({
  resumeData,
  onSave,
  onCancel,
  onCustomColorsChange,
}: ResumeEditorProps) => {
  // Normalize experience data to ensure consistent field names
  const normalizeExperienceData = (
    experience: IncomingExperience[]
  ): ParsedResume['experience'] => {
    return experience.map((exp) => ({
      company: exp.company || '',
      title: exp.title || exp.position || '', // Map position to title
      duration: exp.duration || '',
      details: Array.isArray(exp.details)
        ? exp.details.map(String)
        : Array.isArray(exp.description)
          ? exp.description.map(String)
          : exp.details
            ? [String(exp.details)]
            : exp.description
              ? [String(exp.description)]
              : [], // Ensure details are always string[]
    }));
  };

  const [editedData, setEditedData] = useState<ParsedResume>({
    ...resumeData,
    experience: normalizeExperienceData(resumeData.experience || []),
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
        // Special handling for optional contact object
        currentSectionData = {} as NonNullable<ParsedResume[Section]>;
      } else {
        // This case should ideally not be reached if the types are correctly defined,
        // but as a fallback, ensure it's an object.
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
    [editedData]
  );

  const addExperience = () => {
    const newExperience = {
      company: '',
      title: '',
      duration: '',
      details: [], // Changed from description to details
    };
    setEditedData((prev: ParsedResume) => ({
      ...prev,
      experience: [...(prev.experience || []), newExperience],
    }));
  };

  const removeExperience = (index: number) => {
    const updatedExperience = (editedData.experience || []).filter(
      (__, i: number) => i !== index
    );
    setEditedData((prev: ParsedResume) => ({
      ...prev,
      experience: updatedExperience,
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

  // New handler for color changes
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
    // The data is already in ParsedResume format due to useState<ParsedResume>
    // and the type of handleExperienceChange. No explicit conversion needed here.
    onSave(editedData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
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
          {/* Editor Panel */}
          <div className={styles.editorPanel}>
            {/* Profile Image */}
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

            {/* Personal Information */}
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

            {/* Contact Information */}
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

            {/* Skills */}
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
                    <Badge key={skill} className={styles.skillBadge}>
                      {skill}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSkillRemove(skill)}
                        className={styles.removeSkillButton}
                      >
                        <X className={styles.iconSm} />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
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
                  <div
                    key={`${job.title}-${job.company}-${index}`}
                    className={styles.experienceItem}
                  >
                    <div className={styles.experienceItemHeader}>
                      <h3 className={styles.experienceItemTitle}>
                        Job #{index + 1}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className={styles.removeExperienceButton}
                      >
                        <Trash2 className={styles.iconMd} />
                      </Button>
                    </div>
                    <div className={styles.formGridFull}>
                      <div className={styles.formField}>
                        <Label
                          htmlFor={`experience-title-${index}`}
                          className={styles.label}
                        >
                          Job Title
                        </Label>
                        <Input
                          id={`experience-title-${index}`}
                          value={job.title || ''}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              'title',
                              e.target.value
                            )
                          }
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
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              'company',
                              e.target.value
                            )
                          }
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
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              'duration',
                              e.target.value
                            )
                          }
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
                            handleExperienceChange(
                              index,
                              'details',
                              e.target.value.split('\n')
                            )
                          }
                          className={styles.textarea}
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card className={styles.card}>
              <CardHeader className={styles.experienceHeader}>
                <CardTitle className={styles.cardTitle}>Education</CardTitle>
                <Button
                  onClick={() => {
                    setEditedData((prev) => ({
                      ...prev,
                      education: [
                        ...(prev.education || []),
                        { degree: '', institution: '', duration: '' },
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
                  <div
                    key={`${edu.degree}-${edu.institution}-${index}`}
                    className={styles.experienceItem}
                  >
                    <div className={styles.experienceItemHeader}>
                      <h3 className={styles.experienceItemTitle}>
                        Education #{index + 1}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditedData((prev) => ({
                            ...prev,
                            education: (prev.education || []).filter(
                              (__, i: number) => i !== index
                            ),
                          }));
                        }}
                        className={styles.removeExperienceButton}
                      >
                        <Trash2 className={styles.iconMd} />
                      </Button>
                    </div>
                    <div className={styles.formGridFull}>
                      <div className={styles.formField}>
                        <Label
                          htmlFor={`education-degree-${index}`}
                          className={styles.label}
                        >
                          Degree
                        </Label>
                        <Input
                          id={`education-degree-${index}`}
                          value={edu.degree || ''}
                          onChange={(e) => {
                            const updatedEducation = [
                              ...(editedData.education || []),
                            ];
                            updatedEducation[index] = {
                              ...updatedEducation[index],
                              degree: e.target.value,
                            };
                            setEditedData((prev) => ({
                              ...prev,
                              education: updatedEducation,
                            }));
                          }}
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
                          onChange={(e) => {
                            const updatedEducation = [
                              ...(editedData.education || []),
                            ];
                            updatedEducation[index] = {
                              ...updatedEducation[index],
                              institution: e.target.value,
                            };
                            setEditedData((prev) => ({
                              ...prev,
                              education: updatedEducation,
                            }));
                          }}
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
                          onChange={(e) => {
                            const updatedEducation = [
                              ...(editedData.education || []),
                            ];
                            updatedEducation[index] = {
                              ...updatedEducation[index],
                              duration: e.target.value,
                            };
                            setEditedData((prev) => ({
                              ...prev,
                              education: updatedEducation,
                            }));
                          }}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formField}>
                        <Label
                          htmlFor={`education-note-${index}`}
                          className={styles.label}
                        >
                          Note (Optional)
                        </Label>
                        <Textarea
                          id={`education-note-${index}`}
                          value={edu.note || ''}
                          onChange={(e) => {
                            const updatedEducation = [
                              ...(editedData.education || []),
                            ];
                            updatedEducation[index] = {
                              ...updatedEducation[index],
                              note: e.target.value,
                            };
                            setEditedData((prev) => ({
                              ...prev,
                              education: updatedEducation,
                            }));
                          }}
                          className={styles.textarea}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Certifications */}
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
                        { name: '', issuer: '' },
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
                  <div
                    key={`${cert.name}-${cert.issuer}-${index}`}
                    className={styles.experienceItem}
                  >
                    <div className={styles.experienceItemHeader}>
                      <h3 className={styles.experienceItemTitle}>
                        Certification #{index + 1}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditedData((prev) => ({
                            ...prev,
                            certifications: (prev.certifications || []).filter(
                              (__, i: number) => i !== index
                            ),
                          }));
                        }}
                        className={styles.removeExperienceButton}
                      >
                        <Trash2 className={styles.iconMd} />
                      </Button>
                    </div>
                    <div className={styles.formGridFull}>
                      <div className={styles.formField}>
                        <Label
                          htmlFor={`cert-name-${index}`}
                          className={styles.label}
                        >
                          Certification Name
                        </Label>
                        <Input
                          id={`cert-name-${index}`}
                          value={cert.name || ''}
                          onChange={(e) => {
                            const updatedCerts = [
                              ...(editedData.certifications || []),
                            ];
                            updatedCerts[index] = {
                              ...updatedCerts[index],
                              name: e.target.value,
                            };
                            setEditedData((prev) => ({
                              ...prev,
                              certifications: updatedCerts,
                            }));
                          }}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formField}>
                        <Label
                          htmlFor={`cert-issuer-${index}`}
                          className={styles.label}
                        >
                          Issuer
                        </Label>
                        <Input
                          id={`cert-issuer-${index}`}
                          value={cert.issuer || ''}
                          onChange={(e) => {
                            const updatedCerts = [
                              ...(editedData.certifications || []),
                            ];
                            updatedCerts[index] = {
                              ...updatedCerts[index],
                              issuer: e.target.value,
                            };
                            setEditedData((prev) => ({
                              ...prev,
                              certifications: updatedCerts,
                            }));
                          }}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formField}>
                        <Label
                          htmlFor={`cert-date-${index}`}
                          className={styles.label}
                        >
                          Date (Optional)
                        </Label>
                        <Input
                          id={`cert-date-${index}`}
                          value={cert.date || ''}
                          onChange={(e) => {
                            const updatedCerts = [
                              ...(editedData.certifications || []),
                            ];
                            updatedCerts[index] = {
                              ...updatedCerts[index],
                              date: e.target.value,
                            };
                            setEditedData((prev) => ({
                              ...prev,
                              certifications: updatedCerts,
                            }));
                          }}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formField}>
                        <Label
                          htmlFor={`cert-id-${index}`}
                          className={styles.label}
                        >
                          Credential ID (Optional)
                        </Label>
                        <Input
                          id={`cert-id-${index}`}
                          value={cert.id || ''}
                          onChange={(e) => {
                            const updatedCerts = [
                              ...(editedData.certifications || []),
                            ];
                            updatedCerts[index] = {
                              ...updatedCerts[index],
                              id: e.target.value,
                            };
                            setEditedData((prev) => ({
                              ...prev,
                              certifications: updatedCerts,
                            }));
                          }}
                          className={styles.input}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Color Picker Section */}
            <Card className="mt-8">
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

          {/* Preview Panel */}
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

                  {/* Contact Info Preview */}
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

                  {/* Skills Preview */}
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

                  {/* Experience Preview */}
                  <div className={styles.previewSection}>
                    <div className={styles.previewSectionTitle}>Experience</div>
                    {editedData.experience &&
                    editedData.experience.length > 0 ? (
                      editedData.experience.slice(0, 3).map((job, index) => (
                        <div
                          key={`${job.title}-${job.company}-${index}`}
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

                  {/* Education Preview */}
                  <div className={styles.previewSection}>
                    <div className={styles.previewSectionTitle}>Education</div>
                    {editedData.education && editedData.education.length > 0 ? (
                      editedData.education.slice(0, 2).map((edu, index) => (
                        <div
                          key={`${edu.degree}-${edu.institution}-${index}`}
                          className={styles.mb2}
                        >
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

                  {/* Certifications Preview */}
                  <div className={styles.previewSection}>
                    <div className={styles.previewSectionTitle}>
                      Certifications
                    </div>
                    {editedData.certifications &&
                    editedData.certifications.length > 0 ? (
                      editedData.certifications
                        .slice(0, 2)
                        .map((cert, index) => (
                          <div
                            key={`${cert.name}-${cert.issuer}-${index}`}
                            className={styles.mb2}
                          >
                            <div className={styles.fontSemibold}>
                              {cert.name}
                            </div>
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
