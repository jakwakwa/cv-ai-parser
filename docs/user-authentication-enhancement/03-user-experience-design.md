# User Experience Design

## Overview

This document outlines the user experience design for the enhanced authentication system, including user flows, wireframes, and interface specifications following the project's CSS Modules and kebab-case naming conventions.

## Design Principles

### 1. Consistency
- Follow existing design patterns from the current application
- Use consistent spacing, typography, and color schemes
- Maintain visual hierarchy established in the current UI

### 2. Accessibility
- Ensure all components are keyboard navigable
- Provide proper ARIA labels and roles
- Maintain sufficient color contrast ratios
- Support screen readers

### 3. Progressive Enhancement
- Start with basic functionality, add advanced features progressively
- Graceful degradation for older browsers
- Mobile-first responsive design

### 4. User-Centric
- Minimize cognitive load
- Provide clear feedback for all actions
- Implement intuitive navigation patterns

## User Flows

### 1. Settings Access Flow
```
Authenticated User → User Nav Dropdown → Settings → Settings Dashboard
                                     ↓
                               Profile | Security | Preferences | Account
```

### 2. Profile Management Flow
```
Settings → Profile Section → Edit Profile → Update Fields → Save Changes
                          ↓
                     Upload Avatar → Crop/Resize → Save
```

### 3. Password Reset Flow
```
Login Page → "Forgot Password?" → Enter Email → Check Email → Reset Link → New Password → Confirmation
```

### 4. Account Deletion Flow
```
Settings → Account → Delete Account → Confirm Identity → Review Data → Download Export → Final Confirmation → Account Deleted
```

## Page Structure & Layout

### Settings Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Site Header (existing)                                       │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────────────┐ │
│ │ Settings Nav    │ │ Content Area                        │ │
│ │                 │ │                                     │ │
│ │ • Profile       │ │ [Dynamic Content Based on Section] │ │
│ │ • Security      │ │                                     │ │
│ │ • Preferences   │ │                                     │ │
│ │ • Account       │ │                                     │ │
│ └─────────────────┘ └─────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Site Footer (existing)                                       │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout
```
┌─────────────────────────────────────┐
│ Site Header                         │
├─────────────────────────────────────┤
│ Settings Tab Navigation             │
│ [Profile] [Security] [Preferences]  │
├─────────────────────────────────────┤
│                                     │
│ Content Area                        │
│ (Full Width)                        │
│                                     │
├─────────────────────────────────────┤
│ Site Footer                         │
└─────────────────────────────────────┘
```

## Component Specifications

### Settings Navigation Component
```typescript
interface SettingsNavProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const settingsNavItems = [
  { id: 'profile', label: 'Profile', icon: 'User' },
  { id: 'security', label: 'Security', icon: 'Shield' },
  { id: 'preferences', label: 'Preferences', icon: 'Settings' },
  { id: 'account', label: 'Account', icon: 'UserX' }
];
```

### Profile Section Components

#### Profile Information Form
```typescript
interface ProfileFormData {
  displayName: string;
  bio: string;
  website: string;
  location: string;
  timezone: string;
}

interface ProfileFormProps {
  initialData: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isLoading: boolean;
}
```

#### Avatar Upload Component
```typescript
interface AvatarUploadProps {
  currentAvatar?: string;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
  isLoading: boolean;
}
```

### Security Section Components

#### Password Change Form
```typescript
interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordChangeFormProps {
  onSubmit: (data: PasswordChangeFormData) => Promise<void>;
  isLoading: boolean;
}
```

#### Security Dashboard
```typescript
interface SecurityDashboardProps {
  lastLogin: string;
  activeSessions: number;
  recentActivity: ActivityItem[];
  onViewAllActivity: () => void;
}
```

### Preferences Section Components

#### Theme Preferences
```typescript
interface ThemePreferencesProps {
  currentTheme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: string) => void;
}
```

#### Default Resume Settings
```typescript
interface DefaultResumeSettingsProps {
  defaultPrivacy: boolean;
  defaultColors: Record<string, string>;
  onSettingsChange: (settings: any) => void;
}
```

## Visual Design System

### Color Palette
```css
/* Primary Colors */
--primary-50: #f0f9ff;
--primary-100: #e0f2fe;
--primary-500: #0ea5e9;
--primary-600: #0284c7;
--primary-700: #0369a1;

/* Secondary Colors */
--secondary-50: #f8fafc;
--secondary-100: #f1f5f9;
--secondary-500: #64748b;
--secondary-600: #475569;
--secondary-700: #334155;

/* Status Colors */
--success-50: #f0fdf4;
--success-500: #8dd0ca;
--error-50: #fef2f2;
--error-500: #ef4444;
--warning-50: #fffbeb;
--warning-500: #f59e0b;
```

### Typography
```css
/* Headings */
.heading-1 {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  font-family: 'DM Sans', sans-serif;
}

.heading-2 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  font-family: 'DM Sans', sans-serif;
}

.heading-3 {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  font-family: 'DM Sans', sans-serif;
}

/* Body Text */
.body-1 {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  font-family: 'DM Sans', sans-serif;
}

.body-2 {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  font-family: 'DM Sans', sans-serif;
}
```

### Spacing System
```css
/* Spacing scale based on 4px unit */
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
```

## Detailed Component Wireframes

### Settings Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ Settings                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Quick Actions                                               │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ Update Profile  │ │ Change Password │ │ Export Data     │ │
│ │ [Icon]          │ │ [Icon]          │ │ [Icon]          │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
│                                                             │
│ Recent Activity                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ • Profile updated                    2 hours ago        │ │
│ │ • New resume created                 1 day ago          │ │
│ │ • Password changed                   3 days ago         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Account Overview                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Account created: January 15, 2024                       │ │
│ │ Total resumes: 12                                       │ │
│ │ Public resumes: 3                                       │ │
│ │ Total views: 1,234                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Profile Section
```
┌─────────────────────────────────────────────────────────────┐
│ Profile Information                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────┐ Personal Information                    │
│ │                 │ ┌─────────────────────────────────────┐ │
│ │ [Avatar Image]  │ │ Display Name: [John Doe          ] │ │
│ │                 │ │ Email: [john@example.com         ] │ │
│ │ [Change Photo]  │ │ Bio: [Software Developer...      ] │ │
│ │ [Remove Photo]  │ │ Website: [https://johndoe.com    ] │ │
│ └─────────────────┘ │ Location: [San Francisco, CA     ] │ │
│                     │ Timezone: [Pacific Time (UTC-8) ▼] │ │
│                     └─────────────────────────────────────┘ │
│                                                             │
│ Profile Visibility                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ □ Show my name on public resumes                        │ │
│ │ □ Allow others to find me by email                      │ │
│ │ □ Show my profile in resume sharing                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [Cancel] [Save Changes]                                     │
└─────────────────────────────────────────────────────────────┘
```

### Security Section
```
┌─────────────────────────────────────────────────────────────┐
│ Security                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Password                                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Last changed: 3 days ago                                │ │
│ │ [Change Password]                                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Login Activity                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Current session    Chrome on Mac      San Francisco     │ │
│ │ Previous session   Safari on iPhone   Los Angeles       │ │
│ │ [View All Activity]                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Account Security                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Two-factor authentication: [Enable]                     │ │
│ │ Login notifications: [✓] Email me about new logins     │ │
│ │ Suspicious activity: [✓] Alert me about unusual access │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Account Section
```
┌─────────────────────────────────────────────────────────────┐
│ Account Management                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Data Export                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Download all your data including resumes, profiles,     │ │
│ │ and account information.                                │ │
│ │ [Request Data Export]                                   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Account Deletion                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⚠️ Permanently delete your account and all associated   │ │
│ │ data. This action cannot be undone.                    │ │
│ │ [Delete Account]                                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Privacy Settings                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ □ Allow analytics tracking                              │ │
│ │ □ Receive product updates                               │ │
│ │ □ Participate in user research                          │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Responsive Design

### Breakpoints
```css
/* Mobile first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Mobile Adaptations
- Settings navigation becomes horizontal tabs
- Forms stack vertically
- Cards become full-width
- Simplified navigation patterns

### Tablet Adaptations
- Sidebar navigation remains visible
- Two-column layout for forms
- Larger touch targets
- Optimized spacing

## Interaction Design

### Loading States
- Skeleton screens for form loading
- Spinner for button actions
- Progress indicators for uploads
- Shimmer effects for content loading

### Error States
- Inline validation for forms
- Toast notifications for actions
- Error boundaries for critical failures
- Retry mechanisms for failed requests

### Success States
- Confirmation messages for saves
- Success animations for completions
- Progress feedback for multi-step processes
- Clear feedback for all actions

## Accessibility Features

### Keyboard Navigation
- Tab order follows logical flow
- Skip links for main content
- Focus indicators clearly visible
- Escape key closes modals

### Screen Reader Support
- Proper heading hierarchy
- Descriptive link text
- Form labels and instructions
- Status announcements

### Visual Accessibility
- High contrast mode support
- Scalable text (up to 200%)
- Color not sole indicator
- Reduced motion preferences

## Implementation Notes

### CSS Modules Structure
```
src/components/settings/
├── settings-layout/
│   ├── settings-layout.tsx
│   └── settings-layout.module.css
├── settings-nav/
│   ├── settings-nav.tsx
│   └── settings-nav.module.css
└── [component-name]/
    ├── [component-name].tsx
    └── [component-name].module.css
```

### Theme Integration
- CSS custom properties for theming
- Dynamic theme switching
- Consistent color usage
- Dark mode support

### Performance Considerations
- Code splitting for settings sections
- Lazy loading for heavy components
- Optimized images and assets
- Minimal bundle size impact

## Next Steps

1. **Create Component Library**: Build reusable settings components
2. **Implement Navigation**: Settings navigation and routing
3. **Build Forms**: Profile and preferences forms
4. **Add Interactions**: Loading states and animations
5. **Test Accessibility**: Comprehensive accessibility testing

See [Technical Architecture](./04-technical-architecture.md) for implementation details.