# Template Integration Guide

This guide explains how to integrate the resume templates into your application with a template selector UI.

## Quick Start

### 1. Import Templates

```typescript
import { 
  ResumeTemplate1, 
  ResumeTemplate2, 
  ResumeTemplate3,
  templateMetadata 
} from '@/src/containers/resume-templates';
```

### 2. Add Template State

```typescript
import { useState } from 'react';

const [selectedTemplate, setSelectedTemplate] = useState<string>('original');
```

### 3. Conditional Rendering

```typescript
const renderTemplate = () => {
  switch (selectedTemplate) {
    case 'template-1':
      return <ResumeTemplate1 resumeData={resumeData} isAuth={isAuth} />;
    case 'template-2':
      return <ResumeTemplate2 resumeData={resumeData} isAuth={isAuth} />;
    case 'template-3':
      return <ResumeTemplate3 resumeData={resumeData} isAuth={isAuth} />;
    case 'original':
    default:
      return <ResumeDisplay resumeData={resumeData} isAuth={isAuth} />;
  }
};

return (
  <div>
    {/* Template selector UI */}
    <TemplateSelector 
      selected={selectedTemplate} 
      onChange={setSelectedTemplate} 
    />
    
    {/* Render selected template */}
    {renderTemplate()}
  </div>
);
```

---

## Full Implementation Example

### Component: `ResumeWithTemplateSelector.tsx`

```typescript
import React, { useState } from 'react';
import type { ParsedResumeSchema } from '@/lib/tools-lib/shared-parsed-resume-schema';
import ResumeDisplay from '@/src/containers/resume-display/resume-display';
import { 
  ResumeTemplate1, 
  ResumeTemplate2, 
  ResumeTemplate3,
  templateMetadata 
} from '@/src/containers/resume-templates';

interface ResumeWithTemplateSelectorProps {
  resumeData: ParsedResumeSchema;
  isAuth: boolean;
}

const ResumeWithTemplateSelector: React.FC<ResumeWithTemplateSelectorProps> = ({ 
  resumeData, 
  isAuth 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('original');

  const templates = [
    { id: 'original', name: 'Original', description: 'Default resume layout' },
    ...templateMetadata,
  ];

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'template-1':
        return <ResumeTemplate1 resumeData={resumeData} isAuth={isAuth} />;
      case 'template-2':
        return <ResumeTemplate2 resumeData={resumeData} isAuth={isAuth} />;
      case 'template-3':
        return <ResumeTemplate3 resumeData={resumeData} isAuth={isAuth} />;
      case 'original':
      default:
        return <ResumeDisplay resumeData={resumeData} isAuth={isAuth} />;
    }
  };

  return (
    <div className="resume-container">
      {/* Template Selector */}
      <div className="template-selector-wrapper">
        <h3>Choose From Multiple Resume Templates</h3>
        <div className="template-grid">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`template-option ${
                selectedTemplate === template.id ? 'active' : ''
              }`}
            >
              <div className="template-preview">
                {/* Add preview thumbnails here */}
                <span className="template-icon">📄</span>
              </div>
              <h4>{template.name}</h4>
              <p>{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Resume Display */}
      <div className="resume-display">
        {renderTemplate()}
      </div>
    </div>
  );
};

export default ResumeWithTemplateSelector;
```

### Styles: `ResumeWithTemplateSelector.module.css`

```css
.resumeContainer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.templateSelectorWrapper {
  margin-bottom: 2rem;
}

.templateSelectorWrapper h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--app-charcoal);
}

.templateGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.templateOption {
  padding: 1.5rem;
  border: 2px solid var(--app-light-grey-border);
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.templateOption:hover {
  border-color: var(--app-teal-main);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.templateOption.active {
  border-color: var(--app-teal-main);
  background: var(--app-mint-background);
  box-shadow: 0 4px 12px rgba(17, 105, 100, 0.2);
}

.templatePreview {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--app-light-grey-background);
  border-radius: 4px;
  margin-bottom: 1rem;
}

.templateIcon {
  font-size: 3rem;
}

.templateOption h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--app-charcoal);
}

.templateOption p {
  font-size: 0.85rem;
  margin: 0;
  color: var(--app-charcoal);
  opacity: 0.7;
}

.resumeDisplay {
  margin-top: 2rem;
}
```

---

## Advanced: Template Selector with Previews

### Component with Thumbnail Previews

```typescript
import { useState } from 'react';

const TemplateSelector = ({ selected, onChange, templates }) => {
  return (
    <div className="template-selector">
      <label htmlFor="template-select">Select Resume Template:</label>
      <select 
        id="template-select"
        value={selected} 
        onChange={(e) => onChange(e.target.value)}
        className="template-dropdown"
      >
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>

      {/* Visual Grid Alternative */}
      <div className="template-cards">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onChange(template.id)}
            className={`template-card ${selected === template.id ? 'selected' : ''}`}
          >
            <div className="template-thumbnail">
              {/* Mini preview of template layout */}
              <TemplatePreview templateId={template.id} />
            </div>
            <h4>{template.name}</h4>
            <p>{template.description}</p>
            {selected === template.id && <span className="selected-badge">✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## Persist Template Selection

### Using localStorage

```typescript
import { useState, useEffect } from 'react';

const useTemplatePreference = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('original');

  // Load preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('resumeTemplate');
    if (saved) {
      setSelectedTemplate(saved);
    }
  }, []);

  // Save preference when changed
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    localStorage.setItem('resumeTemplate', templateId);
  };

  return [selectedTemplate, handleTemplateChange] as const;
};

// Usage
const [selectedTemplate, setSelectedTemplate] = useTemplatePreference();
```

### Using Database (for authenticated users)

```typescript
import { useState, useEffect } from 'react';

const useTemplatePreference = (userId: string | null) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('original');

  useEffect(() => {
    if (userId) {
      // Fetch from database
      fetchUserTemplatePreference(userId).then((pref) => {
        setSelectedTemplate(pref || 'original');
      });
    }
  }, [userId]);

  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplate(templateId);
    
    if (userId) {
      // Save to database
      await saveUserTemplatePreference(userId, templateId);
    }
  };

  return [selectedTemplate, handleTemplateChange] as const;
};
```

---

## Integration with Existing Pages

### Resume Builder Page

```typescript
// pages/resume-builder/page.tsx or similar
import ResumeWithTemplateSelector from '@/src/components/ResumeWithTemplateSelector';

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ParsedResumeSchema | null>(null);
  const { user } = useAuth();

  return (
    <div>
      <h1>Resume Builder</h1>
      
      {/* Upload section */}
      <ResumeUploadPanel onUpload={setResumeData} />
      
      {/* Display with template selection */}
      {resumeData && (
        <ResumeWithTemplateSelector 
          resumeData={resumeData} 
          isAuth={!!user} 
        />
      )}
    </div>
  );
}
```

### Resume Tailor Page

```typescript
// pages/resume-tailor/page.tsx or similar
import ResumeWithTemplateSelector from '@/src/components/ResumeWithTemplateSelector';

export default function ResumeTailorPage() {
  const [tailoredResume, setTailoredResume] = useState<ParsedResumeSchema | null>(null);
  const { user } = useAuth();

  return (
    <div>
      <h1>Resume Tailor</h1>
      
      {/* Tailor form */}
      <ResumeTailorForm onComplete={setTailoredResume} />
      
      {/* Display with template selection */}
      {tailoredResume && (
        <ResumeWithTemplateSelector 
          resumeData={tailoredResume} 
          isAuth={!!user} 
        />
      )}
    </div>
  );
}
```

---

## Dynamic Template Loading (Code Splitting)

For better performance, lazy load templates:

```typescript
import { lazy, Suspense } from 'react';

const ResumeTemplate1 = lazy(() => import('@/src/containers/resume-templates/resume-template-1'));
const ResumeTemplate2 = lazy(() => import('@/src/containers/resume-templates/resume-template-2'));
const ResumeTemplate3 = lazy(() => import('@/src/containers/resume-templates/resume-template-3'));

const renderTemplate = () => {
  let TemplateComponent;
  
  switch (selectedTemplate) {
    case 'template-1':
      TemplateComponent = ResumeTemplate1;
      break;
    case 'template-2':
      TemplateComponent = ResumeTemplate2;
      break;
    case 'template-3':
      TemplateComponent = ResumeTemplate3;
      break;
    default:
      return <ResumeDisplay resumeData={resumeData} isAuth={isAuth} />;
  }
  
  return (
    <Suspense fallback={<div>Loading template...</div>}>
      <TemplateComponent resumeData={resumeData} isAuth={isAuth} />
    </Suspense>
  );
};
```

---

## Template-Specific PDF Generation

When generating PDFs, ensure the selected template is used:

```typescript
const handleDownloadPDF = async () => {
  // Get the resume content element
  const element = document.getElementById('resume-content');
  
  if (!element) return;
  
  // Use html2pdf or similar library
  const options = {
    margin: 0,
    filename: `resume-${selectedTemplate}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  await html2pdf().set(options).from(element).save();
};
```

---

## Testing Templates

```typescript
// Test each template renders correctly
describe('Resume Templates', () => {
  const mockData: ParsedResumeSchema = {
    name: 'John Doe',
    title: 'Software Engineer',
    // ... other fields
  };

  it('renders Template 1', () => {
    render(<ResumeTemplate1 resumeData={mockData} isAuth={true} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders Template 2', () => {
    render(<ResumeTemplate2 resumeData={mockData} isAuth={true} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders Template 3', () => {
    render(<ResumeTemplate3 resumeData={mockData} isAuth={true} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

---

## Summary

✅ Import templates from `@/src/containers/resume-templates`  
✅ Use state to track selected template  
✅ Render conditionally based on selection  
✅ Persist preference (localStorage or DB)  
✅ Integrate with existing pages  
✅ Add template selector UI  
✅ Support PDF generation for all templates  
✅ Consider lazy loading for performance  

All templates use the **same data** and **same colors**, so integration is straightforward!