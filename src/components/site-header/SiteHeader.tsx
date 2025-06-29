'use client';

import { useAuth } from '@/src/components/auth-provider/AuthProvider';
import { MainNav } from '../main-nav/MainNav';
import { UserNav } from '../user-nav/UserNav';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  const { user } = useAuth();
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <MainNav />

        {user && <UserNav />}
      </div>
    </header>
  );
}
