'use client';

import {
  ArrowRight,
  Bot,
  FileText as BriefcaseIcon,
  FileText,
  Palette,
  Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/ui-button/button';
import styles from './home-page-content.module.css';

export default function HomePageContent() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>AI-Powered Resume Builder</h1>
          <p className={styles.heroSubtitle}>
            Transform your career with our intelligent resume tools. Create
            tailored resumes from scratch or convert your Figma designs into
            professional resume components.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          {/* Resume Tailor Card */}
          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>AI Resume Tailor</h3>
            <p className={styles.featureDescription}>
              Upload your resume and a job description. Our AI will
              automatically optimize your resume for that specific role.
            </p>

            <div className={styles.featureHighlights}>
              <div className={styles.highlight}>
                <Upload size={16} />
                <span>Upload PDF or TXT</span>
              </div>
              <div className={styles.highlight}>
                <BriefcaseIcon size={16} />
                <span>Paste job description</span>
              </div>
              <div className={styles.highlight}>
                <Bot size={16} />
                <span>AI optimization</span>
              </div>
              <div className={styles.highlight}>
                <Palette size={16} />
                <span>Custom styling</span>
              </div>
            </div>

            <Button
              variant="primary"
              className={styles.featureButton}
              onClick={() => router.push('/tools/tailor')}
            >
              Start Tailoring
              <ArrowRight size={16} />
            </Button>
          </div>

          {/* Figma to Resume Card */}
          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Figma to Resume</h3>
            <p className={styles.featureDescription}>
              Have a resume design in Figma? Convert it directly into a
              deployable React component with just one click.
            </p>

            <div className={styles.featureHighlights}>
              <div className={styles.highlight}>
                <FileText size={16} />
                <span>Figma integration</span>
              </div>
              <div className={styles.highlight}>
                <Bot size={16} />
                <span>Auto component generation</span>
              </div>
              <div className={styles.highlight}>
                <Palette size={16} />
                <span>Preserve styling</span>
              </div>
              <div className={styles.highlight}>
                <ArrowRight size={16} />
                <span>Export ready code</span>
              </div>
            </div>

            <Button
              variant="primary"
              className={styles.featureButton}
              onClick={() => router.push('/tools/figma-to-resume')}
            >
              Convert Design
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

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
