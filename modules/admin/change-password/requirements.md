# Admin Change Password Module Requirements

> [!NOTE] **EN:** Detail the specific business and functional requirements for
> this module. **VI:** Trình bày chi tiết các yêu cầu nghiệp vụ và chức năng cụ
> thể cho module này.

## Yêu Cầu Nghiệp Vụ & Chức Năng (Requirements & Business Rules)

Các yêu cầu của hệ thống đổi mật khẩu được xây dựng dựa trên tài liệu nghiệp vụ
[brd.md](file:///d:/Workspace/Projects/my-portfolio/docs/requirements/brd.md),
đặc tả
[prd.md](file:///d:/Workspace/Projects/my-portfolio/docs/requirements/prd.md) và
danh mục
[business-rules.md](file:///d:/Workspace/Projects/my-portfolio/docs/analysis/business-rules.md):

### 1. Xác thực & Tiêu chuẩn Mật khẩu (Password Validation & Constraints)

- **REQ-CPW-001:** Người dùng phải nhập mật khẩu hiện tại (`currentPassword`).
  Mật khẩu này phải trùng khớp với `passwordHash` lưu trong cơ sở dữ liệu
  MongoDB Atlas (kiểm tra bằng `bcrypt.compare`).
- **REQ-CPW-002:** Mật khẩu mới (`newPassword`) bắt buộc phải đáp ứng tiêu chuẩn
  an toàn:
  - Độ dài tối thiểu **8 ký tự**.
  - Chứa ít nhất một chữ cái viết hoa (A-Z).
  - Chứa ít nhất một chữ cái viết thường (a-z).
  - Chứa ít nhất một chữ số (0-9).
  - Chứa ít nhất một ký tự đặc biệt (ví dụ: `@`, `#`, `$`, `%`, `!`).
- **REQ-CPW-003:** Mật khẩu mới và mật khẩu nhập lại (`confirmPassword`) phải
  trùng khớp 100% trước khi gửi request tới Server Action.
- **REQ-CPW-004:** Mật khẩu mới không được phép giống hệt mật khẩu hiện tại nhằm
  tránh việc đổi mật khẩu mang tính hình thức.
- **REQ-CPW-012 (Kiểm tra dữ liệu bắt buộc):** Cả 3 trường dữ liệu
  (`currentPassword`, `newPassword`, `confirmPassword`) bắt buộc không được phép
  để trống hoặc chỉ chứa khoảng trắng.

### 2. Kiểm soát Tần suất & Chống Brute-Force (Rate Limiting & Lockout)

- **REQ-CPW-011 (Throttling / Rate Limiting):** Hệ thống triển khai cơ chế kiểm
  soát tần suất truy cập tại endpoint/Server Action đổi mật khẩu:
  - Nếu Admin nhập sai mật khẩu hiện tại **quá 5 lần liên tiếp trong vòng 15
    phút**, hệ thống phải tạm thời khóa (lockout) chức năng đổi mật khẩu của tài
    khoản đó trong **30 phút**.
  - Trong thời gian bị khóa 30 phút, mọi yêu cầu đổi mật khẩu sẽ bị từ chối ngay
    lập tức với thông báo lỗi rõ ràng và thời gian còn lại trước khi mở khóa.
  - Mọi sự kiện bị khóa do dò mật khẩu sai phải được ghi vết an ninh vào
    `AuditLog`.

### 3. Mã hóa, Transaction & Bảo toàn Dữ liệu (Database Transaction & Hashing)

- **REQ-CPW-005:** Mật khẩu mới sau khi được xác nhận hợp lệ phải được băm một
  chiều bằng thuật toán `bcrypt` (với salt rounds $\ge 10$) trước khi cập nhật
  vào trường `passwordHash` của bảng `User`.
- **REQ-CPW-006:** Mật khẩu thô (raw password) tuyệt đối không được phép lưu vết
  trong bất kỳ log hệ thống hay trả về response API nào.
- **REQ-CPW-013 (Giao dịch ACID / Transaction Rollback):** Quá trình cập nhật
  `passwordHash` mới vào bảng `User` và quá trình ghi nhận sự kiện vào bảng
  `AuditLog` bắt buộc phải được thực thi trong cùng một **Database Transaction**
  (`prisma.$transaction`). Nếu một trong hai tác vụ thất bại, toàn bộ quá trình
  phải được tự động Rollback để đảm bảo tính toàn vẹn dữ liệu.

### 4. Quản lý Session & Đăng xuất Toàn cục (Global Sign-out)

- **REQ-CPW-007 (Global Sign-out):** Ngay sau khi mật khẩu mới được cập nhật
  thành công, hệ thống không chỉ hủy phiên làm việc ở trình duyệt hiện tại mà
  phải vô hiệu hóa **toàn bộ các phiên đăng nhập hợp lệ đang tồn tại trên tất cả
  các trình duyệt/thiết bị khác (Global Sign-out)**. Điều này được thực hiện
  bằng cách tăng giá trị `tokenVersion` (hoặc `passwordUpdatedAt`) trong bảng
  `User` để làm mất hiệu lực toàn bộ JWT token đã phát hành trước đó.
- **REQ-CPW-008:** Người dùng được tự động chuyển hướng về trang `/admin/login`
  kèm thông báo thành công và yêu cầu đăng nhập lại hoàn toàn bằng mật khẩu mới
  trên tất cả các thiết bị.

### 5. Nhật ký Kiểm toán & Cảnh báo An ninh Chi tiết (Audit Logging & Detailed Email Alert)

- **REQ-CPW-009 (BRULE-05):** Mỗi lần đổi mật khẩu thành công hoặc thất bại phải
  được ghi nhận vào bảng `AuditLog` thông qua hàm `createAuditLog`:
  - **Thành công:** Sự kiện `CHANGE_PASSWORD`, mô tả "Đổi mật khẩu tài khoản
    thành công", kèm địa chỉ IP, User-Agent, trình duyệt và thiết bị.
  - **Thất bại:** Sự kiện `CHANGE_PASSWORD_FAILED`, mô tả rõ lý do (Mật khẩu
    hiện tại sai / Khóa tài khoản do quá 5 lần nhập sai), kèm địa chỉ IP và
    thông tin thiết bị.
- **REQ-CPW-010 (BRULE-16 & Detailed Alert):** Hệ thống tự động phát một Email
  cảnh báo an ninh tới hòm thư cá nhân của Admin ngay sau khi đổi mật khẩu thành
  công. Nội dung email bắt buộc phải bao gồm:
  - **Thời gian thực hiện (Timestamp):** Thời điểm chính xác thực hiện đổi mật
    khẩu (định dạng UTC/Local).
  - **Địa chỉ IP máy khách (IP Address):** IP xuất phát của yêu cầu.
  - **Trình duyệt (Browser):** Tên trình duyệt (Chrome/Firefox/Safari/Edge, v.v.
    được phân tích từ User-Agent).
  - **Thiết bị (Device):** Loại thiết bị (Desktop/Mobile/Tablet).
