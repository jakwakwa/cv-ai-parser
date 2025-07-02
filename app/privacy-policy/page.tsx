'use client';

import React from 'react';
import styles from './privacy-policy.module.css';
import { SiteHeader } from '@/src/components/site-header/SiteHeader';
import BackButton from '@/src/components/ui/BackButton';

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <SiteHeader />
      <div className={styles.textWhite}>
        <BackButton />
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.paragraph}>
          Your privacy is important to us. This Privacy Policy explains how
          resume.ai ('we', 'us', or 'our') collects, uses, discloses, and
          safeguards your information when you use our resume parsing and
          generation service.
        </p>

        <h2 className={styles.sectionTitle}>
          Information We Collect
        </h2>
        <p className={styles.paragraph}>
          We collect information you provide directly to us, such as when you
          create an account, upload a resume, or contact us for support. This
          may include:
        </p>
        <p className={styles.paragraph}>
          We may also collect certain information automatically when you use our
          service, including your IP address, browser type, operating system,
          and usage patterns.
        </p>

        <ul className={styles.list}>
          <li>Personal information (name, email address, phone number)</li>
          <li>Professional information (work experience, education, skills)</li>
          <li>Resume files and documents you upload</li>
          <li>Account credentials and preferences</li>
          <li>Communication history with our support team</li>
          <li>Payment information (if applicable)</li>
          <li>Usage data and analytics</li>
          <li>Device information and technical data</li>
          <li>Cookies and similar tracking technologies</li>
          <li>Social media information (if you choose to connect accounts)</li>
          <li>Third-party integrations data</li>
          <li>Feedback and survey responses</li>
          <li>Error logs and debugging information</li>
          <li>Security-related information</li>
          <li>Location data (general geographic area)</li>
          <li>Browser preferences and settings</li>
          <li>Time zone and language preferences</li>
        </ul>

        <h2 className={styles.sectionTitle}>
          How We Use Your Information
        </h2>
        <p className={styles.paragraph}>
          We use the information we collect to provide, maintain, and improve
          our services, process your requests, communicate with you, and comply
          with legal obligations. We may also use your information for research
          and development purposes to enhance our AI-powered resume parsing and
          generation capabilities.
        </p>

        <h2 className={styles.sectionTitle}>Changes</h2>
        <p className={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the 'Last updated' date.
        </p>

        <h2 className={styles.sectionTitle}>Contact Us</h2>
        <p className={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us
          at privacy@resume.ai
        </p>
      </div>
    </div>
  );
}
