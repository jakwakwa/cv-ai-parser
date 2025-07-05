# Component Generation Examples

This document provides real-world examples of generating React components from Figma designs using MCP Figma integration.

## Basic Button Component

### Figma Design
URL: `https://figma.com/file/ABC123/Design-System?node-id=1:23`

### Prompt Used
```
Generate a React component with CSS Modules based on this Figma design:
https://figma.com/file/ABC123/Design-System?node-id=1:23

Requirements:
- Use TypeScript
- Follow kebab-case naming for files
- Use CSS Modules (not Tailwind)
- Make it responsive
- Include proper TypeScript interfaces
- Support variant props (primary, secondary, danger)
- Include hover and focus states
```

### Generated Output

**File: `src/components/button/button.tsx`**
```typescript
import React from 'react';
import styles from './button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  className = ''
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};
```

**File: `src/components/button/button.module.css`**
```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  white-space: nowrap;
}

.button:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Variants */
.primary {
  background-color: var(--color-primary-500);
  color: white;
}

.primary:hover {
  background-color: var(--color-primary-600);
}

.secondary {
  background-color: transparent;
  color: var(--color-primary-500);
  border: 1px solid var(--color-primary-500);
}

.secondary:hover {
  background-color: var(--color-primary-50);
}

.danger {
  background-color: var(--color-red-500);
  color: white;
}

.danger:hover {
  background-color: var(--color-red-600);
}

/* Sizes */
.sm {
  padding: 8px 16px;
  font-size: 14px;
  min-height: 32px;
}

.md {
  padding: 12px 24px;
  font-size: 16px;
  min-height: 40px;
}

.lg {
  padding: 16px 32px;
  font-size: 18px;
  min-height: 48px;
}

/* States */
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

@media (max-width: 768px) {
  .button {
    min-width: 44px; /* Touch target size */
    min-height: 44px;
  }
}
```

## Navigation Bar Component

### Figma Design
URL: `https://figma.com/file/XYZ789/Website?node-id=2:45`

### Prompt Used
```
Generate a responsive navigation component from this Figma design:
https://figma.com/file/XYZ789/Website?node-id=2:45

Requirements:
- Use TypeScript and CSS Modules
- Responsive design with mobile hamburger menu
- Support keyboard navigation
- Include logo and navigation links
- Match exact colors and spacing from design
- Use semantic HTML
```

### Generated Output

**File: `src/components/navigation/navigation.tsx`**
```typescript
import React, { useState, useEffect } from 'react';
import styles from './navigation.module.css';

interface NavigationLink {
  label: string;
  href: string;
  isActive?: boolean;
}

interface NavigationProps {
  logo: {
    src: string;
    alt: string;
    href: string;
  };
  links: NavigationLink[];
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  logo,
  links,
  className = ''
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`${styles.navigation} ${className}`} role="navigation">
      <div className={styles.container}>
        {/* Logo */}
        <a href={logo.href} className={styles.logo}>
          <img src={logo.src} alt={logo.alt} />
        </a>

        {/* Desktop Navigation */}
        <ul className={styles.navLinks}>
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className={`${styles.navLink} ${
                  link.isActive ? styles.active : ''
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>

        {/* Mobile Navigation */}
        <div className={`${styles.mobileMenu} ${
          isMobileMenuOpen ? styles.mobileMenuOpen : ''
        }`}>
          <ul className={styles.mobileNavLinks}>
            {links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className={`${styles.mobileNavLink} ${
                    link.isActive ? styles.active : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
```

**File: `src/components/navigation/navigation.module.css`**
```css
.navigation {
  background-color: white;
  border-bottom: 1px solid var(--color-gray-200);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo img {
  height: 32px;
  width: auto;
}

.navLinks {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.navLink {
  color: var(--color-gray-700);
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  transition: color 0.2s ease;
}

.navLink:hover,
.navLink:focus {
  color: var(--color-primary-600);
}

.navLink.active {
  color: var(--color-primary-600);
}

.mobileMenuButton {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.hamburger {
  width: 100%;
  height: 2px;
  background-color: var(--color-gray-700);
  transition: all 0.3s ease;
}

.mobileMenu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border-bottom: 1px solid var(--color-gray-200);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mobileNavLinks {
  list-style: none;
  margin: 0;
  padding: 1rem 0;
}

.mobileNavLink {
  display: block;
  color: var(--color-gray-700);
  text-decoration: none;
  padding: 0.75rem 1rem;
  font-weight: 500;
  border-bottom: 1px solid var(--color-gray-100);
}

.mobileNavLink:hover,
.mobileNavLink:focus {
  background-color: var(--color-gray-50);
  color: var(--color-primary-600);
}

.mobileNavLink.active {
  color: var(--color-primary-600);
  background-color: var(--color-primary-50);
}

@media (max-width: 768px) {
  .navLinks {
    display: none;
  }

  .mobileMenuButton {
    display: flex;
  }

  .mobileMenu.mobileMenuOpen {
    display: block;
  }
}

/* Keyboard navigation */
.navLink:focus,
.mobileNavLink:focus,
.mobileMenuButton:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

## Card Component with Content

### Figma Design
URL: `https://figma.com/file/DEF456/Cards?node-id=3:67`

### Prompt Used
```
Generate a reusable card component from this Figma design:
https://figma.com/file/DEF456/Cards?node-id=3:67

Requirements:
- TypeScript with proper interfaces
- CSS Modules styling
- Support optional image, title, description, and action button
- Responsive design
- Hover effects as shown in design
- Accessible markup
```

### Generated Output

**File: `src/components/card/card.tsx`**
```typescript
import React from 'react';
import styles from './card.module.css';

interface CardProps {
  image?: {
    src: string;
    alt: string;
  };
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  image,
  title,
  description,
  action,
  variant = 'default',
  className = ''
}) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  const ActionComponent = action?.href ? 'a' : 'button';

  return (
    <article className={cardClasses}>
      {image && (
        <div className={styles.imageContainer}>
          <img 
            src={image.src} 
            alt={image.alt}
            className={styles.image}
          />
        </div>
      )}
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        
        {description && (
          <p className={styles.description}>{description}</p>
        )}
        
        {action && (
          <ActionComponent
            className={styles.action}
            {...(action.href ? { href: action.href } : { onClick: action.onClick })}
            {...(action.href ? {} : { type: 'button' })}
          >
            {action.label}
          </ActionComponent>
        )}
      </div>
    </article>
  );
};
```

**File: `src/components/card/card.module.css`**
```css
.card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-2px);
}

.default {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.default:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.elevated {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.elevated:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.outlined {
  border: 1px solid var(--color-gray-200);
  box-shadow: none;
}

.outlined:hover {
  border-color: var(--color-gray-300);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.imageContainer {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .image {
  transform: scale(1.05);
}

.content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.description {
  color: var(--color-gray-600);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  flex: 1;
}

.action {
  background-color: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  align-self: flex-start;
}

.action:hover,
.action:focus {
  background-color: var(--color-primary-600);
}

.action:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }
  
  .imageContainer {
    height: 160px;
  }
  
  .title {
    font-size: 1.125rem;
  }
}
```

## Usage Examples

### Button Component Usage
```typescript
import { Button } from '@/src/components/button/button';

// In your component
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

<Button variant="secondary" size="lg" disabled>
  Disabled Button
</Button>
```

### Navigation Component Usage
```typescript
import { Navigation } from '@/src/components/navigation/navigation';

const navigationData = {
  logo: {
    src: '/logo.svg',
    alt: 'Company Logo',
    href: '/'
  },
  links: [
    { label: 'Home', href: '/', isActive: true },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' }
  ]
};

<Navigation {...navigationData} />
```

### Card Component Usage
```typescript
import { Card } from '@/src/components/card/card';

<Card
  image={{
    src: '/blog-post-image.jpg',
    alt: 'Blog post preview'
  }}
  title="How to Use MCP Figma Integration"
  description="Learn how to rapidly generate components from Figma designs using MCP technology."
  action={{
    label: 'Read More',
    href: '/blog/mcp-figma-integration'
  }}
  variant="elevated"
/>
```

## Best Practices for MCP Component Generation

### 1. Specific Prompts
- Always include specific requirements
- Mention TypeScript and CSS Modules explicitly
- Specify responsive behavior
- Include accessibility requirements

### 2. Design Quality
- Use well-structured Figma files
- Name layers meaningfully
- Use Auto Layout for responsive behavior
- Define component variants clearly

### 3. Code Review
- Always review generated code
- Test responsive behavior
- Verify accessibility
- Check for design fidelity

### 4. Iteration
- Refine prompts based on results
- Add specific requirements for edge cases
- Build up a library of effective prompts
- Document successful patterns

This collection of examples demonstrates the power of MCP Figma integration for rapid, high-quality component development while maintaining consistency with your project's patterns and standards.