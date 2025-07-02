'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import styles from './BackButton.module.css';

const BackButton: React.FC = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={styles.backButton}
    >
      &larr; Back
    </button>
  );
};

export default BackButton;
