# Figma Upload Feature Implementation Guide

## Overview

This document provides step-by-step instructions for implementing the Figma upload feature into the existing ResumeUploader component. This feature will allow users to input a Figma design URL and automatically generate a resume based on the design layout and structure.

## Implementation Steps

### Step 1: Install Required Dependencies

```bash
# Install MCP client and Figma API utilities
npm install @modelcontextprotocol/sdk
npm install figma-api
npm install cheerio # for URL parsing
```

### Step 2: Create Figma API Service

Create a new file `lib/figma-api.ts`:

```typescript
// lib/figma-api.ts
import { ParsedResume } from '@/lib/resume-parser/schema';

export interface FigmaNodeInfo {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fills?: any[];
  strokes?: any[];
  effects?: any[];
  characters?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  children?: FigmaNodeInfo[];
}

export interface FigmaDesignData {
  fileId: string;
  nodeId: string;
  name: string;
  nodes: FigmaNodeInfo[];
  styles: {
    colors: Record<string, string>;
    fonts: Record<string, any>;
    spacing: Record<string, number>;
  };
}

export class FigmaAPI {
  private static API_BASE = 'https://api.figma.com/v1';
  private static API_KEY = process.env.FIGMA_API_KEY;

  static extractFigmaIds(url: string): { fileId: string; nodeId?: string } {
    const urlPattern = /figma\.com\/file\/([a-zA-Z0-9]+)\/[^?]*(\?.*node-id=([^&]+))?/;
    const match = url.match(urlPattern);
    
    if (!match) {
      throw new Error('Invalid Figma URL format');
    }

    return {
      fileId: match[1],
      nodeId: match[3] ? match[3].replace('-', ':') : undefined
    };
  }

  static async fetchDesignData(fileId: string, nodeId?: string): Promise<FigmaDesignData> {
    if (!this.API_KEY) {
      throw new Error('Figma API key not configured');
    }

    try {
      const endpoint = nodeId 
        ? `/files/${fileId}/nodes?ids=${nodeId}`
        : `/files/${fileId}`;

      const response = await fetch(`${this.API_BASE}${endpoint}`, {
        headers: {
          'X-Figma-Token': this.API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return this.processDesignData(data, fileId, nodeId);
    } catch (error) {
      console.error('Figma API error:', error);
      throw error;
    }
  }

  private static processDesignData(data: any, fileId: string, nodeId?: string): FigmaDesignData {
    const document = nodeId ? data.nodes[nodeId].document : data.document;
    
    return {
      fileId,
      nodeId: nodeId || 'root',
      name: document.name || 'Figma Design',
      nodes: this.extractNodes(document),
      styles: this.extractStyles(data.styles || {})
    };
  }

  private static extractNodes(node: any): FigmaNodeInfo[] {
    const extractedNode: FigmaNodeInfo = {
      id: node.id,
      name: node.name,
      type: node.type,
      x: node.x || 0,
      y: node.y || 0,
      width: node.width || 0,
      height: node.height || 0,
      fills: node.fills,
      strokes: node.strokes,
      effects: node.effects,
      characters: node.characters,
      fontSize: node.style?.fontSize,
      fontFamily: node.style?.fontFamily,
      fontWeight: node.style?.fontWeight
    };

    if (node.children) {
      extractedNode.children = node.children.flatMap((child: any) => 
        this.extractNodes(child)
      );
    }

    return [extractedNode];
  }

  private static extractStyles(styles: any): FigmaDesignData['styles'] {
    return {
      colors: {},
      fonts: {},
      spacing: {}
    };
  }
}
```

### Step 3: Create Figma-to-Resume Parser

Create `lib/figma-resume-parser.ts`:

```typescript
// lib/figma-resume-parser.ts
import { ParsedResume } from '@/lib/resume-parser/schema';
import { FigmaDesignData, FigmaNodeInfo } from './figma-api';

export class FigmaToResumeParser {
  static async parseDesign(designData: FigmaDesignData): Promise<ParsedResume> {
    const allNodes = this.flattenNodes(designData.nodes);
    const textNodes = allNodes.filter(node => node.type === 'TEXT');
    
    return {
      name: this.extractName(textNodes),
      title: this.extractTitle(textNodes),
      summary: this.extractSummary(textNodes),
      profileImage: '', // Will be handled separately
      contact: this.extractContact(textNodes),
      experience: this.extractExperience(textNodes),
      education: this.extractEducation(textNodes),
      certifications: this.extractCertifications(textNodes),
      skills: this.extractSkills(textNodes),
      customColors: this.extractCustomColors(designData.styles)
    };
  }

  private static flattenNodes(nodes: FigmaNodeInfo[]): FigmaNodeInfo[] {
    const result: FigmaNodeInfo[] = [];
    
    for (const node of nodes) {
      result.push(node);
      if (node.children) {
        result.push(...this.flattenNodes(node.children));
      }
    }
    
    return result;
  }

  private static extractName(textNodes: FigmaNodeInfo[]): string {
    // Look for the largest text node, likely to be the name
    const nameNode = textNodes
      .filter(node => node.characters && node.fontSize)
      .sort((a, b) => (b.fontSize || 0) - (a.fontSize || 0))[0];
    
    return nameNode?.characters || '';
  }

  private static extractTitle(textNodes: FigmaNodeInfo[]): string {
    // Look for text nodes that might be job titles
    const titleKeywords = ['developer', 'engineer', 'designer', 'manager', 'analyst'];
    
    const titleNode = textNodes.find(node => 
      node.characters && 
      titleKeywords.some(keyword => 
        node.characters!.toLowerCase().includes(keyword)
      )
    );
    
    return titleNode?.characters || '';
  }

  private static extractSummary(textNodes: FigmaNodeInfo[]): string {
    // Look for longer text blocks that might be summaries
    const summaryNode = textNodes
      .filter(node => node.characters && node.characters.length > 50)
      .sort((a, b) => (b.characters?.length || 0) - (a.characters?.length || 0))[0];
    
    return summaryNode?.characters || '';
  }

  private static extractContact(textNodes: FigmaNodeInfo[]): ParsedResume['contact'] {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /[\+]?[1-9][\d\s\-\(\)\.]{8,}/;
    
    const contact: ParsedResume['contact'] = {};
    
    for (const node of textNodes) {
      if (!node.characters) continue;
      
      const emailMatch = node.characters.match(emailRegex);
      if (emailMatch) {
        contact.email = emailMatch[0];
      }
      
      const phoneMatch = node.characters.match(phoneRegex);
      if (phoneMatch) {
        contact.phone = phoneMatch[0];
      }
    }
    
    return contact;
  }

  private static extractExperience(textNodes: FigmaNodeInfo[]): ParsedResume['experience'] {
    // This is a simplified implementation
    // In a real scenario, you'd need more sophisticated parsing
    const experienceKeywords = ['experience', 'work', 'employment', 'job'];
    
    const experienceNodes = textNodes.filter(node =>
      node.characters && 
      experienceKeywords.some(keyword => 
        node.name.toLowerCase().includes(keyword) ||
        node.characters!.toLowerCase().includes(keyword)
      )
    );
    
    return experienceNodes.map(node => ({
      company: node.characters || '',
      position: '',
      startDate: '',
      endDate: '',
      responsibilities: []
    }));
  }

  private static extractEducation(textNodes: FigmaNodeInfo[]): ParsedResume['education'] {
    const educationKeywords = ['education', 'school', 'university', 'college', 'degree'];
    
    const educationNodes = textNodes.filter(node =>
      node.characters && 
      educationKeywords.some(keyword => 
        node.name.toLowerCase().includes(keyword) ||
        node.characters!.toLowerCase().includes(keyword)
      )
    );
    
    return educationNodes.map(node => ({
      institution: node.characters || '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    }));
  }

  private static extractCertifications(textNodes: FigmaNodeInfo[]): ParsedResume['certifications'] {
    const certKeywords = ['certification', 'certificate', 'licensed', 'certified'];
    
    const certNodes = textNodes.filter(node =>
      node.characters && 
      certKeywords.some(keyword => 
        node.name.toLowerCase().includes(keyword) ||
        node.characters!.toLowerCase().includes(keyword)
      )
    );
    
    return certNodes.map(node => ({
      name: node.characters || '',
      issuer: '',
      date: '',
      url: ''
    }));
  }

  private static extractSkills(textNodes: FigmaNodeInfo[]): ParsedResume['skills'] {
    const skillKeywords = ['skills', 'technologies', 'expertise'];
    
    const skillNodes = textNodes.filter(node =>
      node.characters && 
      skillKeywords.some(keyword => 
        node.name.toLowerCase().includes(keyword) ||
        node.characters!.toLowerCase().includes(keyword)
      )
    );
    
    return skillNodes.map(node => ({
      name: node.characters || '',
      level: 'Intermediate' // Default level
    }));
  }

  private static extractCustomColors(styles: FigmaDesignData['styles']): Record<string, string> {
    // Extract and convert Figma colors to CSS custom properties
    const colors: Record<string, string> = {};
    
    // Add default colors based on extracted styles
    colors.primary = '#007bff';
    colors.secondary = '#6c757d';
    colors.accent = '#28a745';
    colors.background = '#ffffff';
    colors.text = '#333333';
    
    return colors;
  }
}
```

### Step 4: Create New API Route

Create `app/api/parse-figma-resume/route.ts`:

```typescript
// app/api/parse-figma-resume/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { FigmaAPI } from '@/lib/figma-api';
import { FigmaToResumeParser } from '@/lib/figma-resume-parser';
import { createClient } from '@/lib/supabase/server';
import { ResumeDatabase } from '@/lib/database';
import { createSlug } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { figmaUrl, isAuthenticated } = await request.json();
    
    if (!figmaUrl) {
      return NextResponse.json(
        { error: 'Figma URL is required' },
        { status: 400 }
      );
    }

    // Validate Figma URL format
    let fileId: string;
    let nodeId: string | undefined;
    
    try {
      ({ fileId, nodeId } = FigmaAPI.extractFigmaIds(figmaUrl));
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid Figma URL format' },
        { status: 400 }
      );
    }

    // Fetch design data from Figma
    const designData = await FigmaAPI.fetchDesignData(fileId, nodeId);
    
    // Parse design to resume structure
    const parsedResume = await FigmaToResumeParser.parseDesign(designData);
    
    // Handle authentication if user is logged in
    let savedResume: { id: string; slug: string } | undefined;
    
    if (isAuthenticated) {
      const supabase = await createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Save resume to database
      const resumeTitle = parsedResume.name || 'Figma Resume';
      const generatedSlug = `${createSlug(resumeTitle)}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      savedResume = await ResumeDatabase.saveResume(supabase, {
        userId: user.id,
        title: resumeTitle,
        originalFilename: `${designData.name}.figma`,
        fileType: 'application/json',
        fileSize: JSON.stringify(parsedResume).length,
        parsedData: parsedResume,
        parseMethod: 'figma',
        confidenceScore: 0.85, // Default confidence for Figma parsing
        isPublic: true,
        slug: generatedSlug
      });
    }

    return NextResponse.json({
      success: true,
      data: parsedResume,
      meta: {
        method: 'figma',
        confidence: 0.85,
        filename: `${designData.name}.figma`,
        fileType: 'application/json',
        fileSize: JSON.stringify(parsedResume).length,
        resumeId: savedResume?.id,
        resumeSlug: savedResume?.slug,
        figmaData: {
          fileId,
          nodeId,
          designName: designData.name
        }
      }
    });

  } catch (error) {
    console.error('Figma parsing error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to parse Figma design',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
```

### Step 5: Update ResumeUploader Component

Update `src/components/ResumeUploader/ResumeUploader.tsx`:

```typescript
// Add to existing imports
import { useState } from 'react';

// Add new state variables after existing ones
const [uploadType, setUploadType] = useState<'file' | 'figma'>('file');
const [figmaUrl, setFigmaUrl] = useState('');
const [figmaError, setFigmaError] = useState('');

// Add new handler function
const handleFigmaUpload = async () => {
  if (!figmaUrl.trim()) {
    setFigmaError('Please enter a Figma URL');
    return;
  }

  // Validate Figma URL format
  const figmaPattern = /figma\.com\/file\/[a-zA-Z0-9]+/;
  if (!figmaPattern.test(figmaUrl)) {
    setFigmaError('Please enter a valid Figma URL');
    return;
  }

  setFigmaError('');
  setError('');
  setIsLoading(true);

  try {
    // Check authentication if required
    if (isAuthenticated) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session found. Please sign in again.');
      }
    }

    const response = await fetch('/api/parse-figma-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        figmaUrl,
        isAuthenticated
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to parse Figma design');
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }

    // Create upload info
    const uploadInfo: ParseInfo = {
      ...result.meta,
      method: 'Figma MCP',
      confidence: result.meta.confidence || 0.85
    };

    // Pass parsed data to parent component
    onResumeUploaded(result.data, uploadInfo);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    setFigmaError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

// Add this JSX before the existing dropzone
<div className={styles.uploadTypeSelector}>
  <div className={styles.tabButtons}>
    <button
      type="button"
      className={`${styles.tabButton} ${uploadType === 'file' ? styles.activeTab : ''}`}
      onClick={() => setUploadType('file')}
    >
      📄 Upload File
    </button>
    <button
      type="button"
      className={`${styles.tabButton} ${uploadType === 'figma' ? styles.activeTab : ''}`}
      onClick={() => setUploadType('figma')}
    >
      🎨 Figma Design
    </button>
  </div>
</div>

{uploadType === 'figma' && (
  <div className={styles.figmaUploadSection}>
    <div className={styles.figmaInputContainer}>
      <h3 className={styles.figmaTitle}>Import from Figma</h3>
      <p className={styles.figmaDescription}>
        Paste a link to your Figma resume design and we'll automatically extract the content and layout.
      </p>
      
      <div className={styles.figmaUrlInput}>
        <input
          type="url"
          value={figmaUrl}
          onChange={(e) => setFigmaUrl(e.target.value)}
          placeholder="https://figma.com/file/ABC123/Resume-Design"
          className={`${styles.figmaInput} ${figmaError ? styles.inputError : ''}`}
        />
        <button
          type="button"
          onClick={handleFigmaUpload}
          className={styles.figmaButton}
          disabled={!figmaUrl.trim()}
        >
          Import Design
        </button>
      </div>
      
      {figmaError && (
        <div className={styles.figmaError}>
          <AlertTriangle className="w-4 h-4 mr-2" />
          {figmaError}
        </div>
      )}
      
      <div className={styles.figmaHelp}>
        <p className={styles.helpText}>
          <strong>How to get a Figma URL:</strong>
        </p>
        <ol className={styles.helpList}>
          <li>Open your resume design in Figma</li>
          <li>Click "Share" in the top right corner</li>
          <li>Make sure "Anyone with the link can view" is selected</li>
          <li>Copy the link and paste it above</li>
        </ol>
      </div>
    </div>
  </div>
)}

{uploadType === 'file' && (
  // Wrap existing file upload UI in this condition
  // ... existing file upload code
)}
```

### Step 6: Add CSS Styles

Add to `src/components/ResumeUploader/ResumeUploader.module.css`:

```css
.uploadTypeSelector {
  margin-bottom: 2rem;
}

.tabButtons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.tabButton {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.tabButton:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.activeTab {
  border-color: #0d9488;
  background: #f0fdfa;
  color: #0d9488;
}

.figmaUploadSection {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.figmaInputContainer {
  max-width: 600px;
  margin: 0 auto;
}

.figmaTitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  text-align: center;
}

.figmaDescription {
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.figmaUrlInput {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.figmaInput {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.figmaInput:focus {
  outline: none;
  border-color: #0d9488;
}

.inputError {
  border-color: #ef4444;
}

.figmaButton {
  padding: 0.75rem 1.5rem;
  background: #0d9488;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.figmaButton:hover {
  background: #0f766e;
}

.figmaButton:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.figmaError {
  display: flex;
  align-items: center;
  color: #ef4444;
  background: #fef2f2;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.figmaHelp {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.helpText {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.helpList {
  margin: 0;
  padding-left: 1.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.helpList li {
  margin-bottom: 0.25rem;
}

@media (max-width: 768px) {
  .figmaUrlInput {
    flex-direction: column;
  }
  
  .tabButtons {
    flex-direction: column;
  }
  
  .figmaUploadSection {
    padding: 1rem;
  }
}
```

### Step 7: Environment Configuration

Add to your `.env.local`:

```bash
# Figma API Configuration
FIGMA_API_KEY=your_figma_api_key_here
```

### Step 8: Update .gitignore

Add to `.gitignore`:

```gitignore
# Figma API credentials
.env.local
.env
.cursor/mcp.json
```

## Testing the Implementation

1. **Create a Test Figma File**:
   - Design a simple resume layout in Figma
   - Include text elements for name, title, contact info
   - Make the file publicly viewable

2. **Test API Endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/parse-figma-resume \
     -H "Content-Type: application/json" \
     -d '{"figmaUrl": "https://figma.com/file/YOUR_FILE_ID", "isAuthenticated": false}'
   ```

3. **Test UI Integration**:
   - Navigate to your resume upload page
   - Click the "Figma Design" tab
   - Enter a Figma URL and test the import process

## Error Handling

The implementation includes comprehensive error handling for:
- Invalid Figma URLs
- API authentication errors
- Network failures
- Parsing errors
- Database save failures

## Performance Considerations

- Figma API calls are rate-limited (1000 requests/hour)
- Consider caching frequently accessed designs
- Implement retry logic for failed requests
- Add loading states for better UX

## Security Considerations

- Figma API key should be server-side only
- Validate all user inputs
- Implement proper authentication checks
- Consider file access permissions

This implementation provides a solid foundation for the Figma upload feature while maintaining compatibility with your existing ResumeUploader component and project structure.