# Project CSS Module Rules and Patterns

## Overview
This document defines the CSS Module patterns and conventions to be followed during the Tailwind to CSS Modules conversion.

## File Naming Conventions

### CSS Module Files
- **Pattern**: `component-name.module.css`
- **Examples**:
  - `user-profile.tsx` → `user-profile.module.css`
  - `resume-editor.tsx` → `resume-editor.module.css`
  - `color-picker-dialog.tsx` → `color-picker-dialog.module.css`

### Important Rules
1. **New Components**: If a component does NOT have an existing `.module.css` file, create a new one
2. **Existing CSS Modules**: If a component already has a `.module.css` file, append new styles to it
3. **Legacy Styles**: NEVER delete or overwrite existing styles in `.module.css` files

## CSS Class Naming Conventions

### Within CSS Modules
Use **camelCase** for class names:

```css
/* ✅ Good */
.container { }
.primaryButton { }
.userProfile { }
.cardHeader { }
.navMenuItem { }

/* ❌ Bad */
.primary-button { }
.user_profile { }
.card-header { }
```

### Import and Usage Pattern
```typescript
// Import
import styles from './component-name.module.css';

// Usage
<div className={styles.container}>
  <button className={styles.primaryButton}>
    Click me
  </button>
</div>

// Multiple classes
<div className={`${styles.container} ${styles.active}`}>

// Conditional classes
<div className={isActive ? styles.active : styles.inactive}>
```

## CSS Variable System

### Color Variables
The project uses CSS variables for theming. Maintain compatibility:

```css
/* Use existing CSS variables */
.text {
  color: var(--foreground);
}

.mutedText {
  color: var(--muted-foreground);
}

.background {
  background-color: var(--background);
}

.card {
  background-color: var(--card);
  color: var(--card-foreground);
}
```

### Common Variables Available
- `--background`
- `--foreground`
- `--card`
- `--card-foreground`
- `--primary`
- `--primary-foreground`
- `--secondary`
- `--secondary-foreground`
- `--muted`
- `--muted-foreground`
- `--accent`
- `--accent-foreground`
- `--destructive`
- `--destructive-foreground`
- `--border`
- `--input`
- `--ring`

## Responsive Design Patterns

### Breakpoints
Define standard breakpoints matching Tailwind's system:

```css
/* Mobile First Approach */
.container {
  /* Mobile styles (default) */
  padding: 16px;
}

/* Tablet and up (md: 768px) */
@media (min-width: 768px) {
  .container {
    padding: 32px;
  }
}

/* Desktop (lg: 1024px) */
@media (min-width: 1024px) {
  .container {
    padding: 48px;
  }
}

/* Large Desktop (xl: 1280px) */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

## Common Pattern Translations

### Layout Patterns

#### Flexbox Layouts
```css
/* flex items-center justify-between */
.flexBetween {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* flex flex-col gap-4 */
.flexColumn {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 16px */
}
```

#### Grid Layouts
```css
/* grid grid-cols-1 md:grid-cols-3 gap-4 */
.gridLayout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .gridLayout {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Spacing Scale
Use a consistent spacing scale (matching Tailwind's):

```css
/* Spacing variables */
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}
```

### Typography Scale
```css
.textXs { font-size: 0.75rem; line-height: 1rem; }
.textSm { font-size: 0.875rem; line-height: 1.25rem; }
.textBase { font-size: 1rem; line-height: 1.5rem; }
.textLg { font-size: 1.125rem; line-height: 1.75rem; }
.textXl { font-size: 1.25rem; line-height: 1.75rem; }
.text2xl { font-size: 1.5rem; line-height: 2rem; }
.text3xl { font-size: 1.875rem; line-height: 2.25rem; }
```

## State Handling

### Interactive States
```css
.button {
  transition: all 0.2s ease;
}

.button:hover {
  opacity: 0.8;
}

.button:focus {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Active/Selected States
```css
.navItem {
  color: var(--muted-foreground);
}

.navItem.active {
  color: var(--foreground);
  font-weight: 600;
}
```

## Animation Patterns

### Common Animations
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
```

## Component Structure Example

```css
/* component-name.module.css */

/* Container */
.container {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  background-color: var(--card);
  border-radius: 0.5rem;
  border: 1px solid var(--border);
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--foreground);
}

/* Content */
.content {
  flex: 1;
  color: var(--muted-foreground);
}

/* Actions */
.actions {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

/* Responsive */
@media (min-width: 768px) {
  .container {
    padding: var(--space-6);
  }
  
  .actions {
    justify-content: flex-end;
  }
}
```

## Do's and Don'ts

### Do's ✅
- Use CSS variables for colors
- Follow the camelCase naming convention
- Create modular, reusable classes
- Use media queries for responsive design
- Maintain existing functionality
- Test all interactive states

### Don'ts ❌
- Don't use Tailwind classes
- Don't delete existing CSS module styles
- Don't hardcode colors
- Don't break responsive behavior
- Don't remove accessibility features
- Don't create overly specific selectors

## Testing Checklist
- [ ] All styles converted maintain original appearance
- [ ] Responsive breakpoints work correctly
- [ ] Interactive states (hover, focus, active) work
- [ ] Theme switching (if applicable) works
- [ ] No visual regressions
- [ ] Performance is maintained