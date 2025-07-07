import Link from 'next/link';
import styles from '../page.module.css';

export default function DeveloperNotesPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Developer Notes</h1>
      <p className={styles.description}>
        Technical documentation and implementation notes for developers working on the AI Resume Generator.
      </p>

      <div className={styles.grid}>
        <Link href="/docs/developer-notes/figma-integration-status" className={styles.card}>
          <h2>Figma Integration Status</h2>
          <p>
            Complete technical overview of the Figma-to-React component generation system, 
            including implementation details, current status, and next steps for Phase 2 integration.
          </p>
          <div className={styles.cardMeta}>
            <span className={styles.status}>Phase 1 Complete ✅</span>
            <span className={styles.priority}>Phase 2 Required</span>
          </div>
        </Link>

        <div className={styles.card}>
          <h2>More Documentation Coming Soon</h2>
          <p>
            Additional developer notes and technical documentation will be added here as new features are implemented.
          </p>
          <div className={styles.cardMeta}>
            <span className={styles.status}>Planned</span>
          </div>
        </div>
      </div>

      <div className={styles.navigation}>
        <Link href="/docs" className={styles.backLink}>
          ← Back to Documentation
        </Link>
      </div>
    </div>
  );
}