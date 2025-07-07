# Figma Color Extraction Feature

## Overview
Enhanced the Figma integration to extract and apply colors from uploaded Figma designs to the preview, creating a more accurate representation of the original design with real color schemes.

## Features

### 🎨 **Automatic Color Extraction**
- **CSS Color Parsing**: Extracts hex, RGB, RGBA, and HSL colors from generated CSS
- **Figma Node Analysis**: Directly extracts colors from Figma node fills and strokes
- **Smart Color Mapping**: Identifies primary, secondary, and accent colors automatically
- **Fallback Colors**: Provides sensible defaults when colors can't be extracted

### 🖼️ **Enhanced Preview System**
- **Dynamic Color Application**: Applies extracted colors to preview elements in real-time
- **Color Palette Display**: Shows extracted colors with labels and hex values
- **Visual Feedback**: Clear indication that colors come from the actual Figma design
- **Responsive Design**: Color scheme adapts to different screen sizes

### 🔧 **Technical Implementation**
- **CSS Custom Properties**: Uses CSS variables for dynamic color application
- **Type Safety**: Full TypeScript support for color extraction and application
- **Performance Optimized**: Efficient color extraction with memoization
- **Error Resilient**: Graceful handling of missing or invalid color data

## Color Extraction Process

### 1. CSS-Based Extraction
```typescript
function extractColorsFromCSS(cssCode: string) {
  // Extract hex colors: #ffffff, #000000ff
  const hexColors = cssCode.match(/#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?/g) || [];
  
  // Extract RGB/RGBA colors: rgb(255,255,255), rgba(0,0,0,0.5)
  const rgbColors = cssCode.match(/rgba?\([^)]+\)/g) || [];
  
  // Extract HSL colors: hsl(0,0%,100%), hsla(0,0%,0%,0.5)
  const hslColors = cssCode.match(/hsla?\([^)]+\)/g) || [];
  
  // Smart color assignment based on CSS patterns
  const primaryMatch = cssCode.match(/(?:primary|main|brand)[^:]*:\s*([^;]+)/i);
  const secondaryMatch = cssCode.match(/(?:secondary|sub|muted)[^:]*:\s*([^;]+)/i);
  const accentMatch = cssCode.match(/(?:accent|highlight|focus)[^:]*:\s*([^;]+)/i);
}
```

### 2. Figma Node Analysis
```typescript
function extractColorsFromNode(node: FigmaNode, colors: Set<string>): void {
  // Extract from fills (backgrounds, shapes)
  if (node.fills) {
    for (const fill of node.fills) {
      if (fill.type === 'SOLID' && fill.color) {
        const hex = rgbaToHex(fill.color.r, fill.color.g, fill.color.b, fill.color.a);
        colors.add(hex);
      }
    }
  }
  
  // Extract from strokes (borders, outlines)
  if (node.strokes) {
    for (const stroke of node.strokes) {
      if (stroke.type === 'SOLID' && stroke.color) {
        const hex = rgbaToHex(stroke.color.r, stroke.color.g, stroke.color.b, stroke.color.a);
        colors.add(hex);
      }
    }
  }
}
```

### 3. Color Application
```typescript
// Dynamic CSS custom properties
const dynamicStyles = {
  '--figma-primary': figmaColors.primary,
  '--figma-secondary': figmaColors.secondary,
  '--figma-accent': figmaColors.accent,
  '--figma-background': figmaColors.background,
  '--figma-text': figmaColors.text,
} as React.CSSProperties;

// Applied to preview elements
<div className={styles.staticPreview} style={dynamicStyles}>
  <h1 className={`${styles.mockName} ${styles.figmaStyled}`}>
    {actualContent.name}
  </h1>
</div>
```

## API Response Structure

### Enhanced Response Format
```typescript
interface FigmaApiResponse {
  jsx: string;
  css: string;
  componentName: string;
  rawFigma: Record<string, unknown>;
  customColors: Record<string, string>;
  extractedColors: {
    primary: string;      // Main brand color
    secondary: string;    // Supporting color
    accent: string;       // Highlight color
    all: string[];        // All extracted colors
  };
  success: boolean;
  message: string;
}
```

### Color Extraction Results
```json
{
  "extractedColors": {
    "primary": "#116964",
    "secondary": "#565854", 
    "accent": "#a49990",
    "all": ["#116964", "#565854", "#a49990", "#3e2f22"]
  }
}
```

## Preview Enhancements

### Visual Elements
- **Color-Coded Headers**: Primary color applied to names and titles
- **Themed Sections**: Section titles use primary color with opacity
- **Branded Skills**: Skill tags use primary color with background tint
- **Consistent Borders**: Dividers and borders match the color scheme

### Color Palette Display
- **Color Swatches**: Visual representation of extracted colors
- **Color Labels**: Descriptive names (Primary, Secondary, Accent)
- **Hex Values**: Exact color codes for reference
- **Responsive Layout**: Adapts to different screen sizes

## CSS Implementation

### Dynamic Color Classes
```css
/* Figma color styling */
.figmaStyled {
  color: var(--figma-primary, #0891b2) !important;
}

.figmaStyled.sectionTitle {
  border-bottom-color: var(--figma-primary, #0891b2) !important;
}

.figmaStyled.skillTag {
  background-color: var(--figma-primary, #0891b2)15 !important;
  color: var(--figma-primary, #0891b2) !important;
}
```

### Color Palette Styling
```css
.colorPalette {
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  margin-top: 1rem;
}

.colorSwatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 80px;
}

.colorCircle {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

## User Experience Improvements

### Before Enhancement
- Generic blue color scheme (`#0891b2`, `#64748b`)
- No connection to actual Figma design colors
- Static preview with placeholder styling

### After Enhancement
- **Real Figma Colors**: Extracted from actual design
- **Dynamic Preview**: Colors change based on uploaded design
- **Visual Feedback**: Clear indication of color source
- **Color Reference**: Palette display for easy reference

## Technical Benefits

### Performance
- **Efficient Extraction**: Single-pass color extraction from CSS and nodes
- **Memoized Results**: Colors cached to prevent re-extraction
- **Minimal Re-renders**: Only updates when JSX/CSS changes

### Reliability
- **Fallback System**: Default colors when extraction fails
- **Error Handling**: Graceful degradation for invalid colors
- **Type Safety**: Full TypeScript coverage for color operations

### Maintainability
- **Modular Design**: Separate functions for different extraction methods
- **Clear Interfaces**: Well-defined types for color data
- **Consistent Patterns**: Reusable color application system

## Integration Points

### API Routes
- **`/api/parse-figma-resume`**: Returns extracted colors with generated components
- **`/api/adapt-figma-resume`**: Uses MCP agent for advanced color adaptation

### Components
- **`FigmaComponentPreview`**: Displays colors in preview and palette
- **`FigmaLinkUploader`**: Handles color extraction workflow
- **`ColorPicker`**: Could be enhanced to use extracted colors

### Data Flow
1. **Upload**: User provides Figma link
2. **Extract**: API extracts colors from Figma data
3. **Generate**: Component created with color-aware CSS
4. **Preview**: Colors applied to preview elements
5. **Display**: Color palette shows extracted colors

## Future Enhancements

### Advanced Color Analysis
- **Color Harmony**: Detect complementary and analogous colors
- **Accessibility**: Check contrast ratios and WCAG compliance
- **Brand Guidelines**: Suggest color usage based on design patterns

### User Customization
- **Color Override**: Allow users to modify extracted colors
- **Palette Export**: Export color schemes for other tools
- **Theme Generation**: Create complete design systems from colors

### AI Integration
- **Smart Mapping**: Use AI to better identify color purposes
- **Color Naming**: Generate semantic names for extracted colors
- **Style Suggestions**: Recommend color applications based on content

## Success Metrics

### User Engagement
- ✅ Users see their actual design colors in preview
- ✅ Increased confidence in generated components
- ✅ Better understanding of color extraction process

### Technical Quality
- ✅ Accurate color extraction from multiple sources
- ✅ Performance optimized with minimal overhead
- ✅ Error-resistant with graceful fallbacks

### Design Fidelity
- ✅ Preview matches original Figma design colors
- ✅ Consistent color application across elements
- ✅ Responsive color scheme adaptation

## Conclusion

The Figma color extraction feature significantly enhances the design-to-code workflow by preserving the original color scheme from Figma designs. This creates a more accurate and trustworthy preview experience while providing users with valuable color information for their design projects.

The implementation balances performance, reliability, and user experience, making it a valuable addition to the Figma integration system.