'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

/**
 * Error Boundary component for graceful error handling in React components.
 * Catches JavaScript errors anywhere in the child component tree and displays
 * a user-friendly fallback UI instead of crashing the entire application.
 * Implements comprehensive error logging and recovery mechanisms.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Static method called when an error is caught.
   * Updates component state to trigger error UI rendering.
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  /**
   * Called after an error has been thrown by a descendant component.
   * Used for error reporting and logging with user-friendly error handling.
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging while providing user-friendly messaging
    console.error('Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    
    // Update state with error information for display
    this.setState({
      error,
      errorInfo: errorInfo.componentStack || null
    });

    // In a production app, you would report this error to an error reporting service
    this.reportError(error, errorInfo);
  }

  /**
   * Reports errors to monitoring service (placeholder for actual implementation).
   * In production, this would integrate with services like Sentry, LogRocket, etc.
   */
  private reportError(error: Error, errorInfo: React.ErrorInfo) {
    try {
      // Placeholder for error reporting service integration
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
      };
      
      // In production, send this to your error reporting service
      console.log('Error report (would be sent to monitoring service):', errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  /**
   * Resets the error boundary state to allow recovery.
   * Provides users with a way to retry after encountering an error.
   */
  private handleReset = () => {
    try {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
    } catch (resetError) {
      console.error('Error resetting error boundary:', resetError);
      // Force page reload as last resort
      window.location.reload();
    }
  };

  /**
   * Reloads the entire page as a recovery mechanism.
   * Used when component reset doesn't work properly.
   */
  private handleReload = () => {
    try {
      window.location.reload();
    } catch (reloadError) {
      console.error('Error reloading page:', reloadError);
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or use provided fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-4">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-4">
                An unexpected error occurred while playing Sudoku. Don&apos;t worry, your progress might be saved.
              </p>
            </div>

            {/* Error details (only show in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg text-left">
                <p className="text-sm font-mono text-red-800 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Recovery actions */}
            <div className="space-y-3">
              <Button 
                onClick={this.handleReset}
                className="w-full"
                variant="default"
              >
                Try Again
              </Button>
              
              <Button 
                onClick={this.handleReload}
                className="w-full"
                variant="outline"
              >
                Reload Page
              </Button>

              <p className="text-xs text-gray-500 mt-4">
                If this problem persists, please try refreshing your browser or clearing your cache.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;