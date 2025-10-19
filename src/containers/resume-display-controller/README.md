# Resume Display Controller

## Overview

The `ResumeDisplayController` is a smart wrapper component that:
- Reads the selected template from Zustand store
- Renders the appropriate template component
- Defaults to original `ResumeDisplay` if no template selected
- Seamlessly integrates with the template picker in the upload panel

## Architecture

```
User selects template → Zustand Store → ResumeDisplayController → Renders correct template
    (TemplatePicker)    (template-store)  (this component)        (Template1/2/3/Original)
```

## Usage

### Basic Integration

**Before:**
```tsx
import ResumeDisplay from '@/src/containers/resume-display/resume-display';

<ResumeDisplay resumeData={resumeData} isAuth={isAuth} />
```

**After:**
```tsx
import ResumeDisplayController from '@/src/containers/resume-display-controller/resume-display-controller';

<ResumeDisplayController resumeData={resumeData} isAuth={isAuth} />
```

That's it! The controller automatically reads from the store and renders the correct template.

---

## Complete Flow Example

### 1. User uploads resume and selects template

```tsx
// In resume-upload-panel.tsx
import { TemplatePicker } from '@/src/containers/resume-templates';

<TemplatePicker />
// User clicks on "Modern Two-Column"
// Store updates: selectedTemplate = "template-1"
```

### 2. User submits form and resume is generated

```tsx
// Resume data is generated from API
const resumeData = await generateResume(uploadedFile);
```

### 3. Controller renders selected template

```tsx
// In your page/component
import ResumeDisplayController from '@/src/containers/resume-display-controller/resume-display-controller';

<ResumeDisplayController 
  resumeData={resumeData} 
  isAuth={isAuth} 
/>
// Automatically renders ResumeTemplate1 because store has "template-1"
```

---

## Integration Points

### Resume Builder Page

Replace existing `ResumeDisplay` usage:

```tsx
// pages/resume-builder.tsx (or similar)
import ResumeDisplayController from '@/src/containers/resume-display-controller/resume-display-controller';

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ParsedResumeSchema | null>(null);
  const { user } = useAuth();

  return (
    <div>
      <ResumeUploadPanel 
        {...props}
        // TemplatePicker is already included in panel
      />
      
      {resumeData && (
        <ResumeDisplayController 
          resumeData={resumeData} 
          isAuth={!!user} 
        />
      )}
    </div>
  );
}
```

### Resume Tailor Page

Same pattern:

```tsx
// pages/resume-tailor.tsx (or similar)
import ResumeDisplayController from '@/src/containers/resume-display-controller/resume-display-controller';

export default function ResumeTailor() {
  const [tailoredResume, setTailoredResume] = useState<ParsedResumeSchema | null>(null);
  const { user } = useAuth();

  return (
    <div>
      <ResumeTailorForm {...props} />
      
      {tailoredResume && (
        <ResumeDisplayController 
          resumeData={tailoredResume} 
          isAuth={!!user} 
        />
      )}
    </div>
  );
}
```

---

## How It Works

### Template Selection Flow

1. **User Interaction:**
   - User sees `TemplatePicker` in upload panel
   - Clicks on desired template
   - Selection saved to Zustand store (persisted to localStorage)

2. **Store Update:**
   ```tsx
   // Happens automatically when user clicks
   setSelectedTemplate("template-1");
   ```

3. **Controller Reads Store:**
   ```tsx
   const selectedTemplate = useTemplateStore((state) => state.selectedTemplate);
   ```

4. **Controller Renders Template:**
   ```tsx
   switch (selectedTemplate) {
     case "template-1":
       return <ResumeTemplate1 resumeData={resumeData} isAuth={isAuth} />;
     case "template-2":
       return <ResumeTemplate2 resumeData={resumeData} isAuth={isAuth} />;
     case "template-3":
       return <ResumeTemplate3 resumeData={resumeData} isAuth={isAuth} />;
     default:
       return <ResumeDisplay resumeData={resumeData} isAuth={isAuth} />;
   }
   ```

---

## State Persistence

The template selection persists across:
- Page refreshes (localStorage via Zustand persist middleware)
- Different resumes (same user preference applies)
- Sessions (stored locally)

### Accessing Store Directly

```tsx
import { useTemplateStore } from '@/src/stores/template-store';

// In any component
const { selectedTemplate, setSelectedTemplate, resetTemplate } = useTemplateStore();

// Get current selection
console.log(selectedTemplate); // "template-1"

// Change selection programmatically
setSelectedTemplate("template-2");

// Reset to default
resetTemplate(); // Sets to "original"
```

---

## Template IDs

| ID | Component | Description |
|----|-----------|-------------|
| `original` | `ResumeDisplay` | Default template (current) |
| `template-1` | `ResumeTemplate1` | Modern Two-Column |
| `template-2` | `ResumeTemplate2` | Timeline Vertical |
| `template-3` | `ResumeTemplate3` | Classic Centered |

---

## Props

```tsx
interface ResumeDisplayControllerProps {
  resumeData: ParsedResumeSchema;  // Resume data to display
  isAuth: boolean;                 // User authentication status
}
```

Same props as original `ResumeDisplay` component - drop-in replacement!

---

## Advantages

✅ **Zero State Management in Components** - Store handles everything  
✅ **Persistent User Preference** - Remembers choice across sessions  
✅ **Drop-in Replacement** - Same interface as original component  
✅ **Type Safe** - Full TypeScript support  
✅ **Single Source of Truth** - One store for all pages  
✅ **No Prop Drilling** - No need to pass template selection through props  

---

## Troubleshooting

### Template not rendering correctly?

Check store state:
```tsx
import { useTemplateStore } from '@/src/stores/template-store';

const selectedTemplate = useTemplateStore((state) => state.selectedTemplate);
console.log('Current template:', selectedTemplate);
```

### Want to reset template to default?

```tsx
import { useTemplateStore } from '@/src/stores/template-store';

const resetTemplate = useTemplateStore((state) => state.resetTemplate);
resetTemplate(); // Back to "original"
```

### Store not persisting?

Ensure Zustand persist middleware is working:
- Check localStorage key: `resume-template-storage`
- Check browser console for errors
- Verify `zustand/middleware` is installed

---

## Testing

```tsx
import { render, screen } from '@testing-library/react';
import ResumeDisplayController from './resume-display-controller';
import { useTemplateStore } from '@/src/stores/template-store';

describe('ResumeDisplayController', () => {
  it('renders original template by default', () => {
    useTemplateStore.setState({ selectedTemplate: 'original' });
    
    render(<ResumeDisplayController resumeData={mockData} isAuth={true} />);
    
    // Test for original template elements
  });

  it('renders template-1 when selected', () => {
    useTemplateStore.setState({ selectedTemplate: 'template-1' });
    
    render(<ResumeDisplayController resumeData={mockData} isAuth={true} />);
    
    // Test for template-1 elements
  });
});
```

---

## Summary

Replace all instances of:
```tsx
<ResumeDisplay resumeData={resumeData} isAuth={isAuth} />
```

With:
```tsx
<ResumeDisplayController resumeData={resumeData} isAuth={isAuth} />
```

The controller will automatically use the template selected by the user via `TemplatePicker`!