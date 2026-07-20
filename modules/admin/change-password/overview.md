# Admin Change Password Module Overview

> [!NOTE] **EN:** Provide a high-level overview of this module's
> responsibilities and scope. **VI:** Cung cấp cái nhìn tổng quan về trách nhiệm
> và phạm vi của module này.

## 1. Trách nhiệm (Responsibilities)

Module Đổi Mật khẩu Quản trị (**Admin Change Password**) chịu trách nhiệm cung
cấp cơ chế thay đổi mật khẩu an toàn, đạt tiêu chuẩn an ninh Doanh nghiệp
(Enterprise Security) dành riêng cho chủ sở hữu Portfolio (Single-Admin) trực
tiếp từ giao diện cài đặt CMS.

Các trách nhiệm chính bao gồm:

- **Xác thực & Kiểm tra dữ liệu (Validation & Current Password Verification):**
  Đảm bảo cả 3 trường dữ liệu (`currentPassword`, `newPassword`,
  `confirmPassword`) không được để trống và xác thực đúng mật khẩu hiện tại bằng
  `bcrypt`.
- **Kiểm soát tần suất & Chống dò mật khẩu (Rate Limiting & Lockout):** Giới hạn
  tần suất đổi mật khẩu; nếu nhập sai mật khẩu quá 5 lần liên tiếp trong 15
  phút, hệ thống tự động tạm khóa chức năng trong 30 phút để chặn tấn công
  Brute-force.
- **Bảo toàn dữ liệu bằng Transaction (ACID Transaction & Rollback):** Thực thi
  việc cập nhật `passwordHash` trong bảng `User` và lưu vết vào `AuditLog` trong
  cùng một Database Transaction trên MongoDB Atlas. Tự động Rollback 100% nếu
  một trong hai tác vụ gặp lỗi.
- **Vô hiệu hóa phiên toàn cục (Global Sign-out):** Tăng giá trị `tokenVersion`
  (hoặc `passwordUpdatedAt`) để vô hiệu hóa ngay lập tức toàn bộ các phiên làm
  việc (Session/JWT) đang hoạt động trên tất cả các trình duyệt và thiết bị
  khác.
- **Ghi nhật ký kiểm toán & Email cảnh báo chi tiết (Audit Log & Detailed
  Alert):** Ghi lại sự kiện kèm IP/User-Agent và phát email thông báo bảo mật
  chứa **Thời gian, Địa chỉ IP, Trình duyệt và Loại thiết bị** tới hòm thư quản
  trị.

## 2. Phạm vi (Scope)

Module này bao gồm các thành phần sau:

- **Giao diện người dùng (Frontend):**
  - Giao diện form đổi mật khẩu trong Dashboard CMS (`/admin/dashboard/settings`
    hoặc `/admin/change-password`).
  - Các thành phần kiểm tra dữ liệu không để trống, công cụ đo độ mạnh mật khẩu
    (Password Strength Meter) và hiển thị thời gian bị tạm khóa (nếu vi phạm
    rate limit).
- **Logic máy chủ (Backend/Server):**
  - Server Action `changePasswordAction(data)` nằm tại
    `src/app/actions/auth.ts`.
  - Bộ đếm và kiểm soát Rate Limiting / Lockout cho đổi mật khẩu.
  - Tiện ích băm và kiểm tra mã hóa `bcrypt`.
  - Giao dịch Prisma Interactive Transaction (`prisma.$transaction`).
  - Tích hợp hàm `createAuditLog` ghi vết sự kiện bảo mật.
  - Dịch vụ gửi email (Resend / Brevo API) phát thư cảnh báo chứa thông số thiết
    bị/IP.
  - Xử lý vô hiệu hóa Token JWT toàn cục (Global Sign-out).
