# Admin Change Password Module API

> [!NOTE] **EN:** Define the API endpoints, requests, and responses for this
> module. **VI:** Định nghĩa các API, request và response cho module này.

Các Server Actions và điểm cuối xử lý tác vụ thay đổi mật khẩu của Admin:

---

## 1. Server Action Đổi Mật Khẩu

### `changePasswordAction(data)`

- **Mô tả (Description):** Server Action thực hiện xác thực thông tin, kiểm tra
  Rate Limiting (chống Brute-force), mở Database Transaction băm mật khẩu mới,
  cập nhật MongoDB Atlas, vô hiệu hóa phiên toàn cục (Global Sign-out), ghi nhật
  ký Audit Log và phát email cảnh báo an ninh chi tiết.
- **Vị trí định nghĩa (Location):** `src/app/actions/auth.ts`
- **Bảo mật (Security):** Yêu cầu phiên đăng nhập hợp lệ (NextAuth Session
  Check).

- **Tham số đầu vào (Request Payload):**

  ```json
  {
    "currentPassword": "MyOldPassword123!",
    "newPassword": "MyBrandNewPassword456@",
    "confirmPassword": "MyBrandNewPassword456@"
  }
  ```

- **Kết quả trả về (Response Outputs):**

  - **Thành công (200 OK / Success Status):**

    ```json
    {
      "status": "success",
      "message": "Đổi mật khẩu thành công. Tất cả các phiên làm việc đã được đăng xuất toàn cục."
    }
    ```

  - **Thất bại - Trường dữ liệu để trống (400 Bad Request):**

    ```json
    {
      "status": "error",
      "message": "Mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu không được để trống."
    }
    ```

  - **Thất bại - Tạm khóa do quá 5 lần thử sai (429 Too Many Requests):**

    ```json
    {
      "status": "error",
      "message": "Bạn đã nhập sai mật khẩu quá 5 lần. Chức năng đổi mật khẩu bị tạm khóa trong 30 phút.",
      "lockoutRemainingSeconds": 1800
    }
    ```

  - **Thất bại - Mật khẩu hiện tại sai (401 Unauthorized):**

    ```json
    {
      "status": "error",
      "message": "Mật khẩu hiện tại không chính xác. Bạn còn 3 lần thử trước khi bị khóa."
    }
    ```

  - **Thất bại - Mật khẩu không đủ mạnh hoặc không khớp (400 Bad Request):**

    ```json
    {
      "status": "error",
      "message": "Mật khẩu mới phải có tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt."
    }
    ```

---

## 2. Tiện ích Gửi Email Cảnh báo An ninh Chi tiết

### `sendSecurityAlertEmail(email, details)`

- **Mô tả (Description):** Hàm trợ lý gọi API của dịch vụ gửi thư (Resend /
  Brevo) để phát email thông tin tới địa chỉ email Admin đăng ký ngay khi mật
  khẩu vừa thay đổi.
- **Tham số chi tiết (Payload Details):**

  ```json
  {
    "to": "phamson26082005@gmail.com",
    "timestamp": "2026-07-20T08:55:00.000Z",
    "ipAddress": "14.232.112.45",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...",
    "browser": "Chrome 126.0",
    "device": "Desktop (Windows)"
  }
  ```
