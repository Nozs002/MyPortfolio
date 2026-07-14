---
id: DOC-ARCH-DATABASE
type: database
title: database
status: approved
version: 1.0
owner: PO
tags:
  - database
  - schema
  - mongodb
depends_on:
  - DOC-ARCHITECTURE
last_updated: 2026-07-14
---

# Database Architecture

## 1. Hệ Quản trị Cơ sở Dữ liệu (Database Engine)

Dự án sử dụng **MongoDB Atlas** (Cloud NoSQL DBaaS).

- **Lý do chọn:** Thích hợp tuyệt đối cho môi trường Serverless (Vercel) nhờ cơ
  chế kết nối qua connection-string HTTP/TCP tối ưu, loại bỏ hoàn toàn hiện
  tượng cạn kiệt pool kết nối (connection pool exhaustion) thường thấy ở các cơ
  sở dữ liệu SQL truyền thống khi chạy Serverless.
- **Đặc tả kết nối (Prisma 7):** Theo tiêu chuẩn của **Prisma v7**, các tham số
  kết nối di chuyển ra khỏi file schema tĩnh để đặt tập trung trong
  [prisma.config.ts](file:///d:/Workspace/Projects/my-portfolio/prisma.config.ts),
  nạp biến môi trường `DATABASE_URL`.

## 2. Chi Tiết Thực Thể Dữ Liệu (Collections Catalog)

Hệ thống sử dụng Prisma ORM để quản lý chặt chẽ cấu trúc 11 Collections sau
trong MongoDB:

### 2.1. Tài khoản Quản trị (`User`)

- **Mục đích:** Lưu thông tin tài khoản admin duy nhất của Portfolio Owner.
- **Các trường chính:** `id` (ObjectId), `username` (Unique String),
  `passwordHash` (Mã hóa bcrypt), `email` (Unique String), `name`.

### 2.2. Hồ sơ cá nhân (`Profile`)

- **Mục đích:** Lưu trữ thông tin cá nhân cơ bản để hiển thị ở mục giới thiệu.
- **Các trường chính:** `id`, `name`, `title` (ví dụ: "Senior Fullstack Dev"),
  `bio`, `avatarUrl`, `email`, `phone`, `address`, `socialLinks` (Json lưu các
  liên kết MXH), `cvUrl` (Lưu link file PDF).

### 2.3. Kinh nghiệm làm việc (`Experience`)

- **Mục đích:** Lưu lịch sử các vị trí công việc đã và đang đảm nhận.
- **Các trường chính:** `id`, `company`, `role`, `description`, `startDate`,
  `endDate` (tùy chọn), `isCurrent` (đang làm việc), `techStack` (mảng String
  chứa các công nghệ áp dụng).

### 2.4. Quá trình học tập (`Education`)

- **Mục đích:** Lưu thông tin học vấn, trường lớp.
- **Các trường chính:** `id`, `school`, `degree` (bằng cấp), `fieldOfStudy`,
  `startDate`, `endDate`, `grade` (điểm/xếp loại).

### 2.5. Kỹ năng cá nhân (`Skill`)

- **Mục đích:** Danh sách kỹ năng chuyên môn và mềm.
- **Các trường chính:** `id`, `name` (Unique), `category` (Frontend, Backend,
  v.v.), `level` (thang điểm 1-5).

### 2.6. Chứng chỉ đạt được (`Certificate`)

- **Mục đích:** Lưu thông tin chứng chỉ chuyên môn.
- **Các trường chính:** `id`, `name`, `issuer` (tổ chức cấp), `issueDate`,
  `expirationDate` (tùy chọn), `verificationUrl`.

### 2.7. Quản lý Dự án (`Project`)

- **Mục đích:** Lưu thông tin các dự án thực tế phục vụ trang Portfolio.
- **Các trường chính:** `id`, `title`, `slug` (Unique, dùng làm URL),
  `description`, `content` (Markdown), `thumbnail`, `images` (Mảng slide ảnh),
  `techStack`, `liveUrl`, `githubUrl`, `startDate`, `endDate`, `teamSize`,
  `role`, `state` (DRAFT / PUBLISHED / ARCHIVED), `publishedAt`,
  `schedulePublishAt`, `scheduleArchiveAt`.

### 2.8. Lịch sử Phiên bản Dự án (`ProjectVersion`)

- **Mục đích:** Lưu trữ lịch sử snapshot các lần cập nhật dự án phục vụ tính
  năng khôi phục (BR-09).
- **Quan hệ:** Thuộc về một `Project` (Foreign key `projectId` liên kết với
  `Project.id` bằng hành động Cascade Delete - xóa dự án sẽ xóa sạch các phiên
  bản đi kèm).

### 2.9. Tin nhắn Liên hệ (`ContactMessage`)

- **Mục đích:** Lưu các liên hệ của khách hàng/nhà tuyển dụng gửi từ form công
  khai.
- **Các trường chính:** `id`, `senderName`, `senderEmail`, `subject`, `message`,
  `isRead` (boolean), `status` (NEW, READ, ARCHIVED).

### 2.10. Nhật ký Hệ thống (`AuditLog`)

- **Mục đích:** Lưu vết 100% thao tác của Portfolio Owner (BR-04, BRULE-05).
- **Các trường chính:** `id`, `userId` (Liên kết với `User.id`), `action` (Loại
  hành động), `targetType` (Bảng bị tác động), `targetId` (ID bản ghi bị tác
  động), `description`, `ipAddress`.

### 2.11. Đo lường chỉ số tương tác (`AnalyticsMetric`)

- **Mục đích:** Thu thập dữ liệu phi danh tính thống kê tương tác (BR-06,
  BRULE-09).
- **Các trường chính:** `id`, `eventType` (PAGE_VIEW, PROJECT_VIEW, CV_DOWNLOAD,
  CONTACT_SUBMIT), `eventKey` (đường dẫn, slug dự án), `ipHash` (IP đã băm để
  bảo vệ quyền riêng tư), `userAgent`, `referrer`.

## 3. Chiến lược Đánh Chỉ mục & Hiệu năng (Indexes)

Nhằm tối ưu hóa hiệu năng truy vấn trên MongoDB Atlas, hệ thống tự động thiết
lập các chỉ mục (Indexes) thông qua Prisma:

1. **Unique Indexes:**
   - `User.username` và `User.email` để đảm bảo không bị trùng lặp tài khoản.
   - `Project.slug` để phục vụ tìm kiếm động trang chi tiết dự án.
   - `Skill.name` để tránh thêm trùng tên kỹ năng.
2. **Single / Compound Indexes (Dự kiến thiết lập khi lượng dữ liệu lớn):**
   - Chỉ mục trên `Project.state` và `Project.schedulePublishAt` để tối ưu truy
     vấn cho cron job lên lịch xuất bản.
   - Chỉ mục trên `AnalyticsMetric.eventType` và `AnalyticsMetric.createdAt` để
     tăng tốc độ vẽ biểu đồ trên Dashboard.

## 4. Chiến lược Sao lưu & Khôi phục (Backup & Restore)

- **Logical Backup:** Các dữ liệu nghiệp vụ quan trọng được xuất/nhập dưới dạng
  JSON thông qua API `/api/admin/backup`.
- **Database Level Backup:** MongoDB Atlas tự động chụp snapshot dữ liệu hàng
  ngày, đảm bảo khả năng phục hồi thảm họa ở tầng hạ tầng.
