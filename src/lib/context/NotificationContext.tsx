'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import NotificationContainer from '../../components/Notification/Notification';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  description?: string;
  duration?: number; // duration in ms, default 4000ms. If 0 or null, won't auto dismiss
}

interface NotificationContextProps {
  showNotification: (notification: Omit<NotificationItem, 'id'>) => void;
  dismissNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showNotification = useCallback(
    (notification: Omit<NotificationItem, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      const newItem: NotificationItem = {
        ...notification,
        id,
        duration:
          notification.duration !== undefined ? notification.duration : 4000,
      };
      setNotifications((prev) => [...prev, newItem]);
    },
    [],
  );

  return (
    <NotificationContext.Provider
      value={{ showNotification, dismissNotification }}
    >
      {children}
      <NotificationContainer
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }
  return context;
};
