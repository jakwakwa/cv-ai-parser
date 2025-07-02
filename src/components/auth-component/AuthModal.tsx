'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import AuthComponent from './AuthComponent';
import { useAuthModal } from './AuthModalContext';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  onSuccess?: () => void;
}

export function AuthModal({ onSuccess }: AuthModalProps) {
  const { isAuthModalOpen, setAuthModalOpen } = useAuthModal();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAuthModalOpen]);

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
      <DialogContent className="dialog-content-custom-class">
        <DialogHeader>
          <DialogTitle className={styles.hidden}>Authentication</DialogTitle>
          <DialogDescription className={styles.hidden}>
            Sign in or create an account to continue.
          </DialogDescription>
        </DialogHeader>
        <AuthComponent
          onSuccess={() => {
            setAuthModalOpen(false);
            toast({
              title: 'Success',
              description: 'Successfully signed in!',
            });
            if (onSuccess) {
              onSuccess();
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
