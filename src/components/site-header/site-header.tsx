'use client';

import { useAuth } from '@/src/components/auth-provider/auth-provider';
import { AuthModal } from '../auth-component/AuthModal';
import { useAuthModal } from '../auth-component/AuthModalContext';
import { MainNav } from '../main-nav/main-nav';
import { Button } from '../ui/ui-button/button';
import { UserNav } from '../user-nav/user-nav';
import styles from './site-header.module.css';

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
            className="rounded-full p-0"
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
