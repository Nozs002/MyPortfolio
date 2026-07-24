'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  validateResetTokenAction,
  resetPasswordAction,
} from '../../actions/auth';
import { validatePasswordComplexity } from '../../../lib/password';
import '../login/login.css';

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Read theme
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

  // Phase 1: Validate Token on Page Load (REQ-RECOVERY-006)
  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setIsValidating(false);
        setTokenValid(false);
        setErrorMessage('Thiếu mã token xác thực.');
        return;
      }

      try {
        const res = await validateResetTokenAction(token);
        if (res.status === 'success') {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setErrorMessage(res.message);
        }
      } catch (err) {
        console.error(err);
        setTokenValid(false);
        setErrorMessage('Không thể xác thực mã token khôi phục.');
      } finally {
        setIsValidating(false);
      }
    }

    validateToken();
  }, [token]);

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

  // Live password complexity check (REQ-RECOVERY-014)
  const passwordCheck = validatePasswordComplexity(newPassword);

  // Phase 2: Execute Password Reset (REQ-RECOVERY-007, REQ-RECOVERY-008)
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordCheck.isValid) {
      toast.warning('Mật khẩu chưa đủ độ mạnh', {
        description:
          'Vui lòng thỏa mãn tất cả các yêu cầu độ phức tạp mật khẩu.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning('Mật khẩu không trùng khớp', {
        description: 'Mật khẩu mới và mật khẩu xác nhận không khớp nhau.',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await resetPasswordAction(token, newPassword);
      if (res.status === 'success') {
        toast.success('Thành công', {
          description: res.message,
        });
        setTimeout(() => {
          router.push('/admin/login');
        }, 1500);
      } else {
        toast.error('Lỗi đặt lại mật khẩu', {
          description: res.message,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi hệ thống', {
        description: 'Đã xảy ra lỗi trong quá trình cập nhật mật khẩu mới.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      {/* Background Interactive Canvas */}
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

      {/* Reset Password Container */}
      <div className="login-container">
        {/* Left Illustration */}
        <div className="login-illustration">
          <img src="/assets/login_illustration.jpg" alt="Login Illustration" />
        </div>

        {/* Right Glassmorphism Card */}
        <div
          className="login-card"
          style={{ height: 'auto', minHeight: '336px' }}
        >
          <div className="login-header">
            <h1 className="login-title">New Password</h1>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginTop: '0.25rem',
              }}
            >
              Set a strong new password for your admin account.
            </p>
          </div>

          {isValidating ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem 0',
                color: 'var(--text-secondary)',
              }}
            >
              Đang xác thực liên kết khôi phục...
            </div>
          ) : !tokenValid ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  color: '#ef4444',
                  marginBottom: '1rem',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                }}
              >
                ⚠️{' '}
                {errorMessage ||
                  'Liên kết khôi phục mật khẩu không hợp lệ hoặc đã hết hạn.'}
              </div>
              <div
                className="form-buttons-row"
                style={{ justifyContent: 'center' }}
              >
                <Link
                  href="/admin/forgot-password"
                  className="btn-login-blue"
                  style={{ textDecoration: 'none' }}
                >
                  Gửi lại yêu cầu khôi phục
                </Link>
              </div>
            </div>
          ) : (
            <form id="new-password-form" onSubmit={handleResetSubmit}>
              {/* New Password Input */}
              <div className="form-row password-row">
                <label htmlFor="new-password" className="form-row-label">
                  New Password
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
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="new-password"
                      className="form-input form-input-password pill-input"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle Password Visibility"
                    >
                      {showPassword ? (
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
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
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
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="form-row password-row">
                <label htmlFor="confirm-password" className="form-row-label">
                  Confirm
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
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirm-password"
                      className="form-input form-input-password pill-input"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>

              {/* Live Password Complexity Indicators */}
              <div className="password-requirements-list">
                <div
                  className={`req-item ${passwordCheck.hasMinLength ? 'valid' : 'invalid'}`}
                >
                  {passwordCheck.hasMinLength ? '✓' : '•'} Tối thiểu 8 ký tự
                </div>
                <div
                  className={`req-item ${passwordCheck.hasUppercase ? 'valid' : 'invalid'}`}
                >
                  {passwordCheck.hasUppercase ? '✓' : '•'} Ít nhất 1 chữ cái
                  viết hoa (A-Z)
                </div>
                <div
                  className={`req-item ${passwordCheck.hasLowercase ? 'valid' : 'invalid'}`}
                >
                  {passwordCheck.hasLowercase ? '✓' : '•'} Ít nhất 1 chữ cái
                  viết thường (a-z)
                </div>
                <div
                  className={`req-item ${passwordCheck.hasDigit ? 'valid' : 'invalid'}`}
                >
                  {passwordCheck.hasDigit ? '✓' : '•'} Ít nhất 1 chữ số (0-9)
                </div>
                <div
                  className={`req-item ${passwordCheck.hasSpecialChar ? 'valid' : 'invalid'}`}
                >
                  {passwordCheck.hasSpecialChar ? '✓' : '•'} Ít nhất 1 ký tự đặc
                  biệt (!, @, #, $, %)
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
                  disabled={loading || !passwordCheck.isValid}
                >
                  {loading ? 'Updating...' : 'Save Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
