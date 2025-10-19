# Template Store

This directory contains the template selection state management using React Context API.

## Overview

The template store provides:
- Global state for selected resume template
- Automatic localStorage persistence
- Simple React hooks interface
- No external dependencies (pure React)

## Setup

### 1. Wrap Your App with TemplateProvider

Add the provider to your root layout or app component:

```tsx
// app/layout.tsx (Next.js App Router)
import { TemplateProvider } from '@/src/stores/template-context';

export default function RootLayout({ children }) {
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

Or for Pages Router:

```tsx
// pages/_app.tsx (Next.js Pages Router)
import { TemplateProvider } from '@/src/stores/template-context';

function MyApp({ Component, pageProps }) {
  return (
    <TemplateProvider>
      <Component {...pageProps} />
    </TemplateProvider>
  );
}

export default MyApp;
```

### 2. Use the Hook in Components

```tsx
import { useTemplate } from '@/src/stores/template-context';

function MyComponent() {
  const { selectedTemplate, setSelectedTemplate, resetTemplate } = useTemplate();
  
  return (
    <div>
      <p>Current: {selectedTemplate}</p>
      <button onClick={() => setSelectedTemplate('template-1')}>
        Select Template 1
      </button>
      <button onClick={resetTemplate}>
        Reset
      </button>
    </div>
  );
}
```

## API Reference

### `useTemplate()`

Returns an object with:

- **`selectedTemplate`**: `string` - Currently selected template ID
  - `"original"` - Default template
  - `"template-1"` - Modern Two-Column
  - `"template-2"` - Timeline Vertical
  - `"template-3"` - Classic Centered

- **`setSelectedTemplate(templateId: string)`**: `void` - Update selection
  - Automatically persists to localStorage
  - Example: `setSelectedTemplate('template-2')`

- **`resetTemplate()`**: `void` - Reset to default
  - Sets template to `"original"`

## Features

### ✅ Automatic Persistence
Selection is saved to localStorage automatically:
- Key: `resume-template-selection`
- Survives page refreshes
- Survives browser restarts

### ✅ Type Safe
Full TypeScript support with proper types

### ✅ SSR Compatible
Works with Next.js server-side rendering:
- Hydration-safe
- No flash of wrong template
- localStorage only accessed on client

### ✅ Error Handling
Throws helpful error if used outside provider:
```
Error: useTemplate must be used within a TemplateProvider
```

## Usage Examples

### Example 1: Template Picker Component

```tsx
import { useTemplate } from '@/src/stores/template-context';

export function TemplatePicker() {
  const { selectedTemplate, setSelectedTemplate } = useTemplate();
  
  return (
    <div>
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => setSelectedTemplate(template.id)}
          className={selectedTemplate === template.id ? 'active' : ''}
        >
          {template.name}
        </button>
      ))}
    </div>
  );
}
```

### Example 2: Resume Display Controller

```tsx
import { useTemplate } from '@/src/stores/template-context';

export function ResumeDisplayController({ resumeData, isAuth }) {
  const { selectedTemplate } = useTemplate();
  
  switch (selectedTemplate) {
    case 'template-1':
      return <ResumeTemplate1 resumeData={resumeData} isAuth={isAuth} />;
    case 'template-2':
      return <ResumeTemplate2 resumeData={resumeData} isAuth={isAuth} />;
    case 'template-3':
      return <ResumeTemplate3 resumeData={resumeData} isAuth={isAuth} />;
    default:
      return <ResumeDisplay resumeData={resumeData} isAuth={isAuth} />;
  }
}
```

### Example 3: Reset on Logout

```tsx
import { useTemplate } from '@/src/stores/template-context';

export function useLogout() {
  const { resetTemplate } = useTemplate();
  
  const logout = async () => {
    await signOut();
    resetTemplate(); // Reset to default on logout
  };
  
  return logout;
}
```

## Architecture

```
TemplateProvider (Context Provider)
    ├── Manages state (selectedTemplate)
    ├── Loads from localStorage on mount
    ├── Saves to localStorage on change
    └── Provides via Context
            │
            ├── TemplatePicker (Consumer)
            │   └── User selects template
            │
            └── ResumeDisplayController (Consumer)
                └── Renders selected template
```

## Storage Details

### localStorage Key
```
resume-template-selection
```

### localStorage Value
```
"original" | "template-1" | "template-2" | "template-3"
```

### Clear Storage (for testing)
```javascript
localStorage.removeItem('resume-template-selection');
```

## Troubleshooting

### Error: "useTemplate must be used within a TemplateProvider"

**Cause:** Component using `useTemplate()` is not wrapped in `<TemplateProvider>`

**Solution:** Add provider to your app root:
```tsx
<TemplateProvider>
  <YourApp />
</TemplateProvider>
```

### Template not persisting

**Check:**
1. localStorage is enabled in browser
2. Not in incognito/private mode
3. Browser console for errors
4. Check localStorage in DevTools: Application > Local Storage

### Wrong template on first load

**Cause:** localStorage not initialized yet

**Solution:** This is handled automatically - template loads from storage after mount

## Migration from Zustand

If migrating from Zustand:

**Before:**
```tsx
import { useTemplateStore } from '@/src/stores/template-store';

const selectedTemplate = useTemplateStore((state) => state.selectedTemplate);
const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);
```

**After:**
```tsx
import { useTemplate } from '@/src/stores/template-context';

const { selectedTemplate, setSelectedTemplate } = useTemplate();
```

## Files

- `template-context.tsx` - Provider and hook implementation
- `README.md` - This file

## Next Steps

1. Add `<TemplateProvider>` to your app root
2. Use `useTemplate()` in components
3. That's it! ✨