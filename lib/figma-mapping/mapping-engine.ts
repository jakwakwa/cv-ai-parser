/** biome-ignore-all lint/suspicious/noExplicitAny: <temp fix> */
import type {
  EnhancedParsedResume,
  FigmaMappingConfig,
} from '@/lib/resume-parser/enhanced-schema';
import { dataTransformers } from '@/lib/resume-parser/enhanced-schema';

export interface MappingResult {
  success: boolean;
  mappedData: Record<string, any>;
  errors: string[];
  warnings: string[];
  statistics: {
    totalFields: number;
    mappedFields: number;
    missingFields: number;
    transformedFields: number;
  };
}

export interface FigmaElementMapping {
  elementId: string;
  elementType: 'text' | 'container' | 'image' | 'list' | 'conditional';
  dataBinding: string;
  transform?: string;
  fallback?: string;
  conditions?: Array<{
    field: string;
    operator: 'exists' | 'equals' | 'contains' | 'length' | 'greater' | 'less';
    value?: any;
  }>;
  formatting?: {
    maxLength?: number;
    prefix?: string;
    suffix?: string;
    dateFormat?: string;
    numberFormat?: string;
  };
}

export interface GeneratedComponentBinding {
  componentName: string;
  mappings: FigmaElementMapping[];
  dataRequirements: string[];
  conditionalSections: string[];
  dynamicContent: Record<string, any>;
}

export class FigmaMappingEngine {
  private resumeData: EnhancedParsedResume;
  private mappingConfig: FigmaMappingConfig;
  private errors: string[] = [];
  private warnings: string[] = [];

  constructor(
    resumeData: EnhancedParsedResume,
    mappingConfig: FigmaMappingConfig
  ) {
    this.resumeData = resumeData;
    this.mappingConfig = mappingConfig;
  }

  public mapResumeToFigma(): MappingResult {
    this.errors = [];
    this.warnings = [];

    try {
      // Step 1: Map individual fields
      const fieldMappings = this.mapFields();

      // Step 2: Map sections and arrays
      const sectionMappings = this.mapSections();

      // Step 3: Apply conditional rules
      const conditionalMappings = this.applyConditionalRules();

      // Step 4: Apply style mappings
      const styleMappings = this.applyStyleMappings();

      // Combine all mappings
      const mappedData = {
        ...fieldMappings,
        ...sectionMappings,
        ...conditionalMappings,
        ...styleMappings,
      };

      // Calculate statistics
      const statistics = this.calculateStatistics(mappedData);

      return {
        success: this.errors.length === 0,
        mappedData,
        errors: this.errors,
        warnings: this.warnings,
        statistics,
      };
    } catch (error) {
      this.errors.push(
        `Mapping failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return {
        success: false,
        mappedData: {},
        errors: this.errors,
        warnings: this.warnings,
        statistics: {
          totalFields: 0,
          mappedFields: 0,
          missingFields: 0,
          transformedFields: 0,
        },
      };
    }
  }

  private mapFields(): Record<string, any> {
    const mappedFields: Record<string, any> = {};

    Object.entries(this.mappingConfig.fieldMappings).forEach(
      ([fieldKey, mapping]) => {
        try {
          // Get data from resume using data path
          const rawValue = this.getNestedValue(
            this.resumeData,
            mapping.dataPath
          );

          if (rawValue === undefined || rawValue === null) {
            if (mapping.required) {
              this.errors.push(
                `Required field '${fieldKey}' is missing from resume data`
              );
            } else if (mapping.fallback) {
              mappedFields[mapping.figmaPath] = mapping.fallback;
              this.warnings.push(`Using fallback value for '${fieldKey}'`);
            }
            return;
          }

          // Apply transformation if specified
          let transformedValue = rawValue;
          if (mapping.transform && mapping.transform !== 'none') {
            transformedValue = this.applyTransformation(
              rawValue,
              mapping.transform,
              mapping.maxLength
            );
          }

          // Apply max length if specified
          if (mapping.maxLength && typeof transformedValue === 'string') {
            transformedValue = dataTransformers.truncate(
              transformedValue,
              mapping.maxLength
            );
          }

          mappedFields[mapping.figmaPath] = transformedValue;
        } catch (error) {
          this.errors.push(
            `Error mapping field '${fieldKey}': ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }
    );

    return mappedFields;
  }

  private mapSections(): Record<string, any> {
    const mappedSections: Record<string, any> = {};

    Object.entries(this.mappingConfig.sectionMappings).forEach(
      ([sectionKey, mapping]) => {
        try {
          // Get data array from resume
          const sectionData = this.getNestedValue(
            this.resumeData,
            mapping.dataSource
          );

          if (!Array.isArray(sectionData)) {
            this.warnings.push(`Section '${sectionKey}' data is not an array`);
            return;
          }

          // Check show condition
          if (mapping.showIf && !this.evaluateCondition(mapping.showIf)) {
            mappedSections[`${mapping.figmaContainer}.visible`] = false;
            return;
          }

          // Sort data if specified
          let sortedData = sectionData;
          if (mapping.sortBy) {
            sortedData = this.sortSectionData(sectionData, mapping.sortBy);
          }

          // Limit items if specified
          if (mapping.maxItems && sortedData.length > mapping.maxItems) {
            sortedData = sortedData.slice(0, mapping.maxItems);
            this.warnings.push(
              `Section '${sectionKey}' limited to ${mapping.maxItems} items`
            );
          }

          // Map each item in the section
          mappedSections[mapping.figmaContainer] = sortedData.map(
            (item, index) =>
              this.mapSectionItem(
                item,
                index,
                mapping.itemTemplate || 'default'
              )
          );

          mappedSections[`${mapping.figmaContainer}.visible`] = true;
          mappedSections[`${mapping.figmaContainer}.count`] = sortedData.length;
        } catch (error) {
          this.errors.push(
            `Error mapping section '${sectionKey}': ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }
    );

    return mappedSections;
  }

  private mapSectionItem(
    item: any,
    index: number,
    _template: string
  ): Record<string, any> {
    const mappedItem: Record<string, any> = {
      index,
      id: item.id || `item-${index}`,
    };

    // Map common fields based on item type
    if (item.title || item.name) {
      mappedItem.title = item.title || item.name;
    }

    if (item.company || item.institution || item.organization) {
      mappedItem.subtitle =
        item.company || item.institution || item.organization;
    }

    if (item.duration || item.date) {
      mappedItem.duration = item.duration || item.date;
    }

    if (item.location) {
      mappedItem.location = item.location;
    }

    // Map details/description arrays
    if (item.details && Array.isArray(item.details)) {
      mappedItem.details = item.details;
    } else if (item.description) {
      mappedItem.details = [item.description];
    }

    // Map additional fields based on type
    if (item.technologies && Array.isArray(item.technologies)) {
      mappedItem.technologies = item.technologies;
    }

    if (item.achievements && Array.isArray(item.achievements)) {
      mappedItem.achievements = item.achievements;
    }

    if (item.metrics && Array.isArray(item.metrics)) {
      mappedItem.metrics = item.metrics;
    }

    return mappedItem;
  }

  private applyConditionalRules(): Record<string, any> {
    const conditionalMappings: Record<string, any> = {};

    if (!this.mappingConfig.conditionalRules) return conditionalMappings;

    this.mappingConfig.conditionalRules.forEach((rule, index) => {
      try {
        const conditionMet = this.evaluateCondition(rule.condition);

        if (conditionMet) {
          switch (rule.action) {
            case 'show':
              conditionalMappings[`${rule.target}.visible`] = true;
              break;
            case 'hide':
              conditionalMappings[`${rule.target}.visible`] = false;
              break;
            case 'modify':
              if (rule.value) {
                conditionalMappings[`${rule.target}.style`] = rule.value;
              }
              break;
            case 'replace':
              if (rule.value) {
                conditionalMappings[rule.target] = rule.value;
              }
              break;
          }
        }
      } catch (error) {
        this.errors.push(
          `Error applying conditional rule ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });

    return conditionalMappings;
  }

  private applyStyleMappings(): Record<string, any> {
    const styleMappings: Record<string, any> = {};

    if (!this.mappingConfig.styleMappings) return styleMappings;

    // Apply color mappings
    if (this.mappingConfig.styleMappings.colors) {
      Object.entries(this.mappingConfig.styleMappings.colors).forEach(
        ([colorKey, colorPath]) => {
          const colorValue = this.getNestedValue(this.resumeData, colorPath);
          if (colorValue) {
            styleMappings[`colors.${colorKey}`] = colorValue;
          }
        }
      );
    }

    // Apply font mappings
    if (this.mappingConfig.styleMappings.fonts) {
      Object.entries(this.mappingConfig.styleMappings.fonts).forEach(
        ([fontKey, fontPath]) => {
          const fontValue = this.getNestedValue(this.resumeData, fontPath);
          if (fontValue) {
            styleMappings[`fonts.${fontKey}`] = fontValue;
          }
        }
      );
    }

    return styleMappings;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      if (current === null || current === undefined) return undefined;
      return current[key];
    }, obj);
  }

  private applyTransformation(
    value: any,
    transform: string,
    maxLength?: number
  ): any {
    if (typeof value !== 'string') return value;

    switch (transform) {
      case 'uppercase':
        return dataTransformers.uppercase(value);
      case 'lowercase':
        return dataTransformers.lowercase(value);
      case 'capitalize':
        return dataTransformers.capitalize(value);
      case 'truncate':
        return maxLength ? dataTransformers.truncate(value, maxLength) : value;
      case 'format':
        return dataTransformers.format(value, 'default');
      default:
        return value;
    }
  }

  private evaluateCondition(condition: string): boolean {
    try {
      // Simple condition evaluation - in production, use a safer expression evaluator
      const context = {
        resume: this.resumeData,
        experience: this.resumeData.experience,
        education: this.resumeData.education,
        skills: this.resumeData.skills,
        certifications: this.resumeData.certifications,
      };

      // Replace condition variables with actual values
      let evaluationCode = condition;

      // Handle common patterns
      evaluationCode = evaluationCode.replace(
        /(\w+)\.length/g,
        (_match, prop) => {
          const value = this.getNestedValue(context, prop);
          return Array.isArray(value) ? value.length.toString() : '0';
        }
      );

      // Handle existence checks
      evaluationCode = evaluationCode.replace(
        /(\w+\.?\w*)\s*exists/g,
        (_match, prop) => {
          const value = this.getNestedValue(context, prop);
          return (value !== undefined && value !== null).toString();
        }
      );

      // Simple numeric comparisons
      const numericResult = evaluationCode.match(
        /^(\d+)\s*(===|!==|>|<|>=|<=)\s*(\d+)$/
      );
      if (numericResult) {
        const [, left, operator, right] = numericResult;
        const leftNum = Number.parseInt(left);
        const rightNum = Number.parseInt(right);

        switch (operator) {
          case '===':
            return leftNum === rightNum;
          case '!==':
            return leftNum !== rightNum;
          case '>':
            return leftNum > rightNum;
          case '<':
            return leftNum < rightNum;
          case '>=':
            return leftNum >= rightNum;
          case '<=':
            return leftNum <= rightNum;
          default:
            return false;
        }
      }

      // Default fallback
      return false;
    } catch (error) {
      this.warnings.push(
        `Failed to evaluate condition '${condition}': ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return false;
    }
  }

  private sortSectionData(data: any[], sortBy: string): any[] {
    return [...data].sort((a, b) => {
      const aValue = this.getNestedValue(a, sortBy);
      const bValue = this.getNestedValue(b, sortBy);

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      // Date sorting (most recent first)
      if (sortBy.includes('Date') || sortBy.includes('date')) {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return bDate.getTime() - aDate.getTime();
      }

      // String sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }

      // Numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return bValue - aValue;
      }

      return 0;
    });
  }

  private calculateStatistics(
    mappedData: Record<string, any>
  ): MappingResult['statistics'] {
    const totalFields = Object.keys(this.mappingConfig.fieldMappings).length;
    const mappedFields = Object.keys(mappedData).length;
    const missingFields = totalFields - mappedFields;
    const transformedFields = Object.entries(
      this.mappingConfig.fieldMappings
    ).filter(
      ([, mapping]) => mapping.transform && mapping.transform !== 'none'
    ).length;

    return {
      totalFields,
      mappedFields,
      missingFields,
      transformedFields,
    };
  }
}

// Utility functions for creating mapping configurations
export function createMappingFromFigmaAnalysis(
  figmaNodes: any[],
  _resumeData: EnhancedParsedResume
): FigmaMappingConfig {
  const fieldMappings: Record<string, any> = {};
  const sectionMappings: Record<string, any> = {};

  // Analyze Figma nodes and create mappings
  figmaNodes.forEach((node) => {
    const nodeName = node.name.toLowerCase();
    const nodeType = node.type;

    // Map text nodes to resume fields
    if (nodeType === 'TEXT') {
      if (nodeName.includes('name')) {
        fieldMappings.name = {
          figmaPath: `text.${node.id}`,
          dataPath: 'name',
          required: true,
        };
      } else if (nodeName.includes('title') || nodeName.includes('job')) {
        fieldMappings.title = {
          figmaPath: `text.${node.id}`,
          dataPath: 'title',
          required: true,
        };
      } else if (nodeName.includes('email')) {
        fieldMappings.email = {
          figmaPath: `text.${node.id}`,
          dataPath: 'contact.email',
          fallback: 'email@example.com',
        };
      } else if (nodeName.includes('phone')) {
        fieldMappings.phone = {
          figmaPath: `text.${node.id}`,
          dataPath: 'contact.phone',
          transform: 'format',
          fallback: '+1 (555) 123-4567',
        };
      }
    }

    // Map container nodes to sections
    if (nodeType === 'FRAME' || nodeType === 'GROUP') {
      if (nodeName.includes('experience') || nodeName.includes('work')) {
        sectionMappings.experience = {
          figmaContainer: `section.${node.id}`,
          dataSource: 'experience',
          itemTemplate: 'experience',
          maxItems: 5,
          sortBy: 'startDate',
        };
      } else if (nodeName.includes('education')) {
        sectionMappings.education = {
          figmaContainer: `section.${node.id}`,
          dataSource: 'education',
          itemTemplate: 'education',
          showIf: 'education.length > 0',
        };
      } else if (nodeName.includes('skill')) {
        sectionMappings.skills = {
          figmaContainer: `section.${node.id}`,
          dataSource: 'skills.all',
          itemTemplate: 'skill',
          maxItems: 12,
        };
      }
    }
  });

  return {
    fieldMappings,
    sectionMappings,
    conditionalRules: [
      {
        condition: 'experience.length === 0',
        action: 'hide',
        target: 'section.experience',
      },
      {
        condition: 'education.length === 0',
        action: 'hide',
        target: 'section.education',
      },
    ],
  };
}

// Generate component bindings for React component generation
export function generateComponentBindings(
  mappingResult: MappingResult,
  componentName: string
): GeneratedComponentBinding {
  const mappings: FigmaElementMapping[] = [];
  const dataRequirements: string[] = [];
  const conditionalSections: string[] = [];

  // Convert mapping result to element mappings
  Object.entries(mappingResult.mappedData).forEach(([path, value]) => {
    if (path.includes('.visible')) {
      const sectionName = path.replace('.visible', '');
      if (!value) {
        conditionalSections.push(sectionName);
      }
    } else if (Array.isArray(value)) {
      mappings.push({
        elementId: path,
        elementType: 'list',
        dataBinding: path,
      });
      dataRequirements.push(path);
    } else {
      mappings.push({
        elementId: path,
        elementType: 'text',
        dataBinding: path,
      });
      dataRequirements.push(path);
    }
  });

  return {
    componentName,
    mappings,
    dataRequirements,
    conditionalSections,
    dynamicContent: mappingResult.mappedData,
  };
}
