# Admin Change Password Module Flow

> [!NOTE] **EN:** Document the user flows and system interactions within this
> module using Mermaid diagrams. **VI:** Ghi chú lại luồng người dùng và tương
> tác hệ thống trong module này bằng biểu đồ Mermaid.

Tài liệu này mô tả trực quan các luồng xử lý và trình tự tương tác hệ thống
trong quá trình thực hiện thay đổi mật khẩu của Admin.

---

## 1. Luồng Đổi Mật Khẩu Thành Công (Successful Change Password Flow)

Mô tả trình tự tương tác từ khi Admin điền biểu mẫu đổi mật khẩu đến khi hệ
thống kiểm tra Rate Limit, mở Transaction băm mật khẩu, cập nhật DB, ghi Audit
Log, vô hiệu hóa phiên toàn cục và phát email cảnh báo chi tiết:

```mermaid
sequenceDiagram
    actor Admin as Portfolio Owner (Dashboard)
    participant UI as Change Password Form (/admin/dashboard/settings)
    participant Action as Server Action (changePasswordAction)
    participant Limiter as Rate Limiter / Lockout Check
    participant DB as MongoDB Atlas (Prisma Transaction)
    participant Email as Resend Email API
    participant Auth as NextAuth.js (Global Sign-out)
    participant Login as Login Page (/admin/login)

    Admin->>UI: Điền Mật khẩu hiện tại, Mật khẩu mới & Xác nhận mật khẩu
    Admin->>UI: Nhấn nút "Lưu mật khẩu mới"

    UI->>Action: Gọi changePasswordAction({ currentPassword, newPassword, confirmPassword })

    Note over Action: Client/Server validation: Kiểm tra non-empty & tiêu chuẩn độ mạnh mật khẩu

    Action->>Limiter: Kiểm tra số lần nhập sai (Failed Attempts in 15 mins)

    alt Chưa bị khóa Rate Limit (< 5 lần sai)
        Action->>DB: Truy vấn thông tin User Admin (lấy passwordHash)
        Action->>Action: So sánh currentPassword với passwordHash (bcrypt.compare)

        alt Mật khẩu hiện tại chính xác
            Action->>Action: Băm newPassword bằng bcrypt (salt rounds = 10)

            rect rgb(235, 245, 255)
                Note over Action, DB: Thực thi trong 1 Database Transaction (ACID)
                Action->>DB: 1. Cập nhật passwordHash mới & tăng tokenVersion (Global Sign-out)
                Action->>DB: 2. Ghi bản ghi Audit Log ("CHANGE_PASSWORD", IP, User-Agent)
            end

            alt Giao dịch DB thành công
                par Gửi Email cảnh báo an ninh chi tiết
                    Action->>Email: Gọi Resend API gửi thư chứa (Thời gian, IP, Trình duyệt, Thiết bị)
                    Email-->>Admin: Nhận email cảnh báo an ninh chi tiết
                end

                Action-->>UI: Trả về kết quả status: "success"
                UI->>Auth: Thực hiện Global Sign-Out (hủy toàn bộ phiên JWT)
                Auth-->>Login: Điều hướng 302 về trang /admin/login
                Login-->>Admin: Hiển thị thông báo "Đổi mật khẩu thành công. Vui lòng đăng nhập lại"
            else Giao dịch DB gặp lỗi
                DB-->>Action: Tự động Rollback 100% dữ liệu
                Action-->>UI: Trả về lỗi "Lỗi hệ thống. Đã hoàn tác mọi thay đổi"
            end
        end
    end
```

---

## 2. Luồng Xử Lý Lỗi, Lockout & Rate Limiting (Error Handling & Rate Limiting Flow)

Mô tả các kịch bản ngoại lệ khi Admin nhập thiếu trường thông tin, sai mật khẩu
hiện tại dẫn đến bị tạm khóa 30 phút:

```mermaid
sequenceDiagram
    actor Admin as Portfolio Owner
    participant UI as Change Password Form
    participant Action as Server Action (changePasswordAction)
    participant Limiter as Rate Limiter / Counter
    participant DB as MongoDB Atlas

    Admin->>UI: Điền form & nhấn "Lưu mật khẩu mới"
    UI->>Action: Gửi thông tin đổi mật khẩu

    alt Kịch bản 1: Để trống trường thông tin (Empty Fields)
        Action-->>UI: Trả về lỗi "Các trường mật khẩu không được phép để trống"
        UI-->>Admin: Hiển thị lỗi ngay tại Client/Form
    else Kịch bản 2: Đã bị tạm khóa do nhập sai quá 5 lần (Account Lockout)
        Action->>Limiter: Kiểm tra trạng thái Lockout
        Limiter-->>Action: Đang trong thời gian khóa 30 phút
        Action-->>UI: Trả về lỗi "Tài khoản bị tạm khóa đổi mật khẩu trong 30 phút do nhập sai quá 5 lần"
        UI-->>Admin: Hiển thị thông báo khóa & đếm ngược thời gian
    else Kịch bản 3: Nhập sai Mật khẩu hiện tại (Failed Password Attempt)
        Action->>DB: So sánh currentPassword với DB passwordHash
        DB-->>Action: Kết quả so sánh = FALSE
        Action->>Limiter: Tăng số lần thử sai (Failed Counter + 1 trong 15 phút)
        Action->>DB: Ghi Audit Log "CHANGE_PASSWORD_FAILED" (Lý do: Wrong password)

        alt Số lần thử sai >= 5
            Action->>Limiter: Thiết lập thời gian khóa Lockout (30 phút)
            Action-->>UI: Trả về lỗi "Mật khẩu sai. Bạn đã bị tạm khóa chức năng đổi mật khẩu trong 30 phút"
        else Số lần thử sai < 5
            Action-->>UI: Trả về lỗi "Mật khẩu hiện tại không chính xác (Còn X lần thử)"
        end
        UI-->>Admin: Hiển thị thông báo lỗi chi tiết
    end
```
