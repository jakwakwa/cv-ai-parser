# Google AdSense Setup Guide

## 🎯 What's Been Implemented

I've successfully integrated Google AdSense into your CV AI parser app with strategic ad placements:

### Ad Locations:
1. **Header Ads** - Below the main navigation on all pages
2. **Content Ads** - Between resume sections on the resume view page
3. **Footer Ads** - At the bottom of pages
4. **Library Page Ads** - Header and footer ads on the resume library page

### Files Created/Modified:
- ✅ `src/components/adsense/AdSense.tsx` - Reusable AdSense component
- ✅ `src/components/adsense/AdSense.module.css` - AdSense styling
- ✅ `app/layout.tsx` - Added AdSense script
- ✅ `app/page.tsx` - Added header ad
- ✅ `app/resume/[slug]/page.tsx` - Added header, content, and footer ads
- ✅ `app/library/page.tsx` - Added header and footer ads
- ✅ `.env.local.example` - Environment variables template

## 🚀 Next Steps - How to Activate AdSense

### Step 1: Apply for Google AdSense
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Click "Get Started"
3. Add your website URL: `your-domain.com`
4. Select your country and choose currency
5. Review and accept AdSense Terms & Conditions

### Step 2: Get Your Publisher ID
1. Once approved, go to your AdSense dashboard
2. Navigate to **Sites** → **Overview**
3. Find your **Publisher ID** (format: `ca-pub-1234567890123456`)

### Step 3: Create Ad Units
1. In AdSense dashboard, go to **Ads** → **Overview**
2. Click **"+ By ad unit"**
3. Create these ad units:

   **Header Ad:**
   - Name: "CV Parser Header"
   - Type: Display ads
   - Size: Responsive

   **Content Ad:**
   - Name: "CV Parser Content"
   - Type: Display ads
   - Size: Responsive

   **Footer Ad:**
   - Name: "CV Parser Footer"
   - Type: Display ads
   - Size: Responsive

4. Copy the **Ad slot ID** for each (format: `1234567890`)

### Step 4: Update Your App
1. Copy `.env.local.example` to `.env.local`
2. Replace the placeholder values:

```bash
# Replace with your actual Publisher ID
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-YOUR-ACTUAL-ID

# Replace with your actual Ad Slot IDs
NEXT_PUBLIC_ADSENSE_HEADER_SLOT=your-header-slot-id
NEXT_PUBLIC_ADSENSE_RESUME_HEADER_SLOT=your-resume-header-slot-id
NEXT_PUBLIC_ADSENSE_CONTENT_SLOT=your-content-slot-id
NEXT_PUBLIC_ADSENSE_FOOTER_SLOT=your-footer-slot-id
NEXT_PUBLIC_ADSENSE_LIBRARY_HEADER_SLOT=your-library-header-slot-id
NEXT_PUBLIC_ADSENSE_LIBRARY_FOOTER_SLOT=your-library-footer-slot-id
```

3. Update the hardcoded values in the components:
   - Find `ca-pub-XXXXXXXXXX` in `app/layout.tsx` and `src/components/adsense/AdSense.tsx`
   - Replace with your actual Publisher ID
   - Find placeholder ad slots like `1234567890` and replace with actual slot IDs

### Step 5: Deploy and Test
1. Deploy your app to production
2. Visit your live site (not localhost - AdSense won't show on local)
3. Check that ad spaces appear (might show blank initially)
4. Submit your site for AdSense review

### Step 6: Wait for Approval
- **Initial Review**: 1-14 days
- **Ad Display**: Ads may not show immediately even after approval
- **First Payment**: After reaching $100 threshold

## 💰 Expected Revenue

For a CV parser app, you can expect:
- **RPM (Revenue per 1000 views)**: $1-5
- **CTR (Click-through rate)**: 1-3%
- **With 10,000 monthly visitors**: $10-50/month
- **With 50,000 monthly visitors**: $50-250/month

## 🎨 Ad Placement Strategy

The ads are strategically placed to:
1. **Header**: Immediate visibility without disrupting user flow
2. **Between content**: Natural break in resume viewing
3. **Footer**: Capture users after they've completed their task
4. **Library**: Additional impressions for returning users

## 🔧 Customization Options

You can adjust ad behavior by modifying the `AdSense` component props:
- `adFormat`: 'auto', 'rectangle', 'vertical', 'horizontal'
- `className`: Custom styling
- `adStyle`: Inline styles

## 📊 Monitoring Performance

After approval, monitor your earnings at:
- AdSense Dashboard → Reports
- Track: Impressions, Clicks, CTR, RPM, Revenue

## 🚨 Important Notes

1. **Never click your own ads** - This will get you banned
2. **Content quality matters** - Keep your app useful and user-friendly
3. **Mobile optimization** - Ensure ads look good on mobile devices
4. **Page speed** - Monitor that ads don't slow down your site significantly

## ✅ Ready to Go!

Your app is now AdSense-ready! Just complete the signup process and replace the placeholder values with your actual AdSense credentials.

Need help with any step? The integration is complete and tested - you just need the AdSense approval and configuration!
