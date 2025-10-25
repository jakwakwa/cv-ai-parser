# Blog Post Documentation System

This directory contains AI assistant rules and comprehensive documentation for managing blog content on the AIResumeGen website.

## 📚 Available Documentation

### 1. **blog-post-rules.md** (This Directory)
**Purpose**: AI assistant rules for automated blog post creation  
**Use When**: An AI assistant needs to add a new blog post to the website  
**Format**: Structured rules and templates for LLMs

Contains:
- Step-by-step process for blog creation
- Required information checklist
- Component templates and code snippets
- Common mistakes to avoid
- Quick reference patterns

### 2. **../BLOG_POST_GUIDE.md** (Project Root)
**Purpose**: Complete developer guide for human developers  
**Use When**: Manual blog post creation or troubleshooting  
**Format**: Comprehensive markdown documentation

Contains:
- Full project structure explanation
- Detailed SEO considerations
- Styling guidelines and best practices
- Code examples and templates
- Common issues and solutions
- Testing procedures

### 3. **../BLOG_QUICK_REF.md** (Project Root)
**Purpose**: Quick reference card for rapid implementation  
**Use When**: Need quick code snippets or reminders  
**Format**: Condensed cheat sheet

Contains:
- 5-step quick start
- Code templates ready to copy
- Common patterns and elements
- Checklist for verification

### 4. **../BLOG_POST_TEMPLATE.tsx.example** (Project Root)
**Purpose**: Complete TypeScript template file  
**Use When**: Starting a new blog post from scratch  
**Format**: Fully commented React/Next.js component

Contains:
- Complete page.tsx structure
- All necessary imports
- Placeholder sections with instructions
- Inline comments and reminders
- SEO metadata template

## 🎯 How to Use This System

### For AI Assistants (LLMs)
1. **Read**: `blog-post-rules.md` (this directory) first
2. **Reference**: `BLOG_POST_TEMPLATE.tsx.example` for structure
3. **Check**: `BLOG_QUICK_REF.md` for specific patterns
4. **Consult**: `BLOG_POST_GUIDE.md` if issues arise

### For Human Developers
1. **Start**: `BLOG_QUICK_REF.md` for overview
2. **Copy**: `BLOG_POST_TEMPLATE.tsx.example` as starting point
3. **Reference**: `BLOG_POST_GUIDE.md` for details
4. **Follow**: Checklist to ensure completeness

## 🏗️ Blog System Architecture

```
app/blog/
├── page.tsx                    # Main blog listing page
├── page.module.css             # Blog listing styles
├── [article-slug]/             # Individual blog post
│   ├── page.tsx                # Article content & SEO
│   └── page.module.css         # Article styles (copied)
└── [another-article]/
    ├── page.tsx
    └── page.module.css

app/sitemap.ts                  # Must be updated for each new post
```

## ✅ Quick Checklist

Every new blog post requires:
- [ ] Directory created: `app/blog/[slug]/`
- [ ] CSS copied from existing post
- [ ] `page.tsx` created with full structure
- [ ] SEO metadata complete
- [ ] Blog listing page updated (new post FIRST)
- [ ] Sitemap updated
- [ ] All diagnostics pass

## 🔑 Key Principles

1. **Consistency**: Always copy CSS from existing posts
2. **SEO First**: Proper metadata on every post
3. **Newest First**: New articles appear first on listing page
4. **Mobile-First**: Responsive design is critical
5. **Call-to-Action**: Every post links to main service
6. **Ad Placement**: ContentAd after intro, FooterAd at end
7. **Structure**: Follow exact component structure from template

## 📊 Standard Blog Post Components

### Required Components (In Order)
1. Imports (SiteHeader, Ads, JsonLd, etc.)
2. SEO Metadata (buildPageMetadata)
3. Breadcrumbs array
4. Article schema object
5. Page component with:
   - JsonLd schemas
   - SiteHeader
   - HeaderAd
   - Main content wrapper
   - Header (nav, title, meta, subtitle)
   - Article sections
   - ContentAd (after intro)
   - Key Takeaways section
   - Call-to-Action section
   - FooterAd

## 🎨 Standard Categories

- Resume Writing
- Career Advice
- ATS Optimization
- Interview Tips
- Job Search
- LinkedIn Optimization

## 📝 SEO Guidelines

- **Title**: 50-60 characters
- **Description**: 120-160 characters
- **Keywords**: 5-8 relevant terms
- **URL Slug**: 3-5 words, kebab-case
- **Date Display**: "15 January 2025"
- **Date Schema**: "2025-01-15"

## 🔗 Related Files

- Main README: `../README.md`
- Blog Listing: `../app/blog/page.tsx`
- Sitemap: `../app/sitemap.ts`
- Example Posts: `../app/blog/profile-summary-guide/`

## 🆘 Need Help?

1. **For Implementation**: See `BLOG_POST_GUIDE.md` Common Issues section
2. **For Templates**: Copy from `BLOG_POST_TEMPLATE.tsx.example`
3. **For Quick Reference**: Use `BLOG_QUICK_REF.md`
4. **For Examples**: Check `app/blog/profile-summary-guide/page.tsx`

## 📅 Version Info

- **Created**: January 2025
- **Last Updated**: January 2025
- **Maintainer**: AI Resume Generator Team
- **System Version**: 1.0

---

**Note**: This documentation system ensures consistency across all blog posts and enables both human developers and AI assistants to efficiently create high-quality, SEO-optimized content.