'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/components/auth-provider/AuthProvider';
import { useAuthModal } from '@/src/components/auth-component/AuthModalContext';
import { useToast } from '@/hooks/use-toast';
import DownloadButton from '@/src/components/DownloadButton/DownloadButton';
import styles from './ResumeDisplayButtons.module.css';

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
  const { user } = useAuth();
  const { setAuthModalOpen } = useAuthModal();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignInToSave = () => {
    toast({
      title: 'Sign in Required',
      description:
        'Please sign in using the button in the header to save your resume to your library.',
      variant: 'default',
    });
    setAuthModalOpen(true);
  };

  const handleEdit = () => {
    if (!user && onEditResume) {
      toast({
        title: 'Sign in Required',
        description:
          'Please sign in to edit your resume and save it to your library.',
        variant: 'destructive',
      });
      return;
    }
    if (onEditResume) {
      onEditResume();
    }
  };

  const handleUploadNew = () => {
    if (onUploadNew) {
      onUploadNew();
    } else {
      router.push('/');
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
      {/* Authenticated user buttons */}
      {user ? (
        <>
          <button
            type="button"
            onClick={handleEdit}
            className={styles.editButton}
          >
            Edit Resume
          </button>
          {(isOnResumePage || onMyLibrary) && (
            <button
              type="button"
              onClick={handleMyLibrary}
              className={styles.myLibraryButton}
            >
              My Library
            </button>
          )}
          <DownloadButton onClick={onDownloadPdf} />
          <button
            type="button"
            onClick={handleUploadNew}
            className={styles.resetButton}
          >
            Upload New
          </button>
        </>
      ) : (
        /* Unauthenticated user buttons */
        <>
          <DownloadButton onClick={onDownloadPdf} />
          <button
            type="button"
            onClick={handleUploadNew}
            className={styles.resetButton}
          >
            Upload New
          </button>
          <button
            type="button"
            onClick={handleSignInToSave}
            className={styles.signInButton}
          >
            Sign In to Save
          </button>
        </>
      )}
    </div>
  );
};

export default ResumeDisplayButtons;