# 🚀 Template Integration - Quick Start

## TL;DR

Add template selection to your resume app in 3 steps:

### Step 1: Wrap your app with TemplateProvider

```tsx
// app/layout.tsx or pages/_app.tsx
import { TemplateProvider } from '@/src/stores/template-context';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TemplateProvider>
          {children}
        </TemplateProvider>
      </body>
    </html>
  );
}
```

### Step 2: Replace ResumeDisplay with Controller

Find this:
```tsx
import ResumeDisplay from '@/src/containers/resume-display/resume-display';

<ResumeDisplay resumeData={resumeData} isAuth={isAuth} />
```

Replace with:
```tsx
import ResumeDisplayController from '@/src/containers/resume-display-controller/resume-display-controller';

<ResumeDisplayController resumeData={resumeData} isAuth={isAuth} />
```

### Step 3: Verify TemplatePicker is in upload panel

Already added to `ResumeUploadPanel` component - nothing to do! ✅

---

## That's It!

Users can now:
- Select a template before generating resume
- See 4 template options with visual previews
- Have their choice persist across sessions
- Generate resumes with their selected template

---

## Test It

1. Go to Resume Builder page
2. Upload a PDF
3. **Click on a template** (you'll see 4 options)
4. Click "Create Resume"
5. Resume displays in selected template! 🎉

---

## Available Templates

| Template | Style | Best For |
|----------|-------|----------|
| **Original** | Default two-column | General use |
| **Modern Two-Column** | Gradient sidebar | Tech/Creative |
| **Timeline Vertical** | Chronological | Career progression |
| **Classic Centered** | Elegant symmetric | Traditional roles |

---

## Files Changed

✅ **Already added** `TemplatePicker` to `resume-upload-panel.tsx`

📝 **You need to add:**
1. `<TemplateProvider>` wrapper (1 line)
2. Replace `ResumeDisplay` imports (1 line per page)
3. Replace `<ResumeDisplay />` usage (1 line per page)

Total: ~3-5 lines of code to change!

---

## File Locations

**New Components:**
- `src/stores/template-context.tsx` - State management
- `src/containers/resume-display-controller/resume-display-controller.tsx` - Controller
- `src/containers/resume-templates/template-picker.tsx` - Picker UI
- `src/containers/resume-templates/resume-template-1.tsx` - Template 1
- `src/containers/resume-templates/resume-template-2.tsx` - Template 2
- `src/containers/resume-templates/resume-template-3.tsx` - Template 3

**Modified:**
- `src/components/resume-upload-panel.tsx` - Now includes TemplatePicker

---

## Need More Info?

📖 **Detailed Guide:** `TEMPLATE_INTEGRATION_GUIDE.md`

📖 **Store Setup:** `src/stores/README.md`

📖 **Controller Details:** `src/containers/resume-display-controller/README.md`

📖 **Template Info:** `src/containers/resume-templates/TEMPLATES_GUIDE.md`

---

## Troubleshooting

**Error: "useTemplate must be used within a TemplateProvider"**
→ Add `<TemplateProvider>` wrapper to app root

**Template not persisting**
→ Check localStorage is enabled (not in private mode)

**Wrong template showing**
→ Check selected template in DevTools: Application → Local Storage → `resume-template-selection`

---

## Quick Debug

Add this temporarily to see current selection:

```tsx
import { useTemplate } from '@/src/stores/template-context';

function Debug() {
  const { selectedTemplate } = useTemplate();
  return <div>Current: {selectedTemplate}</div>;
}
```

---

## That's All! 🎉

Your resume app now has multiple template options!