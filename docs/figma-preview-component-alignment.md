# Figma Preview Component Alignment

## Overview
Updated the `FigmaComponentPreview` component to match the exact structure and styling of the generated Figma-to-React components, ensuring consistency between preview and actual output.

## Problem Identified
The preview component was using different:
- **CSS class names** (e.g., `styles.company` vs `styles['exp-company']`)
- **HTML structure** (generic sections vs specific Figma layer structure)
- **Content mapping** (combined fields vs separate fields)
- **Styling approach** (generic resume styles vs Figma-specific structure)

## Changes Made

### 1. Updated Preview HTML Structure
**Before:**
```jsx
<div className={styles.resumeSection}>
  <h3 className={styles.sectionTitle}>Experience</h3>
  <div className={styles.experienceItem}>
    <h4 className={styles.jobTitle}>{exp.position}</h4>
    <span className={styles.company}>{exp.company} • {exp.duration}</span>
    <p className={styles.jobDescription}>{exp.description}</p>
  </div>
</div>
```

**After:**
```jsx
<div className={styles.experiencesection}>
  <div className={styles.sectiontitle}>
    <p>Experience</p>
  </div>
  <div className={styles['experience-list']}>
    <div className={styles['experience-item']}>
      <div className={styles['exp-title']}>
        <p>{exp.position}</p>
      </div>
      <div className={styles['exp-company']}>
        <p>{exp.company}</p>
      </div>
      <div className={styles['exp-period']}>
        <p>{exp.duration}</p>
      </div>
      <div className={styles['exp-desc']}>
        <p>{exp.description}</p>
      </div>
    </div>
  </div>
</div>
```

### 2. Added Matching CSS Classes
Added all the CSS classes that match the generated component structure:
- `.resume` - Main container
- `.header` - Header section with summary and profile
- `.summary`, `.summary-name`, `.summary-content` - Summary section
- `.profile`, `.profile-image` - Profile section
- `.resumetwocolbody` - Two-column layout
- `.experiencesection`, `.resumesidebar` - Main sections
- `.sectiontitle` - Section titles
- `.experience-list`, `.experience-item` - Experience structure
- `.exp-title`, `.exp-company`, `.exp-period`, `.exp-desc` - Experience fields
- `.contact`, `.contact-list` - Contact section
- `.education`, `.education-list` - Education section
- `.certification`, `.certification-list` - Certification section
- `.skills`, `.skills-list`, `.skill` - Skills section

### 3. Consistent Styling with CSS Variables
All styles now use CSS variables for colors:
```css
.exp-company p {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
  color: var(--figma-background, #ffffff);
}
```

### 4. Exact Structure Match
The preview now follows the exact same structure as the generated component:
- Same class naming conventions (including bracket notation for hyphenated names)
- Same HTML element hierarchy
- Same content separation (company and period are separate fields)
- Same CSS variable usage for dynamic colors

## Benefits

1. **Visual Consistency**: Preview now matches exactly what gets generated
2. **Accurate Testing**: Users see the real structure and styling
3. **Debugging**: Easier to identify issues when preview matches output
4. **Maintainability**: Single source of truth for component structure
5. **User Experience**: No surprises between preview and generated code

## Files Modified
- `src/components/figma-preview/FigmaComponentPreview.tsx`
- `src/components/figma-preview/FigmaComponentPreview.module.css`

## Next Steps
The preview component now accurately represents the generated output. Future enhancements should maintain this alignment by updating both the generation logic and preview component together.