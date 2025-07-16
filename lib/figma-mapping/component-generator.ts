import type {
  FigmaElementMapping,
  GeneratedComponentBinding,
} from './mapping-engine';

export interface ComponentGenerationOptions {
  componentName: string;
  // biome-ignore lint/suspicious/noExplicitAny: <any is fine here>
  figmaNodeStructure: any;
  mappingBindings: GeneratedComponentBinding;
  extractedColors: {
    primary: string;
    secondary: string;
    accent: string;
    all: string[];
  };
  cssModuleName: string;
}

export interface GeneratedComponent {
  jsxCode: string;
  cssCode: string;
  componentName: string;
  dataBindings: Record<string, string>;
  conditionalLogic: string[];
  imports: string[];
}

export class ComponentGenerator {
  private options: ComponentGenerationOptions;
  private dataBindings: Record<string, string> = {};
  private conditionalLogic: string[] = [];

  constructor(options: ComponentGenerationOptions) {
    this.options = options;
  }

  public generateComponent(): GeneratedComponent {
    // Generate the main component structure
    const jsxCode = this.generateJSXCode();
    const cssCode = this.generateCSSCode();
    const imports = this.generateImports();

    return {
      jsxCode,
      cssCode,
      componentName: this.options.componentName,
      dataBindings: this.dataBindings,
      conditionalLogic: this.conditionalLogic,
      imports,
    };
  }

  private generateJSXCode(): string {
    const { componentName } = this.options;

    // Generate component props interface
    const propsInterface = this.generatePropsInterface();

    // Generate component body
    const componentBody = this.generateComponentBody();

    // Generate conditional rendering logic
    const conditionalHelpers = this.generateConditionalHelpers();

    return `import React from 'react';
import type { EnhancedParsedResume } from '@/lib/resume-parser/enhanced-schema';
import styles from './${this.toKebabCase(componentName)}.module.css';

${propsInterface}

${conditionalHelpers}

export const ${componentName}: React.FC<${componentName}Props> = ({ resume, className, style }) => {
  // Data validation and fallbacks
  const safeResume = validateResumeData(resume);
  
  // Dynamic styles with extracted colors
  const dynamicStyles = {
    '--figma-primary': '${this.options.extractedColors.primary}',
    '--figma-secondary': '${this.options.extractedColors.secondary}',
    '--figma-accent': '${this.options.extractedColors.accent}',
    ...style,
  } as React.CSSProperties;

  return (
    <div 
      className={\`\${styles.container} \${className || ''}\`}
      style={dynamicStyles}
    >
${componentBody}
    </div>
  );
};

export default ${componentName};`;
  }

  private generatePropsInterface(): string {
    const { componentName } = this.options;

    return `interface ${componentName}Props {
  resume: EnhancedParsedResume;
  className?: string;
  style?: React.CSSProperties;
}`;
  }

  private generateConditionalHelpers(): string {
    return `// Data validation and fallback helpers
function validateResumeData(resume: EnhancedParsedResume): EnhancedParsedResume {
  return {
    ...resume,
    name: resume.name || 'Your Name',
    title: resume.title || 'Your Title',
    contact: {
      ...resume.contact,
      email: resume.contact?.email || 'email@example.com',
      phone: resume.contact?.phone || '+1 (555) 123-4567',
      location: resume.contact?.location || 'City, Country',
    },
    experience: resume.experience || [],
    skills: resume.skills,
  };
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return 'Present';
  if (dateStr.toLowerCase() === 'present') return 'Present';
  
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  } catch {
    return dateStr;
  }
}

function formatDuration(startDate?: string, endDate?: string): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  if (start === end) return start;
  return \`\${start} - \${end}\`;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

function renderList(items: string[], maxItems: number = 5): string[] {
  return items.slice(0, maxItems);
}`;
  }

  private generateComponentBody(): string {
    const { mappingBindings } = this.options;
    let componentBody = '';

    // Generate sections based on mappings
    mappingBindings.mappings.forEach((mapping) => {
      const sectionCode = this.generateSectionCode(mapping);
      if (sectionCode) {
        componentBody += `      ${sectionCode}\n`;
      }
    });

    // If no specific mappings, generate a default structure
    if (componentBody.trim() === '') {
      componentBody = this.generateDefaultStructure();
    }

    return componentBody;
  }

  private generateSectionCode(mapping: FigmaElementMapping): string {
    const { elementType, elementId } = mapping;

    switch (elementType) {
      case 'text':
        return this.generateTextElement(mapping);
      case 'list':
        return this.generateListElement(mapping);
      case 'container':
        return this.generateContainerElement(mapping);
      case 'conditional':
        return this.generateConditionalElement(mapping);
      default:
        return `{/* Unmapped element: ${elementId} */}`;
    }
  }

  private generateTextElement(mapping: FigmaElementMapping): string {
    const { dataBinding, elementId, fallback, formatting } = mapping;

    // Generate data access path
    const dataPath = this.convertDataBindingToAccess(dataBinding);
    const className = this.generateClassName(elementId);

    // Apply formatting if specified
    let valueExpression = dataPath;
    if (formatting?.maxLength) {
      valueExpression = `truncateText(${dataPath} || '', ${formatting.maxLength})`;
    }
    if (formatting && (formatting.prefix || formatting.suffix)) {
      const prefix = formatting.prefix ? `'${formatting.prefix}' + ` : '';
      const suffix = formatting.suffix ? ` + '${formatting.suffix}'` : '';
      valueExpression = `${prefix}(${valueExpression})${suffix}`;
    }

    // Add fallback if specified
    if (fallback) {
      valueExpression = `${valueExpression} || '${fallback}'`;
    }

    this.dataBindings[elementId] = dataBinding;

    return `<span className={styles.${className}}>
        {${valueExpression}}
      </span>`;
  }

  private generateListElement(mapping: FigmaElementMapping): string {
    const { dataBinding, elementId } = mapping;
    const dataPath = this.convertDataBindingToAccess(dataBinding);
    const className = this.generateClassName(elementId);
    const itemClassName = this.generateClassName(`${elementId}-item`);

    this.dataBindings[elementId] = dataBinding;

    // Determine list type based on data binding
    if (dataBinding.includes('experience')) {
      return this.generateExperienceList(dataPath, className, itemClassName);
    }

    if (dataBinding.includes('education')) {
      return this.generateEducationList(dataPath, className, itemClassName);
    }

    if (dataBinding.includes('skills')) {
      return this.generateSkillsList(dataPath, className, itemClassName);
    }

    return this.generateGenericList(dataPath, className, itemClassName);
  }

  private generateExperienceList(
    dataPath: string,
    containerClass: string,
    itemClass: string
  ): string {
    return `<div className={styles.${containerClass}}>
        {${dataPath}?.map((exp, index) => (
          <div key={exp.id || \`exp-\${index}\`} className={styles.${itemClass}}>
            <div className={styles.experienceHeader}>
              <h3 className={styles.jobTitle}>{exp.title}</h3>
              <span className={styles.company}>{exp.company}</span>
            </div>
            <div className={styles.experienceMeta}>
              <span className={styles.duration}>
                {formatDuration(exp.startDate, exp.endDate) || exp.duration}
              </span>
              {exp.location && (
                <span className={styles.location}>{exp.location}</span>
              )}
            </div>
            {exp.details && exp.details.length > 0 && (
              <ul className={styles.experienceDetails}>
                {exp.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className={styles.detailItem}>
                    {detail}
                  </li>
                ))}
              </ul>
            )}
            {exp.technologies && exp.technologies.length > 0 && (
              <div className={styles.technologies}>
                {exp.technologies.map((tech, techIndex) => (
                  <span key={techIndex} className={styles.techTag}>
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>`;
  }

  private generateEducationList(
    dataPath: string,
    containerClass: string,
    itemClass: string
  ): string {
    return `<div className={styles.${containerClass}}>
        {${dataPath}?.map((edu, index) => (
          <div key={edu.id || \`edu-\${index}\`} className={styles.${itemClass}}>
            <div className={styles.educationHeader}>
              <h3 className={styles.degree}>{edu.degree}</h3>
              <span className={styles.institution}>{edu.institution}</span>
            </div>
            <div className={styles.educationMeta}>
              {edu.duration && (
                <span className={styles.duration}>{edu.duration}</span>
              )}
              {edu.location && (
                <span className={styles.location}>{edu.location}</span>
              )}
              {edu.gpa && (
                <span className={styles.gpa}>GPA: {edu.gpa}</span>
              )}
            </div>
            {edu.honors && edu.honors.length > 0 && (
              <div className={styles.honors}>
                {edu.honors.map((honor, honorIndex) => (
                  <span key={honorIndex} className={styles.honorTag}>
                    {honor}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>`;
  }

  private generateSkillsList(
    dataPath: string,
    containerClass: string,
    itemClass: string
  ): string {
    return `<div className={styles.${containerClass}}>
        {${dataPath}?.map((skill, index) => (
          <span key={index} className={styles.${itemClass}}>
            {typeof skill === 'string' ? skill : skill.name}
          </span>
        ))}
      </div>`;
  }

  private generateGenericList(
    dataPath: string,
    containerClass: string,
    itemClass: string
  ): string {
    return `<div className={styles.${containerClass}}>
        {${dataPath}?.map((item, index) => (
          <div key={index} className={styles.${itemClass}}>
            {typeof item === 'string' ? item : JSON.stringify(item)}
          </div>
        ))}
      </div>`;
  }

  private generateContainerElement(mapping: FigmaElementMapping): string {
    const { elementId } = mapping;
    const className = this.generateClassName(elementId);

    return `<div className={styles.${className}}>
        {/* Container content will be populated by child elements */}
      </div>`;
  }

  private generateConditionalElement(mapping: FigmaElementMapping): string {
    const { dataBinding, elementId, conditions } = mapping;

    if (!conditions || conditions.length === 0) {
      return this.generateTextElement(mapping);
    }

    const condition = this.generateConditionExpression(conditions[0]);
    const className = this.generateClassName(elementId);
    const dataPath = this.convertDataBindingToAccess(dataBinding);

    this.conditionalLogic.push(`Conditional rendering for ${elementId}`);

    return `{${condition} && (
        <div className={styles.${className}}>
          {${dataPath}}
        </div>
      )}`;
  }

  private generateDefaultStructure(): string {
    return `{/* Header Section */}
      <header className={styles.header}>
        <h1 className={styles.name}>{safeResume.name}</h1>
        <h2 className={styles.title}>{safeResume.title}</h2>
        <div className={styles.contact}>
          <span className={styles.email}>{safeResume.contact?.email}</span>
          <span className={styles.phone}>{safeResume.contact?.phone}</span>
          <span className={styles.location}>{safeResume.contact?.location}</span>
        </div>
      </header>

      {/* Summary Section */}
      {safeResume.summary && (
        <section className={styles.summary}>
          <h3 className={styles.sectionTitle}>Summary</h3>
          <p className={styles.summaryText}>{safeResume.summary}</p>
        </section>
      )}

      {/* Experience Section */}
      {safeResume.experience && safeResume.experience.length > 0 && (
        <section className={styles.experience}>
          <h3 className={styles.sectionTitle}>Experience</h3>
          ${this.generateExperienceList('safeResume.experience', 'experienceList', 'experienceItem')}
        </section>
      )}

      {/* Skills Section */}
      {safeResume.skills?.all && safeResume.skills.length > 0 && (
        <section className={styles.skills}>
          <h3 className={styles.sectionTitle}>Skills</h3>
          ${this.generateSkillsList('safeResume.skills', 'skillsList', 'skillItem')}
        </section>
      )}

      {/* Education Section */}
      {safeResume.education && safeResume.education.length > 0 && (
        <section className={styles.education}>
          <h3 className={styles.sectionTitle}>Education</h3>
          ${this.generateEducationList('safeResume.education', 'educationList', 'educationItem')}
        </section>
      )}`;
  }

  private generateCSSCode(): string {
    const { componentName, extractedColors } = this.options;
    const { primary, secondary, accent } = extractedColors;

    return `/* Generated CSS for ${componentName} */
/* Colors extracted from Figma: Primary: ${primary}, Secondary: ${secondary}, Accent: ${accent} */

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--figma-secondary, ${secondary});
  background: var(--figma-background, #ffffff);
}

/* Header Styles */
.header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--figma-primary, ${primary});
}

.name {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--figma-primary, ${primary});
  margin: 0 0 0.5rem 0;
}

.title {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--figma-secondary, ${secondary});
  margin: 0 0 1rem 0;
}

.contact {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: var(--figma-secondary, ${secondary});
}

.email,
.phone,
.location {
  position: relative;
}

.email::before {
  content: '📧 ';
}

.phone::before {
  content: '📞 ';
}

.location::before {
  content: '📍 ';
}

/* Section Styles */
.sectionTitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--figma-primary, ${primary});
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--figma-primary, ${primary})33;
}

.summary {
  margin-bottom: 2rem;
}

.summaryText {
  line-height: 1.6;
  color: var(--figma-secondary, ${secondary});
  margin: 0;
}

/* Experience Styles */
.experience {
  margin-bottom: 2rem;
}

.experienceList {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.experienceItem {
  padding: 1rem;
  border: 1px solid var(--figma-primary, ${primary})20;
  border-radius: 0.5rem;
  background: var(--figma-background, #ffffff);
}

.experienceHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.jobTitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--figma-primary, ${primary});
  margin: 0;
}

.company {
  font-size: 1rem;
  font-weight: 500;
  color: var(--figma-secondary, ${secondary});
}

.experienceMeta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--figma-secondary, ${secondary});
}

.duration,
.location {
  font-style: italic;
}

.experienceDetails {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.detailItem {
  position: relative;
  padding-left: 1rem;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.detailItem::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--figma-accent, ${accent});
}

.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.techTag {
  background: var(--figma-accent, ${accent})20;
  color: var(--figma-accent, ${accent});
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Education Styles */
.education {
  margin-bottom: 2rem;
}

.educationList {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.educationItem {
  padding: 1rem;
  border: 1px solid var(--figma-primary, ${primary})20;
  border-radius: 0.5rem;
}

.educationHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.degree {
  font-size: 1rem;
  font-weight: 600;
  color: var(--figma-primary, ${primary});
  margin: 0;
}

.institution {
  font-size: 0.9rem;
  color: var(--figma-secondary, ${secondary});
}

.educationMeta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--figma-secondary, ${secondary});
}

.gpa {
  font-weight: 500;
}

.honors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.honorTag {
  background: var(--figma-primary, ${primary})15;
  color: var(--figma-primary, ${primary});
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Skills Styles */
.skills {
  margin-bottom: 2rem;
}

.skillsList {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skillItem {
  background: var(--figma-primary, ${primary})15;
  color: var(--figma-primary, ${primary});
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .name {
    font-size: 2rem;
  }
  
  .contact {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .experienceHeader,
  .educationHeader {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .experienceMeta,
  .educationMeta {
    flex-direction: column;
    gap: 0.25rem;
  }
}

/* Print Styles */
@media print {
  .container {
    max-width: none;
    margin: 0;
    padding: 1rem;
    font-size: 12pt;
  }
  
  .name {
    font-size: 18pt;
  }
  
  .title {
    font-size: 14pt;
  }
  
  .sectionTitle {
    font-size: 13pt;
  }
}`;
  }

  private generateImports(): string[] {
    return [
      "import React from 'react';",
      "import type { EnhancedParsedResume } from '@/lib/resume-parser/enhanced-schema';",
      `import styles from './${this.toKebabCase(this.options.componentName)}.module.css';`,
    ];
  }

  private convertDataBindingToAccess(dataBinding: string): string {
    // Convert dot notation to safe property access
    const parts = dataBinding.split('.');
    let accessPath = 'safeResume';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part === 'resume') continue; // Skip 'resume' prefix

      // Use optional chaining for nested properties
      if (i === 0 || parts[i - 1] === 'resume') {
        accessPath += `.${part}`;
      } else {
        accessPath += `?.${part}`;
      }
    }

    return accessPath;
  }

  private generateClassName(elementId: string): string {
    return elementId
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }

  // biome-ignore lint/suspicious/noExplicitAny: <testing>
  private generateConditionExpression(condition: any): string {
    const { field, operator, value } = condition;
    const fieldAccess = this.convertDataBindingToAccess(field);

    switch (operator) {
      case 'exists':
        return `${fieldAccess} !== undefined && ${fieldAccess} !== null`;
      case 'equals':
        return `${fieldAccess} === '${value}'`;
      case 'contains':
        return `${fieldAccess}?.includes('${value}')`;
      case 'length':
        return `${fieldAccess}?.length ${value}`;
      case 'greater':
        return `${fieldAccess} > ${value}`;
      case 'less':
        return `${fieldAccess} < ${value}`;
      default:
        return 'true';
    }
  }

  private toKebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }
}
