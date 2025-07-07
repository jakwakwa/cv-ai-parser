# CSS Architecture Reorganization Plan

## Overview
This document outlines the reorganization of our CSS architecture for improved maintainability, scalability, and developer experience.

## Current Problems
1. **Inconsistent organization**: Design tokens scattered across files
2. **Duplication**: Similar patterns repeated in multiple components
3. **No clear hierarchy**: Difficulty finding and maintaining styles
4. **Scalability issues**: Hard to add new components without conflicts
5. **Mixed specificity**: Global styles competing with component styles

## Proposed Architecture: ITCSS + CSS Modules Hybrid

### 1. New Folder Structure

```
styles/
├── 01-settings/           # Global variables, config switches
│   ├── _colors.css
│   ├── _typography.css
│   ├── _spacing.css
│   ├── _breakpoints.css
│   └── _z-index.css
├── 02-tools/              # Mixins and functions
│   ├── _mixins.css
│   ├── _functions.css
│   └── _utilities.css
├── 03-generic/            # Reset, normalize, box-sizing
│   ├── _reset.css
│   ├── _normalize.css
│   └── _box-sizing.css
├── 04-elements/           # Bare HTML elements
│   ├── _typography.css
│   ├── _forms.css
│   └── _tables.css
├── 05-objects/            # Layout patterns, grids
│   ├── _layout.css
│   ├── _grid.css
│   ├── _media.css
│   └── _wrapper.css
├── 06-components/         # UI components (keep existing .module.css)
│   └── [existing component modules]
├── 07-utilities/          # Helper classes, overrides
│   ├── _spacing.css
│   ├── _typography.css
│   ├── _display.css
│   └── _responsive.css
└── main.css              # Main import file
```

### 2. Layer Descriptions

#### 01-Settings (Variables)
- CSS custom properties (CSS variables)
- No actual CSS output
- Global configuration

#### 02-Tools (Mixins & Functions)
- Reusable mixins
- CSS functions
- Utility generators

#### 03-Generic (Reset & Normalize)
- Reset styles
- Normalize.css
- Global box-sizing

#### 04-Elements (Base Elements)
- Bare HTML element styles
- Typography defaults
- Form element defaults

#### 05-Objects (Layout Patterns)
- Layout patterns
- Grid systems
- Media objects
- Structural patterns

#### 06-Components (UI Components)
- Keep existing CSS Modules
- Component-specific styles
- Isolated, reusable components

#### 07-Utilities (Helper Classes)
- Single-purpose classes
- Overrides and trumps
- Responsive utilities

### 3. Design Token System

#### Colors
```css
/* styles/01-settings/_colors.css */
:root {
  /* Primary Colors */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-900: #1e3a8a;
  
  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Neutral Colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;
  
  /* Text Colors */
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-500);
  --color-text-inverse: #ffffff;
  
  /* Background Colors */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: var(--color-gray-50);
  --color-bg-accent: var(--color-primary-50);
}
```

#### Typography
```css
/* styles/01-settings/_typography.css */
:root {
  /* Font Families */
  --font-family-primary: 'Inter', system-ui, sans-serif;
  --font-family-mono: 'Fira Code', monospace;
  
  /* Font Sizes */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

#### Spacing
```css
/* styles/01-settings/_spacing.css */
:root {
  /* Spacing Scale */
  --space-0: 0;
  --space-px: 1px;
  --space-0-5: 0.125rem;
  --space-1: 0.25rem;
  --space-1-5: 0.375rem;
  --space-2: 0.5rem;
  --space-2-5: 0.625rem;
  --space-3: 0.75rem;
  --space-3-5: 0.875rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-7: 1.75rem;
  --space-8: 2rem;
  --space-9: 2.25rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;
}
```

#### Breakpoints
```css
/* styles/01-settings/_breakpoints.css */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### 4. Component CSS Module Updates

#### Enhanced Component Structure
```css
/* component-name.module.css */

/* Component Root */
.container {
  /* Use design tokens */
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  padding: var(--space-4);
  border-radius: var(--radius-md);
}

/* Component Elements */
.header {
  margin-bottom: var(--space-3);
}

.title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.content {
  line-height: var(--line-height-normal);
}

/* Component Modifiers */
.container.primary {
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-200);
}

.container.large {
  padding: var(--space-6);
}

/* Responsive Variants */
@media (min-width: 768px) {
  .container {
    padding: var(--space-6);
  }
}
```

### 5. Utility Classes

#### Spacing Utilities
```css
/* styles/07-utilities/_spacing.css */
.u-m-0 { margin: 0 !important; }
.u-m-1 { margin: var(--space-1) !important; }
.u-m-2 { margin: var(--space-2) !important; }
.u-m-3 { margin: var(--space-3) !important; }
.u-m-4 { margin: var(--space-4) !important; }

.u-p-0 { padding: 0 !important; }
.u-p-1 { padding: var(--space-1) !important; }
.u-p-2 { padding: var(--space-2) !important; }
.u-p-3 { padding: var(--space-3) !important; }
.u-p-4 { padding: var(--space-4) !important; }

/* Responsive spacing */
@media (min-width: 768px) {
  .u-md-m-0 { margin: 0 !important; }
  .u-md-m-1 { margin: var(--space-1) !important; }
  .u-md-p-0 { padding: 0 !important; }
  .u-md-p-1 { padding: var(--space-1) !important; }
}
```

#### Typography Utilities
```css
/* styles/07-utilities/_typography.css */
.u-text-xs { font-size: var(--font-size-xs) !important; }
.u-text-sm { font-size: var(--font-size-sm) !important; }
.u-text-base { font-size: var(--font-size-base) !important; }
.u-text-lg { font-size: var(--font-size-lg) !important; }

.u-font-light { font-weight: var(--font-weight-light) !important; }
.u-font-normal { font-weight: var(--font-weight-normal) !important; }
.u-font-medium { font-weight: var(--font-weight-medium) !important; }
.u-font-semibold { font-weight: var(--font-weight-semibold) !important; }
.u-font-bold { font-weight: var(--font-weight-bold) !important; }

.u-text-left { text-align: left !important; }
.u-text-center { text-align: center !important; }
.u-text-right { text-align: right !important; }
```

### 6. Layout Objects

#### Grid System
```css
/* styles/05-objects/_grid.css */
.o-grid {
  display: grid;
  gap: var(--space-4);
}

.o-grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.o-grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.o-grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.o-grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

@media (min-width: 768px) {
  .o-md-grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
  .o-md-grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .o-md-grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .o-md-grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}
```

#### Layout Patterns
```css
/* styles/05-objects/_layout.css */
.o-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.o-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.o-cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
}

.o-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.o-sidebar > :first-child {
  flex-basis: 20rem;
  flex-grow: 1;
}

.o-sidebar > :last-child {
  flex-basis: 0;
  flex-grow: 999;
  min-width: 50%;
}
```

### 7. Main Import File

```css
/* styles/main.css */

/* 01 - Settings */
@import '01-settings/colors.css';
@import '01-settings/typography.css';
@import '01-settings/spacing.css';
@import '01-settings/breakpoints.css';
@import '01-settings/z-index.css';

/* 02 - Tools */
@import '02-tools/mixins.css';
@import '02-tools/functions.css';

/* 03 - Generic */
@import '03-generic/reset.css';
@import '03-generic/normalize.css';
@import '03-generic/box-sizing.css';

/* 04 - Elements */
@import '04-elements/typography.css';
@import '04-elements/forms.css';
@import '04-elements/tables.css';

/* 05 - Objects */
@import '05-objects/layout.css';
@import '05-objects/grid.css';
@import '05-objects/media.css';
@import '05-objects/wrapper.css';

/* 06 - Components */
/* Individual component modules imported via CSS Modules */

/* 07 - Utilities */
@import '07-utilities/spacing.css';
@import '07-utilities/typography.css';
@import '07-utilities/display.css';
@import '07-utilities/responsive.css';
```

### 8. Migration Strategy

#### Phase 1: Setup Foundation
1. Create new folder structure
2. Extract design tokens from globals.css
3. Create base layers (settings, tools, generic, elements)

#### Phase 2: Create Objects & Utilities
1. Identify common layout patterns
2. Create object classes
3. Build utility class system

#### Phase 3: Refactor Components
1. Update component CSS modules to use design tokens
2. Remove duplicate patterns
3. Standardize naming conventions

#### Phase 4: Cleanup & Optimization
1. Remove unused styles
2. Optimize import order
3. Update documentation

### 9. Benefits

1. **Maintainability**: Clear hierarchy and organization
2. **Scalability**: Easy to add new components and patterns
3. **Consistency**: Shared design tokens and patterns
4. **Performance**: Optimized CSS cascade and specificity
5. **Developer Experience**: Predictable structure and naming

### 10. Tools & Validation

#### CSS Linting Rules
```json
{
  "rules": {
    "no-ids": true,
    "no-important": false,
    "selector-max-specificity": "0,3,0",
    "selector-max-compound-selectors": 3,
    "selector-class-pattern": "^[a-z][a-zA-Z0-9]*$|^[a-z][a-zA-Z0-9]*(-[a-z][a-zA-Z0-9]*)*$|^u-[a-z][a-zA-Z0-9]*(-[a-z][a-zA-Z0-9]*)*$|^o-[a-z][a-zA-Z0-9]*(-[a-z][a-zA-Z0-9]*)*$"
  }
}
```

#### Naming Conventions
- **Components**: `.componentName` (camelCase)
- **Objects**: `.o-objectName` (prefix + camelCase)
- **Utilities**: `.u-utilityName` (prefix + camelCase)
- **States**: `.is-stateName` (prefix + camelCase)
- **JavaScript hooks**: `.js-hookName` (prefix + camelCase)

### 11. Next Steps

1. Review and approve this plan
2. Begin Phase 1 implementation
3. Update existing components gradually
4. Train team on new architecture
5. Document patterns and conventions 