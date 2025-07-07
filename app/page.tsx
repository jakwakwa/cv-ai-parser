'use client';

import { Suspense } from 'react';
import { AdBanner } from '@/src/components/adsense/AdBanner';
import { SiteHeader } from '@/src/components/site-header/site-header';
import HomePageContent from '../src/containers/home-page-content/home-page-content';
import homePageContentStyles from '../src/containers/home-page-content/home-page-content.module.css';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      <SiteHeader
        onLogoClick={() => {
          window.location.href = '/';
        }}
      />
      <main className={styles.mainContent}>
        <div className={homePageContentStyles.container}>
          <AdBanner width="100%" height="90px" />
        </div>
        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
          <HomePageContent />
        </Suspense>
      </main>
    </div>
  );
}
