'use client';

import { useAuth } from '@/src/components/auth-provider/AuthProvider';
import { AuthModal } from '../auth-component/AuthModal';
import { useAuthModal } from '../auth-component/AuthModalContext';
import { MainNav } from '../main-nav/MainNav';
import { Button } from '../ui/button';
import { UserNav } from '../user-nav/UserNav';
import styles from './SiteHeader.module.css';

interface SiteHeaderProps {
  onLogoClick?: () => void;
}

export function SiteHeader({ onLogoClick }: SiteHeaderProps) {
  const { user } = useAuth();
  const { setAuthModalOpen } = useAuthModal();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <MainNav onLogoClick={onLogoClick} />

        {user ? (
          <UserNav />
        ) : (
          <Button
            variant="ghost"
            className={styles.signInButton}
            aria-label="Sign in"
            onClick={() => setAuthModalOpen(true)}
          >
            Sign in
          </Button>
        )}

        <AuthModal />
      </div>
    </header>
  );
}
