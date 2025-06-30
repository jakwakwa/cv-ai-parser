'use client';

import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import { useAuth } from '../auth-provider/AuthProvider';
import AuthComponent from './AuthComponent';
import { useAuthModal } from './AuthModalContext';

export default function AuthModal() {
  const { user } = useAuth();
  const { isAuthModalOpen, setAuthModalOpen } = useAuthModal();

  // Don't render anything if user is already authenticated
  if (user) {
    return null;
  }

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 rounded-full p-0"
          aria-label="Sign in"
          onClick={() => setAuthModalOpen(true)}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <title>Sign in</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In / Sign Up</DialogTitle>
        </DialogHeader>
        <AuthComponent onSuccess={() => setAuthModalOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
