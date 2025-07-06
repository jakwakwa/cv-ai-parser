"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
}

const guides: GuideMeta[] = [
  {
    slug: 'resume-from-file',
    title: 'Uploading a Resume File',
    description: 'Step-by-step guide to create a resume from a text/PDF file.',
    category: 'Resume',
  },
  {
    slug: 'resume-from-figma',
    title: 'Building a Resume from a Figma Design',
    description: 'Use a Figma frame link to generate JSX + CSS.',
    category: 'Figma',
  },
];

const categories = Array.from(new Set(guides.map((g) => g.category)));

export default function GuidesPage() {
  const [filter, setFilter] = useState<string | null>(null);
  const filtered = filter ? guides.filter((g) => g.category === filter) : guides;

  return (
    <div>
      <h1>Guides</h1>
      <div className={styles.filters}>
        <button type="button"
          className={`${styles.filterBtn} ${filter === null ? styles.filterBtnActive : ''}`}
          onClick={() => setFilter(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button type="button"
            key={cat}
            className={`${styles.filterBtn} ${filter === cat ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <ul className={styles.guideList}>
        {filtered.map((g) => (
          <li key={g.slug}>
            <Link href={`/docs/guides/${g.slug}`} className={styles.guideItemTitle}>
              {g.title}
            </Link>
            <p className={styles.guideItemDesc}>{g.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}