---
id: DOC-ARCH-API
type: api
title: api
status: approved
version: 1.0
depends_on:
  - DOC-PRD
description:
  REST API and Server Actions specification for the public portfolio and CMS
  administration workspace.
---

# API Specification

Tài liệu này đặc tả chi tiết các API Endpoints và Server Actions của hệ thống
**MyPortfolio** phục vụ giao tiếp giữa Client và Serverless Next.js Backend.

---

## 1. Cơ chế Giao tiếp (Communication Protocols)

Hệ thống sử dụng hai phương thức giao tiếp chính:

1. **Next.js Server Actions:** Sử dụng cho các thao tác gửi biểu mẫu (form
   submissions) và các tác vụ nghiệp vụ thay đổi trạng thái (mutations) trong
   trang quản trị CMS và liên hệ.
2. **REST API Endpoints:** Sử dụng cho các tác vụ nền tự động (Cron Jobs), tích
   hợp của bên thứ ba hoặc tải dữ liệu tĩnh.

---

## 2. Đặc tả Server Actions (Quản trị CMS & Tương tác)

Toàn bộ các Server Actions quản trị CMS được đặt trong thư mục
`src/app/actions/` và được bảo vệ bằng cơ chế xác thực phiên đăng nhập
NextAuth.js.

### 2.1. Nhóm Xác thực (Authentication Actions)

- **`loginAction(credentials)`**
  - _Tác nhân:_ Portfolio Owner.
  - _Mục đích:_ Xác thực tài khoản quản trị bằng tên đăng nhập/mật khẩu.
  - _Input:_ `{ usernameOrEmail, password }`.
  - _Output:_ `{ success: boolean, redirect: "/dashboard", error?: string }`.
- **Google OAuth Authentication**
  - _Tác nhân:_ Portfolio Owner.
  - _Mục đích:_ Xác thực liên kết nhanh bằng tài khoản Google.
  - _Routing:_ Client gọi hàm `signIn('google')` của NextAuth.js. Hệ thống
    chuyển hướng và tiếp nhận callback tại `/api/auth/callback/google`.
  - _Quy tắc bảo mật:_ Chỉ tài khoản trùng khớp `ADMIN_GOOGLE_EMAIL` mới được
    cấp JWT session. Mọi email khác bị chặn và trả về lỗi 403. Ghi audit log
    tương ứng.
- **`logoutAction()`**
  - _Tác nhân:_ Portfolio Owner.
  - _Mục đích:_ Đăng xuất tài khoản quản trị, hủy session.
  - _Output:_ `{ success: boolean, redirect: "/" }`.
- **`changePasswordAction(data)`**
  - _Tác nhân:_ Portfolio Owner (Đã đăng nhập).
  - _Mục đích:_ Thay đổi mật khẩu tài khoản trong trang cài đặt CMS.
  - _Input:_ `{ currentPassword, newPassword }`
  - _Output:_ `{ success: boolean, error?: string }`.
  - _Quy tắc:_ Kiểm tra khớp mật khẩu hiện tại, băm mật khẩu mới (bcrypt), cập
    nhật DB-USER, hủy session NextAuth và ghi DB-AUDIT-LOG.
- **`forgotPasswordAction(email)`**
  - _Tác nhân:_ Khách / Admin quên mật khẩu (Không cần đăng nhập).
  - _Mục đích:_ Gửi email liên kết khôi phục mật khẩu.
  - _Input:_ `email` (String)
  - _Output:_ `{ success: boolean, message: string }`.
  - _Quy tắc:_ Kiểm tra email khớp DB-USER, tạo token reset thời hạn 15 phút lưu
    DB, gửi email liên kết khôi phục thông qua Resend.
- **`resetPasswordAction(token, newPassword)`**
  - _Tác nhân:_ Khách / Admin quên mật khẩu (Không cần đăng nhập).
  - _Mục đích:_ Đặt lại mật khẩu mới thông qua Token xác thực.
  - _Input:_ `token` (String), `newPassword` (String)
  - _Output:_ `{ success: boolean, error?: string }`.
  - _Quy tắc:_ Kiểm tra Token hợp lệ/còn hạn, băm mật khẩu mới cập nhật DB-USER,
    vô hiệu hóa Token, tạo Audit Log.

### 2.2. Nhóm Dự án (Project Actions)

- **`upsertProjectAction(data)`**
  - _Tác nhân:_ Portfolio Owner (Đã đăng nhập).
  - _Mục đích:_ Tạo mới hoặc cập nhật một dự án.
  - _Input:_
    `{ id?, title, slug, description, content, thumbnail, images, techStack, liveUrl?, githubUrl?, startDate?, endDate?, teamSize?, role?, state }`.
  - _Output:_ `{ success: boolean, data?: Project, error?: string }`.
  - _Quy tắc nghiệp vụ kích hoạt:_ Tự động sinh `ProjectVersion` mới và ghi
    `AuditLog` tương ứng. Làm mới cache static của Next.js (`revalidatePath`).
- **`deleteProjectAction(projectId)`**
  - _Tác nhân:_ Portfolio Owner (Đã đăng nhập).
  - _Mục đích:_ Xóa bỏ vĩnh viễn dự án (Cascade delete các phiên bản con).
  - _Input:_ `projectId` (String).
  - _Output:_ `{ success: boolean, error?: string }`.
- **`restoreProjectVersionAction(projectId, versionId)`**
  - _Tác nhân:_ Portfolio Owner (Đã đăng nhập).
  - _Mục đích:_ Ghi đè dữ liệu dự án hiện tại bằng phiên bản cũ trong lịch sử.
  - _Input:_ `projectId` (String), `versionId` (String).
  - _Output:_ `{ success: boolean, data?: Project, error?: string }`.

### 2.3. Nhóm Hồ sơ (Profile Actions)

- **`updateProfileAction(data)`**
  - _Tác nhân:_ Portfolio Owner (Đã đăng nhập).
  - _Mục đích:_ Cập nhật thông tin cá nhân và lý lịch.
  - _Input:_
    `{ name, title, bio, avatarUrl?, email, phone?, address?, socialLinks?, cvUrl? }`.
  - _Output:_ `{ success: boolean, data?: Profile }`.
- **`upsertExperienceAction(data)`** & **`deleteExperienceAction(id)`**
  - _Mục đích:_ CRUD danh mục kinh nghiệm làm việc.
- **`upsertSkillAction(data)`** & **`deleteSkillAction(id)`**
  - _Mục đích:_ CRUD danh mục kỹ năng chuyên môn.

### 2.4. Nhóm Liên hệ (Contact Actions)

- **`submitContactAction(data)`**
  - _Tác nhân:_ Visitor / Recruiter (Không cần đăng nhập).
  - _Mục đích:_ Khách hàng gửi lời nhắn liên hệ.
  - _Input:_ `{ senderName, senderEmail, subject, message }`.
  - _Output:_ `{ success: boolean, error?: string }`.
  - _Quy tắc nghiệp vụ kích hoạt:_ Lưu vào `ContactMessage`, tạo sự kiện
    `AnalyticsMetric`, kích hoạt Resend gửi email thông báo cho Admin.
- **`toggleMessageStatusAction(messageId, status)`**
  - _Tác nhân:_ Portfolio Owner (Đã đăng nhập).
  - _Mục đích:_ Đổi trạng thái tin nhắn (NEW -> READ -> ARCHIVED).
  - _Input:_ `messageId` (String), `status` (NEW / READ / ARCHIVED).

---

## 3. Đặc tả REST API Endpoints (Tác vụ Nền & Tích hợp)

### 3.1. Hẹn giờ Xuất bản (Scheduled Publishing API)

- **API Endpoint:** `POST /api/cron/publishing`
- **Mục đích:** Vercel Cron Job gọi định kỳ để quét và cập nhật các trạng thái
  dự án hẹn lịch (BR-11, BRULE-11).
- **Security:** Sử dụng Bearer Token đặt ở header:
  `Authorization: Bearer <CRON_SECRET>`.
- **Response:**
  - `200 OK` nếu thực hiện thành công:

    ```json
    {
      "success": true,
      "processed": {
        "publishedCount": 2,
        "archivedCount": 1
      }
    }
    ```

  - `401 Unauthorized` nếu sai token bảo mật.

### 3.2. Truy vấn dữ liệu thống kê (Analytics Fetch)

- **API Endpoint:** `GET /api/analytics/summary`
- **Mục đích:** Lấy dữ liệu thống kê tương tác phi danh tính hiển thị biểu đồ
  trên Dashboard.
- **Security:** Admin Session Check (NextAuth.js).
- **Response:**
  - `200 OK` trả về danh sách chỉ số tổng hợp:

    ```json
    {
      "pageViews": 1420,
      "projectViews": [
        { "slug": "ai-assistant", "views": 320 },
        { "slug": "e-commerce", "views": 180 }
      ],
      "cvDownloads": 45,
      "contactSubmits": 12
    }
    ```

### 3.3. Sao lưu Dữ liệu Nghiệp vụ (Logical Backup)

- **API Endpoint:** `GET /api/admin/backup`
- **Mục đích:** Xuất toàn bộ dữ liệu nghiệp vụ dạng JSON.
- **Security:** Admin Session Check (NextAuth.js).
- **Response:**
  - `200 OK` trả về file JSON tải xuống chứa toàn bộ collections: `Profile`,
    `Projects`, `Experiences`, `Skills`, v.v. (ngoại trừ mật khẩu tài khoản).

### 3.4. Hỏi đáp với Trợ lý ảo AI (AI Chat Assistant API)

- **API Endpoint:** `POST /api/chat`
- **Tác nhân:** Visitor / Recruiter (Công khai, không cần đăng nhập).
- **Mục đích:** Gửi lịch sử trò chuyện và câu hỏi hiện tại để nhận phản hồi từ
  AI.
- **Request Body:**
  - Định dạng: `application/json`
  - Tham số:

    ```json
    {
      "messages": [
        {
          "role": "user",
          "content": "Chào bạn, bạn có thể thiết kế giao diện React Native không?"
        }
      ]
    }
    ```

- **Response:**
  - `200 OK`:
    - Header: `Content-Type: text/plain; charset=utf-8` (hoặc
      `text/event-stream` nếu sử dụng Server-Sent Events).
    - Body: Luồng ký tự text (Streamed Text Tokens) được trả về trực tiếp từ mô
      hình Gemini.
  - `429 Too Many Requests`:
    - Trả về khi IP của khách truy cập vượt quá giới hạn 10 lượt gọi/phút.
    - Body:

      ```json
      {
        "error": "Too many requests. Please try again after 1 minute."
      }
      ```

  - `500 Internal Server Error`:
    - Trả về khi gặp sự cố cấu hình Gemini API Key hoặc sự cố kết nối LLM.
