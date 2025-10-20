# Resume Display with Switcher

A wrapper component that displays the resume with a template switcher positioned on the side.

## Purpose

This component combines:
- **TemplateSwitcher** - Vertical template picker on the left side
- **ResumeDisplayController** - Resume display in the main content area

## Usage

```tsx
import ResumeDisplayWithSwitcher from "@/src/containers/resume-display-with-switcher/resume-display-with-switcher";
import type { ParsedResumeSchema } from "@/lib/tools-lib/shared-parsed-resume-schema";

export default function ResumePage() {
  const resumeData: ParsedResumeSchema = {
    // ... your resume data
  };

  return (
    <div>
      <ResumeDisplayWithSwitcher 
        resumeData={resumeData} 
        isAuth={true} 
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `resumeData` | `ParsedResumeSchema` | Yes | The parsed resume data to display |
| `isAuth` | `boolean` | No | Whether the user is authenticated (default: false) |

## Layout

### Desktop/Tablet (≥768px):
```
┌───────────────┬────────────────────────┐
│               │                        │
│  Template     │   Resume Display       │
│  Switcher     │                        │
│  (Sticky)     │   Content here...      │
│               │                        │
└───────────────┴────────────────────────┘
```

### Mobile (<768px):
```
┌────────────────────────┐
│                        │
│   Resume Display       │
│                        │
│   Content here...      │
│                        │
└────────────────────────┘
(Switcher hidden)
```

## Features

- ✅ **Side-by-side layout** - Switcher on left, resume on right
- ✅ **Sticky positioning** - Switcher stays visible while scrolling
- ✅ **Responsive** - Hides switcher on mobile, shows on tablet+
- ✅ **Real-time switching** - Templates change instantly
- ✅ **Smooth animations** - Fade-in effects for content

## Related Components

- `TemplateSwitcher` - The vertical template picker component
- `ResumeDisplayController` - The main resume display component
- `TemplatePicker` - The horizontal template picker for forms

## CSS Architecture

Uses CSS Modules following ITCSS + Design Tokens system:
- File: `resume-display-with-switcher.module.css`
- Design tokens for all colors, spacing, typography
- No Tailwind classes

## Examples

### In a Resume View Page:
```tsx
// app/resume/[slug]/page.tsx
export default function ViewResumePage() {
  const [resume, setResume] = useState<Resume | null>(null);
  
  // ... fetch resume logic
  
  return (
    <div>
      <ResumeDisplayButtons {...buttonProps} />
      <ResumeDisplayWithSwitcher 
        resumeData={resume.parsedData} 
        isAuth={true} 
      />
    </div>
  );
}
```

### In a Temp Resume Page:
```tsx
// app/resume/temp-resume/[slug]/page.tsx
export default function TempResumePage() {
  const [resumeData, setResumeData] = useState<ParsedResumeSchema | null>(null);
  
  // ... get temp resume from store
  
  return (
    <div>
      <ResumeDisplayButtons {...buttonProps} />
      <ResumeDisplayWithSwitcher 
        resumeData={resumeData} 
        isAuth={false} 
      />
    </div>
  );
}
```

## Notes

- The switcher automatically syncs with the form picker (TemplatePicker)
- Both use the same Context for state management
- Selection is persisted in localStorage
- The wrapper handles all layout and responsive behavior
- Child components (ResumeDisplayController) don't need layout changes

## See Also

- [TEMPLATE_SWITCHER_GUIDE.md](../../../TEMPLATE_SWITCHER_GUIDE.md) - Complete feature guide
- [IMPLEMENTATION_COMPLETE.md](../../../IMPLEMENTATION_COMPLETE.md) - Template system overview

