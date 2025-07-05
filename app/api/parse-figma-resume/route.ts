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
function mapTextContent(text: string, layerName: string): string {
  const lower = text.toLowerCase();
  const layerLower = layerName.toLowerCase();
  
  // Map based on layer names from Figma structure
  if (layerLower.includes('summary-name') || layerLower.includes('name')) {
    return '{resume.name}';
  }
  if (layerLower.includes('summary-text') || layerLower.includes('summary-content')) {
    return '{resume.summary}';
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
  if (layerLower.includes('contact-email') || layerLower.includes('email')) {
    return '{resume.contact?.email}';
  }
  if (layerLower.includes('contact-phone') || layerLower.includes('phone')) {
    return '{resume.contact?.phone}';
  }
  if (layerLower.includes('contact-location') || layerLower.includes('location')) {
    return '{resume.contact?.location}';
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
  
  // Section titles
  if (lower.includes('experience') && layerLower.includes('sectiontitle')) {
    return '{"Experience"}';
  }
  if (lower.includes('education') && layerLower.includes('sectiontitle')) {
    return '{"Education"}';
  }
  if (lower.includes('contact') && layerLower.includes('sectiontitle')) {
    return '{"Contact"}';
  }
  if (lower.includes('certification') && layerLower.includes('sectiontitle')) {
    return '{"Certifications"}';
  }
  if (lower.includes('skills') && layerLower.includes('sectiontitle')) {
    return '{"Skills"}';
  }
  
  // Generic content mapping based on text content
  if (lower.includes('curriculum vitae') || lower.includes('resume')) {
    return '{resume.name}';
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

function nodeToJsx(node: FigmaNode): string {
  switch (node.type) {
    case 'TEXT':
      return `<p>${mapTextContent(node.characters || '', node.name)}</p>`;
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
      if (nodeName.includes('experience-list')) {
        return `<div className={${classNameAccess}}>{resume.experience?.map((exp, index) => (
          <div key={index} className={styles['experience-item']}>
            <div className={styles['exp-title']}><p>{exp.position || "Position"}</p></div>
            <div className={styles['exp-company']}><p>{exp.company || "Company"}</p></div>
            <div className={styles['exp-period']}><p>{exp.startDate && exp.endDate ? \`\${exp.startDate} - \${exp.endDate}\` : "Period"}</p></div>
            <div className={styles['exp-desc']}><p>{exp.description || "Job description"}</p></div>
          </div>
        )) || []}</div>`;
      }
      
      if (nodeName.includes('education-list') && !nodeName.includes('education-degree') && !nodeName.includes('education-year') && !nodeName.includes('education-school')) {
        return `<div className={${classNameAccess}}>{resume.education?.map((edu, index) => (
          <div key={index}>
            <p>{edu.degree || "Degree"}</p>
            <p>{edu.institution || "School"}</p>
            <p>{edu.year || "Year"}</p>
          </div>
        )) || []}</div>`;
      }
      
      if (nodeName.includes('certification-list') && !nodeName.includes('certificate-degree') && !nodeName.includes('certificate-school') && !nodeName.includes('certificate-year')) {
        return `<div className={${classNameAccess}}>{resume.certifications?.map((cert, index) => (
          <div key={index}>
            <p>{cert.name || "Certification"}</p>
            <p>{cert.issuer || "Issuer"}</p>
            <p>{cert.year || "Year"}</p>
          </div>
        )) || []}</div>`;
      }
      
      if (nodeName.includes('skills-list')) {
        return `<div className={${classNameAccess}}>{resume.skills?.map((skill, index) => (
          <div key={index} className={styles.skill}>
            <p>{skill}</p>
          </div>
        )) || []}</div>`;
      }
      
      if (nodeName.includes('contact-list')) {
        return `<div className={${classNameAccess}}>
          <p>{resume.contact?.email}</p>
          <p>{resume.contact?.phone}</p>
          <p>{resume.contact?.location}</p>
        </div>`;
      }
      
      // Skip individual experience-item, education-list items, etc. if they're inside a list
      if (nodeName.includes('experience-item') || 
          (nodeName.includes('education-list') && (nodeName.includes('degree') || nodeName.includes('school') || nodeName.includes('year'))) ||
          (nodeName.includes('certification-list') && (nodeName.includes('certificate') || nodeName.includes('issuer')))) {
        return ''; // Skip these as they're handled by the parent list
      }
      
      const childrenJsx = node.children?.map(nodeToJsx).join('\n') || '';
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
    const jsxBody = nodeToJsx(firstNode);
    
    // Extract colors from the Figma node
    const extractedColors = new Set<string>();
    extractColorsFromNode(firstNode, extractedColors);
    const colorsArray = Array.from(extractedColors);
    
    // Create color variables for CSS
    const primaryColor = colorsArray[0] || '#0891b2';
    const secondaryColor = colorsArray[1] || '#64748b';
    const accentColor = colorsArray[2] || '#06b6d4';

    const jsxCode = `import React from 'react';\nimport type { ParsedResume } from '@/lib/resume-parser/schema';\nimport styles from './${componentName}.module.css';\n\nexport const ${componentName}: React.FC<{ resume: ParsedResume }> = ({ resume }) => {\n  return (\n    ${jsxBody}\n  );\n};\n`;

    const cssModule = `/* Styles generated from Figma with extracted colors */
/* Primary: ${primaryColor}, Secondary: ${secondaryColor}, Accent: ${accentColor} */

.${firstNode.name.replace(/\s+/g, '').toLowerCase()} {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: ${secondaryColor};
}

.header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${primaryColor};
}

.name {
  font-size: 2.5rem;
  font-weight: 700;
  color: ${primaryColor};
  margin-bottom: 0.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 500;
  color: ${secondaryColor};
  margin-bottom: 1rem;
}

.contact {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: ${primaryColor};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${primaryColor}33;
}

.experience-item {
  margin-bottom: 1.5rem;
}

.job-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: ${primaryColor};
  margin-bottom: 0.25rem;
}

.company {
  font-size: 0.9rem;
  color: ${secondaryColor};
  margin-bottom: 0.5rem;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill {
  background-color: ${primaryColor}15;
  color: ${primaryColor};
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Responsive design */
@media (max-width: 768px) {
  .${firstNode.name.replace(/\s+/g, '').toLowerCase()} {
    padding: 1rem;
  }
  
  .name {
    font-size: 2rem;
  }
  
  .contact {
    flex-direction: column;
    gap: 0.5rem;
  }
}
`;

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