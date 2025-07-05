import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Documentation | AI Resume Generator',
  description: 'User-facing documentation and guides.',
};

export default function DocsHome() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Documentation</h1>
      <p className={styles.lead}>
        Welcome to the knowledge base.  Here you'll find guides, best practices
        and API references.  Select a topic below to get started.
      </p>

      <nav className={styles.navSection}>
        <h2>User Guides</h2>
        <ul className={styles.list}>
          <li>
            <Link href="/docs/guides/resume-from-file" className={styles.link}>
              Uploading a Resume File
            </Link>
          </li>
          <li>
            <Link href="/docs/guides/resume-from-figma" className={styles.link}>
              Building a Resume from a Figma Design <span className={styles.badge}>new</span>
            </Link>
          </li>
          <li>
            <span className={styles.comingSoon}>
              More topics coming soon…
            </span>
          </li>
        </ul>
      </nav>

      <nav className={styles.navSection}>
        <h2>Developer Documentation</h2>
        <ul className={styles.list}>
          <li>
            <Link href="/docs/developer-notes" className={styles.link}>
              Developer Notes <span className={styles.badge}>technical</span>
            </Link>
          </li>
          <li>
            <Link href="/docs/developer-notes/figma-integration-status" className={styles.link}>
              Figma Integration Status <span className={styles.badge}>phase 1 complete</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}