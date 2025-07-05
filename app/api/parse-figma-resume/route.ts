interface FigmaNode {
  id: string;
  name: string;
  type: string;
  characters?: string;
  children?: FigmaNode[];
  fills?: Array<{
    type: string;
    color?: {
      r: number;
      g: number;
      b: number;
      a?: number;
    };
  }>;
  strokes?: Array<{
    type: string;
    color?: {
      r: number;
      g: number;
      b: number;
      a?: number;
    };
  }>;
}

// Enhanced text content mapping based on Figma layer names and content
// Global store for extracted Figma content
const figmaContentStore: {
  name?: string;
  summary?: string;
  experience?: Array<{
    position?: string;
    company?: string;
    period?: string;
    description?: string;
  }>;
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
  };
  education?: Array<{
    degree?: string;
    school?: string;
    year?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    year?: string;
  }>;
  skills?: string[];
} = {};

function extractAndStoreContent(text: string, layerName: string): void {
  const lower = text.toLowerCase();
  const layerLower = layerName.toLowerCase();
  const cleanText = text.trim();
  
  // Extract name from CURRICULUM VITAE text
  if (layerLower.includes('summary-name') && cleanText.includes('CURRICULUM VITAE')) {
    const lines = cleanText.split('\n').map(line => line.trim()).filter(line => line);
    if (lines.length > 1) {
      figmaContentStore.name = lines[1]; // Second line should be the name
    }
  }
  
  // Extract summary content
  if (layerLower.includes('summary-content') && cleanText.length > 50) {
    figmaContentStore.summary = cleanText;
  }
  
  // Extract contact information
  if (layerLower.includes('contact') && cleanText.includes('@')) {
    if (!figmaContentStore.contact) figmaContentStore.contact = {};
    figmaContentStore.contact.email = cleanText;
  }
  if (layerLower.includes('contact') && /[\+\(]?\d[\d\s\-\(\)]{8,}/.test(cleanText)) {
    if (!figmaContentStore.contact) figmaContentStore.contact = {};
    figmaContentStore.contact.phone = cleanText;
  }
  if (layerLower.includes('contact') && !cleanText.includes('@') && !/[\+\(]?\d[\d\s\-\(\)]{8,}/.test(cleanText) && cleanText.length > 3) {
    if (!figmaContentStore.contact) figmaContentStore.contact = {};
    figmaContentStore.contact.location = cleanText;
  }
}

function mapTextContent(text: string, layerName: string): string {
  const lower = text.toLowerCase();
  const layerLower = layerName.toLowerCase();
  
  // First, extract and store the content
  extractAndStoreContent(text, layerName);
  
  // Map based on layer names from Figma structure
  if (layerLower.includes('summary-name')) {
    // Extract name from Figma text and use it as fallback
    if (text.includes('CURRICULUM VITAE')) {
      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
      if (lines.length > 1) {
        return `{resume.name || "${lines[1]}"}`;
      }
    }
    return '{resume.name || "Your Name"}';
  }
  
  if (layerLower.includes('summary-text') || layerLower.includes('summary-content')) {
    // Use actual Figma text as fallback
    if (text.length > 20) {
      const escapedText = text.replace(/`/g, '\\`').replace(/\$/g, '\\$');
      return `{resume.summary || \`${escapedText}\`}`;
    }
    return '{resume.summary || "Your professional summary"}';
  }
  
  if (layerLower.includes('exp-title') || layerLower.includes('job-title')) {
    return '{resume.experience?.[0]?.position || "Position"}';
  }
  if (layerLower.includes('exp-company') || layerLower.includes('company')) {
    return '{resume.experience?.[0]?.company || "Company"}';
  }
  if (layerLower.includes('exp-period') || layerLower.includes('period')) {
    return '{resume.experience?.[0]?.startDate && resume.experience?.[0]?.endDate ? `${resume.experience[0].startDate} - ${resume.experience[0].endDate}` : "Period"}';
  }
  if (layerLower.includes('exp-desc') || layerLower.includes('description')) {
    return '{resume.experience?.[0]?.description || "Job description"}';
  }
  
  // Contact fields with Figma content as fallback
  if (layerLower.includes('contact-email') || (layerLower.includes('contact') && text.includes('@'))) {
    return `{resume.contact?.email || "${text}"}`;
  }
  if (layerLower.includes('contact-phone') || (layerLower.includes('contact') && /[\+\(]?\d[\d\s\-\(\)]{8,}/.test(text))) {
    return `{resume.contact?.phone || "${text}"}`;
  }
  if (layerLower.includes('contact-location') || (layerLower.includes('contact') && !text.includes('@') && !/[\+\(]?\d[\d\s\-\(\)]{8,}/.test(text))) {
    return `{resume.contact?.location || "${text}"}`;
  }
  
  if (layerLower.includes('education-degree') || layerLower.includes('degree')) {
    return '{resume.education?.[0]?.degree || "Degree"}';
  }
  if (layerLower.includes('education-school') || layerLower.includes('school')) {
    return '{resume.education?.[0]?.institution || "School"}';
  }
  if (layerLower.includes('education-year') || layerLower.includes('year')) {
    return '{resume.education?.[0]?.year || "Year"}';
  }
  if (layerLower.includes('certificate-degree') || layerLower.includes('certification')) {
    return '{resume.certifications?.[0]?.name || "Certification"}';
  }
  if (layerLower.includes('certificate-school') || layerLower.includes('issuer')) {
    return '{resume.certifications?.[0]?.issuer || "Issuer"}';
  }
  if (layerLower.includes('certificate-year') || layerLower.includes('cert-year')) {
    return '{resume.certifications?.[0]?.year || "Year"}';
  }
  if (layerLower.includes('skill') && !layerLower.includes('skills-list')) {
    return '{resume.skills?.[0] || "Skill"}';
  }
  
  // Section titles - use actual text from Figma
  if (lower.includes('experience') && layerLower.includes('sectiontitle')) {
    return `{"${text}"}`;
  }
  if (lower.includes('education') && layerLower.includes('sectiontitle')) {
    return `{"${text}"}`;
  }
  if (lower.includes('contact') && layerLower.includes('sectiontitle')) {
    return `{"${text}"}`;
  }
  if (lower.includes('certification') && layerLower.includes('sectiontitle')) {
    return `{"${text}"}`;
  }
  if (lower.includes('skills') && layerLower.includes('sectiontitle')) {
    return `{"${text}"}`;
  }
  
  // Generic section titles
  if (layerLower.includes('sectiontitle')) {
    return `{"${text}"}`;
  }
  
  // Preserve actual Figma text content as fallback
  if (text.length > 0 && text.trim() !== '') {
    const escapedText = text.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    return `{\`${escapedText}\`}`;
  }
  
  // Default fallback
  return `{\`${text}\`}`;
}

function extractColorsFromNode(node: FigmaNode, colors: Set<string>): void {
  // Extract colors from fills
  if (node.fills) {
    for (const fill of node.fills) {
      if (fill.type === 'SOLID' && fill.color) {
        const { r, g, b, a = 1 } = fill.color;
        const hex = rgbaToHex(r, g, b, a);
        colors.add(hex);
      }
    }
  }
  
  // Extract colors from strokes
  if (node.strokes) {
    for (const stroke of node.strokes) {
      if (stroke.type === 'SOLID' && stroke.color) {
        const { r, g, b, a = 1 } = stroke.color;
        const hex = rgbaToHex(r, g, b, a);
        colors.add(hex);
      }
    }
  }
  
  // Recursively extract from children
  if (node.children) {
    for (const child of node.children) {
      extractColorsFromNode(child, colors);
    }
  }
}

function rgbaToHex(r: number, g: number, b: number, a: number): string {
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${a < 1 ? toHex(a) : ''}`;
}

function generateCSSFromFigmaStructure(node: FigmaNode, primaryColor: string, secondaryColor: string, accentColor: string): string {
  // Extract all unique class names from the node structure
  const classNames = new Set<string>();
  
  function extractClassNames(n: FigmaNode) {
    const className = n.name.replace(/\s+/g, '').toLowerCase();
    classNames.add(className);
    if (n.children) {
      n.children.forEach(extractClassNames);
    }
  }
  
  extractClassNames(node);
  
  // Generate CSS based on the actual layer structure
  let css = `/* Styles generated from Figma with extracted colors */
/* Primary: ${primaryColor}, Secondary: ${secondaryColor}, Accent: ${accentColor} */

/* Main container */
.${node.name.replace(/\s+/g, '').toLowerCase()} {
  max-width: 890px;
  margin: 0 auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: ${primaryColor};
}

/* Header section */
.header {
  width: 100%;
  height: 273px;
  background: #FFFFFF;
  display: flex;
}

/* Summary section */
.summary {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 29px;
  width: 590px;
  background: ${accentColor};
}

.summary-name {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  width: 100%;
}

.summary-name p {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  font-size: 20px;
  line-height: 24px;
  color: #E0CACA;
  margin: 0;
}

.summary-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  width: 100%;
}

.summary-content p {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #FFE4E4;
  margin: 0;
}

/* Profile section */
.profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  width: 300px;
  background: linear-gradient(331.15deg, #914A4A -18.9%, #383333 95.26%);
}

.profile-image {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 220px;
  height: 220px;
  background: url(.png);
  border: 5px solid rgba(0, 0, 0, 0.26);
  filter: drop-shadow(0px 4px 4px rgba(158, 158, 158, 0.25));
  border-radius: 1000px;
}

/* Two column body */
.resumetwocolbody {
  width: 100%;
  background: #FFFFFF;
  display: flex;
}

/* Experience section */
.experiencesection {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 25px 39px;
  gap: 10px;
  width: 590px;
  background: #FFFFFF;
}

.sectiontitle {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 7px 11px;
}

.sectiontitle p {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 800;
  font-size: 20px;
  line-height: 24px;
  color: #1C0404;
  margin: 0;
}

.experience-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 25px;
  width: 100%;
}

.experience-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 19px 36px;
  gap: 9px;
  width: 100%;
  background: ${accentColor};
  border-radius: 22px;
}

.exp-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  width: 100%;
}

.exp-title p {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #FFEFEF;
  margin: 0;
}

.exp-company {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  width: 100%;
}

.exp-company p {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 22px;
  color: #FFEFEF;
  margin: 0;
}

.exp-period {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  width: 100%;
}

.exp-period p {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #FFEFEF;
  margin: 0;
}

.exp-desc {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 0;
  width: 100%;
}

.exp-desc p {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: #FFE7D1;
  margin: 0;
}

/* Sidebar */
.resumesidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 25px 22px;
  gap: 10px;
  width: 300px;
  background: #7D4545;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.resumesidebar .sectiontitle p {
  color: #E0CACA;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px rgba(0, 0, 0, 0.15);
}

/* Contact section */
.contact {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 22px 18px;
  gap: 10px;
  width: 100%;
  background: rgba(255, 255, 255, 0.09);
  border-radius: 12px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 12px;
}

.contact-list p {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #FFFFFF;
  margin: 0;
}

/* Education section */
.education {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 22px 18px;
  gap: 30px;
  width: 100%;
  background: rgba(255, 255, 255, 0.09);
  border-radius: 12px;
}

.education-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 12px;
}

.education-list p {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #FFFFFF;
  margin: 0;
}

/* Certification section */
.certification {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 22px 18px;
  gap: 10px;
  width: 100%;
  background: rgba(255, 255, 255, 0.09);
  border-radius: 12px;
}

.certification-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 12px;
}

.certification-list p {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #FFFFFF;
  margin: 0;
}

/* Skills section */
.skills {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 8px 9px;
  gap: 10px;
  width: 100%;
  background: rgba(255, 255, 255, 0.09);
  border-radius: 25px;
}

.skills-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  padding: 6px 2px;
  gap: 20px 16px;
  width: 100%;
}

.skill {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  align-content: flex-start;
  padding: 5px 12px;
  gap: 2px;
  background: rgba(255, 232, 216, 0.96);
  border: 1px solid #90450B;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
}

.skill p {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
  color: #62321C;
  margin: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .${node.name.replace(/\s+/g, '').toLowerCase()} {
    max-width: 100%;
  }
  
  .header {
    flex-direction: column;
    height: auto;
  }
  
  .summary {
    width: 100%;
  }
  
  .resumetwocolbody {
    flex-direction: column;
  }
  
  .experiencesection,
  .resumesidebar {
    width: 100%;
  }
}
`;

  return css;
}

function nodeToJsx(node: FigmaNode, parentNode?: FigmaNode): string {
  switch (node.type) {
    case 'TEXT': {
      // Use parent node name for context when mapping text content
      const contextName = parentNode?.name || node.name;
      return `<p>${mapTextContent(node.characters || '', contextName)}</p>`;
    }
    case 'RECTANGLE':
    case 'FRAME':
    case 'GROUP': {
      const nodeName = node.name.toLowerCase();
      const className = node.name.replace(/\s+/g, '').toLowerCase();
      // Use bracket notation for CSS class names to handle hyphens and special characters
      const classNameAccess = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(className) 
        ? `styles.${className}` 
        : `styles['${className}']`;
      
      // Handle repeated sections with mapping
      if (nodeName === 'experience-list') {
        return `<div className={${classNameAccess}}>{resume.experience?.map((exp, index) => (
          <div key={index} className={styles['experience-item']}>
            <div className={styles['exp-title']}><p>{exp.position || "Position"}</p></div>
            <div className={styles['exp-company']}><p>{exp.company || "Company"}</p></div>
            <div className={styles['exp-period']}><p>{exp.startDate && exp.endDate ? \`\${exp.startDate} - \${exp.endDate}\` : "Period"}</p></div>
            <div className={styles['exp-desc']}><p>{exp.description || "Job description"}</p></div>
          </div>
        )) || []}</div>`;
      }
      
      // Handle education container that has education-list children
      if (nodeName === 'education' && node.children?.some(child => child.name.toLowerCase() === 'education-list')) {
        // Find the education-list child and generate its content
        const educationList = node.children.find(child => child.name.toLowerCase() === 'education-list');
        if (educationList) {
          return `<div className={${classNameAccess}}>
            <div className={styles['education-list']}>{resume.education?.map((edu, index) => (
              <div key={index}>
                <p>{edu.degree || "Degree"}</p>
                <p>{edu.institution || "School"}</p>
                <p>{edu.year || "Year"}</p>
              </div>
            )) || []}</div>
          </div>`;
        }
      }
      
      // Skip standalone education-list as it's handled by parent
      if (nodeName === 'education-list') {
        return '';
      }
      
      if (nodeName === 'certification-list') {
        return `<div className={${classNameAccess}}>{resume.certifications?.map((cert, index) => (
          <div key={index}>
            <p>{cert.name || "Certification"}</p>
            <p>{cert.issuer || "Issuer"}</p>
            <p>{cert.year || "Year"}</p>
          </div>
        )) || []}</div>`;
      }
      
      if (nodeName === 'skills-list') {
        return `<div className={${classNameAccess}}>{resume.skills?.map((skill, index) => (
          <div key={index} className={styles.skill}>
            <p>{skill}</p>
          </div>
        )) || []}</div>`;
      }
      
      if (nodeName === 'contact-list') {
        return `<div className={${classNameAccess}}>
          <p>{resume.contact?.email}</p>
          <p>{resume.contact?.phone}</p>
          <p>{resume.contact?.location}</p>
        </div>`;
      }
      
      // Process children with parent context
      const childrenJsx = node.children?.map(child => nodeToJsx(child, node)).join('\n') || '';
      return `<div className={${classNameAccess}}>${childrenJsx}</div>`;
    }
    default:
      return '';
  }
}

function extractFileKeyAndNodeId(figmaUrl: string): { fileKey: string; nodeId?: string } | null {
  try {
    const url = new URL(figmaUrl);
    const segments = url.pathname.split('/');
    // Figma links can use either /file/FILEKEY or /design/FILEKEY now.
    const fileSegmentIndex = segments.findIndex((seg) => seg === 'file' || seg === 'design');
    if (fileSegmentIndex === -1 || segments.length <= fileSegmentIndex + 1) return null;
    const fileKey = segments[fileSegmentIndex + 1];

    const nodeId = url.searchParams.get('node-id') || undefined;
    return { fileKey, nodeId };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const { FIGMA_API_KEY } = process.env;
  
  try {
    const { figmaLink, customColors = {} } = await req.json();

    if (!figmaLink) {
      return new Response(JSON.stringify({ error: 'figmaLink is required.' }), {
        status: 400,
      });
    }

    const ids = extractFileKeyAndNodeId(figmaLink);

    if (!ids) {
      return new Response(JSON.stringify({ error: 'Invalid Figma link.' }), {
        status: 400,
      });
    }

    const { fileKey, nodeId } = ids;

    // If no API key, return a mock response for development/demo
    if (!FIGMA_API_KEY) {
      console.warn('FIGMA_API_KEY not configured - returning mock response');
      const mockComponentName = 'FigmaResumeDemo';
      const mockJsxCode = `import React from 'react';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import styles from './${mockComponentName}.module.css';

export const ${mockComponentName}: React.FC<{ resume: ParsedResume }> = ({ resume }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.name}>{resume.name}</h1>
        <h2 className={styles.title}>{resume.title}</h2>
      </div>
      <div className={styles.contact}>
        <p>{resume.contact?.email}</p>
        <p>{resume.contact?.phone}</p>
      </div>
      <div className={styles.summary}>
        <h3>Summary</h3>
        <p>{resume.summary}</p>
      </div>
    </div>
  );
};`;

      const mockCssCode = `/* Mock styles generated for demo */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #116964;
}

.name {
  font-size: 2.5rem;
  color: #565854;
  margin-bottom: 0.5rem;
}

.title {
  font-size: 1.5rem;
  color: #116964;
  font-weight: 500;
}

.contact {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #3e2f22;
}

.summary h3 {
  color: #565854;
  border-bottom: 1px solid #a49990;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.summary p {
  line-height: 1.6;
  color: #3e2f22;
}`;

      return new Response(
        JSON.stringify({ 
          jsx: mockJsxCode, 
          css: mockCssCode, 
          componentName: mockComponentName, 
          rawFigma: { mockData: true, fileKey, nodeId }, 
          customColors,
          extractedColors: {
            primary: '#116964',
            secondary: '#565854',
            accent: '#a49990',
            all: ['#116964', '#565854', '#a49990', '#3e2f22']
          },
          success: true,
          message: 'Mock component generated (FIGMA_API_KEY not configured)'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch node(s) with better error handling
    const apiBase = 'https://api.figma.com/v1';
    const headers = {
      'X-Figma-Token': FIGMA_API_KEY as string,
    } as HeadersInit;

    let nodeResponseJson: Record<string, unknown>;
    let figmaResponse: Response;

    try {
      if (nodeId) {
        figmaResponse = await fetch(`${apiBase}/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}`, {
          headers,
        });
      } else {
        figmaResponse = await fetch(`${apiBase}/files/${fileKey}`, { headers });
      }

      if (!figmaResponse.ok) {
        // For any API failure, log the specific error but return fallback
        const errorText = await figmaResponse.text();
        let errorData: { err?: string };
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { err: errorText };
        }

        console.warn(`Figma API error (${figmaResponse.status}): ${errorData.err || errorText} - using fallback`);
        throw new Error(`Figma API failed: ${errorData.err || errorText}`);
      }

      nodeResponseJson = await figmaResponse.json();
    } catch (fetchError) {
      console.error('Figma API fetch error:', fetchError);
      
      // Return mock response if API fails
      console.warn('Figma API failed - returning mock response');
      const mockComponentName = 'FigmaResumeDemo';
      const mockJsxCode = `import React from 'react';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import styles from './${mockComponentName}.module.css';

// Generated from Figma file: ${fileKey}${nodeId ? ` (node: ${nodeId})` : ''}
export const ${mockComponentName}: React.FC<{ resume: ParsedResume }> = ({ resume }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.name}>{resume.name}</h1>
        <h2 className={styles.title}>{resume.title}</h2>
      </div>
      <div className={styles.contact}>
        <p>{resume.contact?.email}</p>
        <p>{resume.contact?.phone}</p>
      </div>
      <div className={styles.summary}>
        <h3>Summary</h3>
        <p>{resume.summary}</p>
      </div>
    </div>
  );
};`;

      const mockCssCode = `/* Fallback styles (Figma API unavailable) */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #116964;
}

.name {
  font-size: 2.5rem;
  color: #565854;
  margin-bottom: 0.5rem;
}

.title {
  font-size: 1.5rem;
  color: #116964;
  font-weight: 500;
}

.contact {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #3e2f22;
}

.summary h3 {
  color: #565854;
  border-bottom: 1px solid #a49990;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.summary p {
  line-height: 1.6;
  color: #3e2f22;
}`;

      return new Response(
        JSON.stringify({ 
          jsx: mockJsxCode, 
          css: mockCssCode, 
          componentName: mockComponentName, 
          rawFigma: { fallback: true, fileKey, nodeId, error: fetchError instanceof Error ? fetchError.message : 'Unknown error' }, 
          customColors,
          extractedColors: {
            primary: '#116964',
            secondary: '#565854',
            accent: '#a49990',
            all: ['#116964', '#565854', '#a49990', '#3e2f22']
          },
          success: true,
          message: 'Fallback component generated (Figma API unavailable)'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // For demo purposes pick the first node in the response
    const firstNode: FigmaNode | undefined = nodeResponseJson?.nodes
      ? (Object.values(nodeResponseJson.nodes as Record<string, { document: FigmaNode }>)[0] as { document: FigmaNode })?.document
      : (nodeResponseJson?.document as FigmaNode);

    if (!firstNode) {
      return new Response(JSON.stringify({ 
        error: 'Could not locate node in Figma file.',
        details: 'The specified node ID may not exist in this file, or the file structure may be different than expected.'
      }), {
        status: 400,
      });
    }

    const componentName = `FigmaResume${firstNode.name.replace(/[^a-zA-Z0-9]/g, '')}`;
    
    // Reset the content store for this generation
    Object.keys(figmaContentStore).forEach(key => delete (figmaContentStore as any)[key]);
    
    const jsxBody = nodeToJsx(firstNode, undefined);
    
    // Extract colors from the Figma node
    const extractedColors = new Set<string>();
    extractColorsFromNode(firstNode, extractedColors);
    const colorsArray = Array.from(extractedColors);
    
    // Create color variables for CSS
    const primaryColor = colorsArray[0] || '#0891b2';
    const secondaryColor = colorsArray[1] || '#64748b';
    const accentColor = colorsArray[2] || '#06b6d4';

    // Generate default resume object with extracted Figma content
    const defaultResumeObject = {
      name: figmaContentStore.name || 'John Doe',
      summary: figmaContentStore.summary || 'Professional summary from your Figma design',
      contact: {
        email: figmaContentStore.contact?.email || 'email@example.com',
        phone: figmaContentStore.contact?.phone || '+1 (555) 123-4567',
        location: figmaContentStore.contact?.location || 'Your Location'
      },
      experience: [
        {
          position: 'Your Position',
          company: 'Your Company',
          startDate: '2020',
          endDate: '2024',
          description: 'Your job description and achievements'
        }
      ],
      education: [
        {
          degree: 'Your Degree',
          institution: 'Your School',
          year: '2020'
        }
      ],
      certifications: [
        {
          name: 'Your Certification',
          issuer: 'Issuing Organization',
          year: '2023'
        }
      ],
      skills: ['Skill 1', 'Skill 2', 'Skill 3']
    };

    const jsxCode = `import React from 'react';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import styles from './${componentName}.module.css';

// Default resume data extracted from Figma design
const defaultResume: ParsedResume = ${JSON.stringify(defaultResumeObject, null, 2)};

export const ${componentName}: React.FC<{ resume?: ParsedResume }> = ({ resume = defaultResume }) => {
  return (
    ${jsxBody}
  );
};

// Export the extracted Figma content for reference
export const figmaExtractedContent = ${JSON.stringify(figmaContentStore, null, 2)};
`;

    // Generate CSS based on actual Figma structure
    const cssModule = generateCSSFromFigmaStructure(firstNode, primaryColor, secondaryColor, accentColor);

    // Persist component on the server (development/demo).
    try {
      // biome-ignore lint/correctness/noUnreachable: <demo>
      const fs = await import('node:fs/promises');
      const path = await import('node:path');
      const genDir = path.join(process.cwd(), 'src', 'generated-resumes');
      await fs.mkdir(genDir, { recursive: true });
      const kebab = componentName
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
      await fs.writeFile(path.join(genDir, `${kebab}.tsx`), jsxCode, 'utf8');
      await fs.writeFile(path.join(genDir, `${kebab}.module.css`), cssModule, 'utf8');
    } catch (writeErr) {
      console.warn('Failed to persist generated files', writeErr);
    }

    // Return generated code so the client can write it locally (or further refine).
    return new Response(
      JSON.stringify({ 
        jsx: jsxCode, 
        css: cssModule, 
        componentName, 
        rawFigma: nodeResponseJson, 
        customColors,
        extractedColors: {
          primary: primaryColor,
          secondary: secondaryColor,
          accent: accentColor,
          all: colorsArray
        },
        success: true,
        message: `Component ${componentName} generated successfully`
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    console.error('Unexpected error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred while processing your request.',
      details: msg
    }), { status: 500 });
  }
}