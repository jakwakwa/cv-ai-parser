'use client';

import { useState } from 'react';
import { useAuth } from '@/src/components/auth-provider/auth-provider';
import { AuthModal } from '../auth-component/AuthModal';
import { useAuthModal } from '../auth-component/AuthModalContext';
import { MainNav } from '../main-nav/main-nav';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { Button } from '../ui/ui-button/button';
import { UserNav } from '../user-nav/user-nav';
import { MobileDrawer } from './mobile-drawer';
import styles from './site-header.module.css';

interface SiteHeaderProps {
  onLogoClick?: () => void;
}

export function SiteHeader({ onLogoClick }: SiteHeaderProps) {
  const { user } = useAuth();
  const { setAuthModalOpen } = useAuthModal();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen);
  };

  const closeMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <MainNav onLogoClick={onLogoClick} />

        <div className={styles.headerActions}>
          {/* Mobile menu button - only visible on mobile */}
          <button
            type="button"
            className={styles.mobileMenuButton}
            onClick={toggleMobileDrawer}
            aria-label="Open mobile menu"
            aria-expanded={isMobileDrawerOpen}
          >
            <div className={styles.hamburger}>
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </div>
          </button>

          <ThemeToggle />
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
        </div>

        <AuthModal />
        <MobileDrawer isOpen={isMobileDrawerOpen} onClose={closeMobileDrawer} />
      </div>
    </header>
  );
}
