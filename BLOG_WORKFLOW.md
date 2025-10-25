# Blog Post Workflow Diagram

This document provides visual workflows for creating and managing blog posts in the AIResumeGen project.

## 📋 Table of Contents

1. [Quick Start Workflow](#quick-start-workflow)
2. [Detailed Creation Process](#detailed-creation-process)
3. [File Relationships](#file-relationships)
4. [Decision Tree](#decision-tree)
5. [Documentation Flow](#documentation-flow)

---

## Quick Start Workflow

```mermaid
flowchart TD
    Start([New Blog Post Request]) --> Gather[Gather Requirements]
    Gather --> |Title, Content, Slug| CreateDir[Create Directory<br/>app/blog/your-slug/]
    CreateDir --> CopyCSS[Copy page.module.css<br/>from existing post]
    CopyCSS --> CreatePage[Create page.tsx<br/>from template]
    CreatePage --> UpdateList[Update Blog Listing<br/>app/blog/page.tsx]
    UpdateList --> UpdateSite[Update Sitemap<br/>app/sitemap.ts]
    UpdateSite --> Test[Run Diagnostics]
    Test --> |Pass| Done([✅ Complete])
    Test --> |Fail| Fix[Fix Errors]
    Fix --> Test
    
    style Start fill:#e1f5ff
    style Done fill:#d4edda
    style Test fill:#fff3cd
    style Fix fill:#f8d7da
```

---

## Detailed Creation Process

```mermaid
flowchart LR
    subgraph "1. Prerequisites"
        A1[Article Content]
        A2[SEO Metadata]
        A3[URL Slug]
        A4[Category]
        A5[Read Time]
    end
    
    subgraph "2. File Creation"
        B1[Create Directory]
        B2[Copy CSS]
        B3[Create page.tsx]
        B4[Add Imports]
        B5[Add Metadata]
        B6[Add Content]
    end
    
    subgraph "3. Integration"
        C1[Update Blog Listing]
        C2[Update Sitemap]
        C3[Test Links]
    end
    
    subgraph "4. Verification"
        D1[Run Diagnostics]
        D2[Check SEO]
        D3[Test Mobile]
        D4[Verify Ads]
    end
    
    A1 --> B1
    A2 --> B5
    A3 --> B1
    A4 --> C1
    A5 --> C1
    
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> B5
    B5 --> B6
    
    B6 --> C1
    C1 --> C2
    C2 --> C3
    
    C3 --> D1
    D1 --> D2
    D2 --> D3
    D3 --> D4
    
    style A1 fill:#e3f2fd
    style A2 fill:#e3f2fd
    style A3 fill:#e3f2fd
    style A4 fill:#e3f2fd
    style A5 fill:#e3f2fd
    style D4 fill:#c8e6c9
```

---

## File Relationships

```mermaid
graph TD
    Root[Project Root] --> App[app/]
    App --> Blog[blog/]
    App --> Sitemap[sitemap.ts]
    
    Blog --> Listing[page.tsx<br/>Main Listing]
    Blog --> ListCSS[page.module.css<br/>Listing Styles]
    Blog --> Article1[article-slug-1/]
    Blog --> Article2[article-slug-2/]
    Blog --> ArticleN[your-new-article/]
    
    Article1 --> A1Page[page.tsx]
    Article1 --> A1CSS[page.module.css]
    
    Article2 --> A2Page[page.tsx]
    Article2 --> A2CSS[page.module.css]
    
    ArticleN --> ANPage[page.tsx<br/>⚠️ Must Create]
    ArticleN --> ANCSS[page.module.css<br/>⚠️ Copy from existing]
    
    Root --> Docs[Documentation/]
    Docs --> Guide[BLOG_POST_GUIDE.md]
    Docs --> Quick[BLOG_QUICK_REF.md]
    Docs --> Template[BLOG_POST_TEMPLATE.tsx.example]
    Docs --> Workflow[BLOG_WORKFLOW.md]
    
    Root --> Zed[.zed/]
    Zed --> Rules[blog-post-rules.md]
    Zed --> ZedRead[README.md]
    
    Listing -.->|Links to| ANPage
    Sitemap -.->|Indexes| ANPage
    
    style ArticleN fill:#fff3cd
    style ANPage fill:#f8d7da
    style ANCSS fill:#f8d7da
    style Listing fill:#d4edda
    style Sitemap fill:#d4edda
```

---

## Decision Tree

```mermaid
flowchart TD
    Start{Need to add<br/>blog post?}
    Start -->|Yes| Q1{Are you an<br/>AI Assistant?}
    Start -->|No| End([Done])
    
    Q1 -->|Yes| AI1[Read:<br/>.zed/blog-post-rules.md]
    Q1 -->|No| Human1[Read:<br/>BLOG_QUICK_REF.md]
    
    AI1 --> AI2[Use:<br/>BLOG_POST_TEMPLATE.tsx.example]
    Human1 --> Human2[Copy:<br/>BLOG_POST_TEMPLATE.tsx.example]
    
    AI2 --> Q2{Need detailed<br/>information?}
    Human2 --> Q2
    
    Q2 -->|Yes| Detail[Consult:<br/>BLOG_POST_GUIDE.md]
    Q2 -->|No| Create[Create Blog Post]
    
    Detail --> Create
    
    Create --> Q3{Encountered<br/>issues?}
    
    Q3 -->|Yes| Trouble[Check:<br/>BLOG_POST_GUIDE.md<br/>Common Issues]
    Q3 -->|No| Verify[Run Verification]
    
    Trouble --> Verify
    
    Verify --> Q4{All checks<br/>pass?}
    
    Q4 -->|Yes| Success([✅ Success])
    Q4 -->|No| Debug[Debug Errors]
    
    Debug --> Q5{Can fix?}
    
    Q5 -->|Yes| Create
    Q5 -->|No| Help[Consult<br/>Documentation]
    
    Help --> Trouble
    
    style Start fill:#e1f5ff
    style Success fill:#d4edda
    style Q1 fill:#fff3cd
    style Q2 fill:#fff3cd
    style Q3 fill:#fff3cd
    style Q4 fill:#fff3cd
    style Q5 fill:#fff3cd
```

---

## Documentation Flow

```mermaid
flowchart LR
    subgraph "For AI Assistants"
        AI1[blog-post-rules.md<br/>START HERE]
        AI2[BLOG_POST_TEMPLATE.tsx.example<br/>Structure Reference]
        AI3[BLOG_QUICK_REF.md<br/>Code Snippets]
        AI4[BLOG_POST_GUIDE.md<br/>Deep Dive]
    end
    
    subgraph "For Human Developers"
        H1[BLOG_QUICK_REF.md<br/>START HERE]
        H2[BLOG_POST_TEMPLATE.tsx.example<br/>Copy & Customize]
        H3[BLOG_POST_GUIDE.md<br/>Reference Manual]
        H4[BLOG_WORKFLOW.md<br/>Visual Guide]
    end
    
    subgraph "Reference Examples"
        E1[app/blog/profile-summary-guide/<br/>Latest Example]
        E2[app/blog/resume-writing-tips/<br/>Structure Reference]
    end
    
    AI1 --> AI2
    AI2 --> AI3
    AI3 --> AI4
    AI1 -.->|If needed| AI4
    
    H1 --> H2
    H2 --> H3
    H1 -.->|Visual learner| H4
    
    AI4 -.->|Check| E1
    H3 -.->|Check| E1
    E1 --> E2
    
    style AI1 fill:#e3f2fd
    style H1 fill:#fff9c4
    style E1 fill:#c8e6c9
```

---

## Component Structure

```mermaid
flowchart TD
    Page[page.tsx Component]
    
    Page --> Meta[Metadata Section]
    Page --> Bread[Breadcrumbs]
    Page --> Schema[Article Schema]
    Page --> Component[React Component]
    
    Meta --> MetaTitle[Title 50-60 chars]
    Meta --> MetaDesc[Description 120-160 chars]
    Meta --> MetaKey[Keywords 5-8 terms]
    Meta --> MetaPath[URL Path]
    
    Component --> Wrapper[PageWrapper]
    
    Wrapper --> JsonLd1[JsonLd - Breadcrumb]
    Wrapper --> JsonLd2[JsonLd - Article]
    Wrapper --> Header[SiteHeader]
    Wrapper --> HAd[HeaderAd]
    Wrapper --> Main[Main Content]
    Wrapper --> FAd[FooterAd]
    
    Main --> ArtHeader[Article Header]
    Main --> Article[Article Body]
    
    ArtHeader --> Nav[Navigation]
    ArtHeader --> Title[H1 Title]
    ArtHeader --> MetaInfo[Meta Info]
    ArtHeader --> Subtitle[Subtitle]
    
    Article --> Intro[Introduction Section]
    Article --> CAd1[ContentAd]
    Article --> Sections[Main Sections]
    Article --> CAd2[ContentAd - Optional]
    Article --> Takeaways[Key Takeaways]
    Article --> CTA[Call-to-Action]
    
    Sections --> S1[Section 1]
    Sections --> S2[Section 2]
    Sections --> S3[Section 3+]
    
    S1 --> H2[H2 Title]
    S1 --> Para[Paragraphs]
    S1 --> Sub[H3 Subsections]
    S1 --> Lists[Lists]
    S1 --> Examples[Good/Bad Examples]
    
    style Page fill:#e1f5ff
    style Main fill:#fff9c4
    style Article fill:#e8f5e9
    style Meta fill:#fce4ec
```

---

## Update Checklist Flow

```mermaid
flowchart TD
    Start([Start Blog Post]) --> Step1{Create Directory?}
    Step1 -->|✅ Yes| Step2{Copy CSS?}
    Step1 -->|❌ No| Fix1[Create app/blog/slug/]
    Fix1 --> Step2
    
    Step2 -->|✅ Yes| Step3{Create page.tsx?}
    Step2 -->|❌ No| Fix2[Copy from existing post]
    Fix2 --> Step3
    
    Step3 -->|✅ Yes| Step4{SEO Metadata?}
    Step3 -->|❌ No| Fix3[Use template structure]
    Fix3 --> Step4
    
    Step4 -->|✅ Yes| Step5{Breadcrumbs?}
    Step4 -->|❌ No| Fix4[Add buildPageMetadata]
    Fix4 --> Step5
    
    Step5 -->|✅ Yes| Step6{Article Schema?}
    Step5 -->|❌ No| Fix5[Add breadcrumbs array]
    Fix5 --> Step6
    
    Step6 -->|✅ Yes| Step7{Content Sections?}
    Step6 -->|❌ No| Fix6[Add article object]
    Fix6 --> Step7
    
    Step7 -->|✅ Yes| Step8{ContentAd placed?}
    Step7 -->|❌ No| Fix7[Add sections with styles]
    Fix7 --> Step8
    
    Step8 -->|✅ Yes| Step9{Key Takeaways?}
    Step8 -->|❌ No| Fix8[Add after intro]
    Fix8 --> Step9
    
    Step9 -->|✅ Yes| Step10{CTA Section?}
    Step9 -->|❌ No| Fix9[Add styled section]
    Fix9 --> Step10
    
    Step10 -->|✅ Yes| Step11{Updated Listing?}
    Step10 -->|❌ No| Fix10[Add CTA with link]
    Fix10 --> Step11
    
    Step11 -->|✅ Yes| Step12{Updated Sitemap?}
    Step11 -->|❌ No| Fix11[Add card to blog/page.tsx]
    Fix11 --> Step12
    
    Step12 -->|✅ Yes| Step13{Diagnostics Pass?}
    Step12 -->|❌ No| Fix12[Add URL to sitemap.ts]
    Fix12 --> Step13
    
    Step13 -->|✅ Yes| Complete([✅ Complete!])
    Step13 -->|❌ No| Debug[Fix Errors]
    Debug --> Step13
    
    style Complete fill:#d4edda
    style Start fill:#e1f5ff
    style Debug fill:#f8d7da
```

---

## Ad Placement Strategy

```mermaid
flowchart TD
    Article[Article Start]
    
    Article --> Header[Header Section<br/>Navigation, Title, Meta]
    Header --> Intro[Introduction<br/>2-3 paragraphs]
    
    Intro --> Ad1[📱 ContentAd #1<br/>REQUIRED]
    
    Ad1 --> Section1[Main Content<br/>Sections 1-2]
    
    Section1 --> Decision{Article > 2000 words?}
    
    Decision -->|Yes| Ad2[📱 ContentAd #2<br/>OPTIONAL]
    Decision -->|No| Skip[Continue Content]
    
    Ad2 --> Section2[More Sections]
    Skip --> Section2
    
    Section2 --> Takeaways[Key Takeaways Section<br/>Styled Background]
    
    Takeaways --> CTA[Call-to-Action Section<br/>With Button]
    
    CTA --> Footer[📱 FooterAd<br/>REQUIRED]
    
    Footer --> End([Article End])
    
    style Ad1 fill:#fff9c4
    style Ad2 fill:#fff9c4
    style Footer fill:#fff9c4
    style Intro fill:#e3f2fd
    style Takeaways fill:#e8f5e9
    style CTA fill:#fce4ec
```

---

## File Naming Convention

```
app/blog/
├── [article-slug]/              ← kebab-case (required)
│   ├── page.tsx                 ← exact name (required)
│   └── page.module.css          ← exact name (required)
│
└── example-article-title/       ✅ GOOD: lowercase, hyphens
    ├── page.tsx
    └── page.module.css

❌ BAD Examples:
└── Example_Article/             ← Uppercase, underscores
└── exampleArticle/              ← camelCase
└── example article/             ← spaces
└── example.article/             ← dots
```

---

## Quick Command Reference

```bash
# 1. Create new blog post directory
mkdir app/blog/your-article-slug

# 2. Copy CSS from existing post
cp app/blog/resume-writing-tips/page.module.css \
   app/blog/your-article-slug/page.module.css

# 3. Copy and customize template
cp BLOG_POST_TEMPLATE.tsx.example \
   app/blog/your-article-slug/page.tsx

# 4. Edit the three main files
# - app/blog/your-article-slug/page.tsx (your content)
# - app/blog/page.tsx (add card)
# - app/sitemap.ts (add URL)

# 5. Check for errors
npm run build

# 6. Run linting
npm run lint
```

---

## SEO Optimization Flow

```mermaid
flowchart LR
    Research[Keyword Research] --> Title[Craft Title<br/>50-60 chars]
    Title --> Desc[Write Description<br/>120-160 chars]
    Desc --> Keywords[Select Keywords<br/>5-8 terms]
    Keywords --> Slug[Create URL Slug<br/>3-5 words]
    Slug --> Content[Write Content<br/>Use keywords naturally]
    Content --> Internal[Add Internal Links<br/>2-3 minimum]
    Internal --> Meta[Add Metadata<br/>buildPageMetadata]
    Meta --> Schema[Add Schemas<br/>Breadcrumb + Article]
    Schema --> Test[Test SEO<br/>Lighthouse Audit]
    
    style Research fill:#e3f2fd
    style Test fill:#c8e6c9
```

---

## Priority Levels

### 🔴 Critical (Must Have)
- Directory structure correct
- page.tsx with all imports
- SEO metadata complete
- Blog listing updated
- Sitemap updated
- At least one ContentAd
- FooterAd present
- CTA section with link

### 🟡 Important (Should Have)
- Key Takeaways section
- Multiple content sections
- Good/Bad example boxes
- Internal links to other pages
- Proper heading hierarchy
- Mobile-responsive testing

### 🟢 Nice to Have
- Second ContentAd (for long articles)
- Multiple code examples
- Data visualization
- External authoritative links
- Social media metadata
- Custom images with alt text

---

## Common Patterns Reference

### Section Pattern
```
<section className={styles.section}>
  <h2 className={styles.sectionTitle}>Title</h2>
  <p className={styles.paragraph}>Content</p>
</section>
```

### Subsection Pattern
```
<h3 style={{ fontSize: "1.4rem", marginBottom: "1rem", marginTop: "1.5rem" }}>
  Subsection
</h3>
```

### List Pattern
```
<ul className={styles.list}>
  <li>Item</li>
</ul>
```

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Maintainer**: AI Resume Generator Team