import Link from 'next/link';
import styles from './MainNav.module.css';
// import { Icons } from '@/components/icons'

export function MainNav() {
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.link}>
        {/* <Icons.logo className="h-6 w-6" /> */}
        <span className={styles.brand}>Magic AI CV Generator</span>
      </Link>
    </div>
  );
}
