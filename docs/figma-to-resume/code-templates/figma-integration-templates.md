# Figma Integration Code Templates

This document provides reusable code templates for implementing the MCP Figma integration features.

## Core Service Templates

### 1. Figma API Service Template

```typescript
// lib/figma-api.ts
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
  fills?: any[];
  children?: FigmaNodeInfo[];
}

export interface FigmaDesignData {
  fileId: string;
  nodeId?: string;
  name: string;
  nodes: Record<string, any>;
  metadata: {
    lastModified: string;
    version: string;
  };
}

export class FigmaAPI {
  private static readonly API_BASE = 'https://api.figma.com/v1';
  private static readonly API_KEY = process.env.FIGMA_API_KEY;

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

    const endpoint = nodeId 
      ? `/files/${fileId}/nodes?ids=${nodeId}`
      : `/files/${fileId}`;

    const response = await fetch(`${this.API_BASE}${endpoint}`, {
      headers: { 'X-Figma-Token': this.API_KEY }
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      fileId,
      nodeId,
      name: data.name || 'Figma Design',
      nodes: data.nodes || { [fileId]: data.document },
      metadata: {
        lastModified: data.lastModified || new Date().toISOString(),
        version: data.version || '1.0'
      }
    };
  }

  static async validateFileAccess(fileId: string): Promise<boolean> {
    try {
      await this.fetchDesignData(fileId);
      return true;
    } catch {
      return false;
    }
  }
}
```

### 2. Resume Parser Template

```typescript
// lib/figma-resume-parser.ts
import { ParsedResume } from '@/lib/resume-parser/schema';
import { FigmaDesignData, FigmaNodeInfo } from './figma-api';

export class FigmaToResumeParser {
  static async parseDesign(designData: FigmaDesignData): Promise<ParsedResume> {
    const textNodes = this.extractTextNodes(designData);
    
    return {
      name: this.extractName(textNodes),
      title: this.extractTitle(textNodes),
      summary: this.extractSummary(textNodes),
      profileImage: this.extractProfileImage(designData),
      contact: this.extractContact(textNodes),
      experience: this.extractExperience(textNodes),
      education: this.extractEducation(textNodes),
      certifications: this.extractCertifications(textNodes),
      skills: this.extractSkills(textNodes),
      customColors: this.extractColors(designData)
    };
  }

  private static extractTextNodes(data: FigmaDesignData): FigmaNodeInfo[] {
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
          fontFamily: node.style?.fontFamily,
          fills: node.fills
        });
      }
      
      if (node.children) {
        node.children.forEach(traverse);
      }
    }
    
    const document = data.nodes ? Object.values(data.nodes)[0] : null;
    if (document) traverse(document);
    
    return nodes;
  }

  private static extractName(textNodes: FigmaNodeInfo[]): string {
    // Find largest text node (likely to be name)
    const nameNode = textNodes
      .filter(node => node.characters && node.fontSize)
      .sort((a, b) => (b.fontSize || 0) - (a.fontSize || 0))[0];
    
    const name = nameNode?.characters || '';
    return this.sanitizeText(name);
  }

  private static extractTitle(textNodes: FigmaNodeInfo[]): string {
    const titleKeywords = ['developer', 'engineer', 'designer', 'manager', 'director', 'analyst'];
    const titleNode = textNodes.find(node => 
      node.characters && 
      titleKeywords.some(keyword => 
        node.characters!.toLowerCase().includes(keyword)
      )
    );
    return this.sanitizeText(titleNode?.characters || '');
  }

  private static extractContact(textNodes: FigmaNodeInfo[]) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /[\+]?[1-9][\d\s\-\(\)\.]{8,}/;
    const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9\-]+/;
    const githubRegex = /github\.com\/[a-zA-Z0-9\-]+/;
    
    const contact: any = {};
    
    for (const node of textNodes) {
      if (!node.characters) continue;
      
      const emailMatch = node.characters.match(emailRegex);
      if (emailMatch) contact.email = emailMatch[0];
      
      const phoneMatch = node.characters.match(phoneRegex);
      if (phoneMatch) contact.phone = phoneMatch[0];
      
      const linkedinMatch = node.characters.match(linkedinRegex);
      if (linkedinMatch) contact.linkedin = linkedinMatch[0];
      
      const githubMatch = node.characters.match(githubRegex);
      if (githubMatch) contact.github = githubMatch[0];
    }
    
    return contact;
  }

  private static extractSummary(textNodes: FigmaNodeInfo[]): string {
    const summaryNode = textNodes
      .filter(node => node.characters && node.characters.length > 50)
      .sort((a, b) => (b.characters?.length || 0) - (a.characters?.length || 0))[0];
    return this.sanitizeText(summaryNode?.characters || '');
  }

  private static extractExperience(textNodes: FigmaNodeInfo[]) {
    // Simplified implementation - can be enhanced with more sophisticated parsing
    const experienceKeywords = ['experience', 'work', 'employment', 'career'];
    const experienceNodes = textNodes.filter(node => 
      node.characters && 
      experienceKeywords.some(keyword => 
        node.name.toLowerCase().includes(keyword) ||
        node.characters!.toLowerCase().includes(keyword)
      )
    );
    
    // Basic experience extraction logic
    return experienceNodes.map(node => ({
      company: 'Company Name',
      position: 'Position',
      startDate: '2020-01-01',
      endDate: 'Present',
      responsibilities: [this.sanitizeText(node.characters || '')]
    }));
  }

  private static extractEducation(textNodes: FigmaNodeInfo[]) {
    const educationKeywords = ['education', 'university', 'college', 'degree'];
    const educationNodes = textNodes.filter(node => 
      node.characters && 
      educationKeywords.some(keyword => 
        node.name.toLowerCase().includes(keyword) ||
        node.characters!.toLowerCase().includes(keyword)
      )
    );
    
    return educationNodes.map(node => ({
      institution: 'University Name',
      degree: 'Degree Type',
      field: 'Field of Study',
      startDate: '2015-09-01',
      endDate: '2019-06-01',
      gpa: ''
    }));
  }

  private static extractCertifications(textNodes: FigmaNodeInfo[]) {
    const certKeywords = ['certification', 'certificate', 'certified'];
    const certNodes = textNodes.filter(node => 
      node.characters && 
      certKeywords.some(keyword => 
        node.characters!.toLowerCase().includes(keyword)
      )
    );
    
    return certNodes.map(node => ({
      name: this.sanitizeText(node.characters || ''),
      issuer: 'Issuing Organization',
      date: new Date().toISOString().split('T')[0],
      url: ''
    }));
  }

  private static extractSkills(textNodes: FigmaNodeInfo[]) {
    const skillsKeywords = ['skills', 'technologies', 'tools', 'expertise'];
    const skillsNodes = textNodes.filter(node => 
      node.characters && 
      skillsKeywords.some(keyword => 
        node.name.toLowerCase().includes(keyword)
      )
    );
    
    const skillsText = skillsNodes.map(node => node.characters).join(' ');
    const commonSkills = ['JavaScript', 'React', 'TypeScript', 'Python', 'Node.js', 'CSS', 'HTML'];
    
    return commonSkills
      .filter(skill => skillsText.toLowerCase().includes(skill.toLowerCase()))
      .map(skill => ({
        name: skill,
        level: 'Advanced' as const
      }));
  }

  private static extractProfileImage(designData: FigmaDesignData): string {
    // Extract profile image URL if available
    return '';
  }

  private static extractColors(designData: FigmaDesignData) {
    return {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745',
      background: '#ffffff',
      text: '#333333'
    };
  }

  private static sanitizeText(text: string): string {
    return text
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .trim();
  }
}
```

### 3. API Route Template

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
    
    // Validation
    if (!figmaUrl) {
      return NextResponse.json(
        { error: 'Figma URL is required' },
        { status: 400 }
      );
    }

    // Extract Figma IDs
    let fileId: string, nodeId: string | undefined;
    try {
      ({ fileId, nodeId } = FigmaAPI.extractFigmaIds(figmaUrl));
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid Figma URL format' },
        { status: 400 }
      );
    }
    
    // Fetch design data
    const designData = await FigmaAPI.fetchDesignData(fileId, nodeId);
    
    // Parse to resume structure
    const parsedResume = await FigmaToResumeParser.parseDesign(designData);
    
    // Handle authentication and database storage
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
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = errorMessage.includes('API error: 403') ? 403 : 500;
    
    return NextResponse.json(
      { error: 'Failed to parse Figma design', details: errorMessage },
      { status: statusCode }
    );
  }
}
```

## React Component Templates

### 1. Enhanced ResumeUploader Component

```typescript
// src/components/ResumeUploader/ResumeUploader.tsx (additions)
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import styles from './ResumeUploader.module.css';

// Add to existing component state
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

// Add to JSX before existing dropzone
const tabSection = (
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
);

const figmaSection = uploadType === 'figma' && (
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
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={handleFigmaUpload}
          className={styles.figmaButton}
          disabled={!figmaUrl.trim() || isLoading}
        >
          {isLoading ? 'Importing...' : 'Import Design'}
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
);
```

### 2. Figma URL Validator Hook

```typescript
// hooks/useFigmaValidator.ts
import { useState, useCallback } from 'react';

interface FigmaValidationResult {
  isValid: boolean;
  error?: string;
  fileId?: string;
  nodeId?: string;
}

export function useFigmaValidator() {
  const [validationResult, setValidationResult] = useState<FigmaValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateUrl = useCallback(async (url: string): Promise<FigmaValidationResult> => {
    setIsValidating(true);
    
    try {
      // Basic URL format validation
      const figmaPattern = /figma\.com\/file\/([a-zA-Z0-9]+)\/[^?]*(\?.*node-id=([^&]+))?/;
      const match = url.match(figmaPattern);
      
      if (!match) {
        const result = { isValid: false, error: 'Invalid Figma URL format' };
        setValidationResult(result);
        return result;
      }

      const fileId = match[1];
      const nodeId = match[3]?.replace('-', ':');

      // Optional: Check file accessibility
      const response = await fetch('/api/validate-figma-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId })
      });

      if (!response.ok) {
        const result = { isValid: false, error: 'Cannot access Figma file' };
        setValidationResult(result);
        return result;
      }

      const result = { isValid: true, fileId, nodeId };
      setValidationResult(result);
      return result;
      
    } catch (error) {
      const result = { isValid: false, error: 'Validation failed' };
      setValidationResult(result);
      return result;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearValidation = useCallback(() => {
    setValidationResult(null);
  }, []);

  return {
    validationResult,
    isValidating,
    validateUrl,
    clearValidation
  };
}
```

### 3. Figma Preview Component

```typescript
// components/FigmaPreview/FigmaPreview.tsx
import React, { useState, useEffect } from 'react';
import { FigmaAPI } from '@/lib/figma-api';
import styles from './FigmaPreview.module.css';

interface FigmaPreviewProps {
  figmaUrl: string;
  onDataExtracted?: (data: any) => void;
}

export const FigmaPreview: React.FC<FigmaPreviewProps> = ({
  figmaUrl,
  onDataExtracted
}) => {
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (figmaUrl) {
      loadPreview();
    }
  }, [figmaUrl]);

  const loadPreview = async () => {
    setLoading(true);
    setError(null);

    try {
      const { fileId, nodeId } = FigmaAPI.extractFigmaIds(figmaUrl);
      const designData = await FigmaAPI.fetchDesignData(fileId, nodeId);
      
      setPreviewData(designData);
      onDataExtracted?.(designData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preview');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.preview}>
        <div className={styles.loading}>Loading Figma preview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.preview}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  if (!previewData) {
    return null;
  }

  return (
    <div className={styles.preview}>
      <h4 className={styles.title}>Figma Design Preview</h4>
      <div className={styles.metadata}>
        <p><strong>File:</strong> {previewData.name}</p>
        <p><strong>Last Modified:</strong> {previewData.metadata.lastModified}</p>
      </div>
      
      <div className={styles.iframe}>
        <iframe
          src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaUrl)}`}
          width="100%"
          height="300"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  );
};
```

## Utility Templates

### 1. Error Handler Template

```typescript
// lib/figma-error-handler.ts
export class FigmaError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'FigmaError';
  }
}

export class FigmaErrorHandler {
  static handle(error: unknown): FigmaError {
    if (error instanceof FigmaError) {
      return error;
    }

    if (error instanceof Error) {
      if (error.message.includes('403')) {
        return new FigmaError(
          'Cannot access Figma file. Please ensure the file is publicly accessible.',
          'ACCESS_DENIED',
          403
        );
      }

      if (error.message.includes('429')) {
        return new FigmaError(
          'Rate limit exceeded. Please try again later.',
          'RATE_LIMITED',
          429
        );
      }

      if (error.message.includes('Invalid Figma URL')) {
        return new FigmaError(
          'Invalid Figma URL format. Please provide a valid Figma file URL.',
          'INVALID_URL',
          400
        );
      }
    }

    return new FigmaError(
      'An unexpected error occurred while processing the Figma design.',
      'UNKNOWN_ERROR',
      500
    );
  }

  static getRetryable(error: FigmaError): boolean {
    return ['RATE_LIMITED', 'NETWORK_ERROR'].includes(error.code);
  }
}
```

### 2. Cache Template

```typescript
// lib/figma-cache.ts
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class FigmaCache {
  private static cache = new Map<string, CacheEntry<any>>();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  static set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    // Clean up expired entries
    setTimeout(() => this.cleanup(), ttl);
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  static generateKey(fileId: string, nodeId?: string): string {
    return `figma:${fileId}:${nodeId || 'root'}`;
  }

  private static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  static clear(): void {
    this.cache.clear();
  }

  static size(): number {
    return this.cache.size;
  }
}
```

### 3. Rate Limiter Template

```typescript
// lib/figma-rate-limiter.ts
interface RateLimitWindow {
  requests: number;
  resetTime: number;
}

export class FigmaRateLimiter {
  private static windows = new Map<string, RateLimitWindow>();
  private static readonly MAX_REQUESTS = 1000;
  private static readonly WINDOW_SIZE = 60 * 60 * 1000; // 1 hour

  static async checkLimit(apiKey: string): Promise<boolean> {
    const now = Date.now();
    const window = this.windows.get(apiKey);

    if (!window || now > window.resetTime) {
      this.windows.set(apiKey, {
        requests: 1,
        resetTime: now + this.WINDOW_SIZE
      });
      return true;
    }

    if (window.requests >= this.MAX_REQUESTS) {
      return false;
    }

    window.requests++;
    return true;
  }

  static getRemainingRequests(apiKey: string): number {
    const window = this.windows.get(apiKey);
    if (!window || Date.now() > window.resetTime) {
      return this.MAX_REQUESTS;
    }
    return Math.max(0, this.MAX_REQUESTS - window.requests);
  }

  static getResetTime(apiKey: string): number {
    const window = this.windows.get(apiKey);
    return window?.resetTime || Date.now();
  }
}
```

## Testing Templates

### 1. Service Tests Template

```typescript
// __tests__/figma-api.test.ts
import { FigmaAPI } from '@/lib/figma-api';

describe('FigmaAPI', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    process.env.FIGMA_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('extractFigmaIds', () => {
    it('should extract file ID from basic URL', () => {
      const url = 'https://figma.com/file/ABC123/Test-File';
      const result = FigmaAPI.extractFigmaIds(url);
      
      expect(result.fileId).toBe('ABC123');
      expect(result.nodeId).toBeUndefined();
    });

    it('should extract file ID and node ID from URL with node-id', () => {
      const url = 'https://figma.com/file/ABC123/Test-File?node-id=1-23';
      const result = FigmaAPI.extractFigmaIds(url);
      
      expect(result.fileId).toBe('ABC123');
      expect(result.nodeId).toBe('1:23');
    });

    it('should throw error for invalid URL', () => {
      const url = 'https://invalid-url.com';
      expect(() => FigmaAPI.extractFigmaIds(url)).toThrow('Invalid Figma URL format');
    });
  });

  describe('fetchDesignData', () => {
    it('should fetch design data successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          name: 'Test File',
          document: { id: '1:1', type: 'FRAME' }
        })
      };
      
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await FigmaAPI.fetchDesignData('ABC123');
      
      expect(result.fileId).toBe('ABC123');
      expect(result.name).toBe('Test File');
    });

    it('should handle API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 403
      });

      await expect(FigmaAPI.fetchDesignData('ABC123')).rejects.toThrow('Figma API error: 403');
    });
  });
});
```

### 2. Component Tests Template

```typescript
// __tests__/components/FigmaUploader.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FigmaUploader } from '@/components/FigmaUploader';

describe('FigmaUploader', () => {
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('should render figma input field', () => {
    render(<FigmaUploader onUpload={mockOnUpload} />);
    
    expect(screen.getByPlaceholderText(/figma.com\/file/)).toBeInTheDocument();
    expect(screen.getByText('Import Design')).toBeInTheDocument();
  });

  it('should validate figma URL format', async () => {
    render(<FigmaUploader onUpload={mockOnUpload} />);
    
    const input = screen.getByPlaceholderText(/figma.com\/file/);
    const button = screen.getByText('Import Design');
    
    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid Figma URL/)).toBeInTheDocument();
    });
  });

  it('should handle successful upload', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        success: true,
        data: { name: 'John Doe' },
        meta: { confidence: 0.85 }
      })
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    render(<FigmaUploader onUpload={mockOnUpload} />);
    
    const input = screen.getByPlaceholderText(/figma.com\/file/);
    const button = screen.getByText('Import Design');
    
    fireEvent.change(input, { target: { value: 'https://figma.com/file/ABC123/Test' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(
        { name: 'John Doe' },
        expect.objectContaining({ confidence: 0.85 })
      );
    });
  });
});
```

These templates provide a solid foundation for implementing the Figma integration features while maintaining consistency with your project's patterns and ensuring proper error handling, testing, and type safety.