'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import DownloadButton from '@/src/components/download-button/download-button';
import { Button } from '@/src/components/ui/ui-button/button';
import styles from './resume-display-buttons.module.css';

interface ResumeDisplayButtonsProps {
  onDownloadPdf: () => void;
  onEditResume?: () => void;
  onUploadNew?: () => void;
  onMyLibrary?: () => void;
  isOnResumePage?: boolean;
}

export const ResumeDisplayButtons: React.FC<ResumeDisplayButtonsProps> = ({
  onDownloadPdf,
  onEditResume,
  onUploadNew,
  onMyLibrary,
  isOnResumePage = false,
}) => {
  const router = useRouter();

  const handleUploadNew = () => {
    if (onUploadNew) {
      onUploadNew();
    } else {
      router.push('/tools/tailor');
    }
  };

  const handleMyLibrary = () => {
    if (onMyLibrary) {
      onMyLibrary();
    } else {
      router.push('/library');
    }
  };

  return (
    <div className={styles.buttonContainer}>
      <Button type="button" onClick={onEditResume} variant="default">
        Edit Resume
      </Button>
      {(isOnResumePage || onMyLibrary) && (
        <Button type="button" onClick={handleMyLibrary} variant="default">
          My Library
        </Button>
      )}
      <Button type="button" onClick={handleUploadNew} variant="default">
        Upload New
      </Button>
      <DownloadButton onClick={onDownloadPdf} />
    </div>
  );
};

export default ResumeDisplayButtons;
