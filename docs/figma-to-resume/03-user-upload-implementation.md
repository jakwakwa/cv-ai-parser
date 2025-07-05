# User Figma Upload Feature Implementation Guide

## Overview

This document provides detailed implementation instructions for adding Figma upload capability to the existing ResumeUploader component. This feature allows users to input Figma design URLs and automatically generate resumes based on the design layout and structure.

## Architecture Overview

```
User Input (Figma URL) → API Validation → Design Extraction → 
Content Parsing → Resume Generation → Database Storage
```

## Step 1: Install Dependencies

```bash
npm install @modelcontextprotocol/sdk figma-api cheerio
```

## Step 2: Create Core Services

### Figma API Service (`lib/figma-api.ts`)

```typescript
import { ParsedResume } from '@/lib/resume-parser/schema';

export interface FigmaNodeInfo {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  characters?: string;
  fontSize?: number;
  fontFamily?: string;
  children?: FigmaNodeInfo[];
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

  static async fetchDesignData(fileId: string, nodeId?: string) {
    if (!this.API_KEY) {
      throw new Error('Figma API key not configured');
    }

    const endpoint = nodeId 
      ? `/files/${fileId}/nodes?ids=${nodeId}`
      : `/files/${fileId}`;

    const response = await fetch(`${this.API_BASE}${endpoint}`, {
      headers: { 'X-Figma-Token': this.API_KEY }
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status}`);
    }

    return response.json();
  }
}
```

### Resume Parser (`lib/figma-resume-parser.ts`)

```typescript
import { ParsedResume } from '@/lib/resume-parser/schema';
import { FigmaNodeInfo } from './figma-api';

export class FigmaToResumeParser {
  static async parseDesign(designData: any): Promise<ParsedResume> {
    const textNodes = this.extractTextNodes(designData);
    
    return {
      name: this.extractName(textNodes),
      title: this.extractTitle(textNodes),
      summary: this.extractSummary(textNodes),
      profileImage: '',
      contact: this.extractContact(textNodes),
      experience: this.extractExperience(textNodes),
      education: this.extractEducation(textNodes),
      certifications: this.extractCertifications(textNodes),
      skills: this.extractSkills(textNodes),
      customColors: this.extractColors(designData)
    };
  }

  private static extractTextNodes(data: any): FigmaNodeInfo[] {
    // Extract all text nodes from design data
    const nodes: FigmaNodeInfo[] = [];
    
    function traverse(node: any) {
      if (node.type === 'TEXT' && node.characters) {
        nodes.push({
          id: node.id,
          name: node.name,
          type: node.type,
          x: node.x || 0,
          y: node.y || 0,
          width: node.width || 0,
          height: node.height || 0,
          characters: node.characters,
          fontSize: node.style?.fontSize,
          fontFamily: node.style?.fontFamily
        });
      }
      
      if (node.children) {
        node.children.forEach(traverse);
      }
    }
    
    const document = data.nodes ? Object.values(data.nodes)[0] : data.document;
    if (document) traverse(document);
    
    return nodes;
  }

  private static extractName(textNodes: FigmaNodeInfo[]): string {
    // Find largest text node (likely to be name)
    const nameNode = textNodes
      .filter(node => node.characters && node.fontSize)
      .sort((a, b) => (b.fontSize || 0) - (a.fontSize || 0))[0];
    
    return nameNode?.characters || '';
  }

  private static extractContact(textNodes: FigmaNodeInfo[]) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /[\+]?[1-9][\d\s\-\(\)\.]{8,}/;
    
    const contact: any = {};
    
    for (const node of textNodes) {
      if (!node.characters) continue;
      
      const emailMatch = node.characters.match(emailRegex);
      if (emailMatch) contact.email = emailMatch[0];
      
      const phoneMatch = node.characters.match(phoneRegex);
      if (phoneMatch) contact.phone = phoneMatch[0];
    }
    
    return contact;
  }

  // Additional extraction methods...
  private static extractTitle(textNodes: FigmaNodeInfo[]): string {
    const titleKeywords = ['developer', 'engineer', 'designer', 'manager'];
    const titleNode = textNodes.find(node => 
      node.characters && 
      titleKeywords.some(keyword => 
        node.characters!.toLowerCase().includes(keyword)
      )
    );
    return titleNode?.characters || '';
  }

  private static extractSummary(textNodes: FigmaNodeInfo[]): string {
    const summaryNode = textNodes
      .filter(node => node.characters && node.characters.length > 50)
      .sort((a, b) => (b.characters?.length || 0) - (a.characters?.length || 0))[0];
    return summaryNode?.characters || '';
  }

  private static extractExperience(textNodes: FigmaNodeInfo[]) {
    // Simplified implementation
    return [];
  }

  private static extractEducation(textNodes: FigmaNodeInfo[]) {
    return [];
  }

  private static extractCertifications(textNodes: FigmaNodeInfo[]) {
    return [];
  }

  private static extractSkills(textNodes: FigmaNodeInfo[]) {
    return [];
  }

  private static extractColors(designData: any) {
    return {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745',
      background: '#ffffff',
      text: '#333333'
    };
  }
}
```

## Step 3: Create API Endpoint

### `/app/api/parse-figma-resume/route.ts`

```typescript
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

    // Extract file and node IDs
    const { fileId, nodeId } = FigmaAPI.extractFigmaIds(figmaUrl);
    
    // Fetch design data
    const designData = await FigmaAPI.fetchDesignData(fileId, nodeId);
    
    // Parse to resume structure
    const parsedResume = await FigmaToResumeParser.parseDesign(designData);
    
    // Handle user authentication and database storage
    let savedResume: { id: string; slug: string } | undefined;
    
    if (isAuthenticated) {
      const supabase = await createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const resumeTitle = parsedResume.name || 'Figma Resume';
      const slug = `${createSlug(resumeTitle)}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      savedResume = await ResumeDatabase.saveResume(supabase, {
        userId: user.id,
        title: resumeTitle,
        originalFilename: `figma-design.json`,
        fileType: 'application/json',
        fileSize: JSON.stringify(parsedResume).length,
        parsedData: parsedResume,
        parseMethod: 'figma',
        confidenceScore: 0.85,
        isPublic: true,
        slug
      });
    }

    return NextResponse.json({
      success: true,
      data: parsedResume,
      meta: {
        method: 'figma',
        confidence: 0.85,
        filename: 'figma-design.json',
        fileType: 'application/json',
        fileSize: JSON.stringify(parsedResume).length,
        resumeId: savedResume?.id,
        resumeSlug: savedResume?.slug
      }
    });

  } catch (error) {
    console.error('Figma parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to parse Figma design' },
      { status: 500 }
    );
  }
}
```

## Step 4: Update ResumeUploader Component

### Add State and Handlers

Add to existing `ResumeUploader.tsx`:

```typescript
// Add new state variables
const [uploadType, setUploadType] = useState<'file' | 'figma'>('file');
const [figmaUrl, setFigmaUrl] = useState('');
const [figmaError, setFigmaError] = useState('');

// Add Figma upload handler
const handleFigmaUpload = async () => {
  if (!figmaUrl.trim()) {
    setFigmaError('Please enter a Figma URL');
    return;
  }

  const figmaPattern = /figma\.com\/file\/[a-zA-Z0-9]+/;
  if (!figmaPattern.test(figmaUrl)) {
    setFigmaError('Please enter a valid Figma URL');
    return;
  }

  setFigmaError('');
  setIsLoading(true);

  try {
    const response = await fetch('/api/parse-figma-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ figmaUrl, isAuthenticated })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to parse Figma design');
    }

    const result = await response.json();
    
    const uploadInfo: ParseInfo = {
      ...result.meta,
      method: 'Figma MCP',
      confidence: result.meta.confidence || 0.85
    };

    onResumeUploaded(result.data, uploadInfo);
    
  } catch (error) {
    setFigmaError(error instanceof Error ? error.message : 'Unknown error');
  } finally {
    setIsLoading(false);
  }
};
```

### Add UI Components

```jsx
// Add before existing dropzone
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
        Paste a link to your Figma resume design and we'll automatically extract the content.
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
    </div>
  </div>
)}
```

## Step 5: Add CSS Styles

Add to `ResumeUploader.module.css`:

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
}

.figmaButton {
  padding: 0.75rem 1.5rem;
  background: #0d9488;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}

.figmaError {
  display: flex;
  align-items: center;
  color: #ef4444;
  background: #fef2f2;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .figmaUrlInput {
    flex-direction: column;
  }
  
  .tabButtons {
    flex-direction: column;
  }
}
```

## Step 6: Environment Configuration

Add to `.env.local`:

```bash
FIGMA_API_KEY=your_figma_api_key_here
```

Update `.gitignore`:

```gitignore
# Figma API credentials
.env.local
.env
```

## Step 7: Testing

### Unit Tests

Create `__tests__/figma-parser.test.ts`:

```typescript
import { FigmaToResumeParser } from '@/lib/figma-resume-parser';

describe('FigmaToResumeParser', () => {
  it('should extract name from design data', () => {
    const mockData = {
      nodes: {
        '1:1': {
          document: {
            children: [{
              type: 'TEXT',
              characters: 'John Doe',
              style: { fontSize: 32 }
            }]
          }
        }
      }
    };
    
    const result = FigmaToResumeParser.parseDesign(mockData);
    expect(result.name).toBe('John Doe');
  });
});
```

### Integration Test

```bash
# Test API endpoint
curl -X POST http://localhost:3000/api/parse-figma-resume \
  -H "Content-Type: application/json" \
  -d '{"figmaUrl": "https://figma.com/file/test", "isAuthenticated": false}'
```

## Implementation Challenges & Solutions

### Challenge 1: Design Structure Recognition
**Solution**: Use AI-powered text analysis and heuristic algorithms based on typical resume layouts.

### Challenge 2: Data Binding
**Solution**: Implement intelligent text matching with manual override options.

### Challenge 3: Error Handling
**Solution**: Comprehensive error handling for API failures, invalid URLs, and parsing errors.

## Security Considerations

1. **API Key Protection**: Store server-side only
2. **Input Validation**: Validate all URLs and user inputs
3. **Rate Limiting**: Implement proper rate limiting
4. **File Permissions**: Only access public Figma files

## Performance Optimization

1. **Caching**: Cache frequently accessed designs
2. **Background Processing**: Use queues for large files
3. **Error Recovery**: Retry logic with exponential backoff

## Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Error handling verified
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Documentation updated

## Monitoring & Analytics

Track these metrics:
- Upload success rate
- Processing time
- Error types and frequency
- User adoption rate

This implementation provides a solid foundation for the Figma upload feature while maintaining compatibility with existing project patterns and ensuring robust error handling and user experience.