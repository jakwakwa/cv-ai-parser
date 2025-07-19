# Google AdSense Ad Unit Setup Guide

This guide explains how to properly set up Google AdSense ad units in your Next.js application.

## Overview

Your `AdBanner` component now includes the proper AdSense ad unit structure with your real ad slot IDs configured.

## ✅ Current Configuration

Your AdSense ad units are configured with these real slot IDs:

```tsx
const AD_SLOTS = {
  header: "9667986278", // CV Parser Header
  content: "7560041144", // CV Parser Content
  footer: "9100353525", // CV Parser Footer
} as const;
```

## 🚀 Usage Examples

### 1. Using Convenience Components (Recommended)

```tsx
import { HeaderAd, ContentAd, FooterAd } from '@/src/components/adsense/AdBanner';

// Header ad (9667986278)
<HeaderAd />

// Content ad (7560041144)
<ContentAd />

// Footer ad (9100353525)
<FooterAd />
```

### 2. Using Generic AdBanner Component

```tsx
import { AdBanner } from "@/src/components/adsense/AdBanner";

// Custom ad slot
<AdBanner adSlot="9667986278" width="100%" height="90px" />;
```

## 📍 Current Ad Placements

### Home Page (`app/page.tsx`)

- **Header Ad**: Below navigation, above main content

### Resume View Page (`app/resume/[slug]/page.tsx`)

- **Header Ad**: At the top of the resume page
- **Content Ad**: Between tailor commentary and resume display

### Library Page (`app/library/page-content.tsx`)

- **Header Ad**: At the top of the library page
- **Footer Ad**: At the bottom of the library page

## 🔧 Ad Unit Types and Formats

### Available Ad Formats

| Format        | Description               | Best Use               |
| ------------- | ------------------------- | ---------------------- |
| `auto`        | Google chooses best size  | General purpose        |
| `rectangle`   | 300x250, 336x280, 300x600 | Sidebar, content areas |
| `banner`      | 468x60, 728x90            | Header, footer         |
| `leaderboard` | 728x90, 970x90            | Header                 |
| `responsive`  | Adapts to container       | Mobile-friendly        |

### Responsive Configuration

```tsx
// Responsive ad (recommended)
<AdBanner
  adSlot="9667986278"
  responsive={true}
  width="100%"
/>

// Fixed size ad
<AdBanner
  adSlot="9667986278"
  responsive={false}
  width="728px"
  height="90px"
/>
```

## 🧪 Testing Your Ad Units

### Development Testing

- Ads won't show on `localhost`
- Deploy to production to test
- Use browser dev tools to check for errors

### Production Testing

1. Deploy your app
2. Visit your live site
3. Check browser console for AdSense errors
4. Verify ads appear (may take 24-48 hours)

## 🔍 Common Issues and Solutions

### Ad Not Showing

- **Check**: AdSense script is loaded in `app/layout.tsx`
- **Check**: Publisher ID is correct (`ca-pub-7169177467099391`)
- **Check**: Ad slot IDs are correct (see above)
- **Check**: Site is approved by AdSense

### Ad Blocker Detection

The component includes ad blocker detection:

```tsx
// Automatically shows fallback when ad is blocked
if (error || adBlocked) {
  return showFallback ? (
    <div className={styles.fallbackContainer}>
      <span>{fallbackMessage}</span>
    </div>
  ) : null;
}
```

### Loading States

The component shows a loading placeholder:

```tsx
{
  loading && (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingIcon} />
      <div className={styles.loadingTextContainer}>
        <div className={styles.loadingTextLine1} />
        <div className={styles.loadingTextLine2} />
      </div>
    </div>
  );
}
```

## ⚡ Performance Optimization

### Lazy Loading

```tsx
// In your page component
import dynamic from "next/dynamic";

const HeaderAd = dynamic(
  () =>
    import("@/src/components/adsense/AdBanner").then((mod) => ({
      default: mod.HeaderAd,
    })),
  {
    ssr: false,
    loading: () => <div>Loading ad...</div>,
  }
);
```

### Conditional Loading

```tsx
// Only load ads on production
{
  process.env.NODE_ENV === "production" && <HeaderAd />;
}
```

## 📊 Monitoring and Analytics

### AdSense Dashboard

- Monitor impressions, clicks, CTR
- Track revenue and RPM
- Check for policy violations

### Custom Analytics

```tsx
// Add analytics to track ad performance
useEffect(() => {
  if (!loading && !error) {
    // Track successful ad load
    analytics.track("ad_loaded", { slot: adSlot });
  }
}, [loading, error, adSlot]);
```

## 🎯 Best Practices

1. **Strategic Placement**: Ads are placed at natural content breaks
2. **Mobile Optimization**: All ads are responsive by default
3. **User Experience**: Loading states prevent layout shifts
4. **Ad Blocker Handling**: Graceful fallbacks when ads are blocked
5. **Performance**: Ads don't block page rendering

## 📈 Expected Performance

Based on your CV AI Parser app:

- **RPM (Revenue per 1000 views)**: $2-8
- **CTR (Click-through rate)**: 1-3%
- **With 10,000 monthly visitors**: $20-80/month
- **With 50,000 monthly visitors**: $100-400/month

## ✅ Ready to Go!

Your AdSense integration is now properly configured with:

- ✅ Real ad slot IDs from your AdSense dashboard
- ✅ Proper ad unit structure
- ✅ Strategic ad placements
- ✅ Loading states and error handling
- ✅ Ad blocker detection
- ✅ Responsive design

**Next Steps:**

1. Deploy to production
2. Test on live site
3. Monitor AdSense dashboard
4. Optimize based on performance data

Your AdSense setup is complete and ready to generate revenue!
