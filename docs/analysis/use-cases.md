---
id: DOC-USE-CASES
type: use_case
title: use-cases
status: approved
version: 1.0
depends_on:
  - DOC-PRD
description: Interactive use cases for portfolio owners and recruiters.
---

# Use Cases Specification

Tài liệu này đặc tả chi tiết các ca sử dụng (Use Cases) của hệ thống
**MyPortfolio**, bao gồm tác nhân (Actors), tiền điều kiện, hậu điều kiện và
luồng xử lý chính.

---

## 1. Danh sách Tác nhân (Actors)

- **Portfolio Owner (Chủ sở hữu):** Tác nhân đăng nhập có quyền quản trị tối cao
  đối với toàn bộ tài nguyên.
- **Visitor / Recruiter (Khách truy cập / Nhà tuyển dụng):** Tác nhân công khai,
  sử dụng các tính năng xem và kết nối.
- **System (Hệ thống):** Tác nhân tự động thực hiện các cron job hoặc hành vi
  nền.

---

## 2. Đặc tả Chi tiết các Ca sử dụng (Use Cases Specification)

### UC-001: Đăng nhập Quản trị (Admin Login)

- **Actor:** Portfolio Owner.
- **Tiền điều kiện:** Người dùng truy cập trang `/admin/login`. Tài khoản admin
  đã được seeding trong database hoặc email Google được định cấu hình sẵn.
- **Luồng chính (Đăng nhập bằng Mật khẩu):**
  1. Người dùng nhập `username` (hoặc `email`) và `password`.
  2. Người dùng nhấn nút "Đăng nhập".
  3. Hệ thống kiểm tra thông tin qua NextAuth.js Credentials Provider:
     - Truy vấn bản ghi `User` tương ứng trong MongoDB.
     - So sánh password hash băm bcrypt.
  4. Xác thực thành công: Hệ thống sinh session, chuyển hướng người dùng vào
     trang `/dashboard` và ghi log: _"Đăng nhập thành công"_.
- **Luồng thay thế (Đăng nhập bằng Google):**
  1. Người dùng nhấn nút "Đăng nhập bằng Google".
  2. Người dùng chọn tài khoản Google của mình thông qua giao diện OAuth của
     Google.
  3. Google xác thực thành công và trả về thông tin email cho hệ thống.
  4. Hệ thống (NextAuth.js callback signIn) kiểm tra email nhận được:
     - So sánh email với giá trị của biến môi trường `ADMIN_GOOGLE_EMAIL`.
     - Nếu trùng khớp: Hệ thống chấp nhận đăng nhập, khởi tạo session, chuyển
       hướng về `/dashboard` và ghi log: _"Đăng nhập thành công qua Google"_.
- **Luồng ngoại lệ (Xác thực thất bại):**
  - Nhập sai mật khẩu: Hệ thống hiển thị thông báo lỗi _"Tài khoản hoặc mật khẩu
    không chính xác"_, ghi log audit: _"Đăng nhập thất bại từ IP X"_.
  - Đăng nhập Google sai email: Hệ thống từ chối đăng nhập, hiển thị thông báo
    lỗi _"Tài khoản Google không được phép truy cập"_, ghi log audit: _"Đăng
    nhập thất bại qua Google: Email [Email_Khác] không hợp lệ"_.

### UC-002: Thêm mới / Chỉnh sửa Dự án (Create / Edit Project)

- **Actor:** Portfolio Owner.
- **Tiền điều kiện:** Đã đăng nhập hệ thống thành công (UC-001).
- **Luồng chính:**
  1. Admin truy cập mục "Quản lý Dự án", nhấn "Thêm dự án".
  2. Admin nhập thông tin: Tiêu đề, slug, mô tả ngắn, nội dung Markdown, đính
     kèm ảnh (tải lên Cloudinary), thời gian, vai trò, quy mô nhóm và chọn trạng
     thái `state` (Draft hoặc Published).
  3. Admin nhấn "Lưu".
  4. Hệ thống:
     - Kiểm tra tính duy nhất của `slug`.
     - Lưu bản ghi mới vào bảng `Project`.
     - Tự động sinh bản ghi `ProjectVersion` nếu trạng thái là `PUBLISHED`
       (BRULE-04).
     - Ghi log thao tác vào bảng `AuditLog`.
  5. Hệ thống hiển thị thông báo _"Lưu dự án thành công"_.

### UC-003: Lên lịch xuất bản tự động (Scheduled Publishing)

- **Actor:** System (Hệ thống).
- **Tiền điều kiện:** Dự án đã có thông tin hẹn giờ `schedulePublishAt` hoặc
  `scheduleArchiveAt` và đang ở trạng thái `DRAFT` hoặc `PUBLISHED`.
- **Luồng chính:**
  1. Vercel Cron gửi request HTTP POST định kỳ tới endpoint
     `/api/cron/publishing`.
  2. Hệ thống kiểm tra thời gian hiện tại:
     - Quét các dự án có trạng thái `DRAFT` và `schedulePublishAt` $\le$ hiện
       tại $\rightarrow$ chuyển trạng thái thành `PUBLISHED`, cập nhật
       `publishedAt`.
     - Quét các dự án có trạng thái `PUBLISHED` và `scheduleArchiveAt` $\le$
       hiện tại $\rightarrow$ chuyển trạng thái thành `ARCHIVED`.
  3. Với mỗi dự án được xuất bản:
     - Hệ thống nhân bản để tạo một bản ghi `ProjectVersion` mới.
     - Làm mới cache tĩnh của Next.js (`revalidatePath`).
  4. Hệ thống ghi nhật ký hoạt động với tác nhân `SYSTEM`.

### UC-004: Khôi phục phiên bản cũ (Restore Project Version)

- **Actor:** Portfolio Owner.
- **Tiền điều kiện:** Đã đăng nhập hệ thống (UC-001). Dự án đã có lịch sử trong
  bảng `ProjectVersion`.
- **Luồng chính:**
  1. Admin mở trang chi tiết dự án trong CMS, chuyển tới tab "Lịch sử Phiên
     bản".
  2. Admin chọn một phiên bản cũ trong danh sách và nhấn "Khôi phục phiên bản
     này".
  3. Hệ thống:
     - Đọc thông tin từ bảng `ProjectVersion` tương ứng.
     - Ghi đè thông tin đó ngược lại bản ghi chính trong bảng `Project`.
     - Tăng số hiệu phiên bản của `Project` lên 1 đơn vị.
     - Tạo một bản ghi `ProjectVersion` mới đại diện cho trạng thái hiện tại sau
       khôi phục (không xóa các phiên bản cũ - BRULE-06).
     - Ghi nhật ký vào bảng `AuditLog`.
  4. Hệ thống hiển thị thông báo _"Khôi phục phiên bản thành công"_.

### UC-005: Xem thống kê & Đọc tin nhắn liên hệ (View Dashboard & Messages)

- **Actor:** Portfolio Owner.
- **Tiền điều kiện:** Đã đăng nhập hệ thống (UC-001).
- **Luồng chính:**
  1. Admin truy cập Dashboard chính.
  2. Hệ thống hiển thị biểu đồ thống kê tương tác (đọc từ bảng
     `AnalyticsMetric`): Tổng lượt truy cập, lượt xem từng dự án, lượt tải CV.
  3. Admin chọn mục "Hộp thư đến" để đọc tin nhắn từ nhà tuyển dụng (truy vấn
     bảng `ContactMessage`).
  4. Admin có thể đánh dấu trạng thái tin nhắn (Đã đọc/Lưu trữ) hoặc Xóa tin
     nhắn. Mỗi thao tác xóa được ghi nhận vào `AuditLog`.

### UC-006: Khách xem hồ sơ & Tải CV (View Portfolio & Download CV)

- **Actor:** Visitor / Recruiter.
- **Tiền điều kiện:** Truy cập trang web công khai của Portfolio.
- **Luồng chính:**
  1. Khách xem thông tin cá nhân, kinh nghiệm, học vấn, dự án đã xuất bản (hệ
     thống lọc `{ state: "PUBLISHED" }`).
  2. Khách nhấn nút "Tải CV PDF".
  3. Trình duyệt tải CV trực tiếp từ đường dẫn CDN.
  4. Hệ thống ngầm ghi nhận một bản ghi `AnalyticsMetric` với
     `eventType: "CV_DOWNLOAD"`, băm địa chỉ IP khách để đếm lượt truy cập
     unique (BRULE-09).

### UC-007: Gửi biểu mẫu liên hệ (Submit Contact Form)

- **Actor:** Visitor / Recruiter.
- **Tiền điều kiện:** Khách truy cập mục "Liên hệ" ngoài trang công khai.
- **Luồng chính:**
  1. Khách điền thông tin: Tên, Email, Tiêu đề, Nội dung tin nhắn.
  2. Khách nhấn "Gửi tin nhắn".
  3. Hệ thống:
     - Kiểm tra tính hợp lệ của dữ liệu đầu vào.
     - Lưu tin nhắn vào bảng `ContactMessage` với trạng thái `NEW`.
     - Tự động gửi email cảnh báo thông qua Email Service (Resend/Brevo) để báo
       cho Portfolio Owner có tin nhắn mới.
     - Ghi nhận sự kiện `AnalyticsMetric` với `eventType: "CONTACT_SUBMIT"`.
  4. Website hiển thị thông báo gửi thành công cho Khách truy cập.

### UC-008: Đổi Mật khẩu (Change Password)

- **Actor:** Portfolio Owner.
- **Tiền điều kiện:** Admin đã đăng nhập thành công (UC-001).
- **Luồng chính:**
  1. Admin mở trang "Cấu hình tài khoản" trong CMS, chọn "Đổi mật khẩu".
  2. Admin nhập mật khẩu hiện tại, mật khẩu mới, xác nhận mật khẩu mới.
  3. Admin nhấn "Xác nhận đổi".
  4. Hệ thống:
     - Kiểm tra mật khẩu hiện tại khớp với password hash trong DB.
     - Kiểm tra mật khẩu mới hợp lệ (tối thiểu 8 ký tự).
     - Băm mật khẩu mới (bcrypt) và lưu đè DB.
     - Tạo sự kiện trong `DB-AUDIT-LOG`.
     - Hủy token/session NextAuth.js hiện tại để yêu cầu đăng nhập lại bằng mật
       khẩu mới.
     - Gửi email cảnh báo tài khoản vừa đổi mật khẩu qua Resend.
  5. Hệ thống điều hướng Admin về trang đăng nhập.

### UC-009: Khôi phục Mật khẩu Quên (Password Recovery)

- **Actor:** Portfolio Owner, System.
- **Tiền điều kiện:** Admin quên mật khẩu, truy cập đường dẫn
  `/admin/forgot-password`.
- **Luồng chính:**
  1. Admin điền email quản trị đăng ký và nhấn "Gửi liên kết khôi phục".
  2. Hệ thống:
     - Kiểm tra email khớp với email Admin trong DB.
     - Tạo mã Token ngẫu nhiên (UUID hoặc tương đương), lưu vào DB kèm thời hạn
       hiệu lực (15 phút).
     - Gửi một Email chứa liên kết khôi phục dạng
       `/admin/reset-password?token=XYZ` tới hòm thư của Admin.
  3. Admin mở email, nhấn vào liên kết và được chuyển hướng về trang nhập mật
     khẩu mới.
  4. Admin điền mật khẩu mới và xác nhận.
  5. Hệ thống:
     - Kiểm tra Token còn hạn trong DB.
     - Băm mật khẩu mới (bcrypt), cập nhật DB.
     - Vô hiệu hóa Token vừa dùng.
     - Tạo bản ghi nhật ký trong `DB-AUDIT-LOG`.
  6. Hệ thống hiển thị thông báo khôi phục thành công, chuyển hướng về trang
     đăng nhập `/admin/login`.
