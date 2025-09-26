'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * Theme Toggle Component with smooth animations and accessible design.
 * 
 * Features:
 * - Smooth transition animations
 * - Sun/Moon icons with rotation effects
 * - Accessible keyboard navigation
 * - ARIA labels for screen readers
 * - Hover and focus states
 * - Visual feedback on click
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = false 
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        w-12 h-12 rounded-full
        bg-gray-200 dark:bg-gray-700
        hover:bg-gray-300 dark:hover:bg-gray-600
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
        transition-all duration-300 ease-in-out
        transform hover:scale-105 active:scale-95
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Sun Icon */}
      <div
        className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-500 ease-in-out
          ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
        `}
      >
        <svg
          className="w-6 h-6 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Moon Icon */}
      <div
        className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-500 ease-in-out
          ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
        `}
      >
        <svg
          className="w-6 h-6 text-blue-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>

      {/* Optional Label */}
      {showLabel && (
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          {isDark ? 'Dark' : 'Light'} Mode
        </span>
      )}
      
      {/* Ripple Effect */}
      <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 scale-0 transition-all duration-300 pointer-events-none" />
    </button>
  );
};

export default ThemeToggle;