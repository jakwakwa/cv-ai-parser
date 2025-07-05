# AI Agents Guide: Using Figma MCP Server Integration

This guide provides AI agents with the knowledge needed to effectively use the Figma MCP server integration for generating resume components from Figma designs.

## Overview

The AI Resume Generator includes a Figma MCP (Model Context Protocol) server integration that allows AI agents to:
- Fetch Figma design data directly from Figma files
- Convert Figma designs into React components
- Generate CSS modules for styling
- Create resume components with data binding

## MCP Server Configuration

### Server Setup
The MCP server is configured in `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "figma-dev": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "REPLACE_WITH_YOUR_FIGMA_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

### Available Tools
The MCP server exposes these tools:
- `get_figma_data` - Fetches design data from Figma files
- `download_figma_images` - Downloads images from Figma designs

### Starting the Server
```bash
# Start the MCP server manually
pnpm run mcp:figma

# Or let Cursor auto-connect on demand
```

## API Integration

### Parse Figma Resume Endpoint
**Endpoint:** `POST /api/parse-figma-resume`

**Request Body:**
```json
{
  "figmaLink": "https://www.figma.com/file/ABC123/Resume-Design?node-id=1%3A2",
  "customColors": {
    "primary": "#0891b2",
    "secondary": "#64748b",
    "accent": "#06b6d4"
  }
}
```

**Response:**
```json
{
  "componentName": "FigmaResumeComponent",
  "jsx": "import React from 'react';\n// ... component code",
  "css": "/* Generated CSS Module */\n.container { /* ... */ }",
  "rawFigma": { /* Raw Figma API response */ },
  "customColors": { /* Applied color scheme */ }
}
```

### Error Handling
Common error responses:
- `400` - Invalid Figma link or missing node-id
- `500` - Figma API failure, missing API key, or disk write errors

## Component Generation Process

### 1. Figma Node Mapping
The system maps Figma nodes to React components:

```typescript
// TEXT layers are mapped via heuristics
function mapTextContent(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('name')) return '{resume.name}';
  if (lower.includes('title')) return '{resume.title}';
  if (lower.includes('summary')) return '{resume.summary}';
  if (lower.includes('email')) return '{resume.contact?.email}';
  if (lower.includes('phone')) return '{resume.contact?.phone}';
  return `{\`${text}\`}`;
}

// FRAME/GROUP/RECTANGLE become div elements
function nodeToJsx(node: FigmaNode): string {
  switch (node.type) {
    case 'TEXT':
      return `<p>${mapTextContent(node.characters || '')}</p>`;
    case 'FRAME':
    case 'GROUP':
      const childrenJsx = node.children?.map(nodeToJsx).join('\n') || '';
      return `<div className={styles.${node.name.toLowerCase()}}>${childrenJsx}</div>`;
  }
}
```

### 2. Generated Component Structure
```tsx
import React from 'react';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import styles from './ComponentName.module.css';

export const ComponentName: React.FC<{ resume: ParsedResume }> = ({ resume }) => {
  return (
    <div className={styles.container}>
      <p>{resume.name}</p>
      <p>{resume.title}</p>
      <p>{resume.summary}</p>
      <p>{resume.contact?.email}</p>
      <p>{resume.contact?.phone}</p>
    </div>
  );
};
```

### 3. File Persistence
Generated files are saved to:
- `src/generated-resumes/component-name.tsx` - React component
- `src/generated-resumes/component-name.module.css` - CSS module

## Usage Examples

### Example 1: Basic Figma Link Processing
```typescript
// AI agent workflow
const figmaLink = "https://www.figma.com/file/ABC123/Resume?node-id=1%3A2";
const response = await fetch('/api/parse-figma-resume', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ figmaLink })
});

const { componentName, jsx, css } = await response.json();
// Files are automatically saved to src/generated-resumes/
```

### Example 2: Custom Color Integration
```typescript
const customColors = {
  primary: '#0891b2',
  secondary: '#64748b',
  accent: '#06b6d4',
  background: '#ffffff',
  text: '#1f2937'
};

const response = await fetch('/api/parse-figma-resume', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ figmaLink, customColors })
});
```

### Example 3: Using MCP Server Directly
```typescript
// If you have MCP server access
const figmaData = await get_figma_data({
  fileKey: "ABC123",
  nodeId: "1:2"
});

// Process the raw Figma data
const component = generateReactComponent(figmaData);
```

## Best Practices for AI Agents

### 1. Figma Link Validation
Always validate Figma links before processing:
```typescript
function isValidFigmaLink(link: string): boolean {
  try {
    const url = new URL(link);
    return url.hostname === 'www.figma.com' && url.pathname.includes('/file/');
  } catch {
    return false;
  }
}
```

### 2. Error Handling
Implement robust error handling:
```typescript
try {
  const response = await fetch('/api/parse-figma-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ figmaLink, customColors })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate component');
  }

  const data = await response.json();
  // Process successful response
} catch (error) {
  console.error('Figma processing failed:', error);
  // Handle error appropriately
}
```

### 3. Component Integration
After generation, integrate components into the app:
```typescript
// Import the generated component
import { FigmaResumeComponent } from '@/src/generated-resumes/figma-resume-component';

// Use in your app
<FigmaResumeComponent resume={resumeData} />
```

## Troubleshooting

### Common Issues

1. **Invalid Figma Link**
   - Ensure the link follows the format: `https://www.figma.com/file/FILE_ID/FILE_NAME`
   - Include `node-id` parameter for specific nodes

2. **API Key Issues**
   - Verify `FIGMA_API_KEY` is set in environment
   - Ensure the key has `file_read` and `file_images` scopes

3. **MCP Server Connection**
   - Check that `figma-developer-mcp` is installed
   - Verify MCP server appears green in Cursor settings
   - Restart MCP server if needed: `pnpm run mcp:figma`

4. **Component Generation Errors**
   - Check that the Figma node contains recognizable text layers
   - Ensure node names are descriptive for better CSS class generation
   - Verify the node is accessible (not private/restricted)

### Debug Tips

1. **View Raw Figma Data**
   Use the FigmaPreview component to inspect raw Figma responses

2. **Check Generated Files**
   Generated files are saved to `src/generated-resumes/` for inspection

3. **Test with Simple Designs**
   Start with simple Figma frames before complex layouts

## Extending the Integration

### Adding New Field Mappings
To support additional resume fields, modify the `mapTextContent` function:

```typescript
function mapTextContent(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('name')) return '{resume.name}';
  if (lower.includes('title')) return '{resume.title}';
  if (lower.includes('location')) return '{resume.location}';
  if (lower.includes('website')) return '{resume.website}';
  // Add more mappings as needed
  return `{\`${text}\`}`;
}
```

### Supporting Complex Layouts
For repeating sections (experience, education), implement loop generators:

```typescript
function generateExperienceLoop(experiences: any[]): string {
  return `
    {resume.experience?.map((exp, index) => (
      <div key={index} className={styles.experienceItem}>
        <h3>{exp.position}</h3>
        <p>{exp.company}</p>
        <p>{exp.duration}</p>
        <p>{exp.description}</p>
      </div>
    ))}
  `;
}
```

## Security Considerations

1. **API Key Protection**
   - Never commit API keys to version control
   - Use environment variables for sensitive data
   - Rotate API keys regularly

2. **Input Validation**
   - Validate all Figma links before processing
   - Sanitize generated code before file writes
   - Implement rate limiting for API calls

3. **File System Security**
   - Restrict generated file locations
   - Validate file names and extensions
   - Implement cleanup for old generated files

## Advanced Usage Patterns

### Batch Processing Multiple Designs
```typescript
const processFigmaDesigns = async (designs: string[]) => {
  const results = await Promise.allSettled(
    designs.map(async (figmaLink) => {
      const response = await fetch('/api/parse-figma-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ figmaLink })
      });
      return response.json();
    })
  );
  
  return results.filter(result => result.status === 'fulfilled');
};
```

### Custom Field Mapping
```typescript
// Extend the mapping function for custom fields
const customFieldMappings = {
  'portfolio': '{resume.portfolio}',
  'github': '{resume.contact?.github}',
  'certifications': '{resume.certifications?.join(", ")}',
  'languages': '{resume.languages?.map(l => l.name).join(", ")}'
};

function enhancedMapTextContent(text: string): string {
  const lower = text.toLowerCase();
  
  // Check custom mappings first
  for (const [key, mapping] of Object.entries(customFieldMappings)) {
    if (lower.includes(key)) {
      return mapping;
    }
  }
  
  // Fall back to default mappings
  return mapTextContent(text);
}
```

### Error Recovery Strategies
```typescript
const robustFigmaProcessing = async (figmaLink: string, maxRetries = 3) => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('/api/parse-figma-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          figmaLink, 
          retryAttempt: attempt 
        })
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      // Handle specific error cases
      if (response.status === 429) {
        // Rate limited - wait before retry
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
        continue;
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
};
```

## Integration with AI Workflows

### Smart Component Generation
```typescript
// AI-enhanced component generation
const generateIntelligentComponent = async (figmaData: any) => {
  // Analyze the design structure
  const designAnalysis = analyzeDesignComplexity(figmaData);
  
  // Generate optimized component based on analysis
  if (designAnalysis.hasRepeatingElements) {
    return generateLoopBasedComponent(figmaData);
  } else {
    return generateStaticComponent(figmaData);
  }
};

function analyzeDesignComplexity(figmaData: any) {
  return {
    hasRepeatingElements: detectRepeatingPatterns(figmaData),
    isResponsive: hasResponsiveConstraints(figmaData),
    usesComponents: hasComponentInstances(figmaData),
    complexity: calculateComplexityScore(figmaData)
  };
}
```

### Automated Testing Integration
```typescript
// Generate tests for Figma components
const generateComponentTests = (componentName: string, jsxCode: string) => {
  return `
import { render, screen } from '@testing-library/react';
import { ${componentName} } from './${componentName}';
import { mockResumeData } from '../__mocks__/resumeData';

describe('${componentName}', () => {
  it('renders resume data correctly', () => {
    render(<${componentName} resume={mockResumeData} />);
    
    expect(screen.getByText(mockResumeData.name)).toBeInTheDocument();
    expect(screen.getByText(mockResumeData.title)).toBeInTheDocument();
  });
  
  it('handles missing data gracefully', () => {
    const incompleteData = { name: 'Test User' };
    render(<${componentName} resume={incompleteData} />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});
  `;
};
```

## Performance Optimization

### Caching Strategy
```typescript
// Implement caching for Figma data
const figmaCache = new Map<string, any>();

const getCachedFigmaData = async (fileKey: string, nodeId?: string) => {
  const cacheKey = `${fileKey}:${nodeId || 'root'}`;
  
  if (figmaCache.has(cacheKey)) {
    return figmaCache.get(cacheKey);
  }
  
  const data = await fetchFigmaData(fileKey, nodeId);
  figmaCache.set(cacheKey, data);
  
  // Cache expiry (24 hours)
  setTimeout(() => figmaCache.delete(cacheKey), 24 * 60 * 60 * 1000);
  
  return data;
};
```

### Incremental Updates
```typescript
// Track component versions for incremental updates
const trackComponentVersion = (componentName: string, hash: string) => {
  const versionFile = `src/generated-resumes/.versions.json`;
  const versions = JSON.parse(fs.readFileSync(versionFile, 'utf8') || '{}');
  
  versions[componentName] = {
    hash,
    timestamp: Date.now(),
    version: (versions[componentName]?.version || 0) + 1
  };
  
  fs.writeFileSync(versionFile, JSON.stringify(versions, null, 2));
};
```

## Future Enhancements

1. **Advanced Node Processing**
   - Support for Figma components and variants
   - Auto-generation of responsive layouts
   - Integration with Figma design tokens
   - Smart detection of design patterns

2. **Enhanced Data Binding**
   - AI-powered field detection and mapping
   - Support for nested data structures
   - Dynamic section generation with loops
   - Context-aware content placement

3. **Performance Optimizations**
   - Intelligent caching with invalidation
   - Incremental component updates
   - Batch processing of multiple designs
   - CDN integration for generated assets

4. **Developer Experience**
   - Visual component editor
   - Real-time preview updates
   - Automated testing generation
   - Performance monitoring and analytics

5. **AI Integration**
   - Smart layout optimization
   - Automated accessibility improvements
   - Content-aware styling suggestions
   - Design pattern recognition

This comprehensive integration provides AI agents with powerful tools for converting Figma designs into production-ready React components, complete with error handling, performance optimization, and extensibility for future enhancements.