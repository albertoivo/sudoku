import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sudoku Game - Challenge Your Mind',
  description: 'Play the classic Sudoku puzzle game with multiple difficulty levels. Built with Next.js and React.',
  keywords: ['sudoku', 'puzzle', 'game', 'brain', 'logic'],
  authors: [{ name: 'Sudoku App Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <ThemeProvider>
          <div className="min-h-full bg-background text-foreground transition-colors duration-300">
            <header className="bg-card shadow-sm border-b border-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex-1"></div>
                  <h1 className="text-2xl font-bold text-foreground">
                    🧩 Sudoku Challenge
                  </h1>
                  <div className="flex-1 flex justify-end">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </header>
            
            <main className="flex-1">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
            
            <footer className="bg-card border-t border-border mt-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="text-center text-sm text-muted-foreground">
                  <p>Built with Next.js, React, and TypeScript</p>
                  <p>Challenge your mind with this classic puzzle game!</p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}