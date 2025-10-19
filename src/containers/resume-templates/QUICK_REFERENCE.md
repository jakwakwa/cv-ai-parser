# Resume Templates - Quick Reference Card

## 🚀 Quick Start (Copy & Paste)

### 1. Import
```typescript
import {
  ResumeTemplate1,
  ResumeTemplate2,
  ResumeTemplate3,
  TemplateSelector,
} from '@/src/containers/resume-templates';
```

### 2. Add State
```typescript
const [selectedTemplate, setSelectedTemplate] = useState<string>('original');
```

### 3. Add UI
```typescript
<TemplateSelector
  selectedTemplate={selectedTemplate}
  onTemplateChange={setSelectedTemplate}
/>
```

### 4. Render Template
```typescript
const renderTemplate = () => {
  switch (selectedTemplate) {
    case 'template-1': return <ResumeTemplate1 resumeData={resumeData} isAuth={isAuth} />;
    case 'template-2': return <ResumeTemplate2 resumeData={resumeData} isAuth={isAuth} />;
    case 'template-3': return <ResumeTemplate3 resumeData={resumeData} isAuth={isAuth} />;
    default: return <ResumeDisplay resumeData={resumeData} isAuth={isAuth} />;
  }
};
```

---

## 📋 Templates At A Glance

### Template 1: Modern Two-Column
- **ID:** `template-1`
- **Layout:** 35% sidebar / 65% content
- **Style:** Modern, gradient sidebar
- **Best for:** Tech/Creative professionals

### Template 2: Timeline Vertical
- **ID:** `template-2`
- **Layout:** Full-width header + vertical flow
- **Style:** Timeline with chronological emphasis
- **Best for:** Career progression showcase

### Template 3: Classic Centered
- **ID:** `template-3`
- **Layout:** Centered header + symmetrical
- **Style:** Elegant, traditional
- **Best for:** Conservative/Executive roles

---

## 🎨 Color Variables Used

All templates use these from `resumeData.customColors`:

```css
--resume-profile-name           /* Name text */
--resume-job-title              /* Job title & primary accents */
--resume-section-titles         /* Section headings */
--resume-body-text              /* Body content */
--resume-main-icons             /* Primary icons & borders */
--resume-sub-icons              /* Secondary icons */
--resume-dates                  /* Date text */
--resume-sidebar-background     /* Sidebar/section backgrounds */
--resume-profile-header-background  /* Header background */
--resume-skill-border           /* Skill badge borders */
--resume-sub-titles-issuer      /* Issuer text */
--resume-sub-titles-companies   /* Company names */
```

---

## 📦 What's Included

### Components (6 files)
- `resume-template-1.tsx` + `.module.css`
- `resume-template-2.tsx` + `.module.css`
- `resume-template-3.tsx` + `.module.css`
- `template-selector.tsx` + `.module.css`

### Exports
- `index.ts` - All components + metadata

### Docs (6 files)
- `README.md` - Technical docs
- `TEMPLATES_GUIDE.md` - Visual comparison
- `INTEGRATION_GUIDE.md` - How to integrate
- `EXAMPLE_USAGE.tsx` - Working examples
- `SUMMARY.md` - Overview
- `CHECKLIST.md` - Implementation checklist

---

## ⚡ Integration Points

### Replace This:
```typescript
<ResumeDisplay resumeData={resumeData} isAuth={isAuth} />
```

### With This:
```typescript
<>
  <TemplateSelector
    selectedTemplate={selectedTemplate}
    onTemplateChange={setSelectedTemplate}
  />
  {renderTemplate()}
</>
```

---

## 💾 Save User Preference

### localStorage
```typescript
localStorage.setItem('userResumeTemplate', templateId);
const saved = localStorage.getItem('userResumeTemplate');
```

### Database (pseudo-code)
```typescript
await saveUserTemplatePreference(userId, templateId);
const pref = await fetchUserTemplatePreference(userId);
```

---

## 🧪 Test Checklist

- [ ] Import templates successfully
- [ ] Template selector displays
- [ ] Click switches templates
- [ ] All resume data shows correctly
- [ ] Colors apply from customColors
- [ ] Profile image displays (or gracefully omitted)
- [ ] Responsive on mobile
- [ ] PDF export works
- [ ] Print styles look good

---

## 🔍 Troubleshooting

### Template not switching?
Check state is updating: `console.log(selectedTemplate)`

### Colors not applying?
Ensure `resumeData.customColors` exists and has values

### Import error?
Check path: `@/src/containers/resume-templates`

### Profile image not showing?
Check for "placeholder", "placehold.co", or "omitted" in image URL

### Section not rendering?
Check if data exists: `resumeData.experience`, `resumeData.skills`, etc.

---

## 📐 Layout Breakdown

```
Template 1:        Template 2:        Template 3:
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ [IMG]  │     │   │ NAME    [IMG]│   │    [IMG]     │
│ NAME   │     │   │══════════════│   │     NAME     │
│ ─────┤     │   │              │   │   ── ── ──   │
│ INFO   │ EXP │   │   SUMMARY    │   │   CONTACT    │
│ SKILLS │     │   │              │   │              │
│ EDU    │     │   │●── EXPER     │   │   SUMMARY    │
│ CERTS  │     │   │              │   │   SKILLS     │
│        │     │   │ EDU  │ CERTS│   │   EXPERIENCE │
└──────────────┘   └──────────────┘   │ EDU │ CERTS │
    35%   65%         Full-width       └──────────────┘
                                          Centered
```

---

## 🎯 Props Interface

```typescript
interface ResumeTemplateProps {
  resumeData: ParsedResumeSchema;  // Required
  isAuth: boolean;                 // Required
}
```

---

## 🌟 Key Features

✅ Same data structure as original  
✅ Same color system  
✅ Responsive (mobile/tablet/desktop)  
✅ Print-optimized  
✅ Profile image support  
✅ Reuses existing components  
✅ No breaking changes  
✅ TypeScript typed  
✅ CSS Modules scoped  
✅ Documentation included  

---

## 📞 Need Help?

1. See `INTEGRATION_GUIDE.md` for detailed steps
2. Check `EXAMPLE_USAGE.tsx` for working code
3. Review `TEMPLATES_GUIDE.md` for visuals
4. Read `README.md` for technical details

---

## 🎉 You're Ready!

Copy the Quick Start code above and you're good to go! 🚀