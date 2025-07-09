import Link from 'next/link';
import styles from './main-nav.module.css';

interface MainNavProps {
  onLogoClick?: () => void;
}

export function MainNav({ onLogoClick }: MainNavProps) {
  return (
    <div className={styles.container}>
      <Link
        href="/"
        className={styles.link}
        onClick={() => {
          onLogoClick?.();
        }}
      >
        {/* Logo placeholder */}
        <span className={styles.brand}>AI Resume Generator</span>
      </Link>

      <nav className={styles.navigation}>
        {/* Tools dropdown or links */}
        <Link href="/tools/tailor" className={styles.navLink}>
          Resume Tailor
        </Link>
        <Link href="/tools/figma-to-resume" className={styles.navLink}>
          Figma to Resume
        </Link>
        <Link href="/docs" className={styles.navLink}>
          Docs
        </Link>
      </nav>
    </div>
  );
}
