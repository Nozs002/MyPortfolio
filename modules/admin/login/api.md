# Admin Login Module API

> [!NOTE] **EN:** Define the API endpoints, requests, and responses for this
> module. **VI:** Định nghĩa các API, request và response cho module này.

Các điểm cuối API và Server Actions phục vụ quá trình xác thực và khôi phục tài
khoản quản trị:

---

## 1. NextAuth.js API Handler

### `GET/POST /api/auth/[...nextauth]`

- **Mô tả (Description):** API động xử lý các luồng xác thực NextAuth.js bao gồm
  khởi tạo OAuth, các callbacks (Google Provider) và xử lý session.
- **Cấu hình callback xác thực Google OAuth:**
  - So khớp `profile.email` với biến môi trường `ADMIN_GOOGLE_EMAIL`.
  - Ghi lại nhật ký thành công/thất bại thông qua cơ chế `createAuditLog`.
- **Trạng thái Response (Response Status):**
  - **200 OK (Thành công):** Phiên làm việc được tạo lập và lưu Cookies.
  - **302 Redirect (Điều hướng):**
    - Điều hướng thành công về `/dashboard`.
    - Điều hướng thất bại về `/admin/login?error=AccessDenied`.
  - **401 Unauthorized / 403 Forbidden:** Truy cập bị từ chối nếu email không
    hợp lệ.

---

## 2. Server Actions / API Khôi Phục Mật Khẩu (Password Recovery Actions)

Hệ thống quản trị sử dụng các Next.js Server Actions hoặc API endpoints nội bộ
để hỗ trợ quên/reset mật khẩu:

### `forgotPasswordAction(email)`

- **Mô tả (Description):** Tiếp nhận yêu cầu gửi link khôi phục mật khẩu. Tạo
  một token bảo mật có hạn 15 phút và gửi email chứa liên kết xác thực cho
  Admin.
- **Tham số đầu vào (Request Parameters):**

  ```json
  {
    "email": "phamson26082005@example.com"
  }
  ```

- **Kết quả trả về (Response):**
  - **Thành công (200 OK / Success Status):**

    ```json
    {
      "status": "success",
      "message": "Liên kết khôi phục mật khẩu đã được gửi vào hòm thư."
    }
    ```

  - **Thất bại (400 Bad Request):**

    ```json
    {
      "status": "error",
      "message": "Địa chỉ email không chính xác hoặc không tồn tại."
    }
    ```

---

### `resetPasswordAction(token, newPassword)`

- **Mô tả (Description):** Xác thực mã Token trong liên kết email và thực hiện
  đặt mật khẩu mới cho tài khoản quản trị.
- **Tham số đầu vào (Request Parameters):**

  ```json
  {
    "token": "secure-random-token-string",
    "newPassword": "MyNewSecurePassword123!"
  }
  ```

- **Kết quả trả về (Response):**
  - **Thành công (200 OK / Success Status):**
    - Hệ thống băm mật khẩu bằng `bcrypt`, cập nhật trường `passwordHash` trong
      MongoDB Atlas, xóa token và ghi Audit Log.

    ```json
    {
      "status": "success",
      "message": "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới."
    }
    ```

  - **Thất bại (400 Bad Request / Expired Token):**

    ```json
    {
      "status": "error",
      "message": "Token không hợp lệ hoặc đã hết hạn (quá 15 phút)."
    }
    ```
