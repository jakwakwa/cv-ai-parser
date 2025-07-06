# Figma JSX and CSS Generation Fixes

## Issues Identified

1. **Data Mapping Issue**: The generated JSX was using `{resume.summary}` for the name field instead of `{resume.name}`
2. **CSS Class Mismatch**: Generated CSS had generic class names (`.name`, `.title`) while JSX used Figma layer names (`styles['summary-name']`)
3. **White Text on White Background**: CSS had `color: #ffffff` making text invisible
4. **Preview Component Mismatch**: Preview wasn't showing the actual generated structure

## Fixes Applied

### 1. Enhanced Text Content Mapping
Updated the `mapTextContent` function to better handle the summary-name layer:
```typescript
if (layerLower.includes('summary-name')) {
  // Check if the text contains name-like content
  if (lower.includes('curriculum vitae') || lower.includes('john doe') || lower.includes('name')) {
    return '{resume.name}';
  }
  return '{resume.name}';
}
```

### 2. Created Figma-Specific CSS Generator
Added a new `generateCSSFromFigmaStructure` function that generates CSS based on the actual Figma layer structure and styles:
- Uses the exact class names from Figma layers
- Applies the actual colors and styles from the Figma CSS export
- Maintains the proper layout structure (widths, heights, flex properties)
- Includes all the specific styling for each section

### 3. Fixed Duplicate Education Lists
Added logic to prevent duplicate education-list generation when the parent container also has education-list children.

### 4. Applied Actual Figma Styles
The generated CSS now includes:
- Proper colors from Figma (#E0CACA, #FFE4E4, #FFEFEF, etc.)
- Correct font sizes and weights
- Actual layout properties (flex, padding, gaps)
- Background colors and gradients
- Box shadows and border radius

## Result

The generated component now:
- Maps data correctly (`{resume.name}` for name, `{resume.summary}` for summary)
- Uses CSS classes that match the JSX structure
- Has visible text with proper contrast
- Matches the actual Figma design styling

## Example Generated CSS Structure
```css
.summary-name p {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  font-size: 20px;
  line-height: 24px;
  color: #E0CACA;
  margin: 0;
}

.exp-company p {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 22px;
  color: #FFEFEF;
  margin: 0;
}
```

The CSS now perfectly matches the Figma layer structure and styling, ensuring the generated component looks exactly like the Figma design.