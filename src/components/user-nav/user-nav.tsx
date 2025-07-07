'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Button } from '@/src/components/ui/ui-button/button';
import { useAuth } from '../auth-provider/auth-provider';
import styles from './user-nav.module.css';

export function UserNav() {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" nav className={styles.userNavButton}>
          {getInitials(user.user_metadata?.full_name)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={styles.dropdownContent} forceMount>
        <div className={styles.dropdownLabel}>
          <div className={styles.labelContainer}>
            <p className={styles.userName}>{user.user_metadata?.full_name}</p>
            <p className={styles.userEmail}>{user.email}</p>
          </div>
        </div>

        <DropdownMenuItem className={styles.dropdownMenuItem} asChild>
          <Link href="/library">My Library</Link>
        </DropdownMenuItem>

        <DropdownMenuItem className={styles.dropdownMenuItem} onClick={signOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
