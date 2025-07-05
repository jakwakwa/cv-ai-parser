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
        Welcome to the knowledge base.  Here you’ll find guides, best practices
        and API references.  Select a topic below to get started.
      </p>

      <nav className={styles.navSection}>
        <ul className={styles.list}>
          <li>
            <Link href="/docs/resume-from-file" className={styles.link}>
              Uploading a Resume File
            </Link>
          </li>
          <li>
            <Link href="/docs/resume-from-figma" className={styles.link}>
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
    </div>
  );
}