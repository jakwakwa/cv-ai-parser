"use client";

import clsx from "clsx";
// import dynamic from 'next/dynamic';
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./DocsLayout.module.css";

// const TOC = dynamic(() => import('./TOC'), { ssr: false });

interface DocsLayoutProps {
  children: ReactNode;
  headings?: { id: string; text: string }[];
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className={styles.layout}>
      {/* Left sidebar */}
      <aside className={styles.sidebar}>
        <nav>
          <ul className={styles.sidebarNav}>
            <li>
              <Link href="/docs/" className={clsx(styles.navLink, pathname === "/docs" && styles.navLinkActive)}>
                Docs
              </Link>
            </li>
            <li>
              <Link href="/blog" className={clsx(styles.navLink, pathname.startsWith("/blog") && styles.navLinkActive)}>
                Blog
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className={styles.content}>{children}</main>
    </div>
  );
}
