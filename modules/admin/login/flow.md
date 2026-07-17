# Admin Login Module Flow

> [!NOTE] **EN:** Document the user flows and system interactions within this
> module using Mermaid diagrams. **VI:** Ghi chú lại luồng người dùng và tương
> tác hệ thống trong module này bằng biểu đồ Mermaid.

Tài liệu này mô tả trực quan các luồng xử lý và tương tác của hệ thống trong quá
trình xác thực và kiểm soát quyền truy cập của Admin.

---

## 1. Kiểm soát quyền truy cập ở Middleware (Route Guard Flow)

Next.js Middleware (`middleware.ts`) đóng vai trò là lá chắn biên, kiểm tra
trạng thái Session trước khi cho phép yêu cầu đi sâu vào hệ thống:

```mermaid
sequenceDiagram
    actor Admin as Portfolio Owner
    participant Mid as Next.js Middleware
    participant Auth as NextAuth.js Session Check
    participant Dash as Dashboard UI / Server Action
    participant Login as Login Page (/admin/login)

    Admin->>Mid: Truy cập /dashboard hoặc gọi Server Action quản trị
    Mid->>Auth: Kiểm tra token hợp lệ trong cookies

    alt Session hợp lệ (Authenticated)
        Auth-->>Mid: Trả về Token xác thực thành công
        Mid->>Dash: Chuyển tiếp request đến Dashboard
        Dash-->>Admin: Trả về giao diện Dashboard CMS
    else Session không hợp lệ / Chưa đăng nhập (Unauthenticated)
        Auth-->>Mid: Token trống hoặc hết hạn
        Mid->>Login: Điều hướng 302 về trang đăng nhập
        Login-->>Admin: Hiển thị form đăng nhập
    end
```

---

## 2. Đăng nhập qua Google OAuth 2.0 (Google Sign-In Flow)

Sơ đồ luồng đăng nhập nhanh bằng tài khoản Google, thể hiện bước callback kiểm
tra email định cấu hình (`ADMIN_GOOGLE_EMAIL`) để bảo vệ tài khoản Single-Admin:

```mermaid
sequenceDiagram
    actor Admin as Portfolio Owner (hoặc Người lạ)
    participant Page as Login Page (/admin/login)
    participant Google as Google Identity Service
    participant NextAuth as NextAuth.js Server
    participant DB as MongoDB Atlas
    participant Dash as Dashboard (/dashboard)

    Admin->>Page: Nhấn nút "Đăng nhập bằng Google"
    Page->>Google: Điều hướng tới trang xác thực Google OAuth
    Admin->>Google: Đăng nhập tài khoản Google cá nhân
    Google-->>NextAuth: Trả về Google Profile (chứa email)

    Note over NextAuth: NextAuth.js callback signIn()
    NextAuth->>NextAuth: So sánh email === process.env.ADMIN_GOOGLE_EMAIL

    alt Email trùng khớp với cấu hình
        NextAuth->>DB: Ghi Audit Log "Đăng nhập Google thành công"
        NextAuth-->>Page: Cho phép tạo Session & Đăng nhập thành công
        Page->>Dash: Điều hướng đến Dashboard
        Dash-->>Admin: Trả về giao diện quản trị CMS
    else Email khác không trùng khớp (Bị chặn)
        NextAuth->>DB: Ghi Audit Log "Cảnh báo: Đăng nhập Google bị chặn từ email [Email_Khác]"
        NextAuth-->>Page: Từ chối xác thực (Trả về lỗi AccessDenied)
        Page-->>Admin: Hiển thị thông báo "Tài khoản Google không được phép truy cập"
    end
```

---

## 3. Đăng nhập bằng tài khoản Credentials (Credentials Sign-In Flow)

Quy trình đăng nhập truyền thống thông qua tên đăng nhập và mật khẩu nội bộ:

```mermaid
sequenceDiagram
    actor Admin as Portfolio Owner
    participant Page as Login Page (/admin/login)
    participant NextAuth as NextAuth.js (Credentials Provider)
    participant DB as MongoDB Atlas
    participant Dash as Dashboard (/dashboard)

    Admin->>Page: Điền Username/Email & Mật khẩu -> Nhấn "Đăng nhập"
    Page->>NextAuth: Gửi thông tin đăng nhập

    NextAuth->>DB: Truy vấn thông tin User từ cơ sở dữ liệu
    DB-->>NextAuth: Trả về bản ghi User (chứa passwordHash)

    Note over NextAuth: Băm password đầu vào bằng bcrypt<br/>và so sánh với passwordHash

    alt Xác thực thành công (Mật khẩu đúng)
        NextAuth->>DB: Ghi Audit Log "Đăng nhập Credentials thành công"
        NextAuth-->>Page: Phản hồi thành công
        Page->>Dash: Điều hướng tới Dashboard
        Dash-->>Admin: Trả về giao diện quản trị CMS
    else Xác thực thất bại (Mật khẩu hoặc tài khoản sai)
        NextAuth->>DB: Ghi Audit Log "Đăng nhập thất bại từ IP X"
        NextAuth-->>Page: Trả về lỗi "Tài khoản hoặc mật khẩu không chính xác"
        Page-->>Admin: Hiển thị thông báo lỗi trên giao diện
    end
```

---

## 4. Khôi phục mật khẩu qua Email (Password Recovery Flow)

Quy trình xử lý gửi email đặt lại mật khẩu và thực hiện cập nhật lại mật khẩu
thông qua Token an toàn:

```mermaid
sequenceDiagram
    actor Admin as Portfolio Owner (Quên mật khẩu)
    participant Web as Recovery UI (/admin/forgot-password)
    participant Action as Server Action (forgotPasswordAction)
    participant DB as MongoDB Atlas
    participant Email as Resend Email Service
    participant ResetPage as Reset Password Page (/admin/reset-password)

    Admin->>Web: Nhập email quản trị & nhấn gửi
    Web->>Action: Gửi yêu cầu khôi phục mật khẩu

    Action->>DB: Kiểm tra email hợp lệ, tạo & lưu Token reset mật khẩu (hạn 15 phút)
    DB-->>Action: Trả về trạng thái lưu thành công

    Action->>Email: Gọi API gửi thư khôi phục kèm Token link
    Email-->>Admin: Gửi email chứa link /admin/reset-password?token=XYZ
    Action-->>Web: Trả về thông báo "Vui lòng kiểm tra hòm thư của bạn"

    Admin->>ResetPage: Click vào liên kết từ email nhận được
    ResetPage->>Action: Kiểm tra Token (resetPasswordAction - Phase 1)

    alt Token hợp lệ và còn hạn (dưới 15 phút)
        Action-->>ResetPage: Hiển thị form nhập mật khẩu mới
        Admin->>ResetPage: Điền mật khẩu mới & xác nhận
        ResetPage->>Action: Gửi mật khẩu mới (resetPasswordAction - Phase 2)
        Action->>DB: Băm mật khẩu mới (bcrypt) & xóa Token đã dùng
        Action->>DB: Ghi Audit Log khôi phục mật khẩu thành công
        DB-->>Action: Phản hồi cập nhật thành công
        Action-->>ResetPage: Phản hồi thành công
        ResetPage-->>Admin: Hiển thị thông báo reset thành công & Redirect về Login
    else Token hết hạn hoặc không hợp lệ
        Action-->>ResetPage: Trả về lỗi "Mã xác thực không hợp lệ hoặc đã hết hạn"
        ResetPage-->>Admin: Hiển thị thông báo lỗi đặt lại mật khẩu
    end
```
