# MCP Figma Developer Setup Guide

## Overview

This guide provides step-by-step instructions for setting up MCP (Model Context Protocol) Figma integration for your development team. This enables rapid code generation from Figma designs using AI-powered tools like Cursor.

**Time to Complete**: 15-30 minutes  
**Prerequisites**: Figma account, Cursor IDE or VS Code with GitHub Copilot  
**Skill Level**: Beginner to Intermediate

## Quick Start Checklist

- [ ] Get Figma API token
- [ ] Configure MCP server
- [ ] Test integration
- [ ] Set up project rules
- [ ] Train team on workflow

## Step 1: Get Your Figma API Token

> **📖 Complete Token Guide**: This section provides a quick overview. For comprehensive token management including security, permissions, and production setup, see [`figma-api-tokens-guide.md`](./figma-api-tokens-guide.md).

### Create Personal Developer Token

**Important**: For Use Case 1 (Developer Workflow), each developer should create their own personal token.

1. **Visit Figma Settings**
   - Go to [https://www.figma.com/settings](https://www.figma.com/settings)
   - Navigate to **Account** → **Personal access tokens**

2. **Generate New Token**
   - Click **"Create a new personal access token"**
   - **Name**: Use descriptive name (e.g., "MCP Development - [Your Name]")
   - **Expiration**: Set to 90 days or longer
   - **Scope**: Default (read access to files you have access to)

3. **Save Token Securely**
   ```bash
   # Copy the token immediately - it won't be shown again
   # Token format: figd_abc123...xyz789
   ```

### Token Permissions & Access

Your personal token will have access to:
- ✅ **Your personal files** (private and public)
- ✅ **Team files** (if you're a team member)
- ✅ **Public community files**
- ✅ **Files shared with you**

### Security Guidelines

⚠️ **Critical Security Rules**:
- Never commit tokens to version control
- Store in local `.env.local` files only
- Don't share tokens between developers
- Regenerate tokens every 90 days

## Step 2: Configure MCP Server

### Option A: Global Configuration (Recommended for Team)

1. **Open Cursor Settings**
   ```
   Cursor → Settings (Cmd/Ctrl + ,) → Tools & Integrations → MCP
   ```

2. **Add New MCP Server**
   - Click **"+ Add new global MCP server"**
   - Use this configuration:

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

3. **Replace API Key**
   - Replace `YOUR_FIGMA_API_KEY` with your actual token
   - Save the configuration

### Option B: Project-Level Configuration

1. **Create Project Configuration**
   ```bash
   # In your project root
   mkdir -p .cursor
   touch .cursor/mcp.json
   ```

2. **Add Configuration**
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

3. **Secure the Configuration**
   ```bash
   # Add to .gitignore
   echo ".cursor/mcp.json" >> .gitignore
   ```

### Alternative: Environment Variable Approach

1. **Create Environment File**
   ```bash
   # Add to .env.local (for Next.js) or .env
   echo "FIGMA_API_KEY=your_figma_token_here" >> .env.local
   ```

2. **Update MCP Configuration**
   ```json
   {
     "mcpServers": {
       "Framelink Figma MCP": {
         "command": "npx",
         "args": ["-y", "figma-developer-mcp", "--stdio"],
         "env": {
           "FIGMA_API_KEY": "${FIGMA_API_KEY}"
         }
       }
     }
   }
   ```

## Step 3: Test the Integration

### Restart and Verify

1. **Restart Cursor Completely**
   ```bash
   # Close all Cursor windows and reopen
   # This ensures MCP server configuration is loaded
   ```

2. **Open Your Project**
   ```bash
   # Navigate to your project directory
   cd /path/to/your/ai-cv-gen
   cursor .
   ```

3. **Start Composer Session**
   ```bash
   # Use keyboard shortcut
   Cmd/Ctrl + I  # Opens Cursor Composer
   ```

### Test MCP Connection

1. **Check Available Tools**
   ```
   Prompt: "Please test the Figma MCP connection by listing available tools."
   ```

   **Expected Response:**
   ```
   Available Figma MCP tools:
   - get_figma_file: Fetch file information
   - get_figma_node: Get specific node data
   - get_figma_image: Extract images
   - get_figma_components: List components
   ```

2. **Test File Access**
   ```
   Prompt: "Get information about this Figma file: https://figma.com/file/ABC123"
   ```

   **Expected Response:**
   ```
   File information retrieved:
   - Name: [File Name]
   - Last Modified: [Date]
   - Pages: [Page List]
   ```

### Troubleshooting Common Issues

#### Issue: "MCP server not found"
```bash
# Solutions:
1. Restart Cursor completely
2. Check MCP configuration syntax
3. Verify API key is correct
4. Try npx figma-developer-mcp --version
```

#### Issue: "Permission denied"
```bash
# Solutions:
1. Ensure Figma file is public or shared
2. Check API token permissions
3. Verify file URL format
4. Test with a known public file
```

#### Issue: "Connection timeout"
```bash
# Solutions:
1. Check internet connection
2. Verify Figma API status
3. Try with shorter timeout
4. Test with different file
```

## Step 4: Create Your First Component

### Find a Test Design

1. **Use Public Figma File**
   - Find or create a simple component design
   - Ensure the file is publicly accessible
   - Copy the complete URL with node ID

2. **Example Test URLs**
   ```
   # Generic component
   https://figma.com/file/ABC123/Design-System?node-id=1:23

   # Button component
   https://figma.com/file/XYZ789/UI-Kit?node-id=45:67
   ```

### Generate Component Code

1. **Use This Prompt Template**
   ```
   Generate a React component with CSS Modules based on this Figma design:
   [PASTE_FIGMA_URL_HERE]

   Requirements:
   - Use TypeScript
   - Follow kebab-case naming for files
   - Use CSS Modules (not Tailwind)
   - Make it responsive
   - Include proper TypeScript interfaces
   - Follow project structure: src/components/[component-name]/
   ```

2. **Review Generated Output**
   ```typescript
   // Expected output structure:
   // src/components/button-component/button-component.tsx
   // src/components/button-component/button-component.module.css
   ```

### Validate Generated Code

1. **Check File Structure**
   ```bash
   # Verify kebab-case naming
   ls src/components/your-component/
   # Should see:
   # your-component.tsx
   # your-component.module.css
   ```

2. **Review Code Quality**
   ```typescript
   // Check for:
   - TypeScript interfaces ✓
   - CSS Modules import ✓
   - Responsive design ✓
   - Clean component structure ✓
   ```

## Step 5: Set Up Project Rules

### Create Cursor Rules

1. **Create Rules File**
   ```bash
   # In project root
   touch .cursor/rules.md
   ```

2. **Add MCP-Specific Rules**
   ```markdown
   # MCP Figma Integration Rules

   ## Code Generation Standards
   - Always use CSS Modules for styling generated from Figma designs
   - Follow kebab-case naming conventions for generated components
   - Preserve responsive design patterns from Figma
   - Use existing design tokens when available
   - Generate TypeScript interfaces for component props

   ## File Organization
   - Place generated components in `src/components/[component-name]/`
   - Include both `.tsx` and `.module.css` files
   - Follow existing project structure patterns

   ## Figma Integration Workflow
   - When given a Figma URL, extract design data using MCP tools
   - Convert Figma layouts to CSS Grid/Flexbox
   - Map Figma colors to CSS custom properties
   - Preserve component hierarchy from Figma
   - Ensure responsive behavior across screen sizes

   ## Quality Standards
   - All generated components must be TypeScript
   - Include proper prop interfaces
   - Add JSDoc comments for complex components
   - Ensure accessibility (ARIA labels, semantic HTML)
   - Test responsive behavior before committing
   ```

### Configure Environment

1. **Update .gitignore**
   ```bash
   # Add to .gitignore
   echo "# MCP and Figma integration" >> .gitignore
   echo ".cursor/mcp.json" >> .gitignore
   echo ".env.local" >> .gitignore
   echo ".env" >> .gitignore
   ```

2. **Create Environment Template**
   ```bash
   # Create .env.example for team
   cat > .env.example << EOF
   # Figma MCP Integration
   FIGMA_API_KEY=your_figma_api_key_here
   EOF
   ```

## Step 6: Advanced Configuration

### Enable Code Connect (Optional)

Code Connect allows mapping Figma components to existing codebase components.

1. **Install Figma Code Connect**
   ```bash
   npm install @figma/code-connect
   ```

2. **Set Up Component Mapping**
   ```typescript
   // src/components/button/button.figma.ts
   import figma from '@figma/code-connect';
   import { Button } from './button';

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

1. **Create Variable Collection in Figma**
   - Open Figma file
   - Go to Design panel → Variables
   - Create collections for colors, spacing, typography

2. **Add Code Syntax**
   ```css
   /* In Figma variable code syntax field */
   var(--color-primary-500)
   var(--spacing-4)
   var(--font-size-lg)
   ```

3. **Generate CSS Custom Properties**
   ```css
   /* These will be included in generated CSS */
   :root {
     --color-primary-500: #3b82f6;
     --spacing-4: 1rem;
     --font-size-lg: 1.125rem;
   }
   ```

## Step 7: Team Workflow Setup

### For Designers

1. **File Organization**
   ```
   Design System Structure:
   📁 Design System
   ├── 🎨 Colors & Typography
   ├── 📐 Spacing & Layout  
   ├── 🧩 Components
   │   ├── Buttons
   │   ├── Forms
   │   └── Navigation
   └── 📄 Templates
   ```

2. **Sharing Guidelines**
   - Always share links with specific node IDs
   - Use descriptive component names
   - Add annotations for interactive states
   - Organize components in logical groups

3. **Component Preparation**
   ```
   Component Checklist:
   ✓ Use Auto Layout for responsive behavior
   ✓ Define component variants clearly
   ✓ Include all interactive states
   ✓ Add meaningful names to layers
   ✓ Use consistent naming conventions
   ```

### For Developers

1. **Daily Workflow**
   ```bash
   # 1. Receive design handoff
   # 2. Review Figma link and requirements
   # 3. Use MCP prompt template
   # 4. Review and refine generated code
   # 5. Test responsive behavior
   # 6. Commit with descriptive message
   ```

2. **Quality Checklist**
   ```
   Before Committing:
   ✓ Component follows naming conventions
   ✓ CSS uses CSS Modules (no Tailwind)
   ✓ TypeScript interfaces included
   ✓ Responsive design tested
   ✓ Accessibility considerations met
   ✓ Code matches design fidelity
   ```

### Team Communication

1. **Handoff Process**
   ```
   Designer → Developer Handoff:
   1. Share Figma link with node ID
   2. Specify component requirements
   3. Note any special interactions
   4. Provide acceptance criteria
   ```

2. **Feedback Loop**
   ```
   Developer → Designer Feedback:
   1. Share generated component
   2. Note any implementation challenges
   3. Suggest design optimizations
   4. Document reusable patterns
   ```

## Advanced Tips & Best Practices

### Effective Prompting

1. **Specific Requirements**
   ```
   Good Prompt:
   "Generate a responsive navigation component from this Figma design: [URL]
   - Use CSS Grid for layout
   - Include mobile hamburger menu
   - Support keyboard navigation
   - Match exact colors and typography"

   Avoid Vague Prompts:
   "Make a nav from this design"
   ```

2. **Iterative Refinement**
   ```
   Initial Generation → Review → Refinement Prompt:
   "Update the component to use flexbox instead of grid and add hover states"
   ```

### Performance Optimization

1. **Batch Operations**
   ```
   # Process multiple components in one session
   "Generate components for all buttons in this Figma file: [URL]"
   ```

2. **Caching Strategy**
   ```
   # MCP server caches frequently accessed designs
   # Reuse component variations from same file
   ```

### Quality Assurance

1. **Code Review Checklist**
   ```markdown
   ## MCP-Generated Component Review
   - [ ] Follows project naming conventions
   - [ ] Uses CSS Modules consistently  
   - [ ] Includes TypeScript interfaces
   - [ ] Responsive design works on mobile
   - [ ] Accessibility attributes present
   - [ ] Performance considerations met
   - [ ] Design fidelity maintained
   ```

2. **Testing Generated Components**
   ```bash
   # Run these checks on generated components:
   npm run lint          # ESLint checks
   npm run type-check    # TypeScript validation
   npm run test          # Component tests
   npm run build         # Build verification
   ```

## Troubleshooting Guide

### Common Issues and Solutions

#### MCP Server Issues

**Problem**: Server fails to start
```bash
# Debug steps:
1. Check API key validity
2. Test network connectivity
3. Verify Node.js version (18+)
4. Clear npm cache: npm cache clean --force
5. Try manual install: npx figma-developer-mcp@latest
```

**Problem**: API rate limiting
```bash
# Solutions:
1. Implement request caching
2. Use multiple API tokens (team accounts)
3. Optimize batch requests
4. Add retry logic with exponential backoff
```

#### Design Processing Issues

**Problem**: Can't access Figma file
```bash
# Check list:
1. File must be publicly accessible
2. Verify URL format includes node-id
3. Check file sharing permissions
4. Try with different file for testing
```

**Problem**: Poor code generation quality
```bash
# Improvements:
1. Use more specific prompts
2. Include design requirements
3. Specify exact frameworks/patterns
4. Iterate with refinement prompts
```

#### Integration Issues

**Problem**: Generated code doesn't match project patterns
```bash
# Solutions:
1. Update .cursor/rules.md
2. Provide example code in prompts
3. Use more specific requirements
4. Create component templates
```

### Performance Monitoring

1. **Track Key Metrics**
   ```typescript
   // Monitor these metrics:
   - API response times
   - Generation success rate
   - Code quality scores
   - Developer satisfaction
   ```

2. **Optimization Strategies**
   ```typescript
   // Implement these improvements:
   - Cache frequently used designs
   - Batch similar requests
   - Optimize prompt templates
   - Preload common components
   ```

## Next Steps

### Immediate Actions (This Week)
- [ ] Complete setup for all team members
- [ ] Test with 3-5 existing designs
- [ ] Create team-specific prompt templates
- [ ] Document initial findings and optimizations

### Short Term Goals (Next Month)
- [ ] Build library of reusable components
- [ ] Optimize workflow based on team feedback
- [ ] Create advanced prompting strategies
- [ ] Implement Code Connect mappings

### Long Term Objectives (Next Quarter)
- [ ] Measure productivity improvements
- [ ] Expand to complex component generation
- [ ] Integrate with design system management
- [ ] Explore automated testing for generated components

## Resources and Support

### Documentation
- [Figma API Documentation](https://www.figma.com/developers/api)
- [MCP Protocol Specification](https://github.com/modelcontextprotocol/specification)
- [Framelink MCP Server](https://github.com/GLips/Figma-Context-MCP)

### Community Support
- [Framelink Discord](https://discord.gg/framelink) - Active community for MCP Figma
- [Cursor Community](https://forum.cursor.com) - General Cursor IDE support
- [GitHub Issues](https://github.com/GLips/Figma-Context-MCP/issues) - Bug reports and feature requests

### Team Resources
- **Project Documentation**: [`../README.md`](../README.md)
- **Implementation Guide**: [`03-user-upload-implementation.md`](./03-user-upload-implementation.md)
- **API Reference**: [`04-api-reference.md`](./04-api-reference.md)

---

**🎉 Congratulations!** You've successfully set up MCP Figma integration. Your team can now rapidly generate production-ready components from Figma designs using AI assistance.

Start experimenting with simple components and gradually work up to more complex designs as you become familiar with the workflow.