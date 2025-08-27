import Link from 'next/link';
import styles from './main-nav.module.css';

interface MainNavProps {
  onLogoClick?: () => void;
  isAuthenticated?: boolean;
}

export function MainNav({
  onLogoClick,
  isAuthenticated = false,
}: MainNavProps) {
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
        <Link href="/tools/ai-resume-tailor" className={styles.navLink}>
          Ai Resume Job Tailor
        </Link>

        <Link href="/tools/ai-resume-generator" className={styles.navLink}>
          Ai Resume Parser
        </Link>
        {/* Only show library link for authenticated users */}
        {isAuthenticated && (
          <Link href="/library" className={styles.navLink}>
            My Resumes
          </Link>
        )}
        <Link href="/blog" className={styles.navLink}>
          Blog
        </Link>

        <Link href="/docs" className={styles.navLink}>
          Docs
        </Link>
      </nav>
    </div>
  );
}
