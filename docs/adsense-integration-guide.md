# Google AdSense Integration Guide

This document outlines the complete process of integrating Google AdSense into a Next.js project, including the steps that led to successful account verification.

## Overview

This guide covers the refactoring process from old AdSense components to a modern Next.js implementation that successfully passed Google's verification process.

## Prerequisites

- Google AdSense account with publisher ID: `pub-PUB-XXXXXXXXXXXXXXXX`
- Next.js project with TypeScript
- Access to modify layout files and create new components

## Step-by-Step Integration Process

### 1. Remove Legacy AdSense Components

**Files Removed:**

- `src/components/adsense/AdSense.tsx`
- `src/components/adsense/AdSenseUnit.tsx`

**Reason:** These components were using outdated patterns and weren't optimized for Next.js performance.

### 2. Clean Up Imports and Usage

**Files Modified:**

- `app/layout.tsx` - Removed old AdSense imports
- `app/page.tsx` - Removed old AdSense component usage
- `app/library/page.tsx` - Removed old AdSense component usage
- `app/resume/[slug]/page.tsx` - Removed old AdSense component usage

**Key Changes:**

- Removed all references to old `AdSense` and `AdSenseUnit` components
- Cleaned up unused imports

### 3. Implement Next.js Script Component

**File:** `app/layout.tsx`

**Before:**

```html
<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-PUB-XXXXXXXXXXXXXXXX" async crossorigin="anonymous"></script>
```

**After:**

```tsx
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-PUB-XXXXXXXXXXXXXXXX"
  crossOrigin="anonymous"
  strategy="lazyOnload"
/>
```

**Benefits:**

- Better performance with lazy loading
- Proper Next.js integration
- Automatic optimization

### 4. Add Publisher ID to Metadata

**File:** `app/layout.tsx`

**Added to metadata export:**

```tsx
export const metadata: Metadata = {
  // ... other metadata
  other: {
    'google-adsense-account': 'pub-PUB-XXXXXXXXXXXXXXXX',
  },
};
```

**Purpose:** Provides Google with explicit publisher identification for verification.

### 5. Create Modern AdBanner Component

**File:** `src/components/adsense/AdBanner.tsx`

**Features:**

- Loading placeholder while AdSense loads
- Responsive design
- Error handling
- CSS Modules styling

**Key Implementation:**

```tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './AdBanner.module.css';

export function AdBanner() {
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    // AdSense loading logic
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      (window as any).adsbygoogle.push({});
      setIsAdLoaded(true);
    }
  }, []);

  return (
    <div className={styles.adBanner}>
      {!isAdLoaded && (
        <div className={styles.loadingPlaceholder}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading advertisement...</p>
        </div>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-PUB-XXXXXXXXXXXXXXXX"
        data-ad-slot="AD-SLOT-ID"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
```

### 6. Create CSS Module for AdBanner

**File:** `src/components/adsense/AdBanner.module.css`

**Features:**

- Responsive design
- Loading animation
- Proper spacing and alignment
- Mobile-friendly layout

### 7. Deploy ads.txt File

**Action:** Moved `ads.txt` from project root to `public/` directory

**Content:**

```text
// ad text values
google.com, pub-PUB-XXXXXXXXXXXXXXXX, DIRECT, CERTIFICATION_AUTHORITY_ID
```

**Purpose:** Required by Google AdSense for verification and ad serving.

### 8. Create robots.txt for SEO

**File:** `app/robots.ts`

**Features:**

- Allow Google AdSense crawlers
- Disallow API routes
- Include sitemap reference

```tsx
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
    ],
    sitemap: 'https://www.example.com/sitemap.xml',
  };
}
```

### 9. Create Dynamic Sitemap

**File:** `app/sitemap.ts`

**Features:**

- Dynamic generation from database
- Includes all public resumes
- Static pages included
- Proper XML formatting

**Database Integration:**

```tsx
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.example.com';
  
  // Fetch all public resumes from database
  const resumes = await getResumeDatabase().getAllPublicResumes();
  
  const resumeUrls = resumes.map((resume) => ({
    url: `${baseUrl}/resume/${resume.slug}`,
    lastModified: resume.updated_at,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/library`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...resumeUrls,
  ];
}
```

### 10. Add Database Method for Sitemap

**File:** `lib/database.ts`

**Added method:**

```tsx
async getAllPublicResumes(): Promise<Array<{ slug: string; updated_at: Date }>> {
  const { data, error } = await this.supabase
    .from('resumes')
    .select('slug, updated_at')
    .eq('is_public', true)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching public resumes:', error);
    return [];
  }

  return data || [];
}
```

## Integration Points

### Home Page Integration

**File:** `app/page.tsx`

Added AdBanner component to the main page:

```tsx
import { AdBanner } from '@/src/components/adsense/AdBanner';

// In the JSX:
<AdBanner />
```

### Layout Integration

**File:** `app/layout.tsx`

- Added AdSense script with Next.js Script component
- Added publisher ID to metadata
- Proper font loading and analytics integration

## Verification Checklist

### ✅ Completed Steps

- [x] Publisher ID added to metadata
- [x] AdSense script properly loaded with Next.js Script component
- [x] ads.txt file deployed to public directory
- [x] robots.txt configured for AdSense crawlers
- [x] Sitemap generated dynamically
- [x] Modern AdBanner component created
- [x] Legacy components removed
- [x] All imports cleaned up
- [x] CSS Modules implemented for styling

### 🔍 Google Verification Requirements Met

- [x] Publisher ID visible in page source
- [x] AdSense script loading correctly
- [x] ads.txt accessible at domain root
- [x] Proper meta tags in place
- [x] Clean, crawlable site structure

## Best Practices Implemented

### Performance

- **Lazy Loading:** AdSense script loads with `strategy="lazyOnload"`
- **Loading States:** AdBanner shows placeholder while loading
- **Error Handling:** Graceful fallbacks for ad loading failures

### SEO

- **Dynamic Sitemap:** Automatically includes all public content
- **Robots.txt:** Properly configured for search engines and AdSense
- **Meta Tags:** Complete OpenGraph and Twitter card support

### Code Quality

- **TypeScript:** Full type safety throughout
- **CSS Modules:** Scoped styling without conflicts
- **Next.js Patterns:** Proper use of App Router features
- **Clean Architecture:** Separation of concerns

## Troubleshooting

### Common Issues and Solutions

1. **AdSense Not Loading**
   - Check browser console for errors
   - Verify publisher ID is correct
   - Ensure ads.txt is accessible at domain root

2. **Verification Fails**
   - Confirm publisher ID in metadata
   - Check ads.txt file content and location
   - Verify script is loading without errors

3. **Performance Issues**
   - Use Next.js Script component with lazy loading
   - Implement loading placeholders
   - Monitor Core Web Vitals

## Future Considerations

### Scaling

- Consider ad unit rotation for better performance
- Implement ad refresh strategies
- Monitor ad performance metrics

### Maintenance

- Keep AdSense script updated
- Monitor for policy violations
- Regular performance audits

### Analytics

- Track ad performance
- Monitor user experience metrics
- A/B test ad placements

## Resources

- [Google AdSense Help Center](https://support.google.com/adsense)
- [Next.js Script Component Documentation](https://nextjs.org/docs/basic-features/script)
- [Google Publisher Policies](https://support.google.com/adsense/answer/48182)

## Notes for Future Projects

When implementing AdSense in future Next.js projects:

1. **Always use Next.js Script component** instead of raw script tags
2. **Include publisher ID in metadata** for verification
3. **Deploy ads.txt to public directory** immediately
4. **Create proper robots.txt** with AdSense crawler allowances
5. **Implement loading states** for better UX
6. **Use CSS Modules** for styling to avoid conflicts
7. **Follow TypeScript best practices** for maintainability

This implementation successfully passed Google's verification process and provides a solid foundation for monetization while maintaining excellent performance and user experience.
