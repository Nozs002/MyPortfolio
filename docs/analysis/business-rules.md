---
id: DOC-RULES
type: business_rule
title: business-rules
status: approved
version: 1.0
depends_on:
  - DOC-BRD
description:
  Collection of systemic business rules governing content lifecycle, audit, and
  security.
---

# Business Rules Catalog

Tài liệu này đặc tả chi tiết các quy tắc nghiệp vụ (Business Rules) chi phối
luồng xử lý dữ liệu, nghiệp vụ hiển thị, cơ chế bảo mật và thống kê tương tác
của hệ thống **MyPortfolio**.

---

## 1. Nhóm Quy tắc Vòng đời Nội dung (Content Lifecycle Rules)

### BRULE-01: Quy tắc Hiển thị Công khai

- **Nội dung:** Chỉ các thực thể nội dung (Dự án, Bài viết, v.v.) có trạng thái
  `PUBLISHED` mới được phép hiển thị trên giao diện công khai cho Khách truy cập
  (`Visitor/Recruiter`).
- **Ràng buộc hệ thống:** Các API/Server Actions phục vụ trang Public bắt buộc
  phải áp dụng bộ lọc: `{ state: "PUBLISHED" }`.

### BRULE-02: Quy tắc Ẩn nội dung

- **Nội dung:** Các nội dung ở trạng thái `DRAFT` (Nháp) hoặc `ARCHIVED` (Lưu
  trữ) tuyệt đối không được hiển thị công khai.
- **Ràng buộc hệ thống:** Nếu Khách truy cập cố tình đoán URL của trang chi tiết
  có trạng thái ẩn (ví dụ: `/projects/du-an-nhap`), hệ thống phải trả về mã lỗi
  **404 Not Found** (không được trả về 403 để tránh lộ thông tin sự tồn tại của
  tài nguyên).

### BRULE-03: Trạng thái Độc quyền

- **Nội dung:** Mỗi một nội dung tại một thời điểm chỉ có duy nhất một trạng
  thái hợp lệ. Các trạng thái được chấp nhận gồm: `DRAFT`, `PUBLISHED`,
  `ARCHIVED`.

---

## 2. Nhóm Quy tắc Hẹn giờ Xuất bản (Scheduled Publishing Rules)

### BRULE-11: Quy tắc Chuyển trạng thái Hẹn giờ

- **Nội dung:** Hệ thống cho phép cấu hình hẹn giờ chuyển trạng thái tự động
  thông qua hai thuộc tính:
  - `schedulePublishAt`: Thời điểm tự động chuyển từ `DRAFT` sang `PUBLISHED`.
  - `scheduleArchiveAt`: Thời điểm tự động chuyển từ `PUBLISHED` sang
    `ARCHIVED`.
- **Cơ chế kích hoạt:** Hệ thống chạy tác vụ nền (Cron Job) định kỳ. Khi thời
  gian hiện tại $\ge$ thời điểm hẹn giờ:
  - Trạng thái tự động cập nhật.
  - Hệ thống ghi nhật ký thao tác với tác nhân thực hiện là `SYSTEM`.
  - Gửi tín hiệu xóa cache tĩnh của route liên quan để cập nhật giao diện ngay
    lập tức.

---

## 3. Nhóm Quy tắc Quản lý Phiên bản (Versioning Rules)

### BRULE-04: Tạo phiên bản khi Xuất bản

- **Nội dung:** Mỗi khi nội dung của Dự án được lưu với trạng thái chuyển sang
  hoặc duy trì là `PUBLISHED`, hệ thống phải tự động nhân bản (Snapshot) dữ liệu
  hiện tại để tạo ra một bản ghi `ProjectVersion` mới.
- **Ràng buộc:** Số hiệu phiên bản (`version`) tự động tăng thêm 1 đơn vị.

### BRULE-06: Bảo toàn lịch sử Khôi phục

- **Nội dung:** Thao tác khôi phục (Restore) một dự án về một phiên bản cũ trong
  lịch sử không được phép xóa đi bất kỳ phiên bản nào khác đã tồn tại trong bảng
  `ProjectVersion`.
- **Cơ chế:** Khi thực hiện khôi phục:
  - Dữ liệu từ bản ghi `ProjectVersion` được sao chép và ghi đè ngược lại bảng
    chính `Project`.
  - Tạo một phiên bản `ProjectVersion` mới đại diện cho hành động khôi phục này
    (đánh dấu số hiệu phiên bản tiếp theo).
  - Lịch sử thao tác phải ghi lại: _"Khôi phục dự án X về phiên bản V"_.

---

## 4. Nhóm Quy tắc Kiểm toán & Bảo mật (Audit & Security Rules)

### BRULE-07: Quyền hạn Tối cao

- **Nội dung:** Chỉ tài khoản quản trị viên duy nhất (`Portfolio Owner`) sau khi
  xác thực NextAuth.js thành công mới có quyền tạo mới, chỉnh sửa, đổi trạng
  thái, khôi phục hoặc xóa bỏ dữ liệu hệ thống.

### BRULE-05: Ràng buộc Nhật ký thao tác (Audit Log)

- **Nội dung:** Mọi thao tác thay đổi dữ liệu (Cập nhật Profile, CRUD Dự án,
  Khôi phục phiên bản) bắt buộc phải được ghi nhật ký hoạt động.
- **Thông tin bắt buộc lưu giữ:**
  - Người thực hiện (`userId` hoặc `SYSTEM` đối với cron job).
  - Thời gian thao tác.
  - Loại hành động (CREATE, UPDATE, DELETE, RESTORE).
  - Tên thực thể và ID thực thể bị tác động.
  - Chi tiết mô tả ngắn gọn.
- **Ràng buộc:** Bản ghi `AuditLog` chỉ được phép ghi (Create) và đọc (Read),
  tuyệt đối không cung cấp API cập nhật (Update) hoặc xóa (Delete).

---

## 5. Nhóm Quy tắc Tương tác & Phân tích (Analytics & Interaction Rules)

### BRULE-09: Ghi nhận tương tác

- **Nội dung:** Để thống kê hiệu quả của Portfolio, hệ thống tự động ghi nhận
  các sự kiện:
  - Lượt xem trang chủ hoặc trang dự án (`PAGE_VIEW` / `PROJECT_VIEW`).
  - Lượt click vào liên kết tải CV PDF (`CV_DOWNLOAD`).
  - Lượt gửi biểu mẫu liên hệ thành công (`CONTACT_SUBMIT`).
- **Bảo vệ quyền riêng tư:** Để tránh vi phạm pháp luật về dữ liệu cá nhân, hệ
  thống không lưu địa chỉ IP gốc của người dùng. Thay vào đó, băm địa chỉ IP kết
  hợp với User-Agent thành chuỗi `ipHash` để phục vụ thống kê số lượng click duy
  nhất (Unique clicks) trong ngày.

### BRULE-10: Định dạng tệp tải lên

- **Nội dung:** Các tệp tin tải lên hệ thống phải được kiểm tra định dạng nghiêm
  ngặt:
  - Tệp CV: Chỉ chấp nhận định dạng `.pdf`, dung lượng tối đa 5MB.
  - Ảnh minh họa / Thumbnail: Chỉ chấp nhận các định dạng `.jpg`, `.jpeg`,
    `.png`, `.webp`, dung lượng tối đa 2MB mỗi ảnh. Các ảnh tải lên sẽ được tự
    động đồng bộ lên CDN.
