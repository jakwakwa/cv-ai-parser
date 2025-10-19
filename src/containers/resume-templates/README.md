# Resume Templates

This directory contains alternative resume display templates for the CV AI Parser application.

## Overview

These templates provide users with different layout options for displaying their resume data. All templates use the **exact same data structure** (`ParsedResumeSchema`) and **color palette** (`resumeData.customColors`) as the original `resume-display.tsx` component.

## Available Templates

### Template 1: Modern Two-Column
**File:** `resume-template-1.tsx`

**Layout:** 35% left sidebar / 65% main content

**Features:**
- Profile image displayed as circular avatar with decorative border
- Name and title prominently displayed in sidebar
- Contact, Skills, Education, and Certifications in left sidebar
- Professional summary and Experience in main content area
- Clean gradient background in sidebar
- Section titles with underline accent

**Best for:** Professionals with extensive experience who want a modern, organized look

---

### Template 2: Timeline Vertical
**File:** `resume-template-2.tsx`

**Layout:** Full-width header with single-column content flow

**Features:**
- Horizontal header section with name, title, and optional profile image
- Contact information displayed as a compact bar
- Skills section with full-width display
- Experience section with timeline visual (left border with markers)
- Education and Certifications in two-column grid at bottom
- Emphasis on chronological flow

**Best for:** Professionals who want to highlight career progression with a timeline aesthetic

---

### Template 3: Classic Centered
**File:** `resume-template-3.tsx`

**Layout:** Centered header with symmetrical single-column content

**Features:**
- Centered profile image (circular with decorative border)
- Name and title centered with decorative divider lines
- Contact information centered below header
- Professional summary with centered text
- Skills section with highlighted background
- Education and Certifications in two-column grid
- Elegant, traditional aesthetic

**Best for:** Professionals seeking a timeless, balanced design with emphasis on symmetry

---

## Technical Implementation

### Data Structure
All templates consume the same `ParsedResumeSchema` interface:
```typescript
interface ResumeTemplateProps {
  resumeData: ParsedResumeSchema;
  isAuth: boolean;
}
```

### Color System
Templates use the existing color variables from `resumeData.customColors`:
- `--resume-profile-name` - Name text color
- `--resume-job-title` - Job title and primary accents
- `--resume-section-titles` - Section heading colors
- `--resume-body-text` - Body text color
- `--resume-main-icons` - Primary icons and borders
- `--resume-sub-icons` - Secondary icons
- `--resume-dates` - Date text color
- `--resume-sidebar-background` - Sidebar/section backgrounds
- `--resume-profile-header-background` - Header background
- `--resume-skill-border` - Skill badge borders
- `--resume-sub-titles-issuer` - Issuer text color
- `--resume-sub-titles-companies` - Company name color

### Component Reuse
All templates reuse the existing section components:
- `ContactSection`
- `SkillsSection`
- `EducationSection`
- `CertificationsSection`
- `ExperienceSection`

### Print Optimization
Each template includes `@media print` styles to ensure proper formatting when generating PDFs.

---

## Usage Example

```typescript
import { ResumeTemplate1, ResumeTemplate2, ResumeTemplate3 } from '@/src/containers/resume-templates';

// Use template 1
<ResumeTemplate1 resumeData={parsedData} isAuth={isAuthenticated} />

// Use template 2
<ResumeTemplate2 resumeData={parsedData} isAuth={isAuthenticated} />

// Use template 3
<ResumeTemplate3 resumeData={parsedData} isAuth={isAuthenticated} />
```

## Adding New Templates

To add a new template:

1. Create `resume-template-N.tsx` and `resume-template-N.module.css`
2. Use the same `ResumeTemplateProps` interface
3. Apply colors from `resumeData.customColors`
4. Reuse existing section components
5. Include responsive and print styles
6. Export from `index.ts`
7. Add metadata to `templateMetadata` array

## Styling Guidelines

- **Colors:** Only use colors from `resumeData.customColors`
- **Layout:** Feel free to create unique layouts (columns, grids, etc.)
- **Typography:** Use varied font sizes and weights for hierarchy
- **Spacing:** Maintain consistent padding/margins
- **Borders/Shadows:** Use borders, shadows, and backgrounds for visual interest
- **Responsive:** Ensure mobile-friendly layouts
- **Print:** Optimize for PDF generation

---

## Template Metadata

The `templateMetadata` array in `index.ts` provides information for UI selection:

```typescript
export const templateMetadata = [
  {
    id: "template-1",
    name: "Modern Two-Column",
    description: "Clean layout with left sidebar featuring profile and contact information",
    component: "ResumeTemplate1",
  },
  // ... more templates
];
```

This can be used to build a template selector UI.