'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Button } from '@/src/components/ui/ui-button/button';
import styles from './user-nav.module.css';

export function UserNav() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const getInitials = (name: string | undefined | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" nav className={styles.userNavButton}>
          {getInitials(session.user.name)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={styles.dropdownContent} forceMount>
        <div className={styles.dropdownLabel}>
          <div className={styles.labelContainer}>
            <p className={styles.userName}>{session.user.name}</p>
            <p className={styles.userEmail}>{session.user.email}</p>
          </div>
        </div>

        <DropdownMenuItem className={styles.dropdownMenuItem} asChild>
          <Link href="/library">My Library</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className={styles.dropdownMenuItem}
          onClick={() => signOut()}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
