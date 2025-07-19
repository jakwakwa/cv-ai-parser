'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/ui-button/button';
import styles from './TabNavigation.module.css';

interface TabNavigationProps {
  initialView: 'upload' | 'library';
  adSpace?: any;
}

export default function TabNavigation({
  initialView,
  adSpace,
}: TabNavigationProps) {
  const router = useRouter();
  const [currentView, setCurrentView] = useState(initialView);

  const handleTabClick = (view: 'upload' | 'library') => {
    setCurrentView(view);
    router.push(view === 'upload' ? '/tools/tailor/' : '/library');
  };

  return (
    <div className={styles.tabNavigationContainer}>
      <p>More Options</p>
      <Button
        type="button"
        variant="default"
        onClick={() => handleTabClick('upload')}
        className={`${styles.tabButton} ${currentView === 'upload' ? styles.activeTab : styles.inactiveTab}`}
        style={{ marginBottom: '0.2rem' }}
      >
        Tailor New Resume
      </Button>
      <hr
        style={{
          borderTop: '1px solid var(--color-border-light)',
          height: '1px',
          width: '100%',
          marginBottom: '0.5rem',
        }}
      />
      {adSpace}
    </div>
  );
}
