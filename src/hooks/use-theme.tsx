'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme?: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }
  window.addEventListener('storage', callback);
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', callback);
  };
};

const getSnapshot = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('theme');
};

const getServerSnapshot = () => {
  return 'system';
};

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: ThemeProviderProps) {
  const storedTheme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [theme, setThemeState] = useState<Theme>(
    (storedTheme as Theme) || defaultTheme
  );
  const [resolvedTheme, setResolvedTheme] = useState<
    'light' | 'dark' | undefined
  >();

  useEffect(() => {
    const newResolvedTheme =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme;

    setResolvedTheme(newResolvedTheme);
    document.documentElement.setAttribute('data-theme', newResolvedTheme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
