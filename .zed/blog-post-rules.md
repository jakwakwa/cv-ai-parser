# Zed AI Rules: Blog Post Management

## Context
This Next.js project uses the App Router with file-based routing. Blog posts are located in `app/blog/[slug]/` directories.

## When User Requests: "Add a new blog post" or "Create a blog article"

### Required Information
Before proceeding, gather from the user:
1. Article title
2. Article content (markdown or plain text)
3. Target URL slug (kebab-case)
4. Category (Resume Writing, Career Advice, ATS Optimization, etc.)
5. Estimated read time (calculate from word count: ~200 words/min)

### Step-by-Step Process

#### Step 1: Create Blog Post Directory
```
Directory: app/blog/[slug-name]/
Files needed:
- page.tsx (article page)
- page.module.css (copy from existing post)
```

#### Step 2: Copy CSS Module
Copy `page.module.css` from `app/blog/resume-writing-tips/page.module.css` to new directory.

**Command**: `copy_path`
- Source: `airesumegen/app/blog/resume-writing-tips/page.module.css`
- Destination: `airesumegen/app/blog/[new-slug]/page.module.css`

#### Step 3: Create page.tsx
Must include:
- Proper imports (SiteHeader, Ads, JsonLd, etc.)
- SEO metadata using `buildPageMetadata()`
- Breadcrumb schema
- Article schema with ISO date (YYYY-MM-DD)
- Header with navigation, title, meta info
- Article sections wrapped in `<section className={styles.section}>`
- At least one `<ContentAd />` after first section
- Key Takeaways section (styled with background)
- Call-to-Action section with link to homepage
- FooterAd component

**Date Format**:
- Display: "15 January 2025"
- Schema: "2025-01-15"

#### Step 4: Update Blog Listing Page
File: `app/blog/page.tsx`

Add new article card as **FIRST item** in `articlesGrid`:
```tsx
<Card className={styles.articleCard}>
  <CardHeader>
    <div className={styles.articleMeta}>
      <span className={styles.category}>[Category]</span>
      <span className={styles.readTime}>[X] min read</span>
    </div>
    <h3>
      <Link href="/blog/[slug]" className={styles.articleTitle}>
        [Article Title]
      </Link>
    </h3>
  </CardHeader>
  <CardContent>
    <p className={styles.articleDescription}>
      [1-2 sentence description]
    </p>
    <div className={styles.articleFooter}>
      <span className={styles.publishDate}>[Date]</span>
      <Link href="/blog/[slug]" className={styles.readMore}>
        Read More →
      </Link>
    </div>
  </CardContent>
</Card>
```

#### Step 5: Update Sitemap
File: `app/sitemap.ts`

Add new URL to `staticPages` array:
```typescript
const staticPages = [
  "/",
  "/blog",
  // ... existing blog posts
  "/blog/[new-slug]",  // ADD HERE (keep alphabetical if possible)
  // ... rest
]
```

#### Step 6: Verify
Run diagnostics on all modified files:
- `app/blog/[new-slug]/page.tsx`
- `app/blog/page.tsx`
- `app/sitemap.ts`

### Important Rules

1. **Always use existing styles**: Copy CSS from `resume-writing-tips`, never create new CSS
2. **Component imports**: Use exact paths from existing blog posts
3. **Ad placement**: First ContentAd after introduction, optional second mid-article, FooterAd at end
4. **SEO**: Title 50-60 chars, description 120-160 chars, 5-8 keywords
5. **Newest first**: Always add new article as first card in blog listing
6. **Consistent formatting**: Follow exact structure of existing blog posts
7. **Internal links**: Link to homepage (/) and other relevant blog posts
8. **Call-to-action**: Always include CTA button linking to resume generator

### Good Example Structure
```typescript
<section className={styles.section}>
  <h2 className={styles.sectionTitle}>Main Section</h2>
  <p className={styles.paragraph}>Content...</p>
  
  <h3 style={{ fontSize: "1.4rem", marginBottom: "1rem", marginTop: "1.5rem" }}>
    Subsection
  </h3>
  <p className={styles.paragraph}>More content...</p>
  
  <ul className={styles.list}>
    <li>Point 1</li>
    <li>Point 2</li>
  </ul>
</section>

<ContentAd />

<section className={styles.section}>
  {/* Next section */}
</section>
```

### Good/Bad Example Boxes
Use these for comparisons:

**Bad (Red)**:
```typescript
<div style={{ backgroundColor: "#fff3f3", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid #ffc9c9" }}>
  <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#c92a2a" }}>BAD Example:</h3>
  <p style={{ marginBottom: "1rem", fontStyle: "italic" }}>"Example text"</p>
  <p style={{ marginBottom: "0" }}><strong>Why it's bad:</strong> Explanation</p>
</div>
```

**Good (Green)**:
```typescript
<div style={{ backgroundColor: "#f0fdf4", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid #86efac" }}>
  <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#15803d" }}>GOOD Example:</h3>
  <p style={{ marginBottom: "1rem", fontStyle: "italic" }}>"Example text"</p>
  <p style={{ marginBottom: "0" }}><strong>Why it's good:</strong> Explanation</p>
</div>
```

### Key Takeaways Section Template
```typescript
<section className={styles.section} style={{ backgroundColor: "#f8fafc", padding: "2rem", borderRadius: "8px", marginTop: "2rem" }}>
  <h2 className={styles.sectionTitle}>Key Takeaways</h2>
  <ul className={styles.list}>
    <li>Takeaway 1</li>
    <li>Takeaway 2</li>
    <li>Takeaway 3</li>
  </ul>
</section>
```

### CTA Section Template
```typescript
<section className={styles.section}>
  <h2 className={styles.sectionTitle}>Ready to Create Your Perfect Resume?</h2>
  <p className={styles.paragraph}>
    Engaging call-to-action text here.
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
```

## Common Mistakes to Avoid

1. ❌ Creating new CSS files instead of copying existing
2. ❌ Forgetting to update sitemap.ts
3. ❌ Adding article card at the end instead of beginning of grid
4. ❌ Using wrong date format (use "15 January 2025" for display)
5. ❌ Forgetting ContentAd placement
6. ❌ Not including Key Takeaways section
7. ❌ Missing Call-to-Action at the end
8. ❌ Incorrect import paths (must match existing posts exactly)
9. ❌ Not wrapping sections in `<section className={styles.section}>`
10. ❌ Using inline styles for main content (only for special boxes/CTAs)

## Quick Reference Checklist

When adding blog post, verify:
- [ ] Directory created: `app/blog/[slug]/`
- [ ] CSS copied from existing post
- [ ] page.tsx created with all sections
- [ ] SEO metadata complete (title, description, keywords)
- [ ] Breadcrumbs and article schema added
- [ ] At least one ContentAd placed
- [ ] Key Takeaways section included
- [ ] CTA section with link to homepage
- [ ] Blog listing page updated (new article FIRST)
- [ ] Sitemap updated
- [ ] All diagnostics pass

## Reference Files

For implementation examples, always check:
- `app/blog/profile-summary-guide/page.tsx` (most recent, best example)
- `app/blog/resume-writing-tips/page.tsx` (good structure reference)
- `app/blog/page.tsx` (for blog listing structure)

## Full Developer Guide

For comprehensive instructions, refer to: `BLOG_POST_GUIDE.md` in project root.