'use client';

import adBannerStyles from '@/src/components/adsense/AdBanner.module.css'; // Import AdBanner styles
import styles from './page.module.css';

// No need for FigmaGenerationInfo or state hooks as functionality is disabled

export default function FigmaToResumePage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Figma to Resume</h1>
        <p className={styles.subtitle}>
          Transform your Figma design directly into a deployable resume
          component
        </p>
      </div>

      {/* Placeholder for coming soon content */}
      <div
        className={adBannerStyles.fallbackContainer}
        style={{ minHeight: '200px' }}
      >
        <div className={adBannerStyles.fallbackContent}>
          <span className={adBannerStyles.fallbackText}>
            Coming Soon: Figma to Resume is under development.
          </span>
        </div>
      </div>
    </div>
  );
}
