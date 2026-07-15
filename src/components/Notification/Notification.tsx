'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  NotificationItem,
  NotificationType,
} from '../../lib/context/NotificationContext';
import styles from './Notification.module.css';

interface NotificationContainerProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return (
        <svg
          className={`${styles.icon} ${styles.successIcon}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case 'error':
      return (
        <svg
          className={`${styles.icon} ${styles.errorIcon}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
    case 'warning':
      return (
        <svg
          className={`${styles.icon} ${styles.warningIcon}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case 'info':
      return (
        <svg
          className={`${styles.icon} ${styles.infoIcon}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
};

const NotificationCard: React.FC<{
  item: NotificationItem;
  onDismiss: (id: string) => void;
}> = ({ item, onDismiss }) => {
  const { id, type, message, description, duration } = item;
  const [isClosing, setIsClosing] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingTimeRef = useRef<number>(duration || 0);
  const startTimeRef = useRef<number>(0);

  const startTimer = () => {
    if (!duration) return;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      handleClose();
    }, remainingTimeRef.current);
  };

  const pauseTimer = () => {
    if (!duration || !timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
    remainingTimeRef.current -= Date.now() - startTimeRef.current;
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onDismiss(id);
    }, 300); // Khớp với transition duration fadeOut trong CSS
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className={`${styles.card} ${styles[type]} ${isClosing ? styles.closing : ''}`}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      role="alert"
    >
      <div className={styles.iconContainer}>{getIcon(type)}</div>
      <div className={styles.contentContainer}>
        <h4 className={styles.title}>{message}</h4>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Đóng thông báo"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      {duration && duration > 0 && (
        <div
          className={styles.progressBar}
          style={{
            animationDuration: `${duration}ms`,
            animationPlayState: timerRef.current ? 'running' : 'paused',
          }}
        />
      )}
    </div>
  );
};

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onDismiss,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className={styles.container}>
      {notifications.map((item) => (
        <NotificationCard key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default NotificationContainer;
