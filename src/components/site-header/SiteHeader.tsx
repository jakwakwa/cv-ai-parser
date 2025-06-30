'use client';

import { useState } from 'react';
import { useAuth } from '@/src/components/auth-provider/AuthProvider';
import AuthModal from '../auth-component/AuthModal';
import { AuthModalContext } from '../auth-component/AuthModalContext';
import { MainNav } from '../main-nav/MainNav';
import { UserNav } from '../user-nav/UserNav';
import styles from './SiteHeader.module.css';

interface SiteHeaderProps {
  onLogoClick?: () => void;
}

export function SiteHeader({ onLogoClick }: SiteHeaderProps) {
  const { user } = useAuth();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <AuthModalContext.Provider
          value={{ isAuthModalOpen, setAuthModalOpen }}
        >
          <MainNav onLogoClick={onLogoClick} />

          {user ? <UserNav /> : <AuthModal />}
        </AuthModalContext.Provider>
      </div>
    </header>
  );
}
