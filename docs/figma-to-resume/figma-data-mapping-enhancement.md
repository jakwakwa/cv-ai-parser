# Figma Data Mapping Enhancement

## Overview
Completely overhauled the JSX generation system to properly extract and map actual text content from Figma designs, ensuring that real Figma content is preserved and bound to appropriate resume fields.

## Key Improvements

### 1. **Content Extraction and Storage System**
Created a global content store that extracts actual text from Figma layers:

```typescript
const figmaContentStore: {
  name?: string;
  summary?: string;
  experience?: Array<{...}>;
  contact?: {...};
  education?: Array<{...}>;
  certifications?: Array<{...}>;
  skills?: string[];
} = {};
```

### 2. **Enhanced Text Content Mapping**
The `mapTextContent` function now:

- **Extracts actual Figma text content** and stores it for reference
- **Uses Figma content as fallbacks** in JSX bindings
- **Preserves original text** while providing proper data binding
- **Handles special cases** like CURRICULUM VITAE name extraction

#### Example Mappings:
```typescript
// Before: Generic binding
'{resume.name}'

// After: Figma content as fallback
'{resume.name || "John Doe"}' // Where "John Doe" is extracted from Figma

// Before: No actual content
'{resume.summary}'

// After: Actual Figma text preserved
'{resume.summary || `I am an experienced frontend engineer...`}'
```

### 3. **Smart Content Detection**
Enhanced detection patterns for:

- **Names**: Extracts from "CURRICULUM VITAE\nJOHN DOE" patterns
- **Contact Info**: Detects emails, phone numbers, and locations using regex
- **Summary Content**: Identifies long-form text content
- **Section Titles**: Uses actual Figma text instead of generic labels

### 4. **Generated Component with Default Data**
Each generated component now includes:

```typescript
// Default resume data extracted from Figma design
const defaultResume: ParsedResume = {
  name: "John Doe", // Extracted from Figma
  summary: "I am an experienced...", // Actual Figma text
  contact: {
    email: "email@example.com", // From Figma if detected
    phone: "+1 (555) 123-4567",
    location: "Your Location"
  },
  // ... other sections with smart defaults
};

export const FigmaResumeComponent: React.FC<{ resume?: ParsedResume }> = ({ 
  resume = defaultResume 
}) => {
  // Component uses actual Figma content as fallbacks
};

// Export extracted content for reference
export const figmaExtractedContent = {
  name: "John Doe",
  summary: "Actual summary from Figma...",
  // ... other extracted content
};
```

### 5. **Enhanced Preview Component**
Updated the preview to:

- **Parse generated JSX** to extract the `defaultResume` object
- **Use actual Figma content** in the preview
- **Show real extracted data** instead of placeholder content
- **Match the generated component** exactly

## Technical Implementation

### Content Extraction Process:
1. **Reset content store** for each generation
2. **Parse Figma nodes** and extract text content
3. **Store content** by layer type and name
4. **Generate JSX** with Figma content as fallbacks
5. **Include default resume object** with extracted data
6. **Export extracted content** for reference

### Data Binding Strategy:
```typescript
// Smart fallback pattern
{resume.field || "Figma extracted content"}

// Contact detection
if (text.includes('@')) {
  return `{resume.contact?.email || "${text}"}`;
}

// Name extraction from CV format
if (text.includes('CURRICULUM VITAE')) {
  const name = extractNameFromCV(text);
  return `{resume.name || "${name}"}`;
}
```

## Benefits

1. **Real Content**: Generated components show actual Figma text content
2. **Smart Fallbacks**: Components work with or without resume data
3. **Accurate Previews**: Preview matches generated component exactly
4. **Content Preservation**: No loss of valuable Figma design content
5. **Flexible Usage**: Components can be used standalone or with dynamic data

## Example Output

### Before (Generic):
```jsx
<p>{resume.name}</p>
<p>{resume.summary}</p>
```

### After (With Figma Content):
```jsx
<p>{resume.name || "John Doe"}</p>
<p>{resume.summary || `I am an experienced frontend engineer situated in marvellous Cape Town...`}</p>
```

## Result
The generated components now properly display actual content from the Figma design while maintaining the ability to be populated with dynamic resume data. Users see their actual design content in both the preview and generated component, creating a seamless design-to-code workflow.