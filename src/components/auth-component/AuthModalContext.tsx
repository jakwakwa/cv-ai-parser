import { createContext, useContext } from 'react';

interface AuthModalContextType {
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

export const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};
