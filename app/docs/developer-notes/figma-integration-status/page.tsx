import { promises as fs } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import Markdown from '@/src/components/docs/Markdown';
import styles from '../../page.module.css';

export default async function FigmaIntegrationStatusPage() {
  // Read the markdown file
  const filePath = path.join(
    process.cwd(),
    'app/docs/developer-notes/figma-integration-status.md'
  );
  const content = await fs.readFile(filePath, 'utf8');

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <Link href="/docs/developer-notes" className={styles.backLink}>
          ← Back to Developer Notes
        </Link>
      </div>

      <Markdown>{content}</Markdown>

      <div className={styles.navigation}>
        <Link href="/docs/developer-notes" className={styles.backLink}>
          ← Back to Developer Notes
        </Link>
        <Link href="/docs" className={styles.backLink}>
          ← Back to Documentation
        </Link>
      </div>
    </div>
  );
}
