'use client';

import { useState, useCallback } from 'react';
import { Notification, UseNotificationsReturn } from '@/types/notifications';

/**
 * Custom hook for managing user notifications and error messages.
 * Provides a centralized system for displaying success, error, warning, and info messages
 * with automatic dismissal and user-friendly error handling throughout the application.
 * 
 * @returns Object containing notification state and management functions
 */
export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * Generates a unique ID for notifications to prevent conflicts and enable proper tracking
   */
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }, []);

  /**
   * Adds a new notification to the queue with automatic dismissal after specified duration.
   * Handles graceful error display with try/catch to prevent notification system failures.
   * 
   * @param notification - The notification object to display
   * @returns The generated notification ID for manual removal if needed
   */
  const addNotification = useCallback((notification: Omit<Notification, 'id'>): string => {
    try {
      const id = generateId();
      const newNotification: Notification = {
        ...notification,
        id,
        duration: notification.duration ?? 5000, // Default 5 seconds
      };

      setNotifications(prev => [...prev, newNotification]);

      // Auto-remove notification after duration (graceful error handling)
      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }

      return id;
    } catch (error) {
      console.error('Error adding notification:', error);
      // Fallback: try to show basic browser alert if notification system fails
      try {
        alert(`${notification.title}: ${notification.message}`);
      } catch (alertError) {
        console.error('Critical error: Unable to show notification or alert:', alertError);
      }
      return '';
    }
  }, [generateId]);

  /**
   * Removes a specific notification by ID with error handling to prevent system crashes.
   * 
   * @param id - The unique identifier of the notification to remove
   */
  const removeNotification = useCallback((id: string) => {
    try {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error removing notification:', error);
      // Continue gracefully even if removal fails
    }
  }, []);

  /**
   * Clears all notifications with error handling for bulk operations.
   * Used for cleanup and reset scenarios.
   */
  const clearAll = useCallback(() => {
    try {
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }, []);

  /**
   * Shows an error notification with user-friendly messaging and optional retry actions.
   * Primary method for displaying errors gracefully throughout the application.
   * 
   * @param title - Error title for user display
   * @param message - Detailed error message in user-friendly language
   * @param actions - Optional retry or recovery actions
   * @returns Notification ID
   */
  const showError = useCallback((title: string, message: string, actions?: Notification['actions']): string => {
    return addNotification({
      type: 'error',
      title,
      message,
      actions,
      duration: 8000, // Longer duration for errors
    });
  }, [addNotification]);

  /**
   * Shows a success notification for positive user feedback.
   * 
   * @param title - Success title
   * @param message - Success message
   * @returns Notification ID
   */
  const showSuccess = useCallback((title: string, message: string): string => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration: 4000,
    });
  }, [addNotification]);

  /**
   * Shows a warning notification for potential issues that need user attention.
   * 
   * @param title - Warning title
   * @param message - Warning message
   * @returns Notification ID
   */
  const showWarning = useCallback((title: string, message: string): string => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 6000,
    });
  }, [addNotification]);

  /**
   * Shows an informational notification for general user feedback.
   * 
   * @param title - Info title
   * @param message - Info message
   * @returns Notification ID
   */
  const showInfo = useCallback((title: string, message: string): string => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration: 4000,
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };
};