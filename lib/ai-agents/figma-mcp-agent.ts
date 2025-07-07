import type { ParsedResume } from '@/lib/resume-parser/schema';

export interface FigmaMCPCapabilities {
  // Core MCP server capabilities
  getFileInfo: (fileKey: string) => Promise<FigmaFileInfo>;
  getNodes: (fileKey: string, nodeIds: string[]) => Promise<FigmaNode[]>;
  searchNodes: (fileKey: string, query: string) => Promise<FigmaNode[]>;
  getStyles: (fileKey: string) => Promise<FigmaStyle[]>;
  getComponents: (fileKey: string) => Promise<FigmaComponent[]>;
}

export interface FigmaFileInfo {
  name: string;
  lastModified: string;
  thumbnailUrl?: string;
  version: string;
  role: string;
  editorType: string;
  linkAccess: string;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  locked?: boolean;
  characters?: string;
  children?: FigmaNode[];
  fills?: FigmaFill[];
  strokes?: FigmaStroke[];
  effects?: FigmaEffect[];
  layoutAlign?: string;
  layoutGrow?: number;
  constraints?: FigmaConstraints;
  absoluteBoundingBox?: FigmaBoundingBox;
  size?: FigmaSize;
  relativeTransform?: number[][];
  clipsContent?: boolean;
  background?: FigmaFill[];
  backgroundColor?: FigmaColor;
  exportSettings?: FigmaExportSetting[];
  blendMode?: string;
  preserveRatio?: boolean;
  layoutVersion?: number;
  characterStyleOverrides?: Record<string, unknown>;
  styleOverrideTable?: Record<string, unknown>;
  lineTypes?: string[];
  lineIndentations?: number[];
  styles?: Record<string, string>;
}

export interface FigmaStyle {
  key: string;
  name: string;
  styleType: 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';
  remote: boolean;
  description?: string;
}

export interface FigmaComponent {
  key: string;
  name: string;
  description?: string;
  remote: boolean;
  documentationLinks?: Array<{ uri: string }>;
}

export interface FigmaFill {
  blendMode?: string;
  type: string;
  color?: FigmaColor;
  gradientHandlePositions?: FigmaVector[];
  gradientStops?: FigmaColorStop[];
  scaleMode?: string;
  imageTransform?: number[][];
  scalingFactor?: number;
  rotation?: number;
  imageRef?: string;
  filters?: FigmaImageFilters;
  gifRef?: string;
  boundVariables?: Record<string, FigmaVariableAlias>;
  visible?: boolean;
  opacity?: number;
}

export interface FigmaStroke {
  blendMode?: string;
  type: string;
  color?: FigmaColor;
  gradientHandlePositions?: FigmaVector[];
  gradientStops?: FigmaColorStop[];
  scaleMode?: string;
  imageTransform?: number[][];
  scalingFactor?: number;
  rotation?: number;
  imageRef?: string;
  filters?: FigmaImageFilters;
  gifRef?: string;
  boundVariables?: Record<string, FigmaVariableAlias>;
  visible?: boolean;
  opacity?: number;
}

export interface FigmaEffect {
  type: string;
  visible?: boolean;
  radius?: number;
  color?: FigmaColor;
  blendMode?: string;
  offset?: FigmaVector;
  spread?: number;
  showShadowBehindNode?: boolean;
  boundVariables?: Record<string, FigmaVariableAlias>;
}

export interface FigmaConstraints {
  vertical: string;
  horizontal: string;
}

export interface FigmaBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FigmaSize {
  x: number;
  y: number;
}

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FigmaVector {
  x: number;
  y: number;
}

export interface FigmaColorStop {
  position: number;
  color: FigmaColor;
}

export interface FigmaImageFilters {
  exposure?: number;
  contrast?: number;
  saturation?: number;
  temperature?: number;
  tint?: number;
  highlights?: number;
  shadows?: number;
}

export interface FigmaVariableAlias {
  type: string;
  id: string;
}

export interface FigmaExportSetting {
  suffix: string;
  format: string;
  constraint: {
    type: string;
    value: number;
  };
}

export interface FigmaAdaptationRequest {
  sourceFileKey: string;
  sourceNodeId?: string;
  targetResumeData: ParsedResume;
  adaptationStrategy:
    | 'content-mapping'
    | 'layout-preservation'
    | 'style-extraction'
    | 'hybrid';
  customMappings?: Record<string, string>;
  preserveElements?: string[];
  colorScheme?: 'original' | 'resume-colors' | 'adaptive';
}

export interface FigmaAdaptationResult {
  success: boolean;
  componentName: string;
  jsxCode: string;
  cssCode: string;
  mappedFields: Record<string, string>;
  preservedElements: string[];
  adaptationLog: string[];
  warnings: string[];
  errors: string[];
}

export class FigmaMCPAgent {
  private mcpCapabilities: FigmaMCPCapabilities | null = null;
  private initialized = false;

  constructor() {
    // Initialize MCP connection in constructor
    this.initializeMCP();
  }

  private async initializeMCP(): Promise<void> {
    try {
      // In a real implementation, this would connect to the MCP server
      // For now, we'll simulate the connection
      console.log('Initializing Figma MCP connection...');

      // Mock MCP capabilities for development
      this.mcpCapabilities = {
        getFileInfo: async (fileKey: string) => {
          return {
            name: `Figma File ${fileKey}`,
            lastModified: new Date().toISOString(),
            version: '1.0',
            role: 'owner',
            editorType: 'figma',
            linkAccess: 'view',
          };
        },
        getNodes: async (_fileKey: string, nodeIds: string[]) => {
          // Mock node data
          return nodeIds.map((id) => ({
            id,
            name: `Node ${id}`,
            type: 'FRAME',
            visible: true,
            children: [],
          }));
        },
        searchNodes: async (_fileKey: string, query: string) => {
          // Mock search results
          return [
            {
              id: 'search-result-1',
              name: `Search result for "${query}"`,
              type: 'TEXT',
              characters: `Found content matching "${query}"`,
            },
          ];
        },
        getStyles: async (_fileKey: string) => {
          return [
            {
              key: 'style-1',
              name: 'Primary Text',
              styleType: 'TEXT',
              remote: false,
            },
          ];
        },
        getComponents: async (_fileKey: string) => {
          return [
            {
              key: 'component-1',
              name: 'Resume Header',
              remote: false,
            },
          ];
        },
      };

      this.initialized = true;
      console.log('Figma MCP connection initialized');
    } catch (error) {
      console.error('Failed to initialize MCP connection:', error);
      this.initialized = false;
    }
  }

  async isReady(): Promise<boolean> {
    return this.initialized && this.mcpCapabilities !== null;
  }

  async adaptDesignForResume(
    request: FigmaAdaptationRequest
  ): Promise<FigmaAdaptationResult> {
    if (!(await this.isReady())) {
      throw new Error('MCP agent not initialized');
    }

    const adaptationLog: string[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      adaptationLog.push(
        `Starting adaptation for file: ${request.sourceFileKey}`
      );

      // Step 1: Get file info and validate access
      const fileInfo = await this.mcpCapabilities?.getFileInfo(
        request.sourceFileKey
      );

      if (!fileInfo) {
        errors.push('Failed to retrieve file information');
        throw new Error('File info is undefined');
      }

      adaptationLog.push(`File info retrieved: ${fileInfo.name}`);

      // Step 2: Get target nodes
      const targetNodes = request.sourceNodeId
        ? await this.mcpCapabilities?.getNodes(request.sourceFileKey, [
            request.sourceNodeId,
          ])
        : await this.mcpCapabilities?.searchNodes(
            request.sourceFileKey,
            'resume'
          );

      if (!targetNodes || targetNodes.length === 0) {
        errors.push('No suitable nodes found for adaptation');
        throw new Error('No nodes found');
      }

      adaptationLog.push(`Found ${targetNodes.length} nodes for adaptation`);

      // Step 3: Analyze content and create mappings
      const mappedFields = await this.createContentMappings(
        targetNodes,
        request.targetResumeData,
        request.customMappings
      );

      adaptationLog.push(
        `Created ${Object.keys(mappedFields).length} content mappings`
      );

      // Step 4: Extract styles and layout information
      const styles = await this.mcpCapabilities?.getStyles(
        request.sourceFileKey
      );

      if (!styles) {
        errors.push('Failed to retrieve styles');
        throw new Error('Styles are undefined');
      }

      const styleInfo = await this.extractStyleInformation(targetNodes, styles);

      adaptationLog.push(
        `Extracted style information from ${styles.length} styles`
      );

      // Step 5: Generate adapted component
      const componentName = this.generateComponentName(
        fileInfo.name,
        request.sourceNodeId
      );
      const { jsxCode, cssCode } = await this.generateAdaptedComponent(
        componentName,
        targetNodes,
        mappedFields,
        styleInfo,
        request
      );

      adaptationLog.push(`Generated component: ${componentName}`);

      return {
        success: true,
        componentName,
        jsxCode,
        cssCode,
        mappedFields,
        preservedElements: request.preserveElements || [],
        adaptationLog,
        warnings,
        errors,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      errors.push(errorMessage);
      adaptationLog.push(`Error during adaptation: ${errorMessage}`);

      return {
        success: false,
        componentName: 'FailedAdaptation',
        jsxCode: '',
        cssCode: '',
        mappedFields: {},
        preservedElements: [],
        adaptationLog,
        warnings,
        errors,
      };
    }
  }

  private async createContentMappings(
    nodes: FigmaNode[],
    resumeData: ParsedResume,
    customMappings?: Record<string, string>
  ): Promise<Record<string, string>> {
    const mappings: Record<string, string> = {};

    // Start with custom mappings if provided
    if (customMappings) {
      Object.assign(mappings, customMappings);
    }

    // Analyze each node and create intelligent mappings
    for (const node of nodes) {
      await this.analyzeNodeForMapping(node, resumeData, mappings);
    }

    return mappings;
  }

  private async analyzeNodeForMapping(
    node: FigmaNode,
    resumeData: ParsedResume,
    mappings: Record<string, string>
  ): Promise<void> {
    // Skip if already mapped
    if (mappings[node.id]) return;

    const nodeName = node.name.toLowerCase();
    const nodeText = node.characters?.toLowerCase() || '';

    // Smart mapping based on node name and content
    if (nodeName.includes('name') || nodeText.includes('name')) {
      mappings[node.id] = '{resume.name}';
    } else if (
      nodeName.includes('title') ||
      nodeName.includes('job') ||
      nodeText.includes('title')
    ) {
      mappings[node.id] = '{resume.title}';
    } else if (nodeName.includes('email') || nodeText.includes('email')) {
      mappings[node.id] = '{resume.contact?.email}';
    } else if (nodeName.includes('phone') || nodeText.includes('phone')) {
      mappings[node.id] = '{resume.contact?.phone}';
    } else if (nodeName.includes('location') || nodeText.includes('location')) {
      mappings[node.id] = '{resume.contact?.location}';
    } else if (
      nodeName.includes('summary') ||
      nodeName.includes('about') ||
      nodeText.includes('summary')
    ) {
      mappings[node.id] = '{resume.summary}';
    } else if (
      nodeName.includes('experience') ||
      nodeText.includes('experience')
    ) {
      mappings[node.id] = '{resume.experience.map(exp => ...)}';
    } else if (
      nodeName.includes('education') ||
      nodeText.includes('education')
    ) {
      mappings[node.id] = '{resume.education?.map(edu => ...)}';
    } else if (nodeName.includes('skill') || nodeText.includes('skill')) {
      mappings[node.id] = '{resume.skills.map(skill => ...)}';
    } else if (node.characters) {
      // For text nodes without clear mapping, preserve original text
      mappings[node.id] = `{\`${node.characters}\`}`;
    }

    // Recursively analyze children
    if (node.children) {
      for (const child of node.children) {
        await this.analyzeNodeForMapping(child, resumeData, mappings);
      }
    }
  }

  private async extractStyleInformation(
    nodes: FigmaNode[],
    styles: FigmaStyle[]
  ): Promise<Record<string, unknown>> {
    const styleInfo: Record<string, unknown> = {};

    // Extract color information
    const colors = new Set<string>();
    const fonts = new Set<string>();
    const spacing = new Set<number>();

    for (const node of nodes) {
      this.extractNodeStyles(node, colors, fonts, spacing);
    }

    styleInfo.colors = Array.from(colors);
    styleInfo.fonts = Array.from(fonts);
    styleInfo.spacing = Array.from(spacing);
    styleInfo.figmaStyles = styles;

    return styleInfo;
  }

  private extractNodeStyles(
    node: FigmaNode,
    colors: Set<string>,
    fonts: Set<string>,
    spacing: Set<number>
  ): void {
    // Extract colors from fills
    if (node.fills) {
      for (const fill of node.fills) {
        if (fill.color) {
          const { r, g, b, a } = fill.color;
          const hex = this.rgbaToHex(r, g, b, a);
          colors.add(hex);
        }
      }
    }

    // Extract spacing from bounding box
    if (node.absoluteBoundingBox) {
      spacing.add(node.absoluteBoundingBox.width);
      spacing.add(node.absoluteBoundingBox.height);
    }

    // Recursively extract from children
    if (node.children) {
      for (const child of node.children) {
        this.extractNodeStyles(child, colors, fonts, spacing);
      }
    }
  }

  private rgbaToHex(r: number, g: number, b: number, a: number): string {
    const toHex = (n: number) =>
      Math.round(n * 255)
        .toString(16)
        .padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${a < 1 ? toHex(a) : ''}`;
  }

  private generateComponentName(fileName: string, nodeId?: string): string {
    const baseName = fileName.replace(/[^a-zA-Z0-9]/g, '');
    const suffix = nodeId ? nodeId.replace(/[^a-zA-Z0-9]/g, '') : 'Adapted';
    return `FigmaAdapted${baseName}${suffix}`;
  }

  private async generateAdaptedComponent(
    componentName: string,
    nodes: FigmaNode[],
    mappedFields: Record<string, string>,
    styleInfo: Record<string, unknown>,
    request: FigmaAdaptationRequest
  ): Promise<{ jsxCode: string; cssCode: string }> {
    // Generate JSX code with mapped content
    const jsxBody = this.generateJSXFromNodes(nodes, mappedFields);

    const jsxCode = `import React from 'react';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import styles from './${this.toKebabCase(componentName)}.module.css';

interface ${componentName}Props {
  resume: ParsedResume;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ resume }) => {
  return (
    ${jsxBody}
  );
};

export default ${componentName};`;

    // Generate CSS with extracted styles
    const cssCode = this.generateCSSFromStyles(
      componentName,
      styleInfo,
      request
    );

    return { jsxCode, cssCode };
  }

  private generateJSXFromNodes(
    nodes: FigmaNode[],
    mappedFields: Record<string, string>
  ): string {
    if (nodes.length === 0) return '<div></div>';

    const primaryNode = nodes[0];
    return this.nodeToJSX(primaryNode, mappedFields);
  }

  private nodeToJSX(
    node: FigmaNode,
    mappedFields: Record<string, string>
  ): string {
    const mapping = mappedFields[node.id];
    const className = this.generateClassName(node.name);
    const classNameAccess = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(className)
      ? `styles.${className}`
      : `styles['${className}']`;

    switch (node.type) {
      case 'TEXT': {
        const content = mapping || `{\`${node.characters || ''}\`}`;
        return `<span className={${classNameAccess}}>${content}</span>`;
      }

      case 'FRAME':
      case 'GROUP':
      case 'RECTANGLE': {
        const children =
          node.children
            ?.map((child) => this.nodeToJSX(child, mappedFields))
            .join('\n      ') || '';
        return `<div className={${classNameAccess}}>
      ${children}
    </div>`;
      }

      default:
        return `<div className={${classNameAccess}}></div>`;
    }
  }

  private generateClassName(nodeName: string): string {
    return nodeName
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  private generateCSSFromStyles(
    componentName: string,
    styleInfo: Record<string, unknown>,
    request: FigmaAdaptationRequest
  ): string {
    const colors = (styleInfo.colors as string[]) || [];
    const primaryColor = colors[0] || '#000000';
    const secondaryColor = colors[1] || '#666666';

    // Apply color scheme strategy
    let finalColors = { primary: primaryColor, secondary: secondaryColor };

    if (
      request.colorScheme === 'resume-colors' &&
      request.targetResumeData.customColors
    ) {
      finalColors = {
        primary: request.targetResumeData.customColors.primary || primaryColor,
        secondary:
          request.targetResumeData.customColors.secondary || secondaryColor,
      };
    }

    return `/* Generated CSS for ${componentName} */
/* Adapted from Figma design with ${request.adaptationStrategy} strategy */

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: ${finalColors.secondary};
}

.header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${finalColors.primary};
}

.name {
  font-size: 2.5rem;
  font-weight: 700;
  color: ${finalColors.primary};
  margin-bottom: 0.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 500;
  color: ${finalColors.secondary};
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
  color: ${finalColors.primary};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${finalColors.primary}33;
}

.experience-item {
  margin-bottom: 1.5rem;
}

.job-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: ${finalColors.primary};
  margin-bottom: 0.25rem;
}

.company {
  font-size: 0.9rem;
  color: ${finalColors.secondary};
  margin-bottom: 0.5rem;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill {
  background-color: ${finalColors.primary}15;
  color: ${finalColors.primary};
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Responsive design */
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
}`;
  }

  private toKebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }
}

export const figmaMCPAgent = new FigmaMCPAgent();
