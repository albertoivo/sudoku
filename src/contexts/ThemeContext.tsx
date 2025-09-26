'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeContextType } from '@/types/theme';

/**
 * Theme Context for managing light/dark mode across the application.
 * 
 * Features:
 * - Persistent theme storage in localStorage
 * - System preference detection (prefers-color-scheme)
 * - Smooth theme transitions
 * - CSS custom properties for dynamic theming
 * - Accessibility-compliant color schemes
 */

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Gets the initial theme from localStorage or system preference
 */
const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    // Check localStorage first
    const savedTheme = localStorage.getItem('sudoku-theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    
    // Fall back to system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  
  return 'light';
};

/**
 * Updates CSS custom properties and HTML class based on current theme
 */
const updateThemeProperties = (theme: Theme) => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Update HTML class for Tailwind dark mode
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Update CSS custom properties for smooth transitions
  root.style.setProperty('--theme-transition', 'all 0.3s ease-in-out');
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);
    updateThemeProperties(initialTheme);
    setMounted(true);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a theme
      const savedTheme = localStorage.getItem('sudoku-theme');
      if (!savedTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        updateThemeProperties(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('sudoku-theme', newTheme);
    updateThemeProperties(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use the theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Hook to get the current theme colors
 */
export const useThemeColors = () => {
  const { theme } = useTheme();
  
  // These will be handled by Tailwind's dark: modifier and CSS custom properties
  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};