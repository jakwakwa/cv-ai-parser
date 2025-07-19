'use client';

import HomeToolItem from '@/src/components/home-tool-item';
import styles from './home-page-content.module.css';

export default function HomePageContent() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>AI-Powered Resume Generator</h1>
          <p className={styles.heroSubtitle}>
            Transform your career with our intelligent resume tools. Create
            tailored resumes from scratch or convert your Figma designs into
            professional resume components.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <HomeToolItem
        content={{
          title: 'Resume Tailor Tool',
          description:
            'Transform your career with our intelligent resume tools. Create tailored resumes from scratch or convert your Figma designs into professional resume components.',
        }}
        link={'tools/ai-resume-tailor'}
      />

      <HomeToolItem
        content={{
          title: 'Resume Generator / Parser',
          description:
            'Transform your career with our intelligent resume tools. Create tailored resumes from scratch or convert your Figma designs into professional resume components.',
        }}
        link={'tools/ai-resume-generator'}
      />

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <h2 className={styles.sectionTitle}>Why Choose Our Tools?</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefit}>
            <h4>AI-Powered</h4>
            <p>
              Advanced AI analyzes job requirements and optimizes your resume
              content
            </p>
          </div>
          <div className={styles.benefit}>
            <h4>Professional Design</h4>
            <p>Clean, modern templates that make your resume stand out</p>
          </div>
          <div className={styles.benefit}>
            <h4>Fast & Easy</h4>
            <p>Get a tailored resume in minutes, not hours</p>
          </div>
          <div className={styles.benefit}>
            <h4>Customizable</h4>
            <p>Full control over colors, fonts, and layout</p>
          </div>
        </div>
      </section>
    </div>
  );
}
