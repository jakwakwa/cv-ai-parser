import { SiteHeader } from "@/src/components/site-header/site-header"
import { HeaderAd, FooterAd, ContentAd } from "@/src/components/adsense/AdBanner"
import Link from "next/link"
import { JsonLd } from "@/src/components/seo/JsonLd"
import { buildBreadcrumbSchema, buildArticleSchema } from "@/src/lib/seo/schemas"
import { buildPageMetadata } from "@/src/lib/seo/metadata"
import { SITE } from "@/src/lib/seo/config"
import styles from "./page.module.css"

// ============================================================================
// SEO METADATA - Update these values
// ============================================================================
export const metadata = buildPageMetadata({
    title: "[YOUR ARTICLE TITLE - 50-60 characters max]",
    description:
        "[Your compelling description with primary keywords - 120-160 characters]",
    path: "/blog/[your-url-slug]",
    keywords: [
        "[primary keyword]",
        "[secondary keyword]",
        "[long-tail keyword]",
        "[related term 1]",
        "[related term 2]",
    ],
})

// ============================================================================
// BREADCRUMB NAVIGATION
// ============================================================================
const breadcrumbs = [
    { name: "Home", item: SITE.baseUrl },
    { name: "Blog", item: `${SITE.baseUrl}/blog` },
    { name: "[Short Article Name]", item: `${SITE.baseUrl}/blog/[your-url-slug]` },
]

// ============================================================================
// ARTICLE SCHEMA (for SEO)
// ============================================================================
const article = {
    title: "[YOUR ARTICLE TITLE - Same as metadata]",
    description:
        "[Same description as metadata]",
    path: "/blog/[your-url-slug]",
    authorName: "AI Resume Generator Team",
    datePublished: "[YYYY-MM-DD]", // Example: "2025-01-15"
    tags: ["[tag1]", "[tag2]", "[tag3]"],
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function [YourArticleTitle]Page() {
    return (
        <div className={styles.pageWrapper}>
            <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />
            <JsonLd data={buildArticleSchema(article)} />
            <SiteHeader />
            <HeaderAd />

            <main className={styles.content}>
                {/* ======================================================== */}
                {/* ARTICLE HEADER                                          */}
                {/* ======================================================== */}
                <header className={styles.header}>
                    <nav className={styles.nav}>
                        <Link href="/blog" className={styles.navLink}>
                            Blog
                        </Link>
                        <span className={styles.navSeparator}>›</span>
                        <span className={styles.navCurrent}>[Short Article Name]</span>
                    </nav>
                    <h1 className={styles.title}>[Your Full Article Title Goes Here]</h1>
                    <div className={styles.meta}>
                        <span>[DD Month YYYY]</span> • <span>[X] min read</span> • <span>[Category]</span>
                    </div>
                    <p className={styles.subtitle}>
                        [A compelling subtitle that expands on your title and hooks the reader. Make it 1-2 sentences.]
                    </p>
                </header>

                <article className={styles.article}>
                    {/* ======================================================== */}
                    {/* INTRODUCTION SECTION                                    */}
                    {/* ======================================================== */}
                    <section className={styles.section}>
                        <p className={styles.paragraph}>
                            [Your engaging introduction that hooks the reader. Explain the problem or topic you're addressing.]
                        </p>

                        <p className={styles.paragraph}>
                            [Expand on the importance of the topic. Why should readers care?]
                        </p>

                        <p className={styles.paragraph}>
                            [Preview what they'll learn in this article. Set expectations.]
                        </p>
                    </section>

                    {/* ======================================================== */}
                    {/* FIRST CONTENT AD - Always after introduction           */}
                    {/* ======================================================== */}
                    <ContentAd />

                    {/* ======================================================== */}
                    {/* MAIN CONTENT SECTION 1                                  */}
                    {/* ======================================================== */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>[Main Section Title]</h2>
                        <p className={styles.paragraph}>
                            [Your section content here. Provide valuable information, tips, or explanations.]
                        </p>

                        <p className={styles.paragraph}>
                            [Continue with more detailed information. Use multiple paragraphs for readability.]
                        </p>

                        {/* Subsection Example */}
                        <h3 style={{ fontSize: "1.4rem", marginBottom: "1rem", marginTop: "1.5rem" }}>
                            [Subsection Title]
                        </h3>
                        <p className={styles.paragraph}>
                            [Subsection content. Break down complex topics into digestible parts.]
                        </p>

                        {/* List Example */}
                        <ul className={styles.list}>
                            <li>[List item with helpful information or example]</li>
                            <li>[Another important point or tip]</li>
                            <li>[Additional relevant information]</li>
                        </ul>
                    </section>

                    {/* ======================================================== */}
                    {/* MAIN CONTENT SECTION 2                                  */}
                    {/* ======================================================== */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>[Second Main Section Title]</h2>
                        <p className={styles.paragraph}>
                            [Continue building on your topic. Provide examples, data, or step-by-step instructions.]
                        </p>

                        {/* GOOD EXAMPLE BOX (Green) */}
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
                                "[Your example text that demonstrates the right way to do something]"
                            </p>
                            <p style={{ marginBottom: "0" }}>
                                <strong>Why it's good:</strong> [Explain what makes this example effective, specific, or correct.]
                            </p>
                        </div>

                        {/* BAD EXAMPLE BOX (Red) */}
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
                                "[Your example text that demonstrates what NOT to do]"
                            </p>
                            <p style={{ marginBottom: "0" }}>
                                <strong>Why it's bad:</strong> [Explain the problems with this approach and why it should be avoided.]
                            </p>
                        </div>
                    </section>

                    {/* ======================================================== */}
                    {/* OPTIONAL: SECOND CONTENT AD (for longer articles)      */}
                    {/* Only use if article is 2000+ words                      */}
                    {/* ======================================================== */}
                    {/* <ContentAd /> */}

                    {/* ======================================================== */}
                    {/* MAIN CONTENT SECTION 3                                  */}
                    {/* ======================================================== */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>[Third Main Section Title]</h2>
                        <p className={styles.paragraph}>
                            [Additional valuable content. This could be advanced tips, common mistakes, or best practices.]
                        </p>

                        <h3 style={{ fontSize: "1.4rem", marginBottom: "1rem", marginTop: "1.5rem" }}>
                            [Subsection Title]
                        </h3>
                        <p className={styles.paragraph}>
                            [Subsection content with practical advice or detailed explanations.]
                        </p>

                        <h3 style={{ fontSize: "1.4rem", marginBottom: "1rem", marginTop: "1.5rem" }}>
                            [Another Subsection Title]
                        </h3>
                        <p className={styles.paragraph}>
                            [More detailed information. Consider using real-world examples or case studies.]
                        </p>
                    </section>

                    {/* ======================================================== */}
                    {/* KEY TAKEAWAYS SECTION - Highly Recommended              */}
                    {/* ======================================================== */}
                    <section className={styles.section} style={{
                        backgroundColor: "#f8fafc",
                        padding: "2rem",
                        borderRadius: "8px",
                        marginTop: "2rem"
                    }}>
                        <h2 className={styles.sectionTitle}>Key Takeaways</h2>
                        <ul className={styles.list}>
                            <li>[Main point or lesson from the article]</li>
                            <li>[Important tip or best practice to remember]</li>
                            <li>[Key insight that provides value]</li>
                            <li>[Actionable advice readers can implement]</li>
                            <li>[Final important takeaway]</li>
                        </ul>
                    </section>

                    {/* ======================================================== */}
                    {/* CALL TO ACTION SECTION - Required                       */}
                    {/* ======================================================== */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Ready to Create Your Perfect Resume?</h2>
                        <p className={styles.paragraph}>
                            [Engaging call-to-action text that connects the article content to your service.
                            Encourage readers to take action and use your AI resume generator.]
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

            {/* ======================================================== */}
            {/* FOOTER AD - Required                                    */}
            {/* ======================================================== */}
            <FooterAd />
        </div>
    )
}

// ============================================================================
// HELPFUL REMINDERS:
// ============================================================================
//
// 1. Categories: "Resume Writing", "Career Advice", "ATS Optimization",
//    "Interview Tips", "Job Search", "LinkedIn Optimization"
//
// 2. Read Time Guide:
//    - 5 min = 750-1,000 words
//    - 8 min = 1,200-1,500 words
//    - 10 min = 1,500-2,000 words
//    - 12 min = 2,000-2,500 words
//
// 3. Date Formats:
//    - Display: "15 January 2025"
//    - Schema: "2025-01-15"
//
// 4. After creating this file:
//    - Update app/blog/page.tsx (add card as FIRST item)
//    - Update app/sitemap.ts (add URL to staticPages)
//    - Run diagnostics to verify no errors
//
// 5. SEO Best Practices:
//    - Title: 50-60 characters
//    - Description: 120-160 characters
//    - Keywords: 5-8 relevant terms
//    - Use primary keyword in first paragraph
//    - Link to at least 2 internal pages
//
// ============================================================================
