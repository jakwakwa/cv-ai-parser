import Link from 'next/link';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './DocsLayout.module.css';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const TOC = dynamic(() => import('./TOC'), { ssr: false });

interface DocsLayoutProps {
  children: ReactNode;
  headings?: { id: string; text: string }[];
}

export default function DocsLayout({ children, headings = [] }: DocsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className={styles.layout}>
      {/* Left sidebar */}
      <aside className={styles.sidebar}>
        <nav>
          <ul className={styles.sidebarNav}>
            <li>
              <Link
                href="/docs"
                className={clsx(styles.navLink, pathname === '/docs' && styles.navLinkActive)}
              >
                Getting Started
              </Link>
            </li>
            <li>
              <Link
                href="/docs/guides"
                className={clsx(styles.navLink, pathname.startsWith('/docs/guides') && styles.navLinkActive)}
              >
                Guides
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className={styles.content}>{children}</main>

      {/* Right sidebar – Table of contents */}
      <aside className={styles.toc}>
        <TOC />
      </aside>
    </div>
  );
}