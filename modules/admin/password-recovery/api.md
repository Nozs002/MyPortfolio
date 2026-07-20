---
id: modules/admin/password-recovery/api.md
type: document
title: api
module: MOD-ADMIN-RECOVERY
status: draft
version: 1.0
owner: PO
tags:
  - admin
  - password-recovery
  - api
last_updated: 2026-07-20
---

# Password Recovery Module API

> [!NOTE] **EN:** Define the API endpoints, requests, and responses for this
> module. **VI:** Định nghĩa các API, Server Actions, request và response cho
> module khôi phục mật khẩu.

Hệ thống quản trị sử dụng các Next.js Server Actions hoặc API endpoints nội bộ
để hỗ trợ các thao tác yêu cầu gửi mail và đặt lại mật khẩu:

---

## 1. Server Actions Đặc tả (Server Actions Specification)

Toàn bộ các logic xử lý nghiệp vụ khôi phục mật khẩu được xây dựng dưới dạng các
Server Actions nằm tại file
[auth.ts](file:///d:/Workspace/Projects/my-portfolio/src/app/actions/auth.ts).

### `forgotPasswordAction(email)`

- **Mô tả (Description):** Tiếp nhận yêu cầu gửi liên kết khôi phục mật khẩu.
  Xác thực email Admin, áp dụng giới hạn tần suất (Rate Limiting) theo IP, sinh
  token ngẫu nhiên có hạn 15 phút, lưu vào DB, ghi nhật ký kiểm toán và gửi
  email bất đồng bộ qua SMTP.
- **Tham số đầu vào (Request Parameters):**

  ```typescript
  interface ForgotPasswordData {
    email: string;
  }
  ```

- **Kết quả trả về (Response):**
  - **Thành công (Success):**

    ```json
    {
      "status": "success",
      "message": "Liên kết khôi phục mật khẩu đã được gửi vào hòm thư của bạn."
    }
    ```

  - **Thất bại - Email không chính xác (Error - Invalid Email):**

    ```json
    {
      "status": "error",
      "message": "Địa chỉ email không chính xác hoặc không tồn tại."
    }
    ```

  - **Thất bại - Vượt quá tần suất yêu cầu (Error - Rate Limited):**

    ```json
    {
      "status": "error",
      "message": "Bạn đã yêu cầu gửi email quá số lần cho phép. Vui lòng thử lại sau 15 phút."
    }
    ```

---

### `validateResetTokenAction(token)`

- **Mô tả (Description):** Được gọi tự động ở phía Client khi người dùng vừa
  truy cập vào đường dẫn `/admin/reset-password?token=XYZ` nhằm xác thực nhanh
  xem token có hợp lệ và còn hạn sử dụng hay không (Phase 1).
- **Tham số đầu vào (Request Parameters):**

  ```typescript
  interface ValidateTokenData {
    token: string;
  }
  ```

- **Kết quả trả về (Response):**
  - **Thành công (Token hợp lệ):**

    ```json
    {
      "status": "success",
      "message": "Token hợp lệ.",
      "email": "admin-email@example.com"
    }
    ```

  - **Thất bại (Token không tồn tại hoặc hết hạn):**

    ```json
    {
      "status": "error",
      "message": "Mã xác thực không hợp lệ hoặc đã hết hạn."
    }
    ```

---

### `resetPasswordAction(token, newPassword)`

- **Mô tả (Description):** Tiếp nhận mật khẩu mới từ form của Admin, kiểm tra
  lại token lần cuối, kiểm tra độ phức tạp của mật khẩu, thực hiện băm mật khẩu
  bằng `bcryptjs`, cập nhật cơ sở dữ liệu, xóa token đã sử dụng, cập nhật thông
  tin phiên để vô hiệu hóa các session cũ, và ghi nhật ký Audit Log (Phase 2).
- **Tham số đầu vào (Request Parameters):**

  ```typescript
  interface ResetPasswordData {
    token: string;
    newPassword: string;
  }
  ```

- **Kết quả trả về (Response):**
  - **Thành công (Success):**

    ```json
    {
      "status": "success",
      "message": "Đặt lại mật khẩu thành công. Đang chuyển hướng về trang đăng nhập..."
    }
    ```

  - **Thất bại - Token hết hạn (Error - Expired/Invalid Token):**

    ```json
    {
      "status": "error",
      "message": "Token không hợp lệ hoặc đã hết hạn (quá 15 phút)."
    }
    ```

  - **Thất bại - Mật khẩu yếu (Error - Weak Password):**

    ```json
    {
      "status": "error",
      "message": "Mật khẩu mới phải có độ dài tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt."
    }
    ```

---

## 2. Ràng buộc Kỹ thuật & Hiệu năng (Technical & Performance Constraints)

### 2.1. Vô hiệu hóa Phiên Đăng nhập cũ (Session Invalidation Strategy - REQ-RECOVERY-015)

- Hệ thống sử dụng NextAuth.js với cấu hình lưu trữ JWT mặc định.
- Để vô hiệu hóa tất cả các JWT đã cấp khi mật khẩu thay đổi:
  - Khi cập nhật `passwordHash` trong database, hệ thống đồng thời tăng giá trị
    trường `passwordVersion` (hoặc cập nhật trường `updatedAt`) trong bảng
    `User`.
  - Trong cấu hình callback `jwt` của NextAuth.js, chúng ta sẽ thực hiện kiểm
    tra `passwordHash` hoặc `passwordVersion` đối chiếu với database hoặc thông
    tin trong JWT. Nếu không khớp (ví dụ: mật khẩu vừa được thay đổi nên version
    trong DB cao hơn version trong token), JWT sẽ bị coi là không hợp lệ và
    người dùng sẽ bị đăng xuất tự động ở các thiết bị cũ.

### 2.2. Chỉ số hiệu năng (Performance SLA)

- **Thời gian phản hồi API (Response Time):** Phải đảm bảo nhỏ hơn 2 giây
  (`< 2s`).
  - _Giải pháp kỹ thuật:_ Để tránh việc gửi email qua SMTP làm nghẽn luồng xử lý
    và tăng thời gian chờ của API (vốn có thể mất từ 1-5 giây do mạng lưới kết
    nối SMTP server), Server Action `forgotPasswordAction` sẽ thực hiện gửi mail
    bất đồng bộ (Background Promise / Non-blocking execution) ngay sau khi lưu
    token thành công vào DB và trả kết quả 200 OK ngay lập tức cho Client.
- **Thời gian phân phối Email (Email Delivery Time):** Email phải được gửi thành
  công đến SMTP Server và phân phối đến hộp thư đích của quản trị viên trong
  vòng **30 giây** kể từ khi nhận được yêu cầu phản hồi API thành công.
