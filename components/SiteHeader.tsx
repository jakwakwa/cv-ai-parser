'use client';

import { useAuth } from '@/components/AuthProvider';
import { MainNav } from './MainNav';
import styles from './SiteHeader.module.css';
import { UserNav } from './UserNav';

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
