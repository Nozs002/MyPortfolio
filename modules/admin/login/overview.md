# Admin Login Module Overview

> [!NOTE] **EN:** Provide a high-level overview of this module's
> responsibilities and scope. **VI:** Cung cấp cái nhìn tổng quan về trách nhiệm
> và phạm vi của module này.

## 1. Trách nhiệm (Responsibilities)

Module Đăng nhập Quản trị (**Admin Login**) chịu trách nhiệm quản lý quá trình
xác thực và kiểm soát quyền truy cập của duy nhất chủ sở hữu Portfolio
(Single-Admin) vào khu vực quản trị của hệ thống.

Các trách nhiệm chính bao gồm:

- **Xác thực danh tính (Authentication):** Hỗ trợ đăng nhập kép thông qua
  Credentials (Tên đăng nhập & Mật khẩu) và Google OAuth 2.0.
- **Kiểm soát truy cập (Access Control):** Bảo vệ các trang quản trị
  (`/admin/*`, `/dashboard/*`) và ngăn chặn truy cập trái phép từ những người
  dùng chưa xác thực hoặc tài khoản Google không hợp lệ.
- **Ghi nhật ký bảo mật (Audit Logging):** Ghi lại mọi hành động đăng nhập thành
  công, thất bại hoặc các thao tác thay đổi mật khẩu nhằm giám sát an ninh hệ
  thống.
- **Khôi phục mật khẩu (Password Recovery):** Cung cấp cơ chế khôi phục mật khẩu
  an toàn qua email xác thực.

## 2. Phạm vi (Scope)

Module này bao gồm các thành phần sau:

- **Giao diện người dùng (Frontend):**
  - Trang đăng nhập quản trị (`/admin/login`) hiển thị form đăng nhập truyền
    thống cùng nút liên kết tài khoản Google. Giao diện frontend sẽ được code
    dựa trên tài liệu
    [design-mockups/login.html](file:///d:/Workspace/Projects/my-portfolio/design-mockups/login.html)
    bao gồm cả hiệu ứng animation.
  - Trang yêu cầu khôi phục mật khẩu (`/admin/forgot-password`).
  - Trang đặt lại mật khẩu mới (`/admin/reset-password`).
- **Logic máy chủ (Backend/Server):**
  - Route API NextAuth.js (`/api/auth/[...nextauth]`) đóng vai trò xử lý luồng
    đăng nhập và callbacks xác thực.
  - Next.js Middleware (`middleware.ts`) đóng vai trò lá chắn (Route Guard) chặn
    truy cập ở tầng edge.
  - Các Server Actions (`src/app/actions/auth.ts`) phục vụ việc đổi mật khẩu và
    xử lý các token đặt lại mật khẩu gửi qua email.
  - Tích hợp dịch vụ gửi thư (Resend / Brevo) gửi email chứa link xác thực khôi
    phục mật khẩu thời hạn 15 phút.
  - Tích hợp tiện ích Audit Log (`src/lib/audit.ts`) ghi sự kiện đăng nhập vào
    cơ sở dữ liệu MongoDB Atlas.
