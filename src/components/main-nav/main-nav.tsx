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

      {/* Public docs */}
      <Link href="/docs" className={styles.docsLink} onClick={() => setAuthModalOpen(false)}>
        Docs
      </Link>
    </div>
  );
}
