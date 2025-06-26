import React from 'react';
import styles from './DownloadButton.module.css';

const DownloadButton = ({ onClick }) => (
  <button 
    onClick={onClick}
    className={styles.downloadBtn}
  >
    Download as PDF
  </button>
);

export default DownloadButton;
