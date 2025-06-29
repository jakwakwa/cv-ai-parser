'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
      <button
        type="button"
        onClick={() => handleTabClick('upload')}
        className={`${styles.tabButton} ${currentView === 'upload' ? styles.activeTab : styles.inactiveTab}`}
        style={{ height: '50px' }}
      >
        Upload New Resume
      </button>
      <button
        type="button"
        onClick={() => handleTabClick('library')}
        className={`${styles.tabButton} ${currentView === 'library' ? styles.activeTab : styles.inactiveTab}`}
        style={{ height: '50px' }}
      >
        My Resume Library
      </button>
    </div>
  );
}
