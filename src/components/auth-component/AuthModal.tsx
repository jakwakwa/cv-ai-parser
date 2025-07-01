'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import AuthComponent from './AuthComponent';
import { useAuthModal } from './AuthModalContext';

interface AuthModalProps {
  onSuccess?: () => void;
}

export function AuthModal({ onSuccess }: AuthModalProps) {
  const { isAuthModalOpen, setAuthModalOpen } = useAuthModal();

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
          <DialogTitle className="hidden">Authentication</DialogTitle>
          <DialogDescription className="hidden">
            Sign in or create an account to continue.
          </DialogDescription>
        </DialogHeader>
        <AuthComponent onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
