# Blog Post Onboarding Checklist

Welcome! This checklist will guide you through creating your first blog post on AIResumeGen.com. Follow each step in order, and you'll have a published article in about an hour.

---

## 🎯 Before You Start

**Time Required**: ~1 hour for your first post (15-20 minutes after that)

**Prerequisites**:
- [ ] Node.js and npm installed
- [ ] Project running locally (`npm run dev`)
- [ ] Basic understanding of React/Next.js
- [ ] Article content ready (or rough draft)

---

## 📚 Step 1: Read the Documentation (15 minutes)

Choose your path:

### Path A: Quick Learner (5 minutes)
- [ ] Read `BLOG_QUICK_REF.md` from top to bottom
- [ ] Skim `BLOG_POST_TEMPLATE.tsx` to see structure
- [ ] You're ready to start!

### Path B: Thorough Learner (15 minutes)
- [ ] Read `BLOG_QUICK_REF.md` (5 min)
- [ ] Read `BLOG_POST_GUIDE.md` sections 1-3 (10 min)
- [ ] Bookmark `BLOG_POST_GUIDE.md` for reference
- [ ] You're ready to start!

### Path C: Visual Learner (15 minutes)
- [ ] Read `BLOG_WORKFLOW.md` diagrams (10 min)
- [ ] Read `BLOG_QUICK_REF.md` (5 min)
- [ ] You're ready to start!

**Pro Tip**: You don't need to memorize everything. These docs are reference materials you'll come back to.

---

## 📝 Step 2: Prepare Your Content (10 minutes)

Gather this information before coding:

- [ ] **Article Title**: _______________________________________________
- [ ] **URL Slug** (kebab-case): _______________________________________
- [ ] **Category**: 
  - [ ] Resume Writing
  - [ ] Career Advice
  - [ ] ATS Optimization
  - [ ] Interview Tips
  - [ ] Job Search
  - [ ] LinkedIn Optimization
- [ ] **Estimated Word Count**: ________ words
- [ ] **Estimated Read Time**: ________ minutes (word count ÷ 200)
- [ ] **Primary Keyword**: ____________________________________________
- [ ] **5 Secondary Keywords**: 
  1. _____________________________________________________________
  2. _____________________________________________________________
  3. _____________________________________________________________
  4. _____________________________________________________________
  5. _____________________________________________________________
- [ ] **SEO Description** (120-160 characters): 
  ```
  _________________________________________________________________
  _________________________________________________________________
  ```
- [ ] **Publication Date**: ______________ (format: 15 January 2025)
- [ ] **Schema Date**: ______________ (format: 2025-01-15)

---

## 🏗️ Step 3: Create Your Blog Post Files (10 minutes)

### 3.1 Create Directory
```bash
cd app/blog
mkdir your-article-slug
```
- [ ] Directory created

### 3.2 Copy CSS File
```bash
cp resume-writing-tips/page.module.css your-article-slug/
```
- [ ] CSS file copied

### 3.3 Copy Template
```bash
cd ../..
cp BLOG_POST_TEMPLATE.tsx app/blog/your-article-slug/page.tsx
```
- [ ] Template copied to new directory

---

## ✏️ Step 4: Customize Your page.tsx (25 minutes)

Open `app/blog/your-article-slug/page.tsx` in your editor.

### 4.1 Update Metadata Section
- [ ] Replace `[YOUR ARTICLE TITLE]` with your title
- [ ] Replace `[Your compelling description]` with your SEO description
- [ ] Replace `[your-url-slug]` with your slug
- [ ] Replace `[primary keyword]` etc. with your keywords

### 4.2 Update Breadcrumbs
- [ ] Replace `[Short Article Name]` with shortened title
- [ ] Replace `[your-url-slug]` with your slug

### 4.3 Update Article Schema
- [ ] Replace title with your title
- [ ] Replace description with your description
- [ ] Replace `[YYYY-MM-DD]` with publication date (e.g., "2025-01-15")
- [ ] Replace tags with relevant tags

### 4.4 Update Component Name
- [ ] Replace `[YourArticleTitle]Page` with PascalCase name (e.g., `ProfileSummaryGuidePage`)

### 4.5 Update Header Section
- [ ] Replace `[Short Article Name]` in navigation
- [ ] Replace `[Your Full Article Title Goes Here]` with full title
- [ ] Replace `[DD Month YYYY]` with date (e.g., "15 January 2025")
- [ ] Replace `[X]` with read time in minutes
- [ ] Replace `[Category]` with your category
- [ ] Replace subtitle placeholder with compelling subtitle

### 4.6 Add Your Content
- [ ] Replace introduction paragraphs with your intro
- [ ] Add main sections (at least 3)
- [ ] Use `<h2 className={styles.sectionTitle}>` for section titles
- [ ] Use `<h3 style={{...}}>` for subsections
- [ ] Use `<p className={styles.paragraph}>` for paragraphs
- [ ] Use `<ul className={styles.list}>` for lists
- [ ] Add at least one Good/Bad example box (optional)
- [ ] Keep first `<ContentAd />` after introduction
- [ ] Update Key Takeaways section with your points (5-7 items)
- [ ] Update Call-to-Action section with relevant copy

**Check Your Work**:
- [ ] All `[placeholder]` text replaced
- [ ] At least 3 main sections with content
- [ ] Introduction is engaging
- [ ] Key Takeaways summarize main points
- [ ] CTA connects article to service

---

## 🔗 Step 5: Update Blog Listing Page (5 minutes)

Open `app/blog/page.tsx`

### 5.1 Find the Featured Articles Section
Look for: `<div className={styles.articlesGrid}>`

### 5.2 Add Your Article Card AS THE FIRST CARD
Copy this template and paste it as the **first** card in the grid:

```typescript
<Card className={styles.articleCard}>
  <CardHeader>
    <div className={styles.articleMeta}>
      <span className={styles.category}>YOUR CATEGORY</span>
      <span className={styles.readTime}>X min read</span>
    </div>
    <h3>
      <Link href="/blog/your-slug" className={styles.articleTitle}>
        Your Article Title
      </Link>
    </h3>
  </CardHeader>
  <CardContent>
    <p className={styles.articleDescription}>
      Brief 1-2 sentence description
    </p>
    <div className={styles.articleFooter}>
      <span className={styles.publishDate}>DD Month YYYY</span>
      <Link href="/blog/your-slug" className={styles.readMore}>
        Read More →
      </Link>
    </div>
  </CardContent>
</Card>
```

- [ ] Card added as **first item** in grid
- [ ] Category filled in
- [ ] Read time filled in
- [ ] URL slug correct in both links
- [ ] Title matches
- [ ] Description is compelling
- [ ] Date formatted correctly

---

## 🗺️ Step 6: Update Sitemap (2 minutes)

Open `app/sitemap.ts`

### 6.1 Find staticPages Array
Look for: `const staticPages = [`

### 6.2 Add Your URL
Add your blog post URL in the blog section:

```typescript
const staticPages = [
  "/",
  "/blog",
  "/blog/ats-optimization",
  "/blog/career-advice",
  "/blog/resume-writing-tips",
  "/blog/your-article-slug",  // <-- ADD YOUR LINE HERE
  "/tools/ai-resume-generator",
  // ...
]
```

- [ ] URL added to staticPages array
- [ ] URL format is `/blog/your-slug` (with leading slash)
- [ ] No trailing slash

---

## ✅ Step 7: Test Your Work (5 minutes)

### 7.1 Run Diagnostics
```bash
npm run build
```

- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] No warnings (or only minor ones)

**If errors occur**: Check `BLOG_POST_GUIDE.md` "Common Issues" section

### 7.2 Test in Browser
```bash
npm run dev
```

Visit in browser:
- [ ] `http://localhost:3000/blog` - Your article appears first
- [ ] `http://localhost:3000/blog/your-slug` - Article loads correctly
- [ ] Navigation breadcrumb works
- [ ] All sections visible
- [ ] Ads appear
- [ ] CTA button links to homepage
- [ ] Mobile view looks good (resize browser)

### 7.3 Check Links
- [ ] Click breadcrumb "Blog" link - returns to listing
- [ ] Click "Generate Your Resume Now" button - goes to homepage
- [ ] All internal links work

---

## 🎉 Step 8: You're Done!

Congratulations! You've created your first blog post!

### Final Checklist
- [ ] All placeholder text replaced
- [ ] Content is well-written and valuable
- [ ] SEO metadata complete
- [ ] Blog listing updated
- [ ] Sitemap updated
- [ ] All tests pass
- [ ] Looks good on mobile

### What's Next?

1. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add blog post: [Your Title]"
   git push
   ```

2. **Deploy** (if using Vercel/similar):
   - Push triggers automatic deployment
   - Wait 2-5 minutes
   - Check production URL

3. **Monitor**:
   - Check Google Search Console (after 24-48 hours)
   - Monitor page views in analytics
   - Read user feedback

---

## 📊 Your Progress Tracker

**Time Spent**:
- Documentation: _____ min
- Content prep: _____ min
- File creation: _____ min
- Customization: _____ min
- Updates: _____ min
- Testing: _____ min
- **Total**: _____ min

**Estimated Next Time**: ~20 minutes (you know the process now!)

---

## 🆘 Stuck? Need Help?

### Common First-Timer Issues

**Issue**: "I don't know what to write"
- **Solution**: Check existing posts for inspiration. Copy their structure.

**Issue**: "Too many placeholder fields"
- **Solution**: Search for `[` in your file. Replace each one systematically.

**Issue**: "Build errors"
- **Solution**: Check `BLOG_POST_GUIDE.md` "Common Issues" section

**Issue**: "Don't understand React/TypeScript"
- **Solution**: Just copy the template exactly and change the text content. You don't need to understand the code deeply for basic posts.

### Reference Documents

- Quick code snippets: `BLOG_QUICK_REF.md`
- Detailed help: `BLOG_POST_GUIDE.md`
- Visual guides: `BLOG_WORKFLOW.md`
- Examples: `app/blog/profile-summary-guide/page.tsx`

---

## 🎓 Tips for Success

### First Post
- Keep it simple
- Follow the template closely
- Don't try to customize too much
- Reference existing posts when unsure

### SEO Tips
- Use your primary keyword in the first paragraph
- Use keywords naturally (don't stuff)
- Keep paragraphs short (2-4 sentences)
- Use lists and formatting for readability
- Add internal links to other blog posts or site pages

### Content Tips
- Write for humans first, SEO second
- Provide real value
- Use examples
- Be specific (numbers, data, names)
- Make it actionable

---

## 🏆 You Did It!

You've successfully created your first blog post! 

**Pat yourself on the back** - you've learned:
- Next.js file-based routing
- React component structure
- SEO optimization basics
- Content management workflow

**Next blog post will be easier!** You now know the system and can do it in 20 minutes.

---

## 📝 Notes & Learnings

Use this space to write down anything you learned or want to remember for next time:

```
_______________________________________________________________________
_______________________________________________________________________
_______________________________________________________________________
_______________________________________________________________________
_______________________________________________________________________
```

---

**Created**: January 2025  
**For**: New blog post contributors  
**Maintainer**: AI Resume Generator Team

**Ready for your next post?** You got this! 🚀