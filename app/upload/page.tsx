'use client';

import { Suspense } from 'react';
import { SiteHeader } from '@/src/components/site-header/site-header';
import PageContent from '@/src/containers/page-content';
import styles from './page.module.css';

export default function UploadPage() {
  return (
    <div className={styles.pageWrapper}>
      <SiteHeader
        onLogoClick={() => {
          window.location.href = '/';
        }}
      />
      <main className={styles.mainContent}>
        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
          <PageContent />
        </Suspense>
      </main>
    </div>
  );
}
