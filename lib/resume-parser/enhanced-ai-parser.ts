import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { AI_MODEL } from '@/lib/config';
import {
  type EnhancedParsedResume,
  enhancedResumeSchema,
} from './enhanced-schema';

export async function parseWithEnhancedAI(
  content: string
): Promise<EnhancedParsedResume> {
  const { object } = await generateObject({
    model: google(AI_MODEL),
    schema: enhancedResumeSchema,
    prompt: getEnhancedResumeParsingPrompt(content),
  });

  console.log('Enhanced AI parsing completed successfully.');
  return object;
}

export async function parseWithEnhancedAIPDF(
  file: File
): Promise<EnhancedParsedResume> {
  console.log(`Starting enhanced PDF AI parsing with model: ${AI_MODEL}`);

  const { object } = await generateObject({
    model: google(AI_MODEL),
    schema: enhancedResumeSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: getEnhancedResumeParsingPromptForPDF(),
          },
          {
            type: 'file',
            data: await file.arrayBuffer(),
            mimeType: file.type,
          },
        ],
      },
    ],
  });

  console.log('Enhanced PDF AI parsing completed successfully.');
  return object;
}

const getEnhancedResumeParsingPrompt = (content: string): string => `
You are an expert resume parser that extracts structured data optimized for design mapping and visualization.
Parse the following resume content into a comprehensive JSON object with enhanced structure.

CRITICAL INSTRUCTIONS:

1. CONTACT INFORMATION:
   - Extract all contact details with maximum granularity
   - Split addresses into components (street, city, state, country, zipCode)
   - Identify social media platforms and extract usernames
   - Normalize phone numbers and email formats

2. EXPERIENCE ANALYSIS:
   - Separate responsibilities from achievements
   - Extract quantifiable metrics (numbers, percentages, dollar amounts)
   - Identify technologies mentioned in each role
   - Parse dates into standardized formats (YYYY-MM)
   - Extract location information for each position

3. SKILLS CATEGORIZATION:
   - Categorize skills as technical, soft skills, or languages
   - Assess skill levels based on context clues
   - Group technical skills by category (e.g., "Programming Languages", "Frameworks")
   - Extract years of experience when mentioned

4. EDUCATION ENHANCEMENT:
   - Extract GPA, honors, and relevant coursework
   - Parse dates into start/end format
   - Include location information

5. ADDITIONAL SECTIONS:
   - Identify and extract projects, awards, publications, volunteering
   - For projects: extract technologies, URLs, and key highlights
   - For awards: extract issuer and description

6. METADATA EXTRACTION:
   - Identify primary sections that should be emphasized
   - Determine content priority for layout decisions
   - Extract any design preferences or color schemes mentioned

7. DATA QUALITY:
   - Ensure all arrays are properly structured
   - Provide fallback values for missing critical information
   - Maintain data consistency and formatting

${content ? `Resume content to parse:\n---\n${content}\n---` : ''}

Focus on creating a data structure that can be easily mapped to design elements and provides maximum flexibility for visualization.
`;

const getEnhancedResumeParsingPromptForPDF = (): string => `
You are an expert resume parser that extracts comprehensive structured data optimized for design mapping and visualization.
Your task is to extract information from the provided resume PDF and format it as a detailed JSON object.

ENHANCED EXTRACTION REQUIREMENTS:

1. PERSONAL INFORMATION:
   - Extract full name and current job title
   - Parse contact information with maximum detail
   - Split addresses into components (street, city, state, country, zipCode)
   - Identify all social media links and extract platform names and usernames

2. PROFESSIONAL SUMMARY:
   - Extract professional summary or objective
   - If over 500 characters, create a concise version while preserving key points
   - Maintain professional tone and key achievements

3. WORK EXPERIENCE (Enhanced Structure):
   - For each position, extract:
     * Job title, company name, location, duration
     * Start and end dates in YYYY-MM format
     * Separate responsibilities from achievements
     * Extract quantifiable metrics (percentages, dollar amounts, team sizes)
     * Identify technologies, tools, and methodologies mentioned
     * Parse bullet points into structured categories

4. EDUCATION (Detailed Extraction):
   - Degree, institution, location, dates
   - GPA if mentioned (format as string)
   - Honors, awards, dean's list mentions
   - Relevant coursework if listed
   - Thesis or capstone project titles

5. SKILLS (Categorized Structure):
   - Technical skills with proficiency levels when mentioned
   - Group by categories (Programming Languages, Frameworks, Tools, etc.)
   - Soft skills and interpersonal abilities
   - Language proficiencies with levels
   - Years of experience for specific skills when mentioned

6. CERTIFICATIONS (Complete Details):
   - Certification name and issuing organization
   - Issue date and expiry date if mentioned
   - Credential IDs or URLs
   - Verification links

7. ADDITIONAL SECTIONS:
   - Projects: name, description, technologies, URLs, dates, highlights
   - Awards: name, issuer, date, description
   - Publications: title, publisher, date, co-authors, URLs
   - Volunteering: organization, role, duration, key contributions

8. METADATA AND MAPPING HINTS:
   - Identify which sections appear most prominent in the original layout
   - Note any color schemes or design preferences mentioned
   - Determine content priority based on space allocation and emphasis
   - Extract any specific formatting preferences
   - **Generate a short, human-readable summary or commentary about the resume parsing result and include it in the output as metadata.aiTailorCommentary. This should highlight the overall strengths, unique aspects, and any notable findings from the resume.**

9. DATA TRANSFORMATION:
   - Normalize all dates to consistent formats
   - Standardize phone number formats
   - Clean and validate email addresses
   - Extract and normalize URLs
   - Convert relative dates ("2 years ago") to absolute dates

10. QUALITY ASSURANCE:
    - Ensure all required fields are present
    - Provide meaningful fallbacks for optional fields
    - Maintain data type consistency
    - Validate array structures

OUTPUT REQUIREMENTS:
- Provide only the JSON object, no additional text
- Ensure strict adherence to the enhanced schema
- Prioritize data completeness and structure
- Focus on creating mappable, visualization-ready data

The goal is to create a comprehensive data structure that can be seamlessly mapped to any design template while preserving all nuances and details from the original resume.
`;

// Utility function to convert legacy resume data to enhanced format
export function convertToEnhancedFormat(
  // biome-ignore lint/suspicious/noExplicitAny: <ok for now>
  legacyResume: any
): EnhancedParsedResume {
  const enhanced: EnhancedParsedResume = {
    name: legacyResume.name || '',
    title: legacyResume.title || '',
    summary: legacyResume.summary,
    profileImage: legacyResume.profileImage,
    customColors: legacyResume.customColors,

    contact: legacyResume.contact
      ? {
          ...legacyResume.contact,
          address: legacyResume.contact.location
            ? {
                city: extractCityFromLocation(legacyResume.contact.location),
                country: extractCountryFromLocation(
                  legacyResume.contact.location
                ),
              }
            : undefined,
          social: extractSocialLinks(legacyResume.contact),
        }
      : undefined,

    experience:
      // biome-ignore lint/suspicious/noExplicitAny: <ok for now>
      legacyResume.experience?.map((exp: any, index: number) => ({
        ...exp,
        id: exp.id || `exp-${index}`,
        startDate: parseDateString(exp.duration, 'start'),
        endDate: parseDateString(exp.duration, 'end'),
        responsibilities: exp.details?.filter(
          (detail: string) =>
            !containsMetrics(detail) && !containsAchievementKeywords(detail)
        ),
        achievements: exp.details?.filter(
          (detail: string) =>
            containsMetrics(detail) || containsAchievementKeywords(detail)
        ),
        technologies: extractTechnologies(exp.details?.join(' ') || ''),
        metrics: extractMetrics(exp.details?.join(' ') || ''),
      })) || [],

    // biome-ignore lint/suspicious/noExplicitAny: <ok for now>
    education: legacyResume.education?.map((edu: any, index: number) => ({
      ...edu,
      id: edu.id || `edu-${index}`,
      startDate: parseDateString(edu.duration, 'start'),
      endDate: parseDateString(edu.duration, 'end'),
    })),

    certifications: legacyResume.certifications?.map(
      // biome-ignore lint/suspicious/noExplicitAny: <ok for now>
      (cert: any, index: number) => ({
        ...cert,
        id: cert.id || `cert-${index}`,
        credentialId: cert.id,
      })
    ),

    skills: {
      all: legacyResume.skills || [],
      technical: legacyResume.skills?.map((skill: string) => ({
        name: skill,
        category: categorizeTechnicalSkill(skill),
      })),
    },

    metadata: {
      source: 'legacy-conversion',
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      figmaMapping: {
        primarySections: ['experience', 'skills', 'education'],
        contentPriority: ['name', 'title', 'contact', 'summary', 'experience'],
        visualEmphasis: ['name', 'title'],
      },
    },
  };

  return enhanced;
}

// Helper functions for data extraction and transformation
function extractCityFromLocation(location: string): string | undefined {
  const parts = location.split(',');
  return parts[0]?.trim();
}

function extractCountryFromLocation(location: string): string | undefined {
  const parts = location.split(',');
  return parts[parts.length - 1]?.trim();
}

function extractSocialLinks(
  // biome-ignore lint/suspicious/noExplicitAny: <ok for now>
  contact: any
): Array<{ platform: string; url: string; username?: string }> | undefined {
  const social: Array<{ platform: string; url: string; username?: string }> =
    [];

  if (contact.linkedin) {
    social.push({
      platform: 'LinkedIn',
      url: contact.linkedin,
      username: extractUsernameFromUrl(contact.linkedin, 'linkedin'),
    });
  }

  if (contact.github) {
    social.push({
      platform: 'GitHub',
      url: contact.github,
      username: extractUsernameFromUrl(contact.github, 'github'),
    });
  }

  return social.length > 0 ? social : undefined;
}

function extractUsernameFromUrl(
  url: string,
  platform: string
): string | undefined {
  if (!url || typeof url !== 'string') {
    return undefined;
  }
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    if (platform === 'linkedin') {
      const match = pathname.match(/\/in\/([^/]+)/);
      return match?.[1];
    }

    if (platform === 'github') {
      const match = pathname.match(/\/([^/]+)$/);
      return match?.[1];
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function parseDateString(
  duration: string | undefined,
  type: 'start' | 'end'
): string | undefined {
  if (!duration) return undefined;

  const dateRegex = /(\w+\s+\d{4})/g;
  const matches = duration.match(dateRegex);

  if (!matches) return undefined;

  const dateStr = type === 'start' ? matches[0] : matches[matches.length - 1];

  try {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  } catch {
    return undefined;
  }
}

function containsMetrics(text: string): boolean {
  const metricPatterns = [
    /\d+%/, // Percentages
    /\$[\d,]+/, // Dollar amounts
    /\d+[kKmM]/, // Thousands/millions (10k, 5M)
    /\d+x/, // Multipliers (2x, 10x)
    /\d+\+/, // Plus numbers (100+)
  ];

  return metricPatterns.some((pattern) => pattern.test(text));
}

function containsAchievementKeywords(text: string): boolean {
  const achievementKeywords = [
    'achieved',
    'improved',
    'increased',
    'reduced',
    'optimized',
    'implemented',
    'launched',
    'delivered',
    'led',
    'managed',
    'created',
    'developed',
    'built',
    'designed',
    'established',
  ];

  const lowerText = text.toLowerCase();
  return achievementKeywords.some((keyword) => lowerText.includes(keyword));
}

function extractTechnologies(text: string): string[] {
  const techKeywords = [
    // Programming languages
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C++',
    'C#',
    'Go',
    'Rust',
    'Swift',
    'Kotlin',
    // Frameworks
    'React',
    'Vue',
    'Angular',
    'Node.js',
    'Express',
    'Django',
    'Flask',
    'Spring',
    'Laravel',
    // Databases
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'SQLite',
    'DynamoDB',
    // Cloud/DevOps
    'AWS',
    'Azure',
    'GCP',
    'Docker',
    'Kubernetes',
    'Jenkins',
    'Git',
    'GitHub',
    'GitLab',
    // Other tools
    'Figma',
    'Sketch',
    'Adobe',
    'Photoshop',
    'Illustrator',
  ];

  const foundTech = techKeywords.filter((tech) =>
    text.toLowerCase().includes(tech.toLowerCase())
  );

  return [...new Set(foundTech)]; // Remove duplicates
}

function extractMetrics(
  text: string
): Array<{ description: string; value: string; unit?: string }> {
  const metrics: Array<{ description: string; value: string; unit?: string }> =
    [];

  // Extract percentages
  const percentageMatches = text.match(/(\d+)%/g);
  if (percentageMatches) {
    percentageMatches.forEach((match) => {
      metrics.push({
        description: 'Percentage improvement',
        value: match.replace('%', ''),
        unit: 'percent',
      });
    });
  }

  // Extract dollar amounts
  const dollarMatches = text.match(/\$(\d+(?:,\d+)*(?:[kKmM])?)/g);
  if (dollarMatches) {
    dollarMatches.forEach((match) => {
      metrics.push({
        description: 'Financial impact',
        value: match.replace('$', ''),
        unit: 'USD',
      });
    });
  }

  return metrics;
}

function categorizeTechnicalSkill(skill: string): string {
  const categories = {
    'Programming Languages': [
      'JavaScript',
      'TypeScript',
      'Python',
      'Java',
      'C++',
      'C#',
      'Go',
      'Rust',
    ],
    'Frontend Frameworks': ['React', 'Vue', 'Angular', 'Svelte'],
    'Backend Frameworks': ['Node.js', 'Express', 'Django', 'Flask', 'Spring'],
    Databases: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite'],
    'Cloud Platforms': ['AWS', 'Azure', 'GCP', 'Heroku'],
    'DevOps Tools': ['Docker', 'Kubernetes', 'Jenkins', 'Git'],
    'Design Tools': ['Figma', 'Sketch', 'Adobe', 'Photoshop'],
  };

  for (const [category, skills] of Object.entries(categories)) {
    if (skills.some((s) => skill.toLowerCase().includes(s.toLowerCase()))) {
      return category;
    }
  }

  return 'Other';
}
