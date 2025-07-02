'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/components/auth-provider/AuthProvider';
import { useAuthModal } from '@/src/components/auth-component/AuthModalContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/src/components/ui/button';
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
          <Button
            type="button"
            onClick={handleEdit}
            variant="default"
          >
            Edit Resume
          </Button>
          {(isOnResumePage || onMyLibrary) && (
            <Button
              type="button"
              onClick={handleMyLibrary}
              variant="default"
            >
              My Library
            </Button>
          )}
          <Button
            type="button"
            onClick={handleUploadNew}
            variant="default"
          >
            Upload New
          </Button>
          <DownloadButton onClick={onDownloadPdf} />
        </>
      ) : (
        /* Unauthenticated user buttons */
        <>
          <Button
            type="button"
            onClick={handleUploadNew}
            variant="default"
          >
            Upload New
          </Button>
          <Button
            type="button"
            onClick={handleSignInToSave}
            variant="default"
          >
            Sign In to Save
          </Button>
          <DownloadButton onClick={onDownloadPdf} />
        </>
      )}
    </div>
  );
};

export default ResumeDisplayButtons;