---
id: modules/admin/password-recovery/overview.md
type: document
title: overview
module: MOD-ADMIN-RECOVERY
status: approved
version: 1.0
owner: PO
tags:
  - admin
  - password-recovery
  - overview
last_updated: 2026-07-20
---

# Password Recovery Module Overview

> [!NOTE] **EN:** Provide a high-level overview of this module's
> responsibilities and scope. **VI:** Cung cấp cái nhìn tổng quan về trách nhiệm
> và phạm vi của module quên và khôi phục mật khẩu.

## 1. Trách nhiệm (Responsibilities)

Module Quên và Khôi phục Mật khẩu (**Password Recovery**) chịu trách nhiệm cung
cấp giải pháp an toàn và bảo mật giúp quản trị viên duy nhất (Portfolio Owner)
lấy lại quyền truy cập vào hệ thống quản trị khi quên mật khẩu đăng nhập
Credentials.

Các trách nhiệm chính bao gồm:

- **Yêu cầu khôi phục mật khẩu:** Tiếp nhận email yêu cầu khôi phục, xác minh
  danh tính tài khoản quản trị viên.
- **Quản lý Token bảo mật:** Sinh token ngẫu nhiên, thiết lập thời gian hết hạn
  (15 phút), lưu trữ trạng thái token trong cơ sở dữ liệu để phục vụ xác thực
  một lần duy nhất.
- **Gửi Email khôi phục:** Tự động tạo và gửi email chứa liên kết đặt lại mật
  khẩu an toàn đến hòm thư đã đăng ký của quản trị viên qua giao thức SMTP.
- **Xác thực và Cập nhật mật khẩu:** Kiểm tra tính hợp lệ của token và cập nhật
  mật khẩu mới (đã băm bcrypt) vào cơ sở dữ liệu.
- **Ghi nhật ký kiểm toán (Audit Logging):** Ghi lại mọi hành động yêu cầu khôi
  phục và đặt lại mật khẩu thành công/thất bại để phục vụ giám sát bảo mật.

## 2. Phạm vi (Scope)

Module này bao gồm các thành phần sau:

- **Giao diện người dùng (Frontend Pages):**
  - Trang yêu cầu khôi phục mật khẩu (`/admin/forgot-password`): Biểu mẫu nhập
    email và gửi yêu cầu.
  - Trang đặt lại mật khẩu mới (`/admin/reset-password?token=XYZ`): Biểu mẫu
    kiểm tra token và cho phép nhập mật khẩu mới.
- **Logic máy chủ (Backend/Server):**
  - Thực thể cơ sở dữ liệu (`PasswordResetToken`): Bảng dữ liệu quản lý token
    khôi phục mật khẩu trong MongoDB Atlas.
  - Các Server Actions (`src/app/actions/auth.ts`):
    - `forgotPasswordAction(email)`: Tạo token, lưu vào DB, gửi mail SMTP.
    - `resetPasswordAction(token, newPassword)`: Xác thực token, băm mật khẩu
      mới, cập nhật DB, xóa token.
  - Tiện ích gửi thư SMTP (`src/lib/mail.ts`): Cấu hình Nodemailer kết nối với
    SMTP server để gửi email khôi phục mật khẩu.
  - Tích hợp kiểm toán (`src/lib/audit.ts`): Ghi log sự kiện
    `PASSWORD_RESET_REQUEST` và `PASSWORD_RESET_SUCCESS` vào DB.
