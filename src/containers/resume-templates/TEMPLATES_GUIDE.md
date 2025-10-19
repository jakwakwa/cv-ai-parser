# Resume Templates Visual Guide

## Quick Comparison

| Feature | Template 1: Modern Two-Column | Template 2: Timeline Vertical | Template 3: Classic Centered |
|---------|------------------------------|-------------------------------|------------------------------|
| **Layout Style** | Sidebar + Main Content | Full-width Header + Vertical Flow | Centered Header + Symmetrical |
| **Profile Image** | Circular (120px, in sidebar) | Square rounded (100px, in header) | Circular (130px, centered) |
| **Header Style** | Integrated in sidebar | Horizontal banner | Centered with dividers |
| **Content Flow** | Two-column (35/65) | Single column with sections | Single column, centered elements |
| **Experience Display** | Standard list | Timeline with left border | Standard list |
| **Skills Placement** | Left sidebar | After summary, full-width | Highlighted section, center |
| **Education/Certs** | Left sidebar, stacked | Bottom, side-by-side grid | Bottom, side-by-side grid |
| **Visual Style** | Modern, clean, gradient | Professional, chronological | Classic, elegant, symmetric |
| **Best Use Case** | Tech/Creative professionals | Career progression focus | Traditional/Executive roles |

---

## Template 1: Modern Two-Column

### Layout Structure
```
┌─────────────────────────────────────┐
│  ┌──────────┬──────────────────┐   │
│  │          │                  │   │
│  │  [IMG]   │                  │   │
│  │          │                  │   │
│  │  NAME    │   SUMMARY        │   │
│  │  TITLE   │                  │   │
│  │  ───────┤                  │   │
│  │          │   EXPERIENCE     │   │
│  │ CONTACT  │   • Job 1        │   │
│  │          │   • Job 2        │   │
│  │ SKILLS   │   • Job 3        │   │
│  │          │                  │   │
│  │ EDUCATION│                  │   │
│  │          │                  │   │
│  │  CERTS   │                  │   │
│  │          │                  │   │
│  └──────────┴──────────────────┘   │
└─────────────────────────────────────┘
    35%           65%
```

### Key Features
- **Left Sidebar (35%)**: Gradient background with profile info
- **Circular Avatar**: 120px with colored border
- **Divider Line**: Horizontal gradient separator
- **Section Accents**: Underline on titles (60px, colored)
- **Print Optimized**: Maintains column structure

### Color Usage
- Sidebar: `--resume-sidebar-background` with gradient
- Name: `--resume-profile-name`
- Title: `--resume-job-title`
- Avatar border: `--resume-main-icons`
- Accents: `--resume-job-title` and `--resume-main-icons`

---

## Template 2: Timeline Vertical

### Layout Structure
```
┌─────────────────────────────────────┐
│  ╔════════════════════════════════╗ │
│  ║ NAME            [IMG]          ║ │
│  ║ TITLE                          ║ │
│  ║ Contact Info Bar               ║ │
│  ╚════════════════════════════════╝ │
│  ┌────────────────────────────────┐ │
│  │ SUMMARY                        │ │
│  └────────────────────────────────┘ │
│                                     │
│  SKILLS: [tag] [tag] [tag]          │
│                                     │
│  ●── EXPERIENCE                     │
│  │   • Job 1                        │
│  │   • Job 2                        │
│  │   • Job 3                        │
│                                     │
│  ┌──────────────┬──────────────┐   │
│  │  EDUCATION   │  CERTS       │   │
│  └──────────────┴──────────────┘   │
└─────────────────────────────────────┘
```

### Key Features
- **Full-Width Header**: Colored bottom border (4px)
- **Profile Image**: Rounded square (12px radius)
- **Contact Bar**: Compact horizontal display
- **Timeline Border**: Left 3px line with circle marker
- **Bottom Grid**: 50/50 split for education/certs
- **Print Optimized**: Maintains structure, adjusts sizing

### Color Usage
- Header background: `--resume-profile-header-background`
- Border accent: `--resume-job-title`
- Timeline: `--resume-main-icons`
- Summary box: `--resume-sidebar-background` with left border
- Section boxes: `--resume-sidebar-background` with top border

---

## Template 3: Classic Centered

### Layout Structure
```
┌─────────────────────────────────────┐
│            [IMG]                     │
│                                     │
│            NAME                     │
│       ─── TITLE ───                 │
│                                     │
│     Contact Information             │
│ ─────────────────────────────────── │
│                                     │
│      PROFESSIONAL SUMMARY           │
│      ─────────────────────          │
│      Text centered here...          │
│                                     │
│  ┌────────────────────────────┐    │
│  │     SKILLS                  │    │
│  └────────────────────────────┘    │
│                                     │
│      EXPERIENCE                     │
│      • Job 1                        │
│      • Job 2                        │
│                                     │
│  ┌──────────────┬──────────────┐   │
│  │  EDUCATION   │  CERTS       │   │
│  └──────────────┴──────────────┘   │
└─────────────────────────────────────┘
```

### Key Features
- **Centered Header**: Gradient background top-to-bottom
- **Circular Avatar**: 130px with 5px colored border
- **Decorative Dividers**: Lines flanking title (80px each)
- **Section Titles**: Centered with left/right line decorations
- **Skills Box**: Full-width, highlighted background
- **Bottom Grid**: 50/50 split for education/certs
- **Print Optimized**: Maintains centered aesthetic

### Color Usage
- Header gradient: `--resume-profile-header-background` to white
- Avatar border: `--resume-job-title`
- Divider lines: `--resume-main-icons`
- Section accents: `--resume-job-title` for lines
- Skills background: `--resume-sidebar-background`
- Bottom boxes: `--resume-sidebar-background` with top border

---

## Choosing the Right Template

### Template 1: Modern Two-Column
**Choose if:**
- You have diverse skills to showcase
- You want clear visual separation
- You prefer modern, app-like design
- Your audience is tech/creative industry
- You have a professional profile photo

**Avoid if:**
- You have minimal contact/education info (sidebar looks empty)
- Printing limitations with multi-column layouts

---

### Template 2: Timeline Vertical
**Choose if:**
- You want to emphasize career progression
- You have significant work experience
- You prefer chronological storytelling
- You want a professional, corporate look
- Space efficiency is important

**Avoid if:**
- You're early career (little experience)
- You want to highlight skills over experience

---

### Template 3: Classic Centered
**Choose if:**
- You want a traditional, elegant look
- You're applying to conservative industries
- You have a strong professional photo
- You want balanced, symmetric design
- You prefer timeless aesthetics

**Avoid if:**
- You want a modern, cutting-edge look
- Space efficiency is critical
- Centered text alignment doesn't fit your style

---

## Implementation Notes

### All Templates Support:
✅ Same data structure (`ParsedResumeSchema`)  
✅ Same color system (`resumeData.customColors`)  
✅ Profile image (with fallback for none/omitted)  
✅ Responsive design (mobile/tablet/desktop)  
✅ Print optimization (PDF generation)  
✅ All resume sections (contact, skills, education, etc.)  

### Unique Styling Per Template:
- Layout grid structure (columns vs single)
- Header placement and styling
- Section backgrounds and borders
- Typography hierarchy
- Spacing and padding
- Visual accents (lines, shadows, borders)

---

## Color Customization

All templates respect the user's color customization:

```typescript
const finalColors = { 
  ...resumeColors,           // Default colors
  ...resumeData.customColors // User overrides
};
```

Users can customize:
- Primary colors (job title, accents)
- Text colors (name, body, dates)
- Background colors (sidebar, header, sections)
- Border colors (skills, dividers)
- Icon colors (main and secondary)

Templates will automatically apply these colors to their respective design elements.

---

## Future Template Ideas

Consider these additional layouts:
- **Minimalist**: Maximum white space, ultra-clean
- **Bold Color Block**: Large color sections
- **Infographic Style**: Visual data representation
- **Academic**: CV-style for research/education focus
- **Creative Portfolio**: Image-heavy for designers/artists