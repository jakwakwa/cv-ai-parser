'use client';

import { useState } from 'react';
import { MainNav } from '../main-nav/main-nav';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { MobileDrawer } from './mobile-drawer';
import styles from './site-header.module.css';

interface SiteHeaderProps {
  onLogoClick?: () => void;
}

export function SiteHeader({ onLogoClick }: SiteHeaderProps) {
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
        </div>

        <MobileDrawer isOpen={isMobileDrawerOpen} onClose={closeMobileDrawer} />
      </div>
    </header>
  );
}
