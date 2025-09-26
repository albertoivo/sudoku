export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  showError: (title: string, message: string, actions?: Notification['actions']) => string;
  showSuccess: (title: string, message: string) => string;
  showWarning: (title: string, message: string) => string;
  showInfo: (title: string, message: string) => string;
}