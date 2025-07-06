'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/ui-button/button';
import styles from './TabNavigation.module.css';

interface TabNavigationProps {
  initialView: 'upload' | 'library';
}

export default function TabNavigation({ initialView }: TabNavigationProps) {
  const router = useRouter();
  const [currentView, setCurrentView] = useState(initialView);

  const handleTabClick = (view: 'upload' | 'library') => {
    setCurrentView(view);
    router.push(view === 'upload' ? '/' : '/library');
  };

  return (
    <div className={styles.tabNavigationContainer}>
      <Button
        type="button"
        variant="default"
        onClick={() => handleTabClick('upload')}
        className={`${styles.tabButton} ${currentView === 'upload' ? styles.activeTab : styles.inactiveTab}`}
      >
        Upload
      </Button>
      <Button
        type="button"
        variant="primary"
        onClick={() => handleTabClick('library')}
        className={`${styles.tabButton} ${currentView === 'library' ? styles.activeTab : styles.inactiveTab}`}
      >
        My Library
      </Button>
    </div>
  );
}
