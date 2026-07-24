'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { forgotPasswordAction } from '../../actions/auth';
import '../login/login.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [theme, setTheme] = useState('light');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Background Interactive Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 20000));
    const connectionDistance = 140;
    const mouse: { x: number | null; y: number | null; radius: number } = {
      x: null,
      y: null,
      radius: 180,
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.5,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark =
        document.documentElement.getAttribute('data-theme') === 'dark';
      const particleColor = isDark
        ? 'rgba(139, 92, 246, 0.4)'
        : 'rgba(79, 70, 229, 0.25)';
      const lineColor = isDark
        ? 'rgba(139, 92, 246, 0.12)'
        : 'rgba(79, 70, 229, 0.08)';
      const mouseLineColor = isDark
        ? 'rgba(6, 182, 212, 0.25)'
        : 'rgba(6, 182, 212, 0.15)';

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.7;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = mouseLineColor.replace(/[\d.]+\)$/, `${alpha})`);
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${alpha})`);
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.warning('Cảnh báo', {
        description: 'Vui lòng nhập địa chỉ email của bạn.',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await forgotPasswordAction(email.trim());
      if (res.status === 'success') {
        setSubmittedSuccess(true);
        toast.success('Thành công', {
          description: res.message,
        });
      } else {
        toast.error('Lỗi yêu cầu', {
          description: res.message,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi hệ thống', {
        description: 'Đã xảy ra lỗi khi gửi yêu cầu khôi phục mật khẩu.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      {/* Background Canvas */}
      <canvas ref={canvasRef} id="bg-canvas"></canvas>

      {/* Theme Toggle Button */}
      <div className="theme-toggle-container">
        <button
          className="theme-toggle"
          id="global-theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Forgot Password Container - Matched with design-mockups/reset-password.html */}
      <div className="login-container">
        {/* Left Illustration */}
        <div className="login-illustration">
          <img src="/assets/login_illustration.jpg" alt="Login Illustration" />
        </div>

        {/* Right Glassmorphism Card */}
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Reset Password</h1>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginTop: '0.25rem',
              }}
            >
              Enter your email to receive a password reset link.
            </p>
          </div>

          {submittedSuccess ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  color: '#10b981',
                  marginBottom: '1rem',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                }}
              >
                ✓ Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui
                lòng kiểm tra hộp thư (và thư rác) trong vòng 15 phút.
              </div>
              <div
                className="form-buttons-row"
                style={{ justifyContent: 'center' }}
              >
                <Link
                  href="/admin/login"
                  className="btn-login-blue"
                  style={{ textDecoration: 'none' }}
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          ) : (
            <form id="reset-password-form" onSubmit={handleSubmit}>
              {/* Email Row */}
              <div className="form-row">
                <label htmlFor="reset-email" className="form-row-label">
                  Email
                </label>
                <div className="form-row-column">
                  <div className="form-row-input-wrapper">
                    <span className="input-icon-left">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </span>
                    <input
                      type="email"
                      id="reset-email"
                      className="form-input pill-input"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons Row */}
              <div
                className="form-buttons-row"
                style={{ justifyContent: 'flex-end', gap: '12px' }}
              >
                <Link href="/admin/login" className="btn-secondary-outline">
                  Back
                </Link>
                <button
                  type="submit"
                  className="btn-login-blue"
                  id="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Link'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
