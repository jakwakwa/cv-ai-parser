import Link from 'next/link';
import { SiteHeader } from '@/src/components/site-header/site-header';
import { HeaderAd, FooterAd } from '@/src/components/adsense/AdBanner';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import styles from './page.module.css';

export default function BlogPage() {
  return (
    <div className={styles.pageWrapper}>
      <SiteHeader />
      <HeaderAd />

      <main className={styles.content}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>
              Professional Career Development Blog
            </h1>
            <p className={styles.subtitle}>
              Expert insights, tips, and strategies for resume writing, career
              advancement, and professional success in today's dynamic job
              market.
            </p>
          </header>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Welcome to Our Career Development Resource Center
            </h2>
            <p className={styles.paragraph}>
              In today's rapidly evolving professional landscape, staying ahead
              requires continuous learning and adaptation. Our blog provides
              comprehensive guidance on resume optimization, career development
              strategies, and job search best practices. Whether you're a recent
              graduate entering the workforce, a mid-career professional seeking
              advancement, or an experienced executive exploring new
              opportunities, our expertly crafted content addresses the
              challenges and opportunities facing modern professionals.
            </p>

            <p className={styles.paragraph}>
              Our team of career development experts, hiring managers, and
              industry professionals contributes insights based on real-world
              experience and current market trends. We understand that
              successful career development requires more than just a
              well-written resume – it demands strategic thinking, continuous
              skill development, and the ability to effectively communicate your
              value proposition to potential employers.
            </p>

            <h3 className={styles.sectionTitle}>
              What You'll Find in Our Blog
            </h3>
            <p className={styles.paragraph}>
              Our content covers a comprehensive range of topics designed to
              support every aspect of your professional journey. From
              fundamental resume writing principles to advanced career strategy
              development, we provide actionable advice that you can implement
              immediately. Our articles are researched thoroughly and updated
              regularly to reflect current best practices and emerging trends in
              recruitment and career development.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Featured Articles</h2>
            <div className={styles.articlesGrid}>
              <Card className={styles.articleCard}>
                <CardHeader>
                  <div className={styles.articleMeta}>
                    <span className={styles.category}>Resume Writing</span>
                    <span className={styles.readTime}>8 min read</span>
                  </div>
                  <h3>
                    <Link
                      href="/blog/resume-writing-tips"
                      className={styles.articleTitle}
                    >
                      Essential Resume Writing Tips for 2024
                    </Link>
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className={styles.articleDescription}>
                    Master the art of resume writing with these proven
                    strategies that help you stand out in today's competitive
                    job market.
                  </p>
                  <div className={styles.articleFooter}>
                    <span className={styles.publishDate}>December 2024</span>
                    <Link
                      href="/blog/resume-writing-tips"
                      className={styles.readMore}
                    >
                      Read More →
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className={styles.articleCard}>
                <CardHeader>
                  <div className={styles.articleMeta}>
                    <span className={styles.category}>ATS Optimization</span>
                    <span className={styles.readTime}>12 min read</span>
                  </div>
                  <h3>
                    <Link
                      href="/blog/ats-optimization"
                      className={styles.articleTitle}
                    >
                      Complete Guide to ATS Optimization
                    </Link>
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className={styles.articleDescription}>
                    Learn how to optimize your resume for Applicant Tracking
                    Systems and increase your chances of getting past automated
                    screening.
                  </p>
                  <div className={styles.articleFooter}>
                    <span className={styles.publishDate}>December 2024</span>
                    <Link
                      href="/blog/ats-optimization"
                      className={styles.readMore}
                    >
                      Read More →
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className={styles.articleCard}>
                <CardHeader>
                  <div className={styles.articleMeta}>
                    <span className={styles.category}>Career Advice</span>
                    <span className={styles.readTime}>10 min read</span>
                  </div>
                  <h3>
                    <Link
                      href="/blog/career-advice"
                      className={styles.articleTitle}
                    >
                      Career Development Strategies for Modern Professionals
                    </Link>
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className={styles.articleDescription}>
                    Discover effective career development strategies that will
                    help you advance your professional goals and build lasting
                    success.
                  </p>
                  <div className={styles.articleFooter}>
                    <span className={styles.publishDate}>December 2024</span>
                    <Link
                      href="/blog/career-advice"
                      className={styles.readMore}
                    >
                      Read More →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Career Development Topics We Cover
            </h2>

            <div className={styles.topicsGrid}>
              <div className={styles.topicCard}>
                <h3>Resume Writing Excellence</h3>
                <p>
                  Learn the fundamental principles of effective resume writing,
                  from structuring your professional experience to crafting
                  compelling achievement statements. Our guides cover everything
                  from entry-level resumes to executive-level presentations.
                </p>
                <ul>
                  <li>
                    <strong>Professional summary optimization</strong>
                  </li>
                  <li>
                    <strong>Achievement quantification techniques</strong>
                  </li>
                  <li>
                    <strong>Industry-specific formatting strategies</strong>
                  </li>
                  <li>
                    <strong>Common mistakes and how to avoid them</strong>
                  </li>
                </ul>
              </div>

              <div className={styles.topicCard}>
                <h3>ATS and Technology Integration</h3>
                <p>
                  Understand how modern recruitment technology affects your job
                  search success. We provide detailed guidance on optimizing
                  your resume for Applicant Tracking Systems and leveraging
                  technology tools effectively.
                </p>
                <ul>
                  <li>
                    <strong>ATS compatibility best practices</strong>
                  </li>
                  <li>
                    <strong>Keyword research and integration</strong>
                  </li>
                  <li>
                    <strong>Digital portfolio development</strong>
                  </li>
                  <li>
                    <strong>Online presence optimization</strong>
                  </li>
                </ul>
              </div>

              <div className={styles.topicCard}>
                <h3>Career Strategy Development</h3>
                <p>
                  Develop comprehensive career strategies that align with your
                  long-term professional goals. Our content helps you identify
                  opportunities for advancement and plan successful career
                  transitions.
                </p>
                <ul>
                  <li>
                    <strong>Career goal setting and planning</strong>
                  </li>
                  <li>
                    <strong>Professional skill development</strong>
                  </li>
                  <li>
                    <strong>
                      Networking strategies and relationship building
                    </strong>
                  </li>
                  <li>
                    <strong>Leadership development pathways</strong>
                  </li>
                </ul>
              </div>

              <div className={styles.topicCard}>
                <h3>Interview Preparation and Success</h3>
                <p>
                  Master the interview process with comprehensive preparation
                  strategies. Learn how to present your qualifications
                  confidently and handle challenging interview scenarios
                  effectively.
                </p>
                <ul>
                  <li>
                    <strong>Interview preparation methodologies</strong>
                  </li>
                  <li>
                    <strong>Behavioral question frameworks</strong>
                  </li>
                  <li>
                    <strong>Salary negotiation strategies</strong>
                  </li>
                  <li>
                    <strong>Post-interview follow-up techniques</strong>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Expert Contributors and Industry Insights
            </h2>
            <p className={styles.paragraph}>
              Our blog features contributions from a diverse team of career
              development professionals, including certified resume writers,
              executive recruiters, hiring managers, and career coaches. This
              collaborative approach ensures our content reflects multiple
              perspectives and real-world insights from across the employment
              ecosystem.
            </p>

            <p className={styles.paragraph}>
              We regularly interview industry leaders, analyze hiring trends,
              and research emerging best practices to provide you with the most
              current and relevant career development information. Our goal is
              to bridge the gap between academic career theory and practical,
              actionable strategies that deliver measurable results.
            </p>

            <h3 className={styles.sectionTitle}>
              Research-Based Content Development
            </h3>
            <p className={styles.paragraph}>
              All our content is grounded in current research and industry
              analysis. We regularly review employment statistics, hiring trend
              reports, and career development studies to ensure our
              recommendations align with current market realities. This
              research-based approach helps you make informed decisions about
              your career development strategy.
            </p>
          </section>

          <section className={styles.callToAction}>
            <h2 className={styles.sectionTitle}>
              Start Your Career Development Journey
            </h2>
            <p className={styles.paragraph}>
              Whether you're looking to optimize your resume, prepare for
              interviews, or develop a comprehensive career strategy, our blog
              provides the resources and insights you need for success. Each
              article includes practical tips, actionable strategies, and
              real-world examples.
            </p>

            <div>
              <h3>Ready to Advance Your Career?</h3>
              <p>
                Explore our comprehensive resources and take the next step in
                your professional development. Start with our featured articles
                above, or browse our complete archive of career development
                content.
              </p>
            </div>
          </section>
        </div>
      </main>

      <FooterAd />
    </div>
  );
}
