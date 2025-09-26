'use client';

import React from 'react';
import { Notification } from '@/types/notifications';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface NotificationToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

/**
 * Individual notification toast component with user-friendly error display.
 * Handles graceful rendering with proper error boundaries and fallback states.
 * Uses modern styling and animations for better user experience.
 */
const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onRemove }) => {
  const { id, type, title, message, actions } = notification;

  /**
   * Handles notification dismissal with error handling to prevent crashes
   */
  const handleDismiss = () => {
    try {
      onRemove(id);
    } catch (error) {
      console.error('Error dismissing notification:', error);
      // Graceful fallback - try to hide the notification visually
      const element = document.getElementById(`notification-${id}`);
      if (element) {
        element.style.display = 'none';
      }
    }
  };

  /**
   * Executes notification actions with error handling
   */
  const handleActionClick = (actionFn: () => void) => {
    try {
      actionFn();
      handleDismiss(); // Auto-dismiss after action
    } catch (error) {
      console.error('Error executing notification action:', error);
      // Show user-friendly error message
      alert('Sorry, an error occurred while processing your request. Please try again.');
    }
  };

  // Get styling based on notification type
  const getNotificationStyles = () => {
    const baseStyles = 'mb-4 p-4 rounded-lg shadow-lg border transition-all duration-300 animate-slide-up max-w-sm';
    
    switch (type) {
      case 'error':
        return cn(baseStyles, 'bg-red-50 border-red-200 text-red-800');
      case 'success':
        return cn(baseStyles, 'bg-green-50 border-green-200 text-green-800');
      case 'warning':
        return cn(baseStyles, 'bg-yellow-50 border-yellow-200 text-yellow-800');
      case 'info':
        return cn(baseStyles, 'bg-blue-50 border-blue-200 text-blue-800');
      default:
        return cn(baseStyles, 'bg-gray-50 border-gray-200 text-gray-800');
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div
      id={`notification-${id}`}
      className={getNotificationStyles()}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <span className="text-lg flex-shrink-0" aria-hidden="true">
            {getIcon()}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
            <p className="text-sm opacity-90">{message}</p>
            
            {/* Action buttons */}
            {actions && actions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => handleActionClick(action.onClick)}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss notification"
        >
          <span className="text-lg">×</span>
        </button>
      </div>
    </div>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

/**
 * Container component for displaying multiple notifications with error handling.
 * Renders notifications in a fixed position with proper z-index and accessibility.
 * Includes error boundaries to prevent notification system crashes from affecting the main app.
 */
export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemove
}) => {
  // Don't render anything if no notifications
  if (notifications.length === 0) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-50 max-h-screen overflow-y-auto"
      style={{ maxWidth: '400px' }}
    >
      {notifications.map((notification) => {
        try {
          return (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onRemove={onRemove}
            />
          );
        } catch (error) {
          console.error('Error rendering notification:', error);
          // Graceful fallback for individual notification errors
          return (
            <div key={notification.id} className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                Error displaying notification. Please refresh the page if issues persist.
              </p>
            </div>
          );
        }
      })}
    </div>
  );
};