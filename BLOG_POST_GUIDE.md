# Blog Post Developer Guide

This guide provides step-by-step instructions for adding new blog posts to the AIResumeGen website. Follow this guide to ensure consistency, proper SEO optimization, and integration with the existing blog infrastructure.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Process](#step-by-step-process)
4. [SEO Considerations](#seo-considerations)
5. [Styling Guidelines](#styling-guidelines)
6. [Examples](#examples)
7. [Checklist](#checklist)
8. [Common Issues](#common-issues)

---

## Project Structure

Blog posts are located in the following directory structure:

```
airesumegen/
├── app/
│   └── blog/
│       ├── page.tsx                    # Main blog listing page
│       ├── page.module.css             # Blog listing styles
│       ├── ats-optimization/           # Example blog post
│       │   ├── page.tsx
│       │   └── page.module.css
│       ├── career-advice/
│       ├── resume-writing-tips/
│       └── [your-new-post]/           # New blog post directory
│           ├── page.tsx                # Post content and metadata
│           └── page.module.css         # Post styles (copied from existing)
└── app/sitemap.ts                      # Site-wide sitemap
```

---

## Prerequisites

Before adding a new blog post, ensure you have:

1. **Article Content**: Complete markdown or text content
2. **Article Metadata**:
   - Title
   - Description (SEO-friendly, 120-160 characters)
   - Keywords (5-8 relevant keywords)
   - Category (e.g., "Career Advice", "Resume Writing", "ATS Optimization")
   - Read time estimate (in minutes)
   - Publication date (YYYY-MM-DD format)
3. **URL Slug**: SEO-friendly slug (e.g., `profile-summary-guide`)

---

## Step-by-Step Process

### Step 1: Create Blog Post Directory

1. Navigate to `airesumegen/app/blog/`
2. Create a new directory with your URL slug (use kebab-case):
   ```bash
   mkdir airesumegen/app/blog/your-post-slug
   ```

### Step 2: Copy CSS File

Copy the CSS module from an existing blog post:
```bash
cp airesumegen/app/blog/resume-writing-tips/page.module.css \
   airesumegen/app/blog/your-post-slug/page.module.css
```

**Note**: All blog posts share the same CSS structure for consistency.

### Step 3: Create page.tsx File

Create `airesumegen/app/blog/your-post-slug/page.tsx` with the following structure:

```typescript
import { SiteHeader } from "@/src/components/site-header/site-header"
import { HeaderAd, FooterAd, ContentAd } from "@/src/components/adsense/AdBanner"
import Link from "next/link"
import { JsonLd } from "@/src/components/seo/JsonLd"
import { buildBreadcrumbSchema, buildArticleSchema } from "@/src/lib/seo/schemas"
import { buildPageMetadata } from "@/src/lib/seo/metadata"
import { SITE } from "@/src/lib/seo/config"
import styles from "./page.module.css"

// SEO Metadata
export const metadata = buildPageMetadata({
    title: "Your Article Title: Comprehensive Guide",
    description: "A compelling 120-160 character description that includes primary keywords and value proposition.",
    path: "/blog/your-post-slug",
    keywords: [
        "primary keyword",
        "secondary keyword",
        "long-tail keyword",
        "related term",
    ],
})

// Breadcrumb Navigation
const breadcrumbs = [
    { name: "Home", item: SITE.baseUrl },
    { name: "Blog", item: `${SITE.baseUrl}/blog` },
    { name: "Your Article Title", item: `${SITE.baseUrl}/blog/your-post-slug` },
]

// Article Schema (for SEO)
const article = {
    title: "Your Article Title: Comprehensive Guide",
    description: "Same as metadata description",
    path: "/blog/your-post-slug",
    authorName: "Instant Ai Resume Generator Team",
    datePublished: "2025-01-15", // Use YYYY-MM-DD format
    tags: ["resume", "career", "keyword"],
}

export default function YourPostPage() {
    return (
        <div className={styles.pageWrapper}>
            <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />
            <JsonLd data={buildArticleSchema(article)} />
            <SiteHeader />
            <HeaderAd />

            <main className={styles.content}>
                <header className={styles.header}>
                    <nav className={styles.nav}>
                        <Link href="/blog" className={styles.navLink}>
                            Blog
                        </Link>
                        <span className={styles.navSeparator}>›</span>
                        <span className={styles.navCurrent}>Your Article Title</span>
                    </nav>
                    <h1 className={styles.title}>Your Article Title: Comprehensive Guide</h1>
                    <div className={styles.meta}>
                        <span>15 January 2025</span> • <span>10 min read</span> • <span>Career Advice</span>
                    </div>
                    <p className={styles.subtitle}>
                        A compelling subtitle that expands on the title and hooks the reader.
                    </p>
                </header>

                <article className={styles.article}>
                    {/* Your article sections go here */}
                    
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Section Title</h2>
                        <p className={styles.paragraph}>
                            Your content here...
                        </p>
                    </section>

                    {/* Add ContentAd after first major section */}
                    <ContentAd />

                    <section className={styles.section}>
                        {/* More content */}
                    </section>

                    {/* Optional: Add another ContentAd mid-article */}
                    <ContentAd />

                    {/* Key Takeaways Section (Optional but Recommended) */}
                    <section className={styles.section} style={{ backgroundColor: "#f8fafc", padding: "2rem", borderRadius: "8px", marginTop: "2rem" }}>
                        <h2 className={styles.sectionTitle}>Key Takeaways</h2>
                        <ul className={styles.list}>
                            <li>Takeaway point 1</li>
                            <li>Takeaway point 2</li>
                            <li>Takeaway point 3</li>
                        </ul>
                    </section>

                    {/* Call to Action */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Ready to Create Your Perfect Resume?</h2>
                        <p className={styles.paragraph}>
                            Engaging CTA copy that encourages users to use your service.
                        </p>
                        <div style={{ textAlign: "center", marginTop: "2rem" }}>
                            <Link
                                href="/"
                                style={{
                                    display: "inline-block",
                                    padding: "0.75rem 2rem",
                                    backgroundColor: "#2563eb",
                                    color: "white",
                                    borderRadius: "8px",
                                    textDecoration: "none",
                                    fontWeight: "600",
                                    fontSize: "1.1rem"
                                }}
                            >
                                Generate Your Resume Now
                            </Link>
                        </div>
                    </section>
                </article>
            </main>

            <FooterAd />
        </div>
    )
}
```

### Step 4: Update Blog Listing Page

Open `airesumegen/app/blog/page.tsx` and add your new article to the **Featured Articles** section:

```typescript
<Card className={styles.articleCard}>
  <CardHeader>
    <div className={styles.articleMeta}>
      <span className={styles.category}>Career Advice</span>
      <span className={styles.readTime}>10 min read</span>
    </div>
    <h3>
      <Link href="/blog/your-post-slug" className={styles.articleTitle}>
        Your Article Title
      </Link>
    </h3>
  </CardHeader>
  <CardContent>
    <p className={styles.articleDescription}>
      A brief 1-2 sentence description of the article value.
    </p>
    <div className={styles.articleFooter}>
      <span className={styles.publishDate}>15 January 2025</span>
      <Link href="/blog/your-post-slug" className={styles.readMore}>
        Read More →
      </Link>
    </div>
  </CardContent>
</Card>
```

**Important**: Add the newest article as the **first card** in the grid for chronological ordering.

### Step 5: Update Sitemap

Open `airesumegen/app/sitemap.ts` and add your new blog post URL to the `staticPages` array:

```typescript
const staticPages = [
  "/",
  "/blog",
  "/blog/ats-optimization",
  "/blog/career-advice",
  "/blog/resume-writing-tips",
  "/blog/your-post-slug",  // Add here
  "/free-ai-tools/ai-resume-builder",
  // ... rest of pages
]
```

---

## SEO Considerations

### Title Optimization
- **Length**: 50-60 characters (displays fully in search results)
- **Format**: `Primary Keyword: Secondary Keywords | Brand` or `How to [Action]: [Benefit]`
- **Example**: `"How to Write an Effective Profile Summary: Examples & Guide"`

### Description Optimization
- **Length**: 120-160 characters
- **Include**: Primary keyword, benefit, and call-to-action
- **Example**: `"Learn how to write a compelling profile summary for your resume and LinkedIn with proven examples, templates, and a step-by-step guide that gets results."`

### Keywords
- Include 5-8 relevant keywords
- Mix of:
  - Primary keyword (e.g., "profile summary")
  - Secondary keywords (e.g., "resume summary", "professional summary")
  - Long-tail keywords (e.g., "how to write profile summary")
  - Related terms (e.g., "LinkedIn summary")

### URL Slug Best Practices
- Use lowercase
- Use hyphens (not underscores)
- Keep it short but descriptive (3-5 words)
- Include primary keyword
- **Good**: `profile-summary-guide`
- **Bad**: `how_to_write_an_effective_profile_summary_examples_guide`

---

## Styling Guidelines

### Headings Hierarchy

```typescript
// H1 - Article Title (only one per page)
<h1 className={styles.title}>Your Article Title</h1>

// H2 - Major Section Titles
<h2 className={styles.sectionTitle}>Section Title</h2>

// H3 - Subsections (inline style)
<h3 style={{ fontSize: "1.4rem", marginBottom: "1rem", marginTop: "1.5rem" }}>
  Subsection Title
</h3>
```

### Text Elements

```typescript
// Paragraphs
<p className={styles.paragraph}>Your text content...</p>

// Lists
<ul className={styles.list}>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>

// Emphasis
<strong>Bold text</strong>
<em>Italic text</em>
```

### Special Boxes (Good/Bad Examples)

```typescript
// Bad Example Box (Red)
<div style={{ 
  backgroundColor: "#fff3f3", 
  padding: "1.5rem", 
  borderRadius: "8px", 
  marginBottom: "1.5rem", 
  border: "1px solid #ffc9c9" 
}}>
  <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#c92a2a" }}>
    BAD Example:
  </h3>
  <p style={{ marginBottom: "1rem", fontStyle: "italic" }}>
    "Example text here..."
  </p>
  <p style={{ marginBottom: "0" }}>
    <strong>Why it's bad:</strong> Explanation...
  </p>
</div>

// Good Example Box (Green)
<div style={{ 
  backgroundColor: "#f0fdf4", 
  padding: "1.5rem", 
  borderRadius: "8px", 
  marginBottom: "1.5rem", 
  border: "1px solid #86efac" 
}}>
  <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#15803d" }}>
    GOOD Example:
  </h3>
  <p style={{ marginBottom: "1rem", fontStyle: "italic" }}>
    "Example text here..."
  </p>
  <p style={{ marginBottom: "0" }}>
    <strong>Why it's good:</strong> Explanation...
  </p>
</div>
```

### Content Ad Placement

- **First Ad**: After the introduction/first major section
- **Second Ad** (optional): Mid-article, after 3-4 sections
- **Never**: More than 2 content ads per article

```typescript
<ContentAd />
```

---

## Examples

### Category Options

Use one of these standard categories:
- `"Resume Writing"`
- `"Career Advice"`
- `"ATS Optimization"`
- `"Interview Tips"`
- `"Job Search"`
- `"LinkedIn Optimization"`

### Read Time Calculation

Estimate based on word count:
- **5 min**: 750-1,000 words
- **8 min**: 1,200-1,500 words
- **10 min**: 1,500-2,000 words
- **12 min**: 2,000-2,500 words
- **15 min**: 2,500+ words

### Date Format

Always use: `DD Month YYYY` format in the meta display
- **Correct**: `"15 January 2025"`
- **Incorrect**: `"1/15/25"` or `"Jan 15, 2025"`

For the `datePublished` schema field, use ISO format:
- **Format**: `"YYYY-MM-DD"`
- **Example**: `"2025-01-15"`

---

## Checklist

Use this checklist when adding a new blog post:

- [ ] Created directory: `app/blog/your-post-slug/`
- [ ] Copied `page.module.css` from existing post
- [ ] Created `page.tsx` with proper structure
- [ ] Added SEO metadata (title, description, keywords)
- [ ] Added breadcrumb schema
- [ ] Added article schema with correct date
- [ ] Added proper heading hierarchy (H1, H2, H3)
- [ ] Added at least one `<ContentAd />` component
- [ ] Added Key Takeaways section
- [ ] Added Call-to-Action section with link
- [ ] Updated `app/blog/page.tsx` - Added card to Featured Articles (as first item)
- [ ] Updated `app/sitemap.ts` - Added URL to staticPages array
- [ ] Verified all internal links work
- [ ] Checked for spelling/grammar errors
- [ ] Tested responsive design (mobile-first)
- [ ] Ran diagnostics: `no errors or warnings`

---

## Common Issues

### Issue 1: "Module not found" error

**Cause**: Incorrect import paths

**Solution**: Ensure all imports use the correct path aliases:
```typescript
import { SiteHeader } from "@/src/components/site-header/site-header"
import { SITE } from "@/src/lib/seo/config"
```

### Issue 2: Styling not applied

**Cause**: CSS module not imported or wrong class names

**Solution**: 
1. Verify `page.module.css` exists in the directory
2. Import: `import styles from "./page.module.css"`
3. Use correct class names from existing posts

### Issue 3: Article not showing in blog listing

**Cause**: Forgot to update `app/blog/page.tsx`

**Solution**: Follow Step 4 to add the article card

### Issue 4: 404 error when accessing article

**Cause**: Directory name doesn't match URL slug

**Solution**: Ensure directory name matches the slug used in links

### Issue 5: SEO metadata not appearing

**Cause**: Incorrect metadata structure

**Solution**: Use `buildPageMetadata()` helper function as shown in Step 3

---

## Best Practices

1. **Content Quality**: Aim for 1,500+ words for better SEO
2. **Keyword Density**: Use primary keyword 3-5 times naturally
3. **Internal Links**: Link to at least 2 other blog posts or site pages
4. **External Links**: Link to authoritative sources when citing data
5. **Images**: Add relevant images with alt text (if applicable)
6. **Mobile-First**: Always test on mobile devices
7. **Loading Speed**: Keep images optimized (WebP format preferred)
8. **Accessibility**: Use proper heading hierarchy and alt text
9. **Call-to-Action**: Always include a clear CTA to your service
10. **Update Regularly**: Review and update content every 6-12 months

---

## File Naming Conventions

- **Directories**: `kebab-case` (e.g., `profile-summary-guide`)
- **Files**: `page.tsx`, `page.module.css` (Next.js convention)
- **Components**: PascalCase for function names (e.g., `ProfileSummaryGuidePage`)

---

## Testing

After adding a blog post, test the following:

1. **Direct URL Access**: Navigate to `/blog/your-post-slug`
2. **Blog Listing**: Verify article appears on `/blog`
3. **Responsive Design**: Test on mobile, tablet, desktop
4. **Links**: Click all internal and external links
5. **SEO**: Check page source for proper meta tags
6. **Performance**: Run Lighthouse audit (aim for 90+ score)
7. **Diagnostics**: Run TypeScript/ESLint checks

```bash
# Check for TypeScript errors
npm run build

# Run linting
npm run lint
```

---

## Additional Resources

- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **SEO Best Practices**: See project's `SEO.md` (if available)
- **Component Library**: Check `/src/components/` for reusable components
- **Existing Blog Posts**: Reference `app/blog/resume-writing-tips/` for examples

---

## Need Help?

If you encounter issues not covered in this guide:

1. Check existing blog posts for reference implementations
2. Review Next.js App Router documentation
3. Check the project's `README.md` for setup instructions
4. Verify all dependencies are installed: `npm install`

---

**Last Updated**: January 2025
**Maintainer**: Instant Ai Resume Generator Team
**Version**: 1.0