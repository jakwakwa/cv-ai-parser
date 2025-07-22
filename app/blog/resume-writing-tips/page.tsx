import { SiteHeader } from '@/src/components/site-header/site-header';
import { HeaderAd, FooterAd, ContentAd } from '@/src/components/adsense/AdBanner';
import Link from 'next/link';
import styles from './page.module.css';

export default function ResumeWritingTipsPage() {
  return (
    <div className={styles.pageWrapper}>
      <SiteHeader />
      <HeaderAd />
      
      <main className={styles.content}>
        <header className={styles.header}>
          <nav className={styles.nav}>
            <Link href="/blog" className={styles.navLink}>Blog</Link>
            <span className={styles.navSeparator}>›</span>
            <span className={styles.navCurrent}>Resume Writing Tips</span>
          </nav>
          <h1 className={styles.title}>
            Essential Resume Writing Tips for 2024: A Comprehensive Guide
          </h1>
          <div className={styles.meta}>
            <span>December 2024</span> • <span>8 min read</span> • <span>Resume Writing</span>
          </div>
          <p className={styles.subtitle}>
            Master the art of resume writing with these proven strategies that help you stand out in today's competitive job market and increase your interview chances.
          </p>
        </header>

        <article className={styles.article}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Introduction: The Modern Resume Landscape</h2>
            <p className={styles.paragraph}>
              In 2024, the resume writing landscape has evolved significantly from traditional formats and expectations. With the widespread adoption of Applicant Tracking Systems (ATS), remote work considerations, and changing hiring practices, creating an effective resume requires understanding both technological requirements and human psychology. This comprehensive guide provides you with the essential strategies needed to craft a resume that not only passes automated screening but also captures the attention of hiring managers.
            </p>
            
            <p className={styles.paragraph}>
              Today's successful resume must serve multiple purposes: it needs to be ATS-friendly for automated processing, visually appealing for human reviewers, keyword-optimized for searchability, and compelling enough to differentiate you from hundreds of other candidates. The key is balancing these sometimes competing requirements while maintaining authenticity and professional presentation.
            </p>
          </section>

          <ContentAd />

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Foundation Elements: Building Your Resume Structure</h2>
            
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>1. Professional Header and Contact Information</h3>
            <p>
              Your resume header is the first element recruiters see, making it crucial for establishing professional credibility. Include your full name in a larger font size, followed by your professional title or target role. Your contact information should include a professional email address, phone number, LinkedIn profile URL, and city/state (full address is no longer necessary for privacy reasons).
            </p>

            <p>
              Avoid common header mistakes such as unprofessional email addresses, outdated personal websites, or including unnecessary personal information like age, marital status, or hobbies in the header. Your LinkedIn URL should be customized rather than using the default number sequence, and ensure it matches your resume content exactly.
            </p>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>2. Professional Summary: Your Elevator Pitch</h3>
            <p>
              The professional summary replaces the outdated "objective" section and serves as your elevator pitch. This 3-4 sentence paragraph should highlight your most significant qualifications, years of experience, key skills, and notable achievements. Tailor this section for each application to match the specific role requirements.
            </p>

            <p>
              An effective professional summary includes quantifiable achievements, relevant keywords from the job posting, and a clear value proposition. For example: "Results-driven marketing professional with 8+ years of experience developing integrated campaigns that increased brand awareness by 40% and generated $2M+ in revenue. Expertise in digital marketing, content strategy, and team leadership with proven success in B2B and B2C environments."
            </p>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>3. Strategic Skills Section</h3>
            <p>
              Your skills section should be strategically organized to highlight the most relevant competencies for your target role. Separate technical skills from soft skills, and consider creating subcategories such as "Programming Languages," "Software Proficiency," and "Certifications." Include specific versions, proficiency levels, and years of experience where relevant.
            </p>

            <p>
              Prioritize skills that appear in the job description, but avoid listing every skill you've ever encountered. Focus on 15-20 highly relevant skills rather than an exhaustive list that dilutes your key competencies. For technical roles, include specific technologies, frameworks, and tools. For leadership positions, emphasize management, strategic planning, and team development skills.
            </p>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Content Optimization: Making Every Word Count</h2>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Achievement-Focused Experience Descriptions</h3>
            <p>
              Transform your job descriptions from duty lists into achievement showcases. Each bullet point should follow the STAR method (Situation, Task, Action, Result) or CAR method (Challenge, Action, Result). Begin with strong action verbs like "implemented," "optimized," "developed," or "spearheaded" rather than passive language.
            </p>

            <p>
              Quantify your achievements whenever possible. Instead of "Managed social media accounts," write "Managed 5 social media accounts with 50K+ combined followers, increasing engagement by 35% and driving 20% more website traffic within 6 months." Numbers provide concrete evidence of your impact and help hiring managers visualize your potential contributions.
            </p>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Keyword Integration and ATS Optimization</h3>
            <p>
              Modern resume success requires understanding how ATS systems process your document. These systems scan for specific keywords, phrases, and formatting elements before ranking applications. Research shows that 75% of resumes are filtered out by ATS before human review, making optimization crucial for visibility.
            </p>

            <p>
              Identify keywords by analyzing job descriptions, industry publications, and competitor profiles. Integrate these naturally throughout your resume, particularly in your professional summary, skills section, and experience descriptions. However, avoid keyword stuffing, which can make your resume read unnaturally and potentially trigger ATS penalties.
            </p>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Industry-Specific Customization</h3>
            <p>
              Different industries have varying expectations for resume content, format, and emphasis. Technology roles should highlight technical skills, programming languages, and project outcomes. Healthcare positions require emphasis on certifications, clinical experience, and patient care outcomes. Finance roles should focus on analytical skills, regulatory knowledge, and quantified business results.
            </p>

            <p>
              Research industry norms for your target field. Creative industries may accept more visual elements and design creativity, while traditional corporate environments prefer conservative formatting. Academic positions typically require detailed publication lists and research experience, while sales roles should emphasize quota achievements and revenue generation.
            </p>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Advanced Formatting and Design Strategies</h2>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Visual Hierarchy and Readability</h3>
            <p>
              Effective resume design guides the reader's eye through your content logically and efficiently. Use consistent formatting for section headers, job titles, and dates. Implement strategic white space to prevent overcrowding and improve readability. Choose professional fonts like Arial, Calibri, or Times New Roman in 10-12 point size for body text and slightly larger for headers.
            </p>

            <p>
              Create visual hierarchy through font weights, sizes, and spacing rather than excessive colors or graphics. Bold job titles and company names for quick scanning, use consistent bullet point styles, and maintain uniform margins throughout the document. Your resume should be scannable in 6-7 seconds while providing detailed information for thorough review.
            </p>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Length and Content Organization</h3>
            <p>
              Resume length should reflect your experience level and industry norms. Entry-level professionals typically use one page, while experienced professionals may extend to two pages. Senior executives or academic professionals might require longer formats, but every page should provide valuable, relevant information.
            </p>

            <p>
              Organize information in reverse chronological order for work experience, with your most recent and relevant positions receiving the most detail. Consider using a hybrid format that combines chronological work history with a skills-based summary for career changers or those with employment gaps.
            </p>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>File Format and Compatibility</h3>
            <p>
              Choose file formats that maintain formatting integrity across different systems and devices. PDF format typically provides the best consistency for visual presentation, while Word documents offer maximum ATS compatibility. Some organizations specify required formats, so always follow application instructions precisely.
            </p>

            <p>
              Use descriptive file names that include your name and position, such as "JohnSmith_MarketingManager_Resume.pdf." Avoid special characters, spaces, or version numbers that might cause technical issues or appear unprofessional.
            </p>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Common Mistakes and How to Avoid Them</h2>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Content and Language Mistakes</h3>
            <p>
              Avoid passive language that diminishes your achievements. Instead of "Was responsible for team management," use "Led a 12-person team to exceed quarterly targets by 15%." Eliminate redundant information, outdated skills, and irrelevant experience that doesn't support your target role.
            </p>

            <p>
              Proofread meticulously for spelling, grammar, and formatting errors. Use professional language throughout, avoiding slang, abbreviations, or overly casual tone. Ensure consistency in verb tenses (past tense for previous roles, present tense for current position) and formatting elements.
            </p>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Technical and Formatting Errors</h3>
            <p>
              Avoid formatting that interferes with ATS processing, such as tables, text boxes, headers/footers, or unusual fonts. Don't use images, graphics, or logos unless specifically required for creative positions. Ensure consistent spacing, alignment, and formatting throughout the document.
            </p>

            <p>
              Test your resume by copying and pasting it into a plain text document to see how ATS systems might interpret it. If formatting is lost or text appears jumbled, simplify your design to ensure proper parsing.
            </p>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Future-Proofing Your Resume Strategy</h2>
            
            <p>
              The resume writing landscape continues evolving with technological advances and changing hiring practices. Stay informed about industry trends, emerging skills requirements, and new application technologies. Regular resume updates ensure your document remains current and competitive.
            </p>

            <p>
              Consider developing multiple resume versions tailored to different roles or industries within your field. Maintain detailed records of your achievements, projects, and skills development to facilitate easy updates and customization for specific opportunities.
            </p>

            <p>
              Integrate your resume strategy with your overall professional branding, ensuring consistency across LinkedIn, portfolio websites, and other professional materials. A cohesive professional presentation reinforces your credibility and makes you more memorable to potential employers.
            </p>
          </section>

          <section className={styles.takeaways}>
            <h2>Key Takeaways</h2>
            <ul>
              <li>Focus on achievements and quantifiable results rather than job duties</li>
              <li>Optimize for both ATS systems and human reviewers</li>
              <li>Customize your resume for each application and target role</li>
              <li>Use professional formatting that enhances readability</li>
              <li>Include relevant keywords naturally throughout your content</li>
              <li>Proofread thoroughly and test for ATS compatibility</li>
              <li>Keep content current and aligned with industry trends</li>
            </ul>
          </section>
        </article>

        <nav className={styles.backNav}>
          <Link href="/blog" className={styles.backLink}>
            ← Back to Blog
          </Link>
        </nav>
      </main>
      
      <FooterAd />
    </div>
  );
}
