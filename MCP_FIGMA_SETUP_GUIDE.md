# MCP Figma Quick Setup Guide

## Prerequisites

1. **Figma Account** with access to design files
2. **Cursor IDE** or VS Code with GitHub Copilot
3. **Node.js** version 18+ installed
4. **Project access** to your AI resume generator codebase

## Step 1: Get Your Figma API Token

1. Go to [Figma Settings](https://www.figma.com/settings) → **Account** → **Personal access tokens**
2. Click **Create a new personal access token**
3. Give it a descriptive name (e.g., "MCP Development Token")
4. Set expiration to 90 days or longer
5. Copy the token and save it securely

## Step 2: Configure MCP Server

### Option A: Global Configuration (Recommended)

1. Open Cursor Settings (`Cmd/Ctrl + ,`)
2. Navigate to **Tools & Integrations** → **MCP**
3. Click **"New MCP Server"**
4. Add this configuration:

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR_FIGMA_API_KEY",
        "--stdio"
      ]
    }
  }
}
```

### Option B: Project-Level Configuration

1. Create `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR_FIGMA_API_KEY",
        "--stdio"
      ]
    }
  }
}
```

## Step 3: Environment Setup

1. Add your Figma API key to your project's `.env.local`:

```bash
FIGMA_API_KEY=your_figma_api_key_here
```

2. Update your `.gitignore` to exclude the token:

```gitignore
# Environment variables
.env.local
.env
.cursor/mcp.json
```

## Step 4: Test the Integration

1. Restart Cursor completely
2. Open your project
3. Start a new Composer session (`Cmd/Ctrl + I`)
4. Try this test prompt:

```
Please test the Figma MCP connection by listing available tools.
```

You should see Figma-related tools like:
- `get_figma_file`
- `get_figma_node`
- `get_figma_image`

## Step 5: Create Your First MCP-Generated Component

1. Find a Figma design you want to convert
2. Copy the Figma URL (e.g., `https://figma.com/file/ABC123/Design-File?node-id=1:23`)
3. Use this prompt in Cursor Composer:

```
Generate a React component with CSS Modules based on this Figma design:
[PASTE_FIGMA_URL_HERE]

Requirements:
- Use TypeScript
- Follow kebab-case naming for files
- Use CSS Modules (not Tailwind)
- Make it responsive
- Include proper TypeScript interfaces
```

## Step 6: Set Up Project Rules

Create `.cursor/rules.md` with MCP-specific rules:

```markdown
# MCP Figma Integration Rules

## Code Generation
- Always use CSS Modules for styling generated from Figma designs
- Follow kebab-case naming conventions for generated components
- Preserve responsive design patterns from Figma
- Use existing design tokens when available
- Generate TypeScript interfaces for component props

## File Structure
- Place generated components in `src/components/[component-name]/`
- Include both `.tsx` and `.module.css` files
- Follow existing project structure patterns

## Figma Integration
- When given a Figma URL, extract design data using MCP tools
- Convert Figma layouts to CSS Grid/Flexbox
- Map Figma colors to CSS custom properties
- Preserve component hierarchy from Figma
```

## Step 7: Advanced Configuration

### Enable Code Connect (Optional)

If you want to map Figma components to existing code:

1. In Figma, select a component
2. Go to **Dev Mode** → **Code Connect**
3. Add mappings to your existing components:

```typescript
// Example Code Connect mapping
figma.connect(Button, "https://figma.com/file/...?node-id=1:23", {
  props: {
    variant: figma.enum("Variant", {
      Primary: "primary",
      Secondary: "secondary"
    }),
    size: figma.enum("Size", {
      Small: "sm",
      Medium: "md",
      Large: "lg"
    })
  }
});
```

### Set Up Figma Variables

1. In Figma, create a **Variable Collection**
2. Add variables for colors, spacing, typography
3. Use code syntax format for CSS custom properties:

```css
/* In Figma variable code syntax */
var(--color-primary-500)
var(--spacing-4)
var(--font-size-lg)
```

## Step 8: Team Workflow

### For Designers
1. Share Figma links with specific node IDs
2. Use consistent naming conventions
3. Organize components in logical groups
4. Add descriptions and annotations

### For Developers
1. Use the shared Figma links in MCP prompts
2. Review generated code before committing
3. Test responsive behavior
4. Maintain design system consistency

## Troubleshooting

### Common Issues

1. **"MCP server not found"**
   - Restart Cursor completely
   - Check that your API key is correct
   - Verify the MCP configuration syntax

2. **"Permission denied"**
   - Ensure you have access to the Figma file
   - Check if the file is public or properly shared
   - Verify your API token has the right permissions

3. **"Node not found"**
   - Check that the node ID in the URL is correct
   - Ensure the node exists in the specified file
   - Try using the file URL without node ID

### Debug Commands

Test your setup with these prompts:

```bash
# Test MCP connection
"List all available MCP tools"

# Test Figma access
"Get information about this Figma file: [FILE_URL]"

# Test component generation
"Generate a simple component from this Figma design: [DESIGN_URL]"
```

## Example Workflow

Here's a complete example of using MCP Figma integration:

1. **Designer shares**: `https://figma.com/file/ABC123/Resume-Templates?node-id=1:45`

2. **Developer prompts**:
```
Generate a resume header component based on this Figma design:
https://figma.com/file/ABC123/Resume-Templates?node-id=1:45

Please:
- Create a TypeScript React component
- Use CSS Modules for styling
- Make it responsive for mobile and desktop
- Extract colors and typography from the design
- Include proper TypeScript interfaces
- Follow the project's kebab-case naming convention
```

3. **AI generates**:
```typescript
// src/components/resume-header/resume-header.tsx
import React from 'react';
import styles from './resume-header.module.css';

interface ResumeHeaderProps {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
}

export const ResumeHeader: React.FC<ResumeHeaderProps> = ({
  name,
  title,
  location,
  email,
  phone
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.nameSection}>
        <h1 className={styles.name}>{name}</h1>
        <p className={styles.title}>{title}</p>
      </div>
      <div className={styles.contactInfo}>
        <span className={styles.location}>{location}</span>
        <span className={styles.email}>{email}</span>
        <span className={styles.phone}>{phone}</span>
      </div>
    </header>
  );
};
```

```css
/* src/components/resume-header/resume-header.module.css */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 0;
  border-bottom: 1px solid var(--color-border);
}

.nameSection {
  flex: 1;
}

.name {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.title {
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.contactInfo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .name {
    font-size: 2rem;
  }
}
```

## Next Steps

1. **Practice** with simple designs first
2. **Build** a component library from your Figma designs
3. **Iterate** on the prompts to improve output quality
4. **Document** your team's workflow and best practices
5. **Scale** to more complex designs and features

## Resources

- [Figma API Documentation](https://www.figma.com/developers/api)
- [MCP Protocol Specification](https://github.com/modelcontextprotocol/specification)
- [Framelink MCP Server GitHub](https://github.com/GLips/Figma-Context-MCP)
- [Cursor MCP Documentation](https://docs.cursor.com/features/mcp)

## Support

If you encounter issues:
1. Check the [GitHub Issues](https://github.com/GLips/Figma-Context-MCP/issues)
2. Join the [Discord Community](https://discord.gg/framelink)
3. Review the [Cursor Documentation](https://docs.cursor.com)

This setup enables your team to rapidly convert Figma designs into production-ready React components, significantly accelerating your development workflow while maintaining design fidelity and code quality standards.