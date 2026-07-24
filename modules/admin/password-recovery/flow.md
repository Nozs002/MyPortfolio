---
id: modules/admin/password-recovery/flow.md
type: document
title: flow
module: MOD-ADMIN-RECOVERY
status: approved
version: 1.0
owner: PO
tags:
  - admin
  - password-recovery
  - flow
last_updated: 2026-07-20
---

# Password Recovery Module Flow

> [!NOTE] **EN:** Document the user flows and system interactions within this
> module using Mermaid diagrams. **VI:** Ghi chú lại luồng người dùng và tương
> tác hệ thống trong module này bằng biểu đồ Mermaid.

Tài liệu này mô tả trực quan các luồng xử lý và tương tác của hệ thống trong quá
trình yêu cầu và thực hiện khôi phục mật khẩu tài khoản Admin.

---

## 1. Luồng Yêu cầu Khôi phục Mật khẩu (Forgot Password Request Flow)

Quy trình xử lý khi quản trị viên nhập email yêu cầu cấp lại mật khẩu cho đến
khi email chứa liên kết được gửi thành công:

```mermaid
sequenceDiagram
    actor Admin as Portfolio Owner (Quên mật khẩu)
    participant Page as Recovery UI (/admin/forgot-password)
    participant Action as Server Action (forgotPasswordAction)
    participant DB as MongoDB Atlas
    participant Email as Mail Service (Nodemailer SMTP)

    Admin->>Page: Nhập địa chỉ email đăng ký & nhấn "Gửi liên kết"
    Page->>Page: Kiểm tra định dạng email hợp lệ ở client
    Page->>Action: Gọi forgotPasswordAction({ email })

    Action->>DB: Truy vấn thông tin User theo email
    DB-->>Action: Trả về thông tin User (nếu tồn tại)

    alt Email không khớp với Admin
        Action-->>Page: Trả về lỗi "Địa chỉ email không chính xác hoặc không tồn tại"
        Page-->>Admin: Hiển thị thông báo lỗi trên giao diện
    else Email trùng khớp với Admin
        Action->>Action: Sinh Token ngẫu nhiên (Hex 32 bytes)
        Action->>Action: Tính thời gian hết hạn (Thời gian hiện tại + 15 phút)

        Action->>DB: Xóa các token reset cũ của email này (nếu có)
        Action->>DB: Lưu token mới vào bảng PasswordResetToken

        Action->>DB: Ghi Audit Log "PASSWORD_RESET_REQUEST" (kèm email và IP nguồn)

        Action->>Email: Gửi mail chứa liên kết khôi phục kèm token
        Email-->>Admin: Hòm thư nhận email chứa link /admin/reset-password?token=XYZ

        Action-->>Page: Trả về phản hồi thành công
        Page-->>Admin: Hiển thị thông báo "Đã gửi liên kết khôi phục vào email..."
    end
```

---

## 2. Luồng Xác thực Token & Đặt lại Mật khẩu Mới (Reset Password Flow)

Quy trình xử lý khi quản trị viên nhấn vào liên kết trong email để đặt lại mật
khẩu mới:

```mermaid
sequenceDiagram
    actor Admin as Portfolio Owner
    participant Page as Reset UI (/admin/reset-password?token=XYZ)
    participant Action as Server Action (resetPasswordAction)
    participant DB as MongoDB Atlas

    Admin->>Page: Truy cập liên kết chứa Token từ email

    Note over Page: Phase 1: Xác thực Token tự động khi load trang
    Page->>Action: Kiểm tra token có hợp lệ không (gọi Action kiểm tra)
    Action->>DB: Truy vấn PasswordResetToken theo token string
    DB-->>Action: Trả về bản ghi Token (nếu tồn tại)

    alt Token không tồn tại hoặc đã hết hạn (expiresAt < Hiện tại)
        Action->>DB: Ghi Audit Log "PASSWORD_RESET_FAILED" (Lý do: Token không hợp lệ/hết hạn)
        Action-->>Page: Trả về trạng thái lỗi (Không hợp lệ/Hết hạn)
        Page-->>Admin: Hiển thị giao diện báo lỗi & Nút quay lại
    else Token hợp lệ và còn hạn
        Action-->>Page: Xác nhận Token hợp lệ
        Page-->>Admin: Hiển thị biểu mẫu nhập Mật khẩu mới

        Note over Page: Phase 2: Đặt mật khẩu mới
        Admin->>Page: Nhập mật khẩu mới & xác nhận (Độ dài >= 8 ký tự, trùng khớp)
        Page->>Action: Gọi resetPasswordAction({ token, newPassword })

        Action->>Action: Băm mật khẩu mới bằng bcryptjs
        Action->>DB: Cập nhật passwordHash mới cho User có email liên kết
        Action->>DB: Xóa Token đã sử dụng khỏi bảng PasswordResetToken
        Action->>DB: Ghi Audit Log "PASSWORD_RESET_SUCCESS" (Đổi mật khẩu thành công)

        DB-->>Action: Cập nhật thành công
        Action-->>Page: Trả về phản hồi thành công
        Page-->>Admin: Hiển thị thông báo đặt lại thành công & chuyển hướng về /admin/login
    end
```
