'use client';

import React, { useState, useEffect } from 'react';
import { useNotification } from '../lib/context/NotificationContext';
import styles from './page.module.css';

export default function HomePage() {
  const { showNotification } = useNotification();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Khởi động đồng bộ theme vào html tag
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    showNotification({
      type: 'info',
      message: 'Chuyển đổi chủ đề',
      description: `Đã kích hoạt chế độ giao diện ${nextTheme === 'dark' ? 'Tối (Dark)' : 'Sáng (Light)'}.`,
      duration: 3000,
    });
  };

  const handleTrigger = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: {
        message: 'Lưu dự án thành công!',
        description:
          'Thông tin dự án mới đã được lưu trữ an toàn trong cơ sở dữ liệu MongoDB.',
      },
      error: {
        message: 'Lỗi đồng bộ dữ liệu!',
        description:
          'Không thể kết nối tới máy chủ lưu trữ Prisma client. Vui lòng kiểm tra lại.',
      },
      warning: {
        message: 'Dữ liệu chưa được công bố!',
        description:
          'Dự án này đang ở trạng thái Nháp (Draft). Chỉ có quản trị viên mới nhìn thấy.',
      },
      info: {
        message: 'Cập nhật hệ thống thành công',
        description:
          'Trình quản lý tệp tin CV vừa được nâng cấp lên phiên bản mới nhất.',
      },
    };

    showNotification({
      type,
      message: messages[type].message,
      description: messages[type].description,
      duration: 4500,
    });
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label="Đổi giao diện"
        >
          {theme === 'light' ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
          <span>{theme === 'light' ? 'Chế độ Tối' : 'Chế độ Sáng'}</span>
        </button>
      </header>

      <section className={styles.hero}>
        <h1 className={styles.title}>Premium Portfolio</h1>
        <p className={styles.subtitle}>
          Hệ thống thông báo toàn hệ thống - Phong cách Liquid Glass
        </p>
      </section>

      <section className={styles.demoSection}>
        <h2 className={styles.sectionTitle}>
          Bảng điều khiển kiểm thử thông báo
        </h2>
        <div className={styles.buttonGrid}>
          <button
            className={`${styles.btn} ${styles.btnSuccess}`}
            onClick={() => handleTrigger('success')}
          >
            Success Notification
          </button>
          <button
            className={`${styles.btn} ${styles.btnError}`}
            onClick={() => handleTrigger('error')}
          >
            Error Notification
          </button>
          <button
            className={`${styles.btn} ${styles.btnWarning}`}
            onClick={() => handleTrigger('warning')}
          >
            Warning Notification
          </button>
          <button
            className={`${styles.btn} ${styles.btnInfo}`}
            onClick={() => handleTrigger('info')}
          >
            Info Notification
          </button>
        </div>
      </section>
    </main>
  );
}
