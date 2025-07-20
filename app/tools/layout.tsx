'use client';

import type React from 'react';
import { SiteHeader } from '@/src/components/site-header/site-header';
import styles from './layout.module.css';

export default function ResumeToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.toolsLayout}>
      <SiteHeader
        onLogoClick={() => {
          window.location.href = '/';
        }}
      />
      <main className={styles.toolsMain}>{children}</main>
    </div>
  );
}
