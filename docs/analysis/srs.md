---
id: DOC-SRS
type: document
title: srs
status: approved
version: 1.2
owner: PO
tags:
  - srs
  - requirements
  - specification
depends_on:
  - DOC-PRD
last_updated: 2026-07-14
---

# Software Requirements Specification (SRS)

Tài liệu này đặc tả chi tiết các yêu cầu kỹ thuật phần mềm (Software
Requirements Specification) cho hệ thống **MyPortfolio**, bao gồm yêu cầu chức
năng (FR), yêu cầu phi chức năng (NFR) và các giao tiếp hệ thống.

---

## 1. Giới Thiệu (Introduction)

### 1.1. Mục đích

Tài liệu này cung cấp các mô tả chi tiết về mặt kỹ thuật cho toàn bộ các tính
năng, ràng buộc và tiêu chuẩn vận hành của hệ thống MyPortfolio, làm căn cứ kỹ
thuật để triển khai mã nguồn và viết kịch bản kiểm thử (Test Cases).

### 1.2. Phạm vi Hệ thống

Hệ thống là một ứng dụng web full-stack chạy trên kiến trúc Serverless
(Next.js), sử dụng MongoDB Atlas lưu trữ dữ liệu và liên kết các API bên ngoài
như Cloudinary (lưu ảnh), Resend (gửi email).

---

## 2. Yêu Cầu Chức Năng (Functional Requirements - FR)

### FR-01: Hệ thống Xác thực Quản trị (Admin Authentication)

- **Mô tả:** Hệ thống cung cấp cơ chế bảo mật đăng nhập cho Portfolio Owner
  thông qua Credentials và Google OAuth.
- **Yêu cầu chi tiết:**
  - Route `/admin/login` hiển thị form đăng nhập username/password và nút "Đăng
    nhập với Google".
  - NextAuth.js hỗ trợ:
    - `CredentialsProvider`: Xác thực bằng username/password trong database.
    - `GoogleProvider`: Xác thực qua Google OAuth Client ID & Client Secret.
  - Callback `signIn` trong NextAuth.js bắt buộc phải lọc email của người đăng
    nhập qua Google:
    - So khớp `profile.email` với biến môi trường `ADMIN_GOOGLE_EMAIL`.
    - Trả về `true` để cấp session nếu khớp, hoặc trả về `false` (từ chối
      session) nếu không khớp.
  - NextAuth.js xử lý lưu và giải mã session bằng JWT.
  - Next.js Middleware chặn mọi truy cập trái phép vào `/admin/*` và
    `/dashboard/*`.
  - Không cung cấp giao diện hay API đăng ký tài khoản mới ngoài công khai.

### FR-02: Quản lý Hồ sơ & Trình độ (Resume Management)

- **Mô tả:** Cho phép quản trị viên CRUD thông tin cá nhân và lý lịch.
- **Yêu cầu chi tiết:**
  - Quản lý thông tin cá nhân cơ bản: Tên, chức danh, bio, liên kết mạng xã hội.
  - Quản lý mảng danh sách: Kinh nghiệm làm việc, quá trình học vấn, chứng chỉ,
    kỹ năng.
  - Cho phép tải lên tệp tin CV dưới dạng `.pdf` (lưu trữ trên CDN).

### FR-03: Quản lý Dự án & Bài viết (Project CRUD)

- **Mô tả:** Quản lý danh mục các dự án cá nhân hiển thị trên Portfolio.
- **Yêu cầu chi tiết:**
  - Admin có quyền thêm, sửa, lưu trữ (Archive) và xóa các dự án.
  - Tự động sinh `slug` theo tiêu đề dự án nhưng cho phép chỉnh sửa thủ công để
    tối ưu SEO.
  - Quản lý 3 trạng thái của dự án: `DRAFT`, `PUBLISHED`, `ARCHIVED`.

### FR-04: Lên lịch Xuất bản Tự động (Scheduled Publishing)

- **Mô tả:** Hệ thống tự động chuyển trạng thái hiển thị của dự án khi đến giờ
  hẹn lịch.
- **Yêu cầu chi tiết:**
  - Admin có thể thiết lập `schedulePublishAt` (hẹn giờ mở) hoặc
    `scheduleArchiveAt` (hẹn giờ ẩn).
  - API route `/api/cron/publishing` (bảo vệ bằng mật khẩu hoặc token bảo mật)
    được gọi định kỳ để quét và thực hiện cập nhật trạng thái tự động trong
    Database.
  - Tác vụ tự động kích hoạt cập nhật cache Next.js (`revalidatePath`).

### FR-05: Lưu & Khôi phục Phiên bản Dự án (Versioning & Rollback)

- **Mô tả:** Cho phép lưu lịch sử và khôi phục dự án về trạng thái cũ.
- **Yêu cầu chi tiết:**
  - Mỗi khi dự án ở trạng thái `PUBLISHED` được lưu chỉnh sửa, hệ thống nhân bản
    dữ liệu và lưu vào collection `ProjectVersion`.
  - Giao diện quản trị liệt kê danh sách lịch sử sửa đổi kèm nút "Khôi phục".
    Khi nhấn khôi phục, hệ thống ghi đè ngược dữ liệu cũ vào bảng `Project` và
    sinh một bản ghi lịch sử mới (không xóa lịch sử cũ).

### FR-06: Tiếp nhận & Quản lý Liên hệ (Contact Inbox)

- **Mô tả:** Nhận phản hồi của khách và quản lý hộp thư trong CMS.
- **Yêu cầu chi tiết:**
  - Giao diện public hiển thị Contact Form với kiểm tra tính đúng đắn dữ liệu
    (email hợp lệ, không để trống).
  - Khi khách gửi thành công, hệ thống lưu bản ghi `ContactMessage` (status =
    `NEW`) và kích hoạt Resend API gửi email cảnh báo tức thì cho Admin.
  - Admin có quyền đánh dấu đã đọc (`READ`), lưu trữ (`ARCHIVED`) hoặc xóa tin
    nhắn trong CMS.

### FR-07: Thống kê & Phân tích Tương tác (Analytics Dashboard)

- **Mô tả:** Theo dõi số liệu tương tác phục vụ thống kê trong CMS.
- **Yêu cầu chi tiết:**
  - Tự động ghi nhận lượt xem trang chủ, xem chi tiết dự án (`PROJECT_VIEW`),
    lượt click tải CV (`CV_DOWNLOAD`), và lượt gửi form liên hệ
    (`CONTACT_SUBMIT`).
  - Thực hiện băm địa chỉ IP kết hợp User-Agent thành chuỗi `ipHash` để định
    danh duy nhất click trong ngày mà không vi phạm quyền riêng tư.
  - Dashboard hiển thị biểu đồ trực quan thống kê các chỉ số này.

### FR-08: Giao diện hiển thị Portfolio Công khai (Public Portfolio UI)

- **Mô tả:** Trang web công khai hiển thị thông tin năng lực cá nhân.
- **Yêu cầu chi tiết:**
  - Tải nhanh, hiển thị mượt mà các thành phần layout (Kinh nghiệm, Kỹ năng, Dự
    án).
  - Tích hợp thành phần WebGL 3D (React Three Fiber) tăng tính thẩm mỹ cao cấp
    (Premium UX).
  - Chỉ lấy các dữ liệu đã xuất bản (`state = 'PUBLISHED'`).
  - Hỗ trợ Dynamic Metadata phục vụ SEO trên từng trang chi tiết dự án.

### FR-09: Quản lý & Khôi phục Mật khẩu (Password Recovery & Change)

- **Mô tả:** Hệ thống hỗ trợ người quản trị đổi mật khẩu hoặc khôi phục khi quên
  mật khẩu một cách an toàn.
- **Yêu cầu chi tiết:**
  - **Đổi mật khẩu:** Form đổi mật khẩu trong Dashboard thực hiện so sánh mật
    khẩu cũ, mật khẩu mới tối thiểu 8 ký tự, xác thực thành công sẽ ghi đè mật
    khẩu mới (băm bcrypt) vào `DB-USER`.
  - **Khôi phục mật khẩu:**
    - Cho phép điền email đăng ký tại route `/admin/forgot-password`.
    - Sinh token ngẫu nhiên và lưu hạn hết hiệu lực (15 phút) vào DB.
    - Gửi email xác thực thông qua API `Resend` chứa liên kết reset mật khẩu.
    - Trang reset mật khẩu `/admin/reset-password?token=XYZ` kiểm tra token hợp
      lệ và cho phép thiết lập mật khẩu mới.
  - Mọi hành động đổi/khôi phục mật khẩu phải ghi nhật ký hoạt động
    (`DB-AUDIT-LOG`).

### FR-10: Trợ lý ảo AI Portfolio (AI Chat Assistant)

- **Mô tả:** Hệ thống cung cấp dịch vụ trò chuyện trực tuyến tích hợp trí tuệ nhân tạo để trả lời nhanh về kỹ năng, kinh nghiệm và dự án của chủ sở hữu.
- **Yêu cầu chi tiết:**
  - **Dầu vào (Input):** Câu hỏi hiện tại của khách hàng (`prompt` dạng chuỗi) và mảng lịch sử hội thoại hiện tại (`messages` dạng mảng đối tượng `{ role, content }`).
  - **Đầu ra (Output):** Luồng dữ liệu chữ (Text Stream - Server-Sent Events) hiển thị phản hồi tức thì từ AI.
  - **Luồng xử lý phía Máy chủ:**
    1. **Kiểm tra giới hạn tần suất:** Hệ thống lấy địa chỉ IP của Client thông qua header `x-forwarded-for`. Nếu số yêu cầu vượt quá **10 yêu cầu/phút/IP**, trả về mã lỗi `429 Too Many Requests`.
    2. **Truy vấn Dữ liệu ngữ cảnh (Context Collection):** Thực hiện đọc đồng thời từ database:
       - Bản ghi `Profile` của ứng viên.
       - Danh sách `Experience`, `Skill`, `Education`, `Certificate`.
       - Danh sách các dự án (`Project`) có trạng thái `PUBLISHED`.
    3. **Tạo Prompt hệ thống (System Prompt):** Gom dữ liệu trên thành một tập văn bản ngắn gọn làm ngữ cảnh gốc.
    4. **Gọi API ngôn ngữ lớn (Gemini Integration):** Sử dụng hàm `streamText` của Vercel AI SDK kết hợp với mô hình `gemini-1.5-flash` của Google AI Studio, gửi kèm System Prompt ngữ cảnh và lịch sử trò chuyện.
    5. **Truyền luồng (Streaming):** Trả về luồng phản hồi trực tiếp cho Client.
  - **Ràng buộc lưu trữ:** Hội thoại không được lưu trữ vào MongoDB Atlas.

---

## 3. Yêu Cầu Phi Chức Năng (Non-Functional Requirements - NFR)

### NFR-01: Hiệu năng & Tốc độ tải (Performance)

- **Tải trang nhanh:** Trang chủ và trang dự án công khai phải sử dụng cơ chế
  tĩnh hoặc ISR (Incremental Static Regeneration) của Next.js để tải trang dưới
  1.5 giây.
- **Hiệu ứng đồ họa mượt mà:** Giao diện 3D WebGL phải duy trì khung hình tối
  thiểu 60 FPS trên các thiết bị hỗ trợ tiêu chuẩn để không làm giật lag trình
  duyệt.

### NFR-02: Bảo mật dữ liệu (Security)

- Mật khẩu quản trị phải được mã hóa bằng chuẩn băm mạnh (`bcrypt` với salt
  rounds = 10).
- Ngăn chặn các lỗ hổng OWASP cơ bản (SQL Injection bằng Prisma Parameterized
  Queries, XSS bằng việc Next.js tự động escape HTML khi render).
- Ngăn chặn lộ thông tin bằng cách trả về lỗi **404** thay vì **403** khi khách
  đoán link các dự án ẩn (`Draft/Archived`).

### NFR-03: Tính sẵn sàng & Uptime (Availability)

- Website hoạt động liên tục 24/7/365 nhờ cơ sở hạ tầng đám mây Serverless của
  Vercel và MongoDB Atlas Shared cluster (không bị sleep như các hosting miễn
  phí thông thường).

### NFR-04: Chi phí Vận hành (Cost Constraints)

- **Ràng buộc tuyệt đối:** Toàn bộ hệ thống phải được thiết kế nằm trong các hạn
  mức miễn phí lâu dài (Free Tier) của các dịch vụ Cloud:
  - Vercel: Dưới 100GB băng thông/tháng.
  - MongoDB Atlas: Dưới 512MB dung lượng lưu trữ.
  - Cloudinary: Dưới 25GB dung lượng/băng thông ảnh.
  - Resend: Dưới 3,000 email gửi đi hàng tháng.

### NFR-05: Khả năng Bảo trì & Mở rộng (Maintainability)

- Sử dụng TypeScript chặt chẽ, tự động sinh type an toàn thông qua Prisma
  Client.
- Áp dụng mô hình cấu trúc mã nguồn app router sạch sẽ, tách biệt logic nghiệp
  vụ trong Server Actions và UI trong Components.

---

## 4. Giao Tiếp Hệ Thống (System Interfaces)

- **Database Interface:** Giao tiếp TCP/HTTP an toàn thông qua Prisma Client kết
  nối MongoDB Atlas.
- **File Storage API:** Kết nối API REST của Cloudinary hoặc SDK để tải và phân
  phối hình ảnh qua CDN.
- **Mail Transfer Interface:** Gọi API của Resend (gửi qua giao thức HTTPS bảo
  mật) để gửi thông báo email.
- **Scheduled Event API:** Vercel Cron Job gửi định kỳ HTTP Request (POST) kèm
  token bảo mật ở header để kích hoạt luồng xuất bản hẹn giờ.
