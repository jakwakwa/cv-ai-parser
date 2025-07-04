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
        {/* <Icons.logo className="h-6 w-6" /> */}
        <span className={styles.brand}>AI Resume Generator</span>
      </Link>
    </div>
  );
}
