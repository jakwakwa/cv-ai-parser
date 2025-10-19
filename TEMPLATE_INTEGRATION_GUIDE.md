# Template Integration Guide - Step by Step

## 🎯 Quick Overview

This guide shows you how to integrate the resume template selection feature into your application.

**What you'll get:**
- Users can select a template BEFORE generating their resume
- Template choice is saved and persists across sessions
- Generated resume automatically uses the selected template
- No changes to existing resume data structure

---

## 📋 Integration Checklist

- [ ] Step 1: Add TemplateProvider to app root
- [ ] Step 2: Replace ResumeDisplay with ResumeDisplayController
- [ ] Step 3: Verify TemplatePicker is in ResumeUploadPanel
- [ ] Step 4: Test the complete flow

---

## Step 1: Add TemplateProvider to App Root

The TemplateProvider manages the template selection state globally.

### For Next.js App Router

Edit your root layout file:

```tsx
// app/layout.tsx
import { TemplateProvider } from '@/src/stores/template-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TemplateProvider>
          {children}
        </TemplateProvider>
      </body>
    </html>
  );
}
```

### For Next.js Pages Router

Edit your _app.tsx file:

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { TemplateProvider } from '@/src/stores/template-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TemplateProvider>
      <Component {...pageProps} />
    </TemplateProvider>
  );
}

export default MyApp;
```

### For Regular React App

Edit your main App component:

```tsx
// src/App.tsx
import { TemplateProvider } from '@/src/stores/template-context';

function App() {
  return (
    <TemplateProvider>
      {/* Your app content */}
    </TemplateProvider>
  );
}

export default App;
```

---

## Step 2: Replace ResumeDisplay with ResumeDisplayController

Find all places where you currently use `<ResumeDisplay />` and replace with the controller.

### Resume Builder Page

**Before:**
```tsx
import ResumeDisplay from '@/src/containers/resume-display/resume-display';

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ParsedResumeSchema | null>(null);
  const { user } = useAuth();

  return (
    <div>
      {/* ... upload panel ... */}
      
      {resumeData && (
        <ResumeDisplay 
          resumeData={resumeData} 
          isAuth={!!user} 
        />
      )}
    </div>
  );
}
```

**After:**
```tsx
import ResumeDisplayController from '@/src/containers/resume-display-controller/resume-display-controller';

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ParsedResumeSchema | null>(null);
  const { user } = useAuth();

  return (
    <div>
      {/* ... upload panel ... */}
      
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

**Before:**
```tsx
import ResumeDisplay from '@/src/containers/resume-display/resume-display';

export default function ResumeTailorPage() {
  const [tailoredResume, setTailoredResume] = useState<ParsedResumeSchema | null>(null);

  return (
    <div>
      {/* ... tailor form ... */}
      
      {tailoredResume && (
        <ResumeDisplay 
          resumeData={tailoredResume} 
          isAuth={isAuth} 
        />
      )}
    </div>
  );
}
```

**After:**
```tsx
import ResumeDisplayController from '@/src/containers/resume-display-controller/resume-display-controller';

export default function ResumeTailorPage() {
  const [tailoredResume, setTailoredResume] = useState<ParsedResumeSchema | null>(null);

  return (
    <div>
      {/* ... tailor form ... */}
      
      {tailoredResume && (
        <ResumeDisplayController 
          resumeData={tailoredResume} 
          isAuth={isAuth} 
        />
      )}
    </div>
  );
}
```

---

## Step 3: Verify TemplatePicker is in ResumeUploadPanel

The TemplatePicker has already been added to `ResumeUploadPanel` component. 

It's positioned between the Profile Picture section and the Color Customization section.

**Check that your ResumeUploadPanel includes:**

```tsx
import { TemplatePicker } from '@/src/containers/resume-templates';

export function ResumeUploadPanel({ /* props */ }) {
  return (
    <div>
      {/* ... file upload ... */}
      
      <div className={styles.customizationSection}>
        <h3 className={styles.sectionTitle}>Profile Picture (Optional)</h3>
        <ProfileImageUploader {...props} />
      </div>

      {/* ✅ TemplatePicker is here */}
      <div className={styles.customizationSection}>
        <TemplatePicker />
      </div>

      <div className={styles.customizationSection}>
        <button onClick={onShowColorDialog}>
          Customize Colors
        </button>
        {/* ... submit button ... */}
      </div>
    </div>
  );
}
```

If it's not there, add it manually (it's already done in the provided file).

---

## Step 4: Test the Complete Flow

### Test Scenario 1: Basic Template Selection

1. Navigate to Resume Builder or Tailor page
2. Upload a PDF resume
3. **Select a template** from the TemplatePicker (e.g., "Modern Two-Column")
4. Click "Create Resume"
5. **Verify** the generated resume uses the selected template layout

### Test Scenario 2: Template Persistence

1. Select "Timeline Vertical" template
2. Refresh the page (F5)
3. **Verify** "Timeline Vertical" is still selected
4. Upload and generate resume
5. **Verify** resume uses Timeline Vertical layout

### Test Scenario 3: Switching Templates

1. Generate a resume with "Original" template
2. Change selection to "Classic Centered"
3. Generate another resume (or same resume again)
4. **Verify** the display switches to Classic Centered layout

### Test Scenario 4: Multiple Pages

1. On Resume Builder page, select "Modern Two-Column"
2. Navigate to Resume Tailor page
3. **Verify** "Modern Two-Column" is still selected
4. Generate resume on Tailor page
5. **Verify** it uses Modern Two-Column layout

---

## 🎨 Template Options

Users can choose from 4 templates:

| Template ID | Name | Description |
|-------------|------|-------------|
| `original` | Original | Default two-column layout (your current template) |
| `template-1` | Modern Two-Column | Clean sidebar with gradient background |
| `template-2` | Timeline Vertical | Chronological emphasis with timeline design |
| `template-3` | Classic Centered | Elegant symmetric design with centered header |

---

## 🔧 Advanced: Programmatic Template Control

### Get Current Selection

```tsx
import { useTemplate } from '@/src/stores/template-context';

function MyComponent() {
  const { selectedTemplate } = useTemplate();
  
  console.log('Current template:', selectedTemplate);
  // Output: "template-1"
}
```

### Change Template Programmatically

```tsx
import { useTemplate } from '@/src/stores/template-context';

function MyComponent() {
  const { setSelectedTemplate } = useTemplate();
  
  const handleQuickSelect = () => {
    setSelectedTemplate('template-2');
  };
}
```

### Reset to Default

```tsx
import { useTemplate } from '@/src/stores/template-context';

function MyComponent() {
  const { resetTemplate } = useTemplate();
  
  const handleReset = () => {
    resetTemplate(); // Back to "original"
  };
}
```

---

## 📱 Mobile Considerations

The TemplatePicker is responsive:
- **Desktop:** 4 columns grid
- **Tablet:** 4 columns grid
- **Mobile:** 2 columns grid

All templates are also responsive and mobile-friendly.

---

## 🖨️ PDF Generation

When generating PDFs, the selected template is automatically used:

```tsx
// Your existing PDF generation code works as-is
const handleDownloadPDF = async () => {
  const element = document.getElementById('resume-content');
  // The ResumeDisplayController has already rendered the correct template
  await html2pdf().from(element).save();
};
```

---

## 🐛 Troubleshooting

### Problem: "useTemplate must be used within a TemplateProvider"

**Solution:** Make sure `<TemplateProvider>` is wrapping your app (Step 1)

### Problem: Template selection not persisting

**Cause:** localStorage might be disabled or in private browsing mode

**Check:**
1. Open DevTools → Application → Local Storage
2. Look for key: `resume-template-selection`
3. Should show: `"original"`, `"template-1"`, etc.

### Problem: Wrong template rendering

**Debug:**
```tsx
import { useTemplate } from '@/src/stores/template-context';

function DebugComponent() {
  const { selectedTemplate } = useTemplate();
  
  return (
    <div style={{ background: 'yellow', padding: '1rem' }}>
      DEBUG: Current template = {selectedTemplate}
    </div>
  );
}
```

Add this temporarily to see what template is selected.

### Problem: Template picker not showing

**Check:**
1. Is `<TemplatePicker />` in your ResumeUploadPanel?
2. Is TemplateProvider wrapping your app?
3. Check browser console for errors

---

## ✅ Verification Checklist

After integration, verify:

- [ ] TemplatePicker appears in upload panel
- [ ] Can click and select different templates
- [ ] Selected template shows checkmark
- [ ] Selection persists after page refresh
- [ ] Generated resume uses selected template
- [ ] Original template still works (default)
- [ ] All 4 templates are selectable
- [ ] Mobile responsive layout works
- [ ] PDF generation uses correct template

---

## 🎉 You're Done!

Your users can now:
1. Upload their resume PDF
2. Choose a template before generation
3. Generate resume with selected template
4. Their choice persists across sessions

The template system is fully integrated and working!

---

## 📚 Additional Resources

- **Template Details:** See `src/containers/resume-templates/TEMPLATES_GUIDE.md`
- **Template Code:** See `src/containers/resume-templates/README.md`
- **Context API:** See `src/stores/README.md`
- **Controller:** See `src/containers/resume-display-controller/README.md`

---

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review the example code in `src/containers/resume-templates/EXAMPLE_USAGE.tsx`
3. Verify TemplateProvider is at app root
4. Check browser console for errors
5. Ensure all imports are correct

---

## Summary of Changes

**Files Added:**
- `src/stores/template-context.tsx` - State management
- `src/containers/resume-display-controller/` - Smart controller
- `src/containers/resume-templates/template-picker.tsx` - Selection UI
- `src/containers/resume-templates/resume-template-1.tsx` - New template
- `src/containers/resume-templates/resume-template-2.tsx` - New template
- `src/containers/resume-templates/resume-template-3.tsx` - New template

**Files Modified:**
- `src/components/resume-upload-panel.tsx` - Added TemplatePicker

**Files to Modify (by you):**
- Your app root layout - Add TemplateProvider
- Pages using ResumeDisplay - Replace with ResumeDisplayController

---

**Integration time:** ~15 minutes

**Lines of code to change:** ~10 lines (just imports and provider wrapper)

**User benefit:** Choose from 4 professional resume templates! 🎨