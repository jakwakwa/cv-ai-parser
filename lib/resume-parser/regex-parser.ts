import { MAX_REGEX_CONFIDENCE } from '@/lib/config';
import type { ParsedResume } from './schema';

const SECTIONS = {
  SUMMARY: ['SUMMARY', 'PROFILE', 'ABOUT'],
  EXPERIENCE: ['EXPERIENCE', 'EMPLOYMENT HISTORY', 'WORK EXPERIENCE'],
  EDUCATION: ['EDUCATION', 'ACADEMIC BACKGROUND'],
  CERTIFICATIONS: ['CERTIFICATIONS', 'LICENSES', 'AWARDS'],
  SKILLS: ['SKILLS', 'TECHNOLOGIES'],
  PROJECTS: ['PROJECTS'],
  PREFERENCES: ['PREFERENCES', 'MY PREFERENCES'],
};

const ALL_SECTION_KEYWORDS = Object.values(SECTIONS).flat();

// --- Helper Functions ---

function extractSectionContent(
  content: string,
  startKeywords: string[],
  endKeywords: string[]
): string {
  const startRegex = new RegExp(
    `^\\s*(?:${startKeywords.join('|')})\\s*[:\n]`,
    'im'
  );
  const endRegex = new RegExp(
    `^\\s*(?:${endKeywords.join('|')})\\s*[:\n]`,
    'im'
  );

  const startIndexMatch = content.match(startRegex);
  if (!startIndexMatch || typeof startIndexMatch.index === 'undefined')
    return '';

  const contentFromStart = content.substring(
    startIndexMatch.index + startIndexMatch[0].length
  );
  const endIndexMatch = contentFromStart.match(endRegex);

  return endIndexMatch && typeof endIndexMatch.index !== 'undefined'
    ? contentFromStart.substring(0, endIndexMatch.index).trim()
    : contentFromStart.trim();
}

// --- Extraction Logic ---

function extractNameAndTitle(lines: string[]): { name: string; title: string } {
  let name = 'Unknown Name';
  const nameRegex = /^[A-Z][a-z]+ [A-Z][a-z\s]+$|^[A-Z\s]+$/;

  // Find the first line that looks like a name and is not a section header
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (
      nameRegex.test(trimmedLine) &&
      !ALL_SECTION_KEYWORDS.includes(trimmedLine.toUpperCase()) &&
      trimmedLine.length < 50
    ) {
      name = trimmedLine;
      break;
    }
  }

  let title = '';
  const roleLine = lines.find((line) =>
    line.trim().toLowerCase().startsWith('current role:')
  );

  if (roleLine) {
    title = roleLine.substring(roleLine.toLowerCase().indexOf(':') + 1).trim();
  }

  return { name, title };
}

function extractContactInfo(content: string): ParsedResume['contact'] {
  const contact: ParsedResume['contact'] = {};
  const emailMatch = content.match(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
  );
  if (emailMatch) contact.email = emailMatch[0];

  const phoneMatch = content.match(/(\+?[\d\s\-()]{10,15})/);
  if (phoneMatch) contact.phone = phoneMatch[0].replace(/[\s\-()]/g, '');

  const linkedinMatch = content.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
  if (linkedinMatch) contact.linkedin = `https://www.${linkedinMatch[0]}`;

  const githubMatch = content.match(/github\.com\/([a-zA-Z0-9-]+)/i);
  if (githubMatch) contact.github = `https://www.${githubMatch[0]}`;

  const locationMatch = content.match(
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/
  );
  if (locationMatch) contact.location = locationMatch[0];

  return contact;
}

function extractExperience(
  content: string,
  endKeywords: string[]
): ParsedResume['experience'] {
  const experienceSection = extractSectionContent(
    content,
    SECTIONS.EXPERIENCE,
    endKeywords
  );

  if (!experienceSection) return [];

  const experiences: ParsedResume['experience'] = [];

  // This regex uses a positive lookahead to split the text *before* a line that looks like a new job header.
  const jobDelimiterPattern =
    /^(?!\s*[*•-])(?=Company:.*|.*,.*(?:engineer|developer|manager|designer|consultant|specialist|analyst|lead|ui\/ux|development).*)/im;

  const jobBlocks = experienceSection
    .trim()
    .split(jobDelimiterPattern)
    .filter((block) => block.trim().length > 0);

  const rolePattern = /Role:\s*(.+)/i;
  const datePattern = /Date:\s*(.+)/i;
  const companyPattern = /Company:\s*(.+)/i;
  const bulletPattern = /^[*•-]\s+/;
  const descriptionHeaderPattern =
    /^(Description|Responsibilities|Description \/ Responsibilities):/i;
  const titleKeywords =
    /engineer|developer|manager|designer|consultant|specialist|analyst|lead|ui\/ux|development/i;
  const generalDatePattern =
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Present|Current|\d{4})\b.*(?:to|–|—|-|Present|Current).*\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Present|Current|\d{4})\b/i;

  for (const block of jobBlocks) {
    const lines = block.trim().split('\n');
    let title: string | undefined;
    let company: string | undefined;
    let duration: string | undefined;
    const details: string[] = [];

    let headerLineProcessed = false;

    if (lines.length > 0) {
      const headerLine = lines[0].trim();
      const companyMatch = headerLine.match(companyPattern);

      if (companyMatch) {
        const content = companyMatch[1];
        const parts = content.split(',').map((p) => p.trim());
        company = parts.find((p) => !p.toLowerCase().startsWith('role:'));
        const rolePart = parts.find((p) => p.toLowerCase().startsWith('role:'));
        if (rolePart) {
          title = rolePart.replace(/Role:\s*/i, '').trim();
        }
        headerLineProcessed = true;
      } else if (headerLine.includes(',') && titleKeywords.test(headerLine)) {
        const parts = headerLine.split(',').map((p) => p.trim());
        title = parts.find((p) => titleKeywords.test(p));
        company = parts.find((p) => !titleKeywords.test(p));
        headerLineProcessed = true;
      }
    }

    for (let i = headerLineProcessed ? 1 : 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      if (trimmedLine.length === 0) continue;

      const roleMatch = trimmedLine.match(rolePattern);
      const dateMatch = trimmedLine.match(datePattern);

      if (roleMatch && !title) {
        title = roleMatch[1].trim();
      } else if (dateMatch) {
        duration = dateMatch[1].trim();
      } else if (generalDatePattern.test(trimmedLine) && !duration) {
        duration = trimmedLine;
      } else if (descriptionHeaderPattern.test(trimmedLine)) {
        // Ignore the header itself
      } else {
        if (bulletPattern.test(line)) {
          details.push(line.replace(bulletPattern, '').trim());
        } else if (details.length > 0) {
          details[details.length - 1] += ` ${trimmedLine}`;
        } else {
          details.push(trimmedLine);
        }
      }
    }

    const finalDetails = details.filter((d) => d.length > 0);

    if (company || title || finalDetails.length > 0) {
      experiences.push({
        title,
        company,
        duration,
        details: finalDetails,
        role: '',
      });
    }
  }

  return experiences;
}

function extractEducation(
  content: string,
  endKeywords: string[]
): ParsedResume['education'] {
  const educationSection = extractSectionContent(
    content,
    SECTIONS.EDUCATION,
    endKeywords
  );

  if (!educationSection) return [];

  const educationEntries: ParsedResume['education'] = [];
  const lines = educationSection
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const institutionRegex =
    /(?:University|College|Institute|Academy|School)\s*(?:of)?\s*[A-Z][a-zA-Z\s,\-.]*/i;
  const degreeRegex =
    /(?:Bachelor|Master|Ph\.D\.|Associate)\s*(?:of)?\s*[A-Z][a-zA-Z\s,\-.]*|Diploma|Certi fi cate/i;
  const yearRangeRegex =
    /\b\d{4}\s*(?:-|to|–|—)?\s*(?:Present|Current|\d{4})?\b/i;

  let currentEducation: {
    institution: string;
    degree: string;
    duration: string;
  } | null = null;

  for (const line of lines) {
    const institutionMatch = line.match(institutionRegex);
    const degreeMatch = line.match(degreeRegex);
    const yearMatch = line.match(yearRangeRegex);

    if (institutionMatch || degreeMatch || yearMatch) {
      if (currentEducation) {
        educationEntries.push(currentEducation);
      }
      currentEducation = {
        institution: institutionMatch
          ? institutionMatch[0]
          : 'Unknown Institution',
        degree: degreeMatch ? degreeMatch[0] : 'Unknown Degree',
        duration: yearMatch ? yearMatch[0] : 'Unknown Duration',
      };
    } else if (currentEducation) {
      if (line.length > 0) {
        // This part could be expanded to capture details related to the degree if needed
      }
    }
  }
  if (currentEducation) {
    educationEntries.push(currentEducation);
  }

  if (educationEntries.length === 0 && educationSection.length > 0) {
    educationEntries.push({
      institution: 'Education Details',
      degree: 'See text below',
      duration: 'N/A',
    });
  }

  return educationEntries;
}

function extractCertifications(
  content: string,
  endKeywords: string[]
): ParsedResume['certifications'] {
  const certificationsSection = extractSectionContent(
    content,
    SECTIONS.CERTIFICATIONS,
    endKeywords
  );

  if (!certificationsSection) return [];

  const certifications: ParsedResume['certifications'] = [];
  const lines = certificationsSection
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  let currentCert: {
    name: string;
    issuer: string;
    date?: string;
    id?: string;
  } | null = null;

  for (const line of lines) {
    const isNewCertTitle =
      line.length > 3 &&
      line.length < 100 &&
      !/^(Course|Issuer|Credential ID|Date|CODECADEMY|Udemy|Coursera)/i.test(
        line
      ) &&
      line
        .split(' ')
        .some((word) => word.length > 3 && word[0] === word[0].toUpperCase());

    if (isNewCertTitle) {
      if (currentCert) certifications.push(currentCert);
      currentCert = {
        name: line.replace(/:/g, '').trim(),
        issuer: 'Unknown Issuer',
      };
    } else if (currentCert) {
      const issuerMatch = line.match(
        /(?:Issuer|CODECADEMY|Udemy|Coursera|from|by)\s*:?\s*([^\n]+)/i
      );
      const dateMatch = line.match(
        /(?:Date|September|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Oct|Nov|Dec)\s*:?\s*([^\n]+)/i
      );
      const idMatch = line.match(/(?:Credential ID:)\s*([^\n]+)/i);

      if (issuerMatch && currentCert.issuer === 'Unknown Issuer') {
        currentCert.issuer = issuerMatch[1].trim();
      }
      if (dateMatch && !currentCert.date) {
        currentCert.date = dateMatch[1].trim();
      }
      if (idMatch && !currentCert.id) {
        currentCert.id = idMatch[1].trim();
      }
    }
  }

  if (currentCert) certifications.push(currentCert);

  if (certifications.length === 0 && certificationsSection.length > 0) {
    certifications.push({
      name: 'Certifications Details',
      issuer: 'See text below',
    });
  }

  return certifications;
}

// --- Main Parser Function ---

export function parseWithRegex(content: string): {
  data: ParsedResume;
  confidence: number;
} {
  console.log('Starting fallback regex parsing...');
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const { name, title } = extractNameAndTitle(lines);
  const contact = extractContactInfo(content);

  const summaryEndKeywords = ALL_SECTION_KEYWORDS.filter(
    (k) => !SECTIONS.SUMMARY.includes(k)
  );
  const summary = extractSectionContent(
    content,
    SECTIONS.SUMMARY,
    summaryEndKeywords
  );

  const experienceEndKeywords = ALL_SECTION_KEYWORDS.filter(
    (k) => !SECTIONS.EXPERIENCE.includes(k)
  );
  const experience = extractExperience(content, experienceEndKeywords);

  const educationEndKeywords = ALL_SECTION_KEYWORDS.filter(
    (k) => !SECTIONS.EDUCATION.includes(k)
  );
  const education = extractEducation(content, educationEndKeywords);

  const certificationsEndKeywords = ALL_SECTION_KEYWORDS.filter(
    (k) => !SECTIONS.CERTIFICATIONS.includes(k)
  );
  const certifications = extractCertifications(
    content,
    certificationsEndKeywords
  );

  const skillsEndKeywords = ALL_SECTION_KEYWORDS.filter(
    (k) => !SECTIONS.SKILLS.includes(k)
  );
  const skillsText = extractSectionContent(
    content,
    SECTIONS.SKILLS,
    skillsEndKeywords
  );
  const skills = skillsText
    .split(/[,•\n|]/)
    .map((s) => s.trim())
    .filter(Boolean);

  let confidence = 0;
  if (name !== 'Unknown Name') confidence += 20;
  if (title !== 'Professional') confidence += 15;
  if (contact && Object.keys(contact).length > 0) confidence += 20;
  if (summary.length > 20) confidence += 10;
  if (experience.length > 0) confidence += 20;
  if (education && education.length > 0) confidence += 10;
  if (certifications && certifications.length > 0) confidence += 5;
  if (skills.length > 0) confidence += 10;

  const parsedData: ParsedResume = {
    name,
    title,
    summary: summary || 'Summary not found.',
    contact,
    experience: experience.length > 0 ? experience : [],
    education: education && education.length > 0 ? education : [],
    certifications:
      certifications && certifications.length > 0 ? certifications : [],
    skills: skills.length > 0 ? skills : ['Skills not found.'],
  };

  console.log(`Regex parsing completed with ${confidence}% confidence.`);
  return {
    data: parsedData,
    confidence: Math.min(confidence, MAX_REGEX_CONFIDENCE),
  };
}
