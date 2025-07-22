import Link from 'next/link';
import { SiteHeader } from '@/src/components/site-header/site-header';
import { HeaderAd, FooterAd } from '@/src/components/adsense/AdBanner';

export default function BlogPage() {
  return (
    <div className="pageWrapper">
      <SiteHeader />
      <HeaderAd />
      
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Professional Career Development Blog</h1>
          <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
            Expert insights, tips, and strategies for resume writing, career advancement, and professional success in today's dynamic job market.
          </p>
        </header>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Welcome to Our Career Development Resource Center</h2>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            In today's rapidly evolving professional landscape, staying ahead requires continuous learning and adaptation. Our blog provides comprehensive guidance on resume optimization, career development strategies, and job search best practices. Whether you're a recent graduate entering the workforce, a mid-career professional seeking advancement, or an experienced executive exploring new opportunities, our expertly crafted content addresses the challenges and opportunities facing modern professionals.
          </p>
          
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Our team of career development experts, hiring managers, and industry professionals contributes insights based on real-world experience and current market trends. We understand that successful career development requires more than just a well-written resume – it demands strategic thinking, continuous skill development, and the ability to effectively communicate your value proposition to potential employers.
          </p>

          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem' }}>What You'll Find in Our Blog</h3>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Our content covers a comprehensive range of topics designed to support every aspect of your professional journey. From fundamental resume writing principles to advanced career strategy development, we provide actionable advice that you can implement immediately. Our articles are researched thoroughly and updated regularly to reflect current best practices and emerging trends in recruitment and career development.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Featured Articles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <article style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <span>Resume Writing</span> • <span>8 min read</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
                <Link href="/blog/resume-writing-tips" style={{ textDecoration: 'none', color: '#333' }}>
                  Essential Resume Writing Tips for 2024
                </Link>
              </h3>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6', color: '#666' }}>
                Master the art of resume writing with these proven strategies that help you stand out in today's competitive job market.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span style={{ color: '#666' }}>December 2024</span>
                <Link href="/blog/resume-writing-tips" style={{ color: '#007bff', textDecoration: 'none' }}>
                  Read More →
                </Link>
              </div>
            </article>

            <article style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <span>ATS Optimization</span> • <span>12 min read</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
                <Link href="/blog/ats-optimization" style={{ textDecoration: 'none', color: '#333' }}>
                  Complete Guide to ATS Optimization
                </Link>
              </h3>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6', color: '#666' }}>
                Learn how to optimize your resume for Applicant Tracking Systems and increase your chances of getting past automated screening.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span style={{ color: '#666' }}>December 2024</span>
                <Link href="/blog/ats-optimization" style={{ color: '#007bff', textDecoration: 'none' }}>
                  Read More →
                </Link>
              </div>
            </article>

            <article style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <span>Career Advice</span> • <span>10 min read</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
                <Link href="/blog/career-advice" style={{ textDecoration: 'none', color: '#333' }}>
                  Career Development Strategies for Modern Professionals
                </Link>
              </h3>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6', color: '#666' }}>
                Discover effective career development strategies that will help you advance your professional goals and build lasting success.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span style={{ color: '#666' }}>December 2024</span>
                <Link href="/blog/career-advice" style={{ color: '#007bff', textDecoration: 'none' }}>
                  Read More →
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Career Development Topics We Cover</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Resume Writing Excellence</h3>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                Learn the fundamental principles of effective resume writing, from structuring your professional experience to crafting compelling achievement statements. Our guides cover everything from entry-level resumes to executive-level presentations.
              </p>
              <ul style={{ lineHeight: '1.6', paddingLeft: '1.5rem' }}>
                <li>Professional summary optimization</li>
                <li>Achievement quantification techniques</li>
                <li>Industry-specific formatting strategies</li>
                <li>Common mistakes and how to avoid them</li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>ATS and Technology Integration</h3>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                Understand how modern recruitment technology affects your job search success. We provide detailed guidance on optimizing your resume for Applicant Tracking Systems and leveraging technology tools effectively.
              </p>
              <ul style={{ lineHeight: '1.6', paddingLeft: '1.5rem' }}>
                <li>ATS compatibility best practices</li>
                <li>Keyword research and integration</li>
                <li>Digital portfolio development</li>
                <li>Online presence optimization</li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Career Strategy Development</h3>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                Develop comprehensive career strategies that align with your long-term professional goals. Our content helps you identify opportunities for advancement and plan successful career transitions.
              </p>
              <ul style={{ lineHeight: '1.6', paddingLeft: '1.5rem' }}>
                <li>Career goal setting and planning</li>
                <li>Professional skill development</li>
                <li>Networking strategies and relationship building</li>
                <li>Leadership development pathways</li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Interview Preparation and Success</h3>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                Master the interview process with comprehensive preparation strategies. Learn how to present your qualifications confidently and handle challenging interview scenarios effectively.
              </p>
              <ul style={{ lineHeight: '1.6', paddingLeft: '1.5rem' }}>
                <li>Interview preparation methodologies</li>
                <li>Behavioral question frameworks</li>
                <li>Salary negotiation strategies</li>
                <li>Post-interview follow-up techniques</li>
              </ul>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Expert Contributors and Industry Insights</h2>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Our blog features contributions from a diverse team of career development professionals, including certified resume writers, executive recruiters, hiring managers, and career coaches. This collaborative approach ensures our content reflects multiple perspectives and real-world insights from across the employment ecosystem.
          </p>

          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            We regularly interview industry leaders, analyze hiring trends, and research emerging best practices to provide you with the most current and relevant career development information. Our goal is to bridge the gap between academic career theory and practical, actionable strategies that deliver measurable results.
          </p>

          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem' }}>Research-Based Content Development</h3>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            All our content is grounded in current research and industry analysis. We regularly review employment statistics, hiring trend reports, and career development studies to ensure our recommendations align with current market realities. This research-based approach helps you make informed decisions about your career development strategy.
          </p>
        </section>

        <section style={{ backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Start Your Career Development Journey</h2>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto 1.5rem' }}>
            Whether you're looking to optimize your resume, prepare for interviews, or develop a comprehensive career strategy, our blog provides the resources and insights you need for success. Each article includes practical tips, actionable strategies, and real-world examples.
          </p>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Ready to Advance Your Career?</h3>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Explore our comprehensive resources and take the next step in your professional development. Start with our featured articles above, or browse our complete archive of career development content.
            </p>
          </div>
        </section>
      </main>
      
      <FooterAd />
    </div>
  );
}
