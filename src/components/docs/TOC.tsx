"use client";
import { useEffect, useState } from 'react';
import styles from './DocsLayout.module.css';

interface Entry { id: string; text: string }

export default function TOC() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const selector = 'main h2, main h3';
    const nodes = Array.from(document.querySelectorAll(selector));
    const items: Entry[] = nodes.map((n) => ({ id: n.id, text: n.textContent || '' }));
    setEntries(items);
  }, []);

  if (entries.length === 0) return null;
  return (
    <div className={styles.toc}>
      <ul>
        {entries.map((e) => (
          <li key={e.id}>
            <a href={`#${e.id}`} className={styles.tocLink}>
              {e.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}