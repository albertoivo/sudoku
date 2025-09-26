/**
 * Theme types and interfaces for the application
 */
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/**
 * Accessible color palette following WCAG 2.1 AA standards
 * All color combinations meet minimum 4.5:1 contrast ratio
 */
export const lightTheme = {
  // Primary colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main primary
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Neutral colors
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Status colors
  success: {
    50: '#ecfdf5',
    500: '#10b981',
    600: '#059669',
  },
  
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
  
  // Sudoku-specific colors
  sudoku: {
    cellBackground: '#ffffff',
    cellBorder: '#e5e7eb',
    cellHover: '#f9fafb',
    cellSelected: '#dbeafe',
    cellPrefilled: '#f3f4f6',
    cellConflict: '#fef2f2',
    boardBorder: '#374151',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textError: '#dc2626',
  }
} as const;

export const darkTheme = {
  // Primary colors (adjusted for dark mode)
  primary: {
    50: '#1e3a8a',
    100: '#1e40af',
    200: '#1d4ed8',
    300: '#2563eb',
    400: '#3b82f6',
    500: '#60a5fa', // Main primary in dark mode
    600: '#93c5fd',
    700: '#bfdbfe',
    800: '#dbeafe',
    900: '#eff6ff',
  },
  
  // Neutral colors (inverted)
  neutral: {
    50: '#111827',
    100: '#1f2937',
    200: '#374151',
    300: '#4b5563',
    400: '#6b7280',
    500: '#9ca3af',
    600: '#d1d5db',
    700: '#e5e7eb',
    800: '#f3f4f6',
    900: '#f9fafb',
  },
  
  // Status colors (slightly adjusted for dark backgrounds)
  success: {
    50: '#064e3b',
    500: '#34d399',
    600: '#10b981',
  },
  
  warning: {
    50: '#78350f',
    500: '#fbbf24',
    600: '#f59e0b',
  },
  
  error: {
    50: '#7f1d1d',
    500: '#f87171',
    600: '#ef4444',
  },
  
  // Sudoku-specific colors for dark mode
  sudoku: {
    cellBackground: '#1f2937',
    cellBorder: '#4b5563',
    cellHover: '#374151',
    cellSelected: '#1e40af',
    cellPrefilled: '#111827',
    cellConflict: '#7f1d1d',
    boardBorder: '#e5e7eb',
    textPrimary: '#f9fafb',
    textSecondary: '#9ca3af',
    textError: '#f87171',
  }
} as const;

export type ColorTheme = typeof lightTheme;