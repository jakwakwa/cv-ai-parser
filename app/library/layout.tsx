import type React from 'react';
import styles from './layout.module.css';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.libraryLayout}>
      <main>{children}</main>
    </div>
  );
}
