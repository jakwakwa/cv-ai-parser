# CSS Architecture Example: Button Component Refactor

## Before (Current Implementation)

### Current button.module.css
```css
/* Base button styles */
.button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    white-space: nowrap;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    outline: none;
    cursor: pointer;
    border: none;
}

.button.primary {
    background-color: #116964;
    color: #faf4ec;
}

.button.secondary {
    background-color: #5450f1;
    color: white;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

/* ... many more hardcoded values */
```

### Problems with Current Approach
1. **Hardcoded values**: Colors, sizes, and other values are duplicated
2. **No design system**: Inconsistent spacing and color usage
3. **Maintenance issues**: Changes require updating multiple files
4. **No reusability**: Patterns can't be shared across components

## After (New Architecture)

### 1. Design Tokens (styles/01-settings/_colors.css)
```css
:root {
  /* Primary Brand Colors */
  --color-primary-50: #f0fdfa;
  --color-primary-100: #ccfbf1;
  --color-primary-200: #99f6e4;
  --color-primary-500: #14b8a6;
  --color-primary-600: #0d9488;
  --color-primary-700: #0f766e;
  --color-primary-900: #134e4a;
  
  /* Secondary Colors */
  --color-secondary-50: #f8fafc;
  --color-secondary-500: #64748b;
  --color-secondary-600: #475569;
  --color-secondary-900: #0f172a;
  
  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Component-specific tokens */
  --button-primary-bg: var(--color-primary-600);
  --button-primary-bg-hover: var(--color-primary-700);
  --button-primary-text: white;
  
  --button-secondary-bg: var(--color-secondary-500);
  --button-secondary-bg-hover: var(--color-secondary-600);
  --button-secondary-text: white;
  
  --button-outline-border: var(--color-secondary-300);
  --button-outline-bg-hover: var(--color-secondary-50);
}
```

### 2. Spacing Tokens (styles/01-settings/_spacing.css)
```css
:root {
  /* Spacing scale */
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  
  /* Button-specific spacing */
  --button-padding-x: var(--space-4);
  --button-padding-y: var(--space-2);
  --button-gap: var(--space-2);
  
  /* Button sizes */
  --button-height-sm: 2rem;
  --button-height-md: 2.5rem;
  --button-height-lg: 3rem;
}
```

### 3. Typography Tokens (styles/01-settings/_typography.css)
```css
:root {
  /* Font sizes */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  
  /* Font weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  
  /* Button typography */
  --button-font-size: var(--font-size-sm);
  --button-font-weight: var(--font-weight-medium);
  --button-line-height: 1.25;
}
```

### 4. Transition Tokens (styles/01-settings/_transitions.css)
```css
:root {
  /* Transition durations */
  --transition-fast: 150ms;
  --transition-normal: 200ms;
  --transition-slow: 300ms;
  
  /* Transition easings */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  
  /* Button transitions */
  --button-transition: all var(--transition-fast) var(--ease-in-out);
}
```

### 5. Border Radius Tokens (styles/01-settings/_borders.css)
```css
:root {
  /* Border radius scale */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;
  
  /* Button border radius */
  --button-radius: var(--radius-md);
}
```

### 6. Refactored Button Component (button.module.css)
```css
/* Button base styles using design tokens */
.button {
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--button-gap);
  
  /* Typography */
  font-size: var(--button-font-size);
  font-weight: var(--button-font-weight);
  line-height: var(--button-line-height);
  white-space: nowrap;
  
  /* Spacing */
  height: var(--button-height-md);
  padding: 0 var(--button-padding-x);
  
  /* Appearance */
  border: 1px solid transparent;
  border-radius: var(--button-radius);
  background: transparent;
  cursor: pointer;
  
  /* Interaction */
  transition: var(--button-transition);
  outline: none;
}

/* Focus states */
.button:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Disabled state */
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Variant: Primary */
.primary {
  background-color: var(--button-primary-bg);
  color: var(--button-primary-text);
}

.primary:hover:not(:disabled) {
  background-color: var(--button-primary-bg-hover);
}

/* Variant: Secondary */
.secondary {
  background-color: var(--button-secondary-bg);
  color: var(--button-secondary-text);
}

.secondary:hover:not(:disabled) {
  background-color: var(--button-secondary-bg-hover);
}

/* Variant: Outline */
.outline {
  border-color: var(--button-outline-border);
  color: var(--color-secondary-700);
}

.outline:hover:not(:disabled) {
  background-color: var(--button-outline-bg-hover);
}

/* Variant: Ghost */
.ghost {
  color: var(--color-secondary-700);
}

.ghost:hover:not(:disabled) {
  background-color: var(--color-secondary-100);
}

/* Size: Small */
.sm {
  height: var(--button-height-sm);
  padding: 0 var(--space-3);
  font-size: var(--font-size-xs);
}

/* Size: Large */
.lg {
  height: var(--button-height-lg);
  padding: 0 var(--space-6);
  font-size: var(--font-size-base);
}

/* Size: Icon */
.icon {
  width: var(--button-height-md);
  height: var(--button-height-md);
  padding: 0;
}

.icon.sm {
  width: var(--button-height-sm);
  height: var(--button-height-sm);
}

.icon.lg {
  width: var(--button-height-lg);
  height: var(--button-height-lg);
}

/* Icon styling */
.button svg {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}
```

### 7. Utility Classes for Quick Styling (styles/07-utilities/_buttons.css)
```css
/* Quick button utilities for one-off cases */
.u-btn-full {
  width: 100% !important;
}

.u-btn-rounded {
  border-radius: var(--radius-full) !important;
}

.u-btn-square {
  border-radius: var(--radius-none) !important;
}

.u-btn-loading {
  position: relative !important;
  color: transparent !important;
}

.u-btn-loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
```

### 8. Enhanced TypeScript Component
```tsx
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from '@/lib/utils';
import styles from './button.module.css';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  asChild?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    const buttonClasses = cn(
      styles.button,
      styles[variant],
      styles[size],
      {
        'u-btn-full': fullWidth,
        'u-btn-loading': loading,
      },
      className
    );

    return (
      <Comp
        className={buttonClasses}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button };
```

## Benefits of the New Architecture

### 1. **Design System Consistency**
- All components use the same color palette
- Consistent spacing and typography scales
- Unified interaction patterns

### 2. **Maintainability**
- Change a color in one place, updates everywhere
- Clear separation of concerns
- Easy to find and modify styles

### 3. **Scalability**
- Easy to add new button variants
- Utility classes for quick customizations
- Predictable naming patterns

### 4. **Performance**
- Smaller CSS bundles through reuse
- Efficient CSS cascade
- Optimized specificity

### 5. **Developer Experience**
- Autocomplete for design tokens
- Clear component API
- Consistent patterns across the codebase

## Usage Examples

```tsx
// Basic usage
<Button variant="primary">Click me</Button>

// With size and loading state
<Button variant="secondary" size="lg" loading>
  Processing...
</Button>

// Full width with utility class
<Button variant="outline" fullWidth>
  Full Width Button
</Button>

// Icon button
<Button variant="ghost" size="icon">
  <IconPlus />
</Button>

// Custom styling with utility classes
<Button variant="primary" className="u-btn-rounded">
  Rounded Button
</Button>
```

This refactored approach provides a solid foundation for scaling your design system while maintaining the flexibility of CSS Modules. 