'use client';

import Link from 'next/link';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { useAuth } from '../auth-provider/AuthProvider';
import { useRouter } from 'next/navigation';
import styles from './UserNav.module.css';

export function UserNav() {
  const { user, signOut } = useAuth();
  const router = useRouter();

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
        <Button variant="ghost" className={styles.userNavButton}>
          <Avatar className={styles.avatar}>
            <AvatarImage
              src={user.user_metadata?.avatar_url}
              alt={user.user_metadata?.full_name || 'User'}
            />
            <AvatarFallback>
              {getInitials(user.user_metadata?.full_name)}
            </AvatarFallback>
          </Avatar>
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

        <DropdownMenuItem
          className={styles.dropdownMenuItem}
          onClick={async () => {
            await signOut();
            router.replace('/');
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
