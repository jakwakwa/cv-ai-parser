import Link from 'next/link';
import { useAuthModal } from '../auth-component/AuthModalContext';
import styles from './main-nav.module.css';

interface MainNavProps {
  onLogoClick?: () => void;
}

export function MainNav({ onLogoClick }: MainNavProps) {
  const { setAuthModalOpen } = useAuthModal();

  return (
    <div className={styles.container}>
      <Link
        href="/"
        className={styles.link}
        onClick={() => {
          setAuthModalOpen(false);
          onLogoClick?.();
        }}
      >
        {/* Logo placeholder */}
        <span className={styles.brand}>AI Resume Generator</span>
      </Link>

      <nav className={styles.navigation}>
        {/* Tools dropdown or links */}
        <Link href="/tools/tailor" className={styles.navLink} onClick={() => setAuthModalOpen(false)}>
          Resume Tailor
        </Link>
        <Link href="/tools/figma-to-resume" className={styles.navLink} onClick={() => setAuthModalOpen(false)}>
          Figma to Resume
        </Link>
        <Link href="/docs" className={styles.navLink} onClick={() => setAuthModalOpen(false)}>
          Docs
        </Link>
      </nav>
    </div>
  );
}
