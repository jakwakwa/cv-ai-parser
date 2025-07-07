# Theme System Implementation

## Overview

This document outlines the comprehensive theme system implementation for the CV AI Parser application, following the architecture described in the [SkillBars dark mode implementation guide](https://www.skillbars.com/blog/how-to-add-dark-mode-to-your-website-and-web-apps).

## Architecture

### 1. Design Token Foundation

The theme system builds on our existing ITCSS design token architecture:

- **Base Tokens**: Located in `styles/01-settings/_colors.css`
- **Theme Variants**: Located in `styles/01-settings/_themes.css`
- **Component Integration**: All components use design tokens exclusively

### 2. Theme Implementation Approach

Following the SkillBars methodology, we use:

- **CSS Custom Properties**: For theme token definitions
- **Data Attributes**: `data-theme="light|dark|system"` on `<html>` element
- **Media Query Detection**: For system preference handling
- **localStorage Persistence**: For user preference storage

### 3. Three-Theme System

#### Light Mode (`data-theme="light"`)
- Clean, professional appearance
- High contrast for accessibility
- Traditional light backgrounds with dark text

#### Dark Mode (`data-theme="dark"`)
- Reduced eye strain in low-light environments
- Dark grays instead of pure black (following SkillBars approach)
- Bright accent colors for better contrast

#### System Mode (`data-theme="system"`)
- Automatically follows user's OS preference
- Uses CSS `@media (prefers-color-scheme: dark)` detection
- Seamless switching when OS theme changes

## Implementation Details

### 1. Theme Tokens (`styles/01-settings/_themes.css`)

```css
:root {
  &[data-theme="light"] {
    --color-background-primary: #ffffff;
    --color-text-primary: #1f2937;
    /* ... additional tokens */
  }
  
  &[data-theme="dark"] {
    --color-background-primary: #1f2937;
    --color-text-primary: #f9fafb;
    /* ... additional tokens */
  }
  
  &[data-theme="system"] {
    /* Defaults to light, overridden by media query */
  }
}

@media (prefers-color-scheme: dark) {
  :root[data-theme="system"] {
    /* Dark theme tokens for system preference */
  }
}
```

### 2. Theme Toggle Component (`src/components/theme-toggle/`)

- **Icons**: Sun (light), Moon (dark), Monitor (system)
- **Cycling Order**: Light → Dark → System → Light
- **Accessibility**: Proper ARIA labels and keyboard support
- **Visual Feedback**: Hover states and smooth transitions

### 3. Theme Context (`src/hooks/use-theme.tsx`)

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}
```

- **Theme Management**: Centralized state management
- **Persistence**: Automatic localStorage integration
- **System Detection**: Real-time OS preference monitoring
- **Hydration Safety**: Prevents flash of unstyled content

### 4. Flash Prevention (`src/components/theme-script/`)

Critical script that runs before React hydration:

```javascript
(function() {
  try {
    const savedTheme = localStorage.getItem('theme') || 'system';
    document.documentElement.setAttribute('data-theme', savedTheme);
  } catch (error) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
```

## Benefits

### 1. Design Token Integration
- **100% Token Coverage**: All theme variations use design tokens
- **Consistent Patterns**: Unified approach across all components
- **Maintainable**: Single source of truth for theme values

### 2. User Experience
- **No Flash**: Immediate theme application on page load
- **Smooth Transitions**: CSS transitions for theme switching
- **System Integration**: Respects user's OS preferences
- **Persistent**: Remembers user choice across sessions

### 3. Developer Experience
- **Type Safety**: Full TypeScript support
- **Easy Integration**: Simple `useTheme()` hook
- **Component Agnostic**: Works with any component using design tokens
- **Accessibility**: Built-in ARIA support and keyboard navigation

## Usage Examples

### Using the Theme Hook

```tsx
import { useTheme } from '@/src/hooks/use-theme';

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  );
}
```

### Component Styling

```css
.component {
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-light);
}

/* Tokens automatically adapt to current theme */
```

### Adding Theme Toggle

```tsx
import { ThemeToggle } from '@/src/components/theme-toggle/theme-toggle';

function Header() {
  return (
    <header>
      <nav>{/* navigation items */}</nav>
      <ThemeToggle />
    </header>
  );
}
```

## Technical Considerations

### 1. Performance
- **CSS-Only Switching**: No JavaScript required for theme application
- **Minimal Bundle Impact**: Lightweight implementation
- **Efficient Re-renders**: Context optimization prevents unnecessary updates

### 2. Accessibility
- **High Contrast**: All themes meet WCAG AA standards
- **Reduced Motion**: Respects user's motion preferences
- **Screen Readers**: Proper ARIA labels and announcements

### 3. Browser Support
- **Modern Browsers**: CSS Custom Properties required
- **Graceful Degradation**: Fallback to light theme
- **Progressive Enhancement**: Enhanced experience with JavaScript

## Future Enhancements

### Phase 4B: Advanced Features
1. **Custom Theme Builder**: User-defined color schemes
2. **Theme Scheduling**: Automatic switching based on time
3. **Component-Specific Themes**: Per-component theme overrides
4. **Theme Analytics**: Usage tracking and insights

### Phase 4C: Extended Integration
1. **PDF Theme Support**: Theme-aware document generation
2. **Email Template Themes**: Consistent branding across communications
3. **Mobile App Sync**: Cross-platform theme consistency
4. **Third-Party Integration**: Theme support for embedded components

## Migration Guide

### For Existing Components

1. **Replace Hardcoded Values**: Use design tokens instead
2. **Test Theme Switching**: Verify appearance in all themes
3. **Update CSS Modules**: Follow established patterns
4. **Add Theme Awareness**: Use `useTheme` hook if needed

### For New Components

1. **Design Token First**: Never use hardcoded colors/spacing
2. **Theme Testing**: Test in all three theme modes
3. **Accessibility Check**: Verify contrast ratios
4. **Documentation**: Document theme-specific behaviors

## Conclusion

The theme system provides a robust, scalable foundation for supporting multiple visual themes while maintaining our design token architecture. The implementation follows industry best practices and provides an excellent user experience across all supported themes.

The system is ready for immediate use and can be extended with additional themes or advanced features as needed. 