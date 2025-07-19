'use client';

import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { EnhancedParsedResume } from '@/lib/resume-parser/enhanced-schema';

type IncomingExperience = {
  id: string;
  company?: string;
  title?: string;
  position?: string;
  duration?: string;
  details?: string | string[];
  description?: string | string[];
};

function normalizeExperienceData(
  experience: IncomingExperience[]
): NonNullable<EnhancedParsedResume['experience']> {
  return (experience || []).map((exp) => {
    const details = Array.isArray(exp.details)
      ? exp.details
      : typeof exp.details === 'string'
        ? exp.details.split('\n')
        : Array.isArray(exp.description)
          ? exp.description
          : typeof exp.description === 'string'
            ? exp.description.split('\n')
            : [];

    return {
      id: exp.id || uuidv4(),
      company: exp.company || '',
      title: exp.title || exp.position || '',
      role: exp.position || exp.title || '',
      duration: exp.duration || '',
      details: details.filter(
        (d): d is string => d !== null && d !== undefined
      ),
    };
  });
}

export const useResumeEditor = (
  resumeData: EnhancedParsedResume,
  onCustomColorsChange?: (colors: Record<string, string>) => void
) => {
  const [editedData, setEditedData] = useState<EnhancedParsedResume>({
    ...resumeData,
    experience: normalizeExperienceData(
      (resumeData.experience || []) as unknown as IncomingExperience[]
    ),
    education: (resumeData.education || []).map((edu) => ({
      ...edu,
      id: edu.id || uuidv4(),
    })),
    certifications: (resumeData.certifications || []).map((cert) => ({
      ...cert,
      id: cert.id || uuidv4(),
    })),
    skills: resumeData.skills || [],
    contact: {
      ...resumeData.contact,
    },
    profileImage: resumeData.profileImage || '',
    customColors: resumeData.customColors || {},
  });

  useEffect(() => {
    setEditedData({
      ...resumeData,
      experience: normalizeExperienceData(
        (resumeData.experience || []) as unknown as IncomingExperience[]
      ),
      education: (resumeData.education || []).map((edu) => ({
        ...edu,
        id: edu.id || uuidv4(),
      })),
      certifications: (resumeData.certifications || []).map((cert) => ({
        ...cert,
        id: cert.id || uuidv4(),
      })),
      skills: resumeData.skills || [],
      contact: {
        ...resumeData.contact,
      },
      profileImage: resumeData.profileImage || '',
      customColors: resumeData.customColors || {},
    });
  }, [resumeData]);

  const handleInputChange = useCallback(
    <Field extends keyof EnhancedParsedResume>(
      field: Field,
      value: EnhancedParsedResume[Field]
    ) => {
      setEditedData((prev: EnhancedParsedResume) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleNestedInputChange = useCallback(
    <
      Section extends keyof EnhancedParsedResume,
      Field extends keyof NonNullable<EnhancedParsedResume[Section]>,
    >(
      section: Section,
      field: Field,
      value: NonNullable<EnhancedParsedResume[Section]>[Field]
    ) => {
      setEditedData((prev: EnhancedParsedResume) => {
        const prevSectionData = prev[section];
        let currentSectionData: NonNullable<EnhancedParsedResume[Section]>;

        if (
          typeof prevSectionData === 'object' &&
          prevSectionData !== null &&
          !Array.isArray(prevSectionData)
        ) {
          currentSectionData = prevSectionData as NonNullable<
            EnhancedParsedResume[Section]
          >;
        } else {
          currentSectionData = {} as NonNullable<EnhancedParsedResume[Section]>;
        }

        const updatedSection = Object.assign({}, currentSectionData, {
          [field]: value,
        });
        return {
          ...prev,
          [section]: updatedSection,
        };
      });
    },
    []
  );

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
      setEditedData((prev: EnhancedParsedResume) => ({
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
      setEditedData((prev: EnhancedParsedResume) => ({
        ...prev,
        experience: updatedExperience,
      }));
    },
    [editedData.experience]
  );

  const addExperience = useCallback(() => {
    setEditedData((prev: EnhancedParsedResume) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          id: uuidv4(),
          company: '',
          title: '',
          duration: '',
          details: [''],
          role: '',
        },
      ],
    }));
  }, []);

  const handleSkillAdd = useCallback((skillToAdd: string) => {
    if (skillToAdd.trim() !== '') {
      setEditedData((prev: EnhancedParsedResume) => ({
        ...prev,
        skills: [...(prev.skills || []), skillToAdd.trim()],
      }));
    }
  }, []);

  const handleSkillRemove = useCallback((skillToRemove: string) => {
    setEditedData((prev: EnhancedParsedResume) => ({
      ...prev,
      skills: (prev.skills || []).filter((skill) => skill !== skillToRemove),
    }));
  }, []);

  const handleProfileImageChange = useCallback((imageUrl: string) => {
    setEditedData((prev: EnhancedParsedResume) => ({
      ...prev,
      profileImage: imageUrl,
    }));
  }, []);

  const handleColorsChange = useCallback(
    (colors: Record<string, string>) => {
      setEditedData((prev: EnhancedParsedResume) => ({
        ...prev,
        customColors: colors,
      }));
      if (onCustomColorsChange) {
        onCustomColorsChange(colors);
      }
    },
    [onCustomColorsChange]
  );

  const handleEducationChange = useCallback(
    <Field extends keyof NonNullable<EnhancedParsedResume['education']>[number]>(
      index: number,
      field: Field,
      value: NonNullable<EnhancedParsedResume['education']>[number][Field]
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

  const addEducation = useCallback(() => {
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
  }, []);

  const handleCertificationChange = useCallback(
    <Field extends keyof NonNullable<EnhancedParsedResume['certifications']>[number]>(
      index: number,
      field: Field,
      value: NonNullable<EnhancedParsedResume['certifications']>[number][Field]
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

  const addCertification = useCallback(() => {
    setEditedData((prev) => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        { id: uuidv4(), name: '', issuer: '' },
      ],
    }));
  }, []);

  return {
    editedData,
    handleInputChange,
    handleNestedInputChange,
    handleExperienceChange,
    removeExperience,
    addExperience,
    handleSkillAdd,
    handleSkillRemove,
    handleProfileImageChange,
    handleColorsChange,
    handleEducationChange,
    removeEducation,
    addEducation,
    handleCertificationChange,
    removeCertification,
    addCertification,
  };
};
