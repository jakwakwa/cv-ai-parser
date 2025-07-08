import { z } from 'zod';

// Enhanced resume schema with better structure for Figma mapping
export const enhancedResumeSchema = z.object({
  name: z.string().describe('Full name of the individual.'),
  title: z.string().describe('Current or most recent job title.'),
  summary: z.string().optional(),
  profileImage: z.string().optional(),
  customColors: z.record(z.string(), z.string()).optional(),

  // Enhanced contact information with better structure
  contact: z
    .object({
      email: z.string().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
      website: z.string().optional(),
      github: z.string().optional(),
      linkedin: z.string().optional(),
      // Additional contact fields for better mapping
      address: z
        .object({
          street: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          country: z.string().optional(),
          zipCode: z.string().optional(),
        })
        .optional(),
      social: z
        .array(
          z.object({
            platform: z.string(),
            url: z.string(),
            username: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),

  // Enhanced experience with better structure
  experience: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().optional(),
      company: z.string().optional(),
      duration: z.string().optional().describe("e.g., 'Jan 2020 - Present'"),
      startDate: z.string().optional().describe("e.g., '2020-01'"),
      endDate: z.string().optional().describe("e.g., '2023-12' or 'Present'"),
      location: z.string().optional(),
      details: z.array(z.string()),
      // Enhanced fields for better mapping
      responsibilities: z.array(z.string()).optional(),
      achievements: z.array(z.string()).optional(),
      technologies: z.array(z.string()).optional(),
      metrics: z
        .array(
          z.object({
            description: z.string(),
            value: z.string(),
            unit: z.string().optional(),
          })
        )
        .optional(),
    })
  ),

  // Enhanced education with better structure
  education: z
    .array(
      z.object({
        id: z.string().optional(),
        degree: z.string(),
        institution: z.string(),
        duration: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        location: z.string().optional(),
        gpa: z.string().optional(),
        honors: z.array(z.string()).optional(),
        relevantCourses: z.array(z.string()).optional(),
        note: z.string().optional(),
      })
    )
    .optional(),

  // Enhanced certifications
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string(),
        date: z.string().optional(),
        expiryDate: z.string().optional(),
        credentialId: z.string().optional(),
        credentialUrl: z.string().optional(),
        id: z.string().optional(),
      })
    )
    .optional(),

  // Enhanced skills with categorization
  skills: z
    .object({
      technical: z
        .array(
          z.object({
            name: z.string(),
            level: z
              .enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
              .optional(),
            category: z.string().optional(),
            yearsOfExperience: z.number().optional(),
          })
        )
        .optional(),
      soft: z.array(z.string()).optional(),
      languages: z
        .array(
          z.object({
            name: z.string(),
            proficiency: z
              .enum(['Basic', 'Conversational', 'Fluent', 'Native'])
              .optional(),
          })
        )
        .optional(),
      // Legacy field for backward compatibility
      all: z.array(z.string()).optional(),
    })
    .optional(),

  // Additional sections for comprehensive mapping
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        technologies: z.array(z.string()).optional(),
        url: z.string().optional(),
        githubUrl: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        highlights: z.array(z.string()).optional(),
      })
    )
    .optional(),

  awards: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string(),
        date: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),

  publications: z
    .array(
      z.object({
        title: z.string(),
        publisher: z.string(),
        date: z.string().optional(),
        url: z.string().optional(),
        authors: z.array(z.string()).optional(),
      })
    )
    .optional(),

  volunteering: z
    .array(
      z.object({
        organization: z.string(),
        role: z.string(),
        duration: z.string().optional(),
        description: z.string().optional(),
        highlights: z.array(z.string()).optional(),
      })
    )
    .optional(),

  // Metadata for better mapping
  metadata: z
    .object({
      lastUpdated: z.string().optional(),
      version: z.string().optional(),
      source: z.string().optional(),
      // Figma mapping hints
      figmaMapping: z
        .object({
          primarySections: z.array(z.string()).optional(),
          contentPriority: z.array(z.string()).optional(),
          visualEmphasis: z.array(z.string()).optional(),
        })
        .optional(),
      aiTailorCommentary: z.string().optional(), // AI-generated summary/commentary for UI
    })
    .optional(),
});

// Mapping configuration for Figma elements
export const figmaMappingConfig = z.object({
  // Field mappings
  fieldMappings: z.record(
    z.string(),
    z.object({
      figmaPath: z.string(), // Path to Figma element (e.g., "header.name")
      dataPath: z.string(), // Path to resume data (e.g., "name")
      transform: z
        .enum([
          'none',
          'uppercase',
          'lowercase',
          'capitalize',
          'truncate',
          'format',
        ])
        .optional(),
      maxLength: z.number().optional(),
      fallback: z.string().optional(),
      required: z.boolean().optional(),
    })
  ),

  // Section mappings
  sectionMappings: z.record(
    z.string(),
    z.object({
      figmaContainer: z.string(),
      dataSource: z.string(),
      itemTemplate: z.string().optional(),
      showIf: z.string().optional(), // Condition for showing section
      maxItems: z.number().optional(),
      sortBy: z.string().optional(),
    })
  ),

  // Style mappings
  styleMappings: z
    .object({
      colors: z.record(z.string(), z.string()).optional(),
      fonts: z.record(z.string(), z.string()).optional(),
      spacing: z.record(z.string(), z.string()).optional(),
    })
    .optional(),

  // Conditional logic
  conditionalRules: z
    .array(
      z.object({
        condition: z.string(), // JavaScript-like condition
        action: z.enum(['show', 'hide', 'modify', 'replace']),
        target: z.string(), // Target element or field
        value: z.string().optional(),
      })
    )
    .optional(),
});

// Types
export type EnhancedParsedResume = z.infer<typeof enhancedResumeSchema>;
export type FigmaMappingConfig = z.infer<typeof figmaMappingConfig>;

// Default mapping configuration
export const defaultFigmaMappingConfig: FigmaMappingConfig = {
  fieldMappings: {
    name: {
      figmaPath: 'header.name',
      dataPath: 'name',
      required: true,
    },
    title: {
      figmaPath: 'header.title',
      dataPath: 'title',
      required: true,
    },
    email: {
      figmaPath: 'contact.email',
      dataPath: 'contact.email',
      fallback: 'email@example.com',
    },
    phone: {
      figmaPath: 'contact.phone',
      dataPath: 'contact.phone',
      fallback: '+1 (555) 123-4567',
    },
    location: {
      figmaPath: 'contact.location',
      dataPath: 'contact.location',
      fallback: 'City, Country',
    },
    summary: {
      figmaPath: 'summary.text',
      dataPath: 'summary',
      maxLength: 500,
    },
  },
  sectionMappings: {
    experience: {
      figmaContainer: 'experience.container',
      dataSource: 'experience',
      itemTemplate: 'experience.item',
      maxItems: 5,
      sortBy: 'startDate',
    },
    education: {
      figmaContainer: 'education.container',
      dataSource: 'education',
      itemTemplate: 'education.item',
      showIf: 'education.length > 0',
    },
    skills: {
      figmaContainer: 'skills.container',
      dataSource: 'skills.all',
      itemTemplate: 'skills.item',
      maxItems: 12,
    },
    certifications: {
      figmaContainer: 'certifications.container',
      dataSource: 'certifications',
      itemTemplate: 'certifications.item',
      showIf: 'certifications.length > 0',
    },
  },
  conditionalRules: [
    {
      condition: 'experience.length === 0',
      action: 'hide',
      target: 'experience.container',
    },
    {
      condition: 'skills.all.length > 10',
      action: 'modify',
      target: 'skills.container',
      value: 'grid-template-columns: repeat(3, 1fr)',
    },
  ],
};

// Utility functions for data transformation
export const dataTransformers = {
  uppercase: (value: string) => value.toUpperCase(),
  lowercase: (value: string) => value.toLowerCase(),
  capitalize: (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  truncate: (value: string, maxLength: number) =>
    value.length > maxLength ? `${value.substring(0, maxLength)}...` : value,
  format: (value: string, format: string) => {
    // Custom formatting logic based on format string
    switch (format) {
      case 'phone':
        return value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      case 'date':
        return new Date(value).toLocaleDateString();
      default:
        return value;
    }
  },
};

// Validation helpers
export const validateMappingConfig = (config: FigmaMappingConfig): string[] => {
  const errors: string[] = [];

  // Validate field mappings
  Object.entries(config.fieldMappings).forEach(([key, mapping]) => {
    if (!mapping.figmaPath) {
      errors.push(`Field mapping '${key}' is missing figmaPath`);
    }
    if (!mapping.dataPath) {
      errors.push(`Field mapping '${key}' is missing dataPath`);
    }
  });

  // Validate section mappings
  Object.entries(config.sectionMappings).forEach(([key, mapping]) => {
    if (!mapping.figmaContainer) {
      errors.push(`Section mapping '${key}' is missing figmaContainer`);
    }
    if (!mapping.dataSource) {
      errors.push(`Section mapping '${key}' is missing dataSource`);
    }
  });

  return errors;
};
