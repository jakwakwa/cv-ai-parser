# Blog Post Quick Reference Card

## Quick Start (5 Steps)

### 1. Create Directory & Copy CSS
```bash
mkdir app/blog/your-slug
cp app/blog/resume-writing-tips/page.module.css app/blog/your-slug/
```

### 2. Create page.tsx Template
```typescript
import { SiteHeader } from "@/src/components/site-header/site-header"
import { HeaderAd, FooterAd, ContentAd } from "@/src/components/adsense/AdBanner"
import Link from "next/link"
import { JsonLd } from "@/src/components/seo/JsonLd"
import { buildBreadcrumbSchema, buildArticleSchema } from "@/src/lib/seo/schemas"
import { buildPageMetadata } from "@/src/lib/seo/metadata"
import { SITE } from "@/src/lib/seo/config"
import styles from "./page.module.css"

export const metadata = buildPageMetadata({
    title: "Your Title (50-60 chars)",
    description: "Your description (120-160 chars with keywords)",
    path: "/blog/your-slug",
    keywords: ["keyword1", "keyword2", "keyword3", "keyword4"],
})

const breadcrumbs = [
    { name: "Home", item: SITE.baseUrl },
    { name: "Blog", item: `${SITE.baseUrl}/blog` },
    { name: "Your Title", item: `${SITE.baseUrl}/blog/your-slug` },
]

const article = {
    title: "Your Title",
    description: "Same as metadata description",
    path: "/blog/your-slug",
    authorName: "AI Resume Generator Team",
    datePublished: "2025-01-15",
    tags: ["tag1", "tag2", "tag3"],
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
                        <Link href="/blog" className={styles.navLink}>Blog</Link>
                        <span className={styles.navSeparator}>›</span>
                        <span className={styles.navCurrent}>Your Title</span>
                    </nav>
                    <h1 className={styles.title}>Your Full Article Title</h1>
                    <div className={styles.meta}>
                        <span>15 January 2025</span> • <span>10 min read</span> • <span>Category</span>
                    </div>
                    <p className={styles.subtitle}>Compelling subtitle here</p>
                </header>
                <article className={styles.article}>
                    <section className={styles.section}>
                        <p className={styles.paragraph}>Content...</p>
                    </section>
                    <ContentAd />
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Section Title</h2>
                        <p className={styles.paragraph}>More content...</p>
                    </section>
                    {/* Key Takeaways */}
                    <section className={styles.section} style={{ backgroundColor: "#f8fafc", padding: "2rem", borderRadius: "8px", marginTop: "2rem" }}>
                        <h2 className={styles.sectionTitle}>Key Takeaways</h2>
                        <ul className={styles.list}>
                            <li>Point 1</li>
                        </ul>
                    </section>
                    {/* CTA */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Ready to Create Your Perfect Resume?</h2>
                        <p className={styles.paragraph}>CTA text here.</p>
                        <div style={{ textAlign: "center", marginTop: "2rem" }}>
                            <Link href="/" style={{ display: "inline-block", padding: "0.75rem 2rem", backgroundColor: "#2563eb", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "1.1rem" }}>
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

### 3. Add to Blog Listing (app/blog/page.tsx)
Add as **FIRST** card in `articlesGrid`:
```typescript
<Card className={styles.articleCard}>
  <CardHeader>
    <div className={styles.articleMeta}>
      <span className={styles.category}>Category Name</span>
      <span className={styles.readTime}>10 min read</span>
    </div>
    <h3>
      <Link href="/blog/your-slug" className={styles.articleTitle}>
        Your Article Title
      </Link>
    </h3>
  </CardHeader>
  <CardContent>
    <p className={styles.articleDescription}>
      Brief description (1-2 sentences)
    </p>
    <div className={styles.articleFooter}>
      <span className={styles.publishDate}>15 January 2025</span>
      <Link href="/blog/your-slug" className={styles.readMore}>
        Read More →
      </Link>
    </div>
  </CardContent>
</Card>
```

### 4. Update Sitemap (app/sitemap.ts)
Add to `staticPages` array:
```typescript
"/blog/your-slug",
```

### 5. Verify
```bash
# Check diagnostics
✓ app/blog/your-slug/page.tsx
✓ app/blog/page.tsx
✓ app/sitemap.ts
```

---

## Common Elements

### H3 Subsection
```typescript
<h3 style={{ fontSize: "1.4rem", marginBottom: "1rem", marginTop: "1.5rem" }}>
  Subsection Title
</h3>
```

### Good Example Box (Green)
```typescript
<div style={{ backgroundColor: "#f0fdf4", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid #86efac" }}>
  <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#15803d" }}>GOOD Example:</h3>
  <p style={{ marginBottom: "1rem", fontStyle: "italic" }}>"Example text"</p>
  <p style={{ marginBottom: "0" }}><strong>Why it's good:</strong> Explanation</p>
</div>
```

### Bad Example Box (Red)
```typescript
<div style={{ backgroundColor: "#fff3f3", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid #ffc9c9" }}>
  <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#c92a2a" }}>BAD Example:</h3>
  <p style={{ marginBottom: "1rem", fontStyle: "italic" }}>"Example text"</p>
  <p style={{ marginBottom: "0" }}><strong>Why it's bad:</strong> Explanation</p>
</div>
```

---

## Categories
- "Resume Writing"
- "Career Advice"
- "ATS Optimization"
- "Interview Tips"
- "Job Search"
- "LinkedIn Optimization"

## Read Time Guide
- 5 min = 750-1,000 words
- 8 min = 1,200-1,500 words
- 10 min = 1,500-2,000 words
- 12 min = 2,000-2,500 words

## Date Formats
- **Display**: "15 January 2025"
- **Schema**: "2025-01-15"

## Checklist
- [ ] Directory created
- [ ] CSS copied
- [ ] page.tsx created
- [ ] Blog listing updated (FIRST card)
- [ ] Sitemap updated
- [ ] Diagnostics pass

---

**Full Guide**: See `BLOG_POST_GUIDE.md`
**Zed Rules**: See `.zed/blog-post-rules.md`
