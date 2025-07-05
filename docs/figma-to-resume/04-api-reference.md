# API Reference - Figma Integration

## Overview

This document provides comprehensive API reference for the Figma integration endpoints in the resume generation system.

## Authentication

All API endpoints require proper authentication when `isAuthenticated` is set to `true`.

```typescript
// Headers required for authenticated requests
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <session_token>" // Handled by Supabase client
}
```

## Endpoints

### Parse Figma Resume

Extract resume data from a Figma design URL.

**Endpoint**: `POST /api/parse-figma-resume`

#### Request

```typescript
interface ParseFigmaResumeRequest {
  figmaUrl: string;           // Required: Valid Figma file URL
  isAuthenticated: boolean;   // Required: Whether user is logged in
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/parse-figma-resume \
  -H "Content-Type: application/json" \
  -d '{
    "figmaUrl": "https://figma.com/file/ABC123/Resume-Design?node-id=1:23",
    "isAuthenticated": true
  }'
```

#### Response

**Success Response (200):**
```typescript
interface ParseFigmaResumeResponse {
  success: true;
  data: ParsedResume;
  meta: {
    method: 'figma';
    confidence: number;        // 0.0-1.0 confidence score
    filename: string;          // Generated filename
    fileType: string;          // 'application/json'
    fileSize: number;          // Size in bytes
    resumeId?: string;         // Only if authenticated
    resumeSlug?: string;       // Only if authenticated
    figmaData?: {
      fileId: string;
      nodeId?: string;
      designName: string;
    };
  };
}
```

**Error Response (400/401/500):**
```typescript
interface ErrorResponse {
  error: string;
  details?: string;
}
```

#### Error Codes

| Code | Description | Common Causes |
|------|-------------|---------------|
| 400 | Bad Request | Invalid Figma URL, missing parameters |
| 401 | Unauthorized | Invalid authentication for authenticated request |
| 403 | Forbidden | Figma file not accessible |
| 429 | Rate Limited | Too many API requests |
| 500 | Server Error | Internal processing error |

## Data Types

### ParsedResume

```typescript
interface ParsedResume {
  name: string;
  title: string;
  summary: string;
  profileImage: string;
  contact: {
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  skills: Array<{
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }>;
  customColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}
```

### FigmaNodeInfo

```typescript
interface FigmaNodeInfo {
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
```

## Figma URL Formats

### Supported URL Formats

```bash
# File-level access
https://figma.com/file/FILE_ID/FILE_NAME

# Node-specific access (recommended)
https://figma.com/file/FILE_ID/FILE_NAME?node-id=NODE_ID

# With additional parameters
https://figma.com/file/FILE_ID/FILE_NAME?node-id=NODE_ID&t=TIMESTAMP
```

### URL Validation

```typescript
// Regex pattern for Figma URLs
const figmaUrlPattern = /figma\.com\/file\/([a-zA-Z0-9]+)\/[^?]*(\?.*node-id=([^&]+))?/;

// Extract components
function extractFigmaIds(url: string): { fileId: string; nodeId?: string } {
  const match = url.match(figmaUrlPattern);
  if (!match) throw new Error('Invalid Figma URL format');
  
  return {
    fileId: match[1],
    nodeId: match[3] ? match[3].replace('-', ':') : undefined
  };
}
```

## Rate Limiting

### Figma API Limits

- **Rate Limit**: 1000 requests per hour per API token
- **File Size**: Maximum 100MB per file
- **Node Limit**: Maximum 500 nodes per request

### Implementation

```typescript
// Rate limiting strategy
const rateLimiter = {
  requests: 1000,
  window: 3600000, // 1 hour in milliseconds
  reset: Date.now() + 3600000
};

// Check rate limit before request
if (rateLimiter.requests <= 0) {
  throw new Error('Rate limit exceeded. Try again later.');
}
```

## Error Handling

### Common Error Scenarios

#### Invalid URL Format
```json
{
  "error": "Invalid Figma URL format",
  "details": "URL must match pattern: https://figma.com/file/FILE_ID/..."
}
```

#### File Access Denied
```json
{
  "error": "Cannot access Figma file",
  "details": "File may be private or you may not have permission"
}
```

#### Parsing Failure
```json
{
  "error": "Failed to parse resume content",
  "details": "Could not identify resume sections in the design"
}
```

#### Rate Limit Exceeded
```json
{
  "error": "Rate limit exceeded",
  "details": "Maximum 1000 requests per hour. Resets at: 2024-01-01T15:00:00Z"
}
```

### Error Recovery

```typescript
// Retry logic with exponential backoff
async function retryWithBackoff(fn: Function, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}
```

## Response Examples

### Successful Parse Response

```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "title": "Senior Software Engineer",
    "summary": "Experienced developer with 8+ years in full-stack development...",
    "profileImage": "",
    "contact": {
      "email": "john.doe@example.com",
      "phone": "+1 (555) 123-4567",
      "location": "San Francisco, CA"
    },
    "experience": [
      {
        "company": "Tech Corp",
        "position": "Senior Software Engineer",
        "startDate": "2020-01-01",
        "endDate": "Present",
        "responsibilities": [
          "Led development of microservices architecture",
          "Mentored junior developers"
        ]
      }
    ],
    "education": [
      {
        "institution": "University of California",
        "degree": "Bachelor of Science",
        "field": "Computer Science",
        "startDate": "2012-09-01",
        "endDate": "2016-06-01"
      }
    ],
    "skills": [
      {
        "name": "JavaScript",
        "level": "Expert"
      },
      {
        "name": "React",
        "level": "Advanced"
      }
    ],
    "customColors": {
      "primary": "#2563eb",
      "secondary": "#64748b",
      "accent": "#059669",
      "background": "#ffffff",
      "text": "#1f2937"
    }
  },
  "meta": {
    "method": "figma",
    "confidence": 0.85,
    "filename": "john-doe-resume.json",
    "fileType": "application/json",
    "fileSize": 2048,
    "resumeId": "uuid-123-456",
    "resumeSlug": "john-doe-resume-1234",
    "figmaData": {
      "fileId": "ABC123DEF456",
      "nodeId": "1:23",
      "designName": "John Doe Resume"
    }
  }
}
```

### Error Response Examples

```json
// Invalid URL
{
  "error": "Invalid Figma URL format",
  "details": "Expected format: https://figma.com/file/FILE_ID/FILE_NAME"
}

// Authentication Error
{
  "error": "Authentication required",
  "details": "Please sign in to save resumes"
}

// Figma API Error
{
  "error": "Failed to access Figma file",
  "details": "File not found or access denied"
}
```

## SDK Usage Examples

### JavaScript/TypeScript

```typescript
// Using fetch API
async function parseFigmaResume(figmaUrl: string, isAuthenticated: boolean) {
  try {
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
      const error = await response.json();
      throw new Error(error.error || 'Failed to parse Figma design');
    }

    return await response.json();
  } catch (error) {
    console.error('Figma parsing error:', error);
    throw error;
  }
}

// Usage
const result = await parseFigmaResume(
  'https://figma.com/file/ABC123/Resume?node-id=1:23',
  true
);
```

### React Hook

```typescript
import { useState } from 'react';

function useFigmaParser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseDesign = async (figmaUrl: string, isAuthenticated: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/parse-figma-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ figmaUrl, isAuthenticated })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { parseDesign, loading, error };
}
```

## Performance Considerations

### Caching Strategy

```typescript
// Cache frequently accessed designs
const designCache = new Map<string, any>();

function getCachedDesign(fileId: string, nodeId?: string): any | null {
  const key = `${fileId}:${nodeId || 'root'}`;
  return designCache.get(key) || null;
}

function setCachedDesign(fileId: string, nodeId: string | undefined, data: any): void {
  const key = `${fileId}:${nodeId || 'root'}`;
  designCache.set(key, data);
  
  // Set TTL (Time To Live)
  setTimeout(() => designCache.delete(key), 300000); // 5 minutes
}
```

### Request Optimization

```typescript
// Batch multiple node requests
async function fetchMultipleNodes(fileId: string, nodeIds: string[]) {
  const nodeIdString = nodeIds.join(',');
  return await FigmaAPI.fetchDesignData(fileId, nodeIdString);
}

// Optimize large file processing
async function processLargeDesign(fileId: string) {
  // Process in chunks to avoid memory issues
  const chunkSize = 50;
  const allNodes = await getAllNodes(fileId);
  
  for (let i = 0; i < allNodes.length; i += chunkSize) {
    const chunk = allNodes.slice(i, i + chunkSize);
    await processChunk(chunk);
  }
}
```

## Security Guidelines

### Input Validation

```typescript
// Validate Figma URL
function validateFigmaUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'www.figma.com' || parsed.hostname === 'figma.com';
  } catch {
    return false;
  }
}

// Sanitize extracted content
function sanitizeContent(content: string): string {
  return content
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}
```

### Access Control

```typescript
// Check file permissions before processing
async function checkFileAccess(fileId: string, apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
      headers: { 'X-Figma-Token': apiKey }
    });
    return response.ok;
  } catch {
    return false;
  }
}
```

## Monitoring & Logging

### Request Logging

```typescript
// Log API requests for monitoring
function logApiRequest(endpoint: string, method: string, status: number, duration: number) {
  console.log({
    timestamp: new Date().toISOString(),
    endpoint,
    method,
    status,
    duration,
    type: 'api_request'
  });
}

// Usage
const startTime = Date.now();
// ... API call
const duration = Date.now() - startTime;
logApiRequest('/api/parse-figma-resume', 'POST', 200, duration);
```

### Error Tracking

```typescript
// Track and categorize errors
function trackError(error: Error, context: any) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    type: 'figma_parse_error'
  };
  
  // Send to monitoring service
  console.error('Figma API Error:', errorData);
}
```

This API reference provides comprehensive documentation for integrating with the Figma parsing functionality, including proper error handling, security considerations, and performance optimization strategies.