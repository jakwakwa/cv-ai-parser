import type { ReactNode } from 'react';
import DocsLayout from '@/src/components/docs/DocsLayout';
import { SiteHeader } from '@/src/components/site-header/site-header';
import styles from './layout.module.css';
import 'nextjs-components/src/styles/globals.css';

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.docsRoot}>
      <SiteHeader />
      <div style={{ flex: 1 }}>
        <DocsLayout>{children}</DocsLayout>
      </div>
    </div>
  );
}
