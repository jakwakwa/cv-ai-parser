import type { ReactNode } from 'react';
import DocsLayout from '@/src/components/docs/DocsLayout';
import styles from './layout.module.css';

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.docsRoot}>
      <DocsLayout>{children}</DocsLayout>
    </div>
  );
}