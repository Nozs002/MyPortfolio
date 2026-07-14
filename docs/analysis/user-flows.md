---
id: DOC-USER-FLOWS
type: user_flow
title: user-flows
status: approved
version: 1.0
depends_on:
  - DOC-USE-CASES
description:
  Sequence diagrams and path flows representing content state transition.
---

# User Flows Diagrams

Tài liệu này trình bày các sơ đồ luồng người dùng (User Flows) chi tiết mô tả sự
tương tác giữa các tác nhân và hệ thống cho các luồng nghiệp vụ cốt lõi.

---

## 1. Vòng đời Trạng thái Nội dung (Content Lifecycle Flow)

Sơ đồ dưới đây mô tả luồng chuyển đổi trạng thái của thực thể Dự án (`Project`)
từ khi tạo bản nháp đến lúc xuất bản và lưu trữ lịch sử:

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Tạo mới dự án (Trạng thái mặc định)

    DRAFT --> PUBLISHED : Admin nhấn "Xuất bản" trực tiếp
    DRAFT --> SCHEDULED : Admin hẹn giờ xuất bản (schedulePublishAt)

    SCHEDULED --> PUBLISHED : Hệ thống Cron kích hoạt chuyển đổi (Khi đến lịch)

    state PUBLISHED {
        [*] --> Active : Hiển thị công khai ngoài website
        Active --> CreateVersion : Tự động lưu bản ghi ProjectVersion
        CreateVersion --> WriteAuditLog : Tự động ghi nhật ký thao tác
    }

    PUBLISHED --> ARCHIVED : Admin nhấn "Lưu trữ" hoặc đến giờ scheduleArchiveAt (Cron)
    ARCHIVED --> PUBLISHED : Admin nhấn "Khôi phục xuất bản"

    PUBLISHED --> DRAFT : Admin chuyển về Nháp
    ARCHIVED --> [*] : Xóa dự án (Cascade Delete các phiên bản liên quan)
```

---

## 2. Xác thực Đăng nhập & Bảo vệ Định tuyến (Admin Auth & Route Guard Flow)

### 2.1. Bảo vệ Định tuyến chung (General Route Guard)

Mô tả cách Next.js Middleware và NextAuth.js ngăn chặn truy cập trái phép vào
Dashboard và API quản trị:

```mermaid
sequenceDiagram
    actor Admin as Portfolio Owner
    participant Mid as Next.js Middleware (middleware.ts)
    participant Auth as NextAuth.js Session Check
    participant Dash as Dashboard UI / Server Action
    participant Login as Login Page (/admin/login)

    Admin->>Mid: Truy cập /dashboard hoặc gọi Server Action quản trị
    Active/Secure Route Check
    Mid->>Auth: Kiểm tra token hợp lệ trong cookies

    alt Session hợp lệ (Authenticated)
        Auth-->>Mid: Trả về Token xác thực thành công
        Mid->>Dash: Chuyển tiếp request đến Dashboard / Thực thi Action
        Dash-->>Admin: Trả về giao diện dashboard / kết quả thực thi
    else Session không hợp lệ / Chưa đăng nhập (Unauthenticated)
        Auth-->>Mid: Token trống hoặc hết hạn
        Mid->>Login: Redirect 302 về trang đăng nhập
        Login-->>Admin: Hiển thị form đăng nhập
    end
```

### 2.2. Đăng nhập qua Google OAuth 2.0 (Google OAuth Sign-In Flow)

Mô tả quy trình đăng nhập bằng Google và cách thức kiểm tra tính hợp lệ của địa
chỉ email để bảo vệ tài khoản Single-Admin:

```mermaid
sequenceDiagram
    actor Admin as Portfolio Owner (hoặc Người lạ)
    participant Page as Login Page (/admin/login)
    participant Google as Google Identity Service (OAuth)
    participant NextAuth as NextAuth.js Server
    participant DB as MongoDB Atlas
    participant Dash as Dashboard (/dashboard)

    Admin->>Page: Nhấn nút "Đăng nhập bằng Google"
    Page->>Google: Chuyển hướng tới trang xác thực Google OAuth
    Admin->>Google: Nhập email, mật khẩu Google của mình
    Google-->>NextAuth: Trả về Google Profile (chứa email người dùng)

    Note over NextAuth: NextAuth.js Callback: signIn({ profile })
    NextAuth->>NextAuth: So sánh profile.email === process.env.ADMIN_GOOGLE_EMAIL

    alt Email trùng khớp với Admin Email cấu hình
        NextAuth->>DB: Ghi Audit Log "Đăng nhập Google thành công"
        NextAuth-->>Page: Cho phép tạo session & đăng nhập thành công
        Page->>Dash: Chuyển hướng đến Dashboard
        Dash-->>Admin: Trả về giao diện quản trị CMS
    else Email khác không trùng khớp
        NextAuth->>DB: Ghi Audit Log "Cảnh báo: Đăng nhập Google bị chặn từ email [Email_Khác]"
        NextAuth-->>Page: Từ chối xác thực (Trả về lỗi AccessDenied)
        Page-->>Admin: Hiển thị thông báo "Tài khoản Google không được phép truy cập"
    end
```

---

## 3. Gửi Liên hệ & Thông báo Email (Contact Form & Notification Flow)

Quy trình gửi tin nhắn từ Khách truy cập đến khi hệ thống lưu trữ và gửi email
cảnh báo tự động cho Portfolio Owner:

```mermaid
sequenceDiagram
    actor Visitor as Khách truy cập / Nhà tuyển dụng
    participant Web as Contact Page UI (Public)
    participant API as Next.js Server Action (Submit Contact)
    participant DB as MongoDB Atlas
    participant Email as Email API (Resend / Brevo)
    actor Owner as Portfolio Owner (Admin)

    Visitor->>Web: Điền Tên, Email, Nội dung & nhấn "Gửi"
    Web->>API: Gửi request dữ liệu liên hệ (Client Validation)

    Note over API: Server-side validation (Email format, required fields)

    API->>DB: Lưu bản ghi mới vào ContactMessage (isRead = false, status = "NEW")
    API->>DB: Lưu sự kiện Analytics (eventType = CONTACT_SUBMIT)

    par Gửi Email chạy song song
        API->>Email: Gọi API gửi thư báo tin nhắn mới
        Email-->>Owner: Gửi email thông báo nội dung tin nhắn
    end

    DB-->>API: Phản hồi lưu thành công
    API-->>Web: Trả về trạng thái SUCCESS
    Web-->>Visitor: Hiển thị thông báo "Đã gửi tin nhắn thành công!"
```

---

## 4. Khôi phục Mật khẩu qua Email (Password Recovery Flow)

Quy trình gửi liên kết đặt lại mật khẩu và thực hiện reset mật khẩu bằng Token
xác thực:

```mermaid
sequenceDiagram
    actor Admin as Portfolio Owner (Quên mật khẩu)
    participant Web as Recovery UI (/admin/forgot-password)
    participant Action as Server Action (forgotPasswordAction)
    participant DB as MongoDB Atlas
    participant Email as Resend Email Service
    participant ResetPage as Reset Password Page (/admin/reset-password)

    Admin->>Web: Nhập email quản trị & nhấn gửi
    Web->>Action: Gửi yêu cầu khôi phục

    Action->>DB: Kiểm tra email & tạo Token reset mật khẩu (hạn 15 phút)
    DB-->>Action: Trả về trạng thái lưu thành công

    Action->>Email: Gọi API gửi thư khôi phục kèm Token link
    Email-->>Admin: Gửi email chứa link /admin/reset-password?token=XYZ
    Action-->>Web: Trả về thông báo "Vui lòng kiểm tra hòm thư của bạn"

    Admin->>ResetPage: Click vào liên kết từ email
    ResetPage->>Action: Kiểm tra Token (resetPasswordAction - phase 1)

    alt Token hợp lệ và còn hạn
        Action-->>ResetPage: Hiển thị form nhập mật khẩu mới
        Admin->>ResetPage: Điền mật khẩu mới & nhấn xác nhận
        ResetPage->>Action: Gửi mật khẩu mới (resetPasswordAction - phase 2)
        Action->>DB: Băm mật khẩu mới (bcrypt) & xóa Token đã dùng
        Action->>DB: Ghi Audit Log khôi phục mật khẩu
        DB-->>Action: Trả về thành công
        Action-->>ResetPage: Trả về kết quả thành công
        ResetPage-->>Admin: Hiển thị thông báo reset thành công & Redirect về Login
    else Token hết hạn hoặc không hợp lệ
        Action-->>ResetPage: Trả về lỗi "Mã xác thực không hợp lệ hoặc đã hết hạn"
        ResetPage-->>Admin: Hiển thị thông báo lỗi
    end
```
