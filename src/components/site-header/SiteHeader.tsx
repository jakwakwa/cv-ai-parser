'use client';

import { useState } from 'react';
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
            className="h-8 w-8 rounded-full p-0"
            aria-label="Sign in"
            onClick={() => setAuthModalOpen(true)}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <title>Sign in</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Button>
        )}

        <AuthModal />
      </div>
    </header>
  );
}
