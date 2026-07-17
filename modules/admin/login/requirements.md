# Admin Login Module Requirements

> [!NOTE] **EN:** Detail the specific business and functional requirements for
> this module. **VI:** Trình bày chi tiết các yêu cầu nghiệp vụ và chức năng cụ
> thể cho module này.

## Yêu Cầu Nghiệp Vụ & Chức Năng (Requirements & Business Rules)

Các yêu cầu của hệ thống đăng nhập quản trị được xây dựng dựa trên tài liệu
nghiệp vụ
[brd.md](file:///d:/Workspace/Projects/my-portfolio/docs/requirements/brd.md) và
đặc tả
[prd.md](file:///d:/Workspace/Projects/my-portfolio/docs/requirements/prd.md):

### 1. Đăng nhập bằng tài khoản nội bộ (Credentials Provider)

- **REQ-LOGIN-001:** Hệ thống phải hỗ trợ phương thức đăng nhập truyền thống sử
  dụng `username` và `password`.
- **REQ-LOGIN-002:** Mật khẩu của Admin bắt buộc phải được mã hóa một chiều bằng
  thuật toán `bcrypt` trước khi lưu trữ vào trường `passwordHash` trong bảng
  `User` tại cơ sở dữ liệu MongoDB Atlas.
- **REQ-LOGIN-003:** Không cho phép đăng ký tài khoản mới trực tiếp trên giao
  diện để đảm bảo tính an toàn của hệ thống đơn quản trị (Single-Admin). Tài
  khoản admin phải được khởi tạo thông qua script seeding hoặc lệnh nội bộ.

### 2. Đăng nhập qua bên thứ ba (Google OAuth 2.0 Provider)

- **REQ-LOGIN-004:** Hệ thống phải hỗ trợ nút đăng nhập nhanh bằng tài khoản
  Google (Google OAuth 2.0).
- **REQ-LOGIN-005 (Bắt buộc - BRULE-17):** Giai đoạn xác thực callback
  (`signIn`) của NextAuth phải đối chiếu email của tài khoản Google đăng nhập
  với biến môi trường `ADMIN_GOOGLE_EMAIL` được cấu hình trên máy chủ:
  - Nếu trùng khớp: Chấp nhận đăng nhập và tạo session.
  - Nếu không trùng khớp: Hệ thống lập tức từ chối và chặn đăng nhập ngay tại
    cổng callback, trả về lỗi `AccessDenied` và hiển thị thông báo lỗi trực quan
    trên giao diện.

### 3. Nhật ký kiểm toán bảo mật (Audit Logging)

- **REQ-LOGIN-006 (BRULE-05):** Mọi hành động đăng nhập hoặc thao tác liên quan
  tới tài khoản đều phải được tự động ghi lại vào bảng `AuditLog` thông qua hàm
  `createAuditLog` với các tham số tối thiểu bao gồm:
  - **Đăng nhập Credentials thành công:** Ghi nhận sự kiện `LOGIN`, mô tả chi
    tiết, IP máy khách.
  - **Đăng nhập Google thành công:** Ghi nhận sự kiện `LOGIN`, mô tả kèm địa chỉ
    email của Google.
  - **Đăng nhập thất bại (Credentials/Google):** Ghi nhận sự kiện
    `LOGIN_FAILED`, mô tả rõ nguyên nhân (Sai mật khẩu, Email Google không hợp
    lệ) và địa chỉ IP nguồn để phòng ngừa tấn công.
  - **Đổi/Khôi phục mật khẩu thành công:** Ghi nhận sự kiện đổi mật khẩu thành
    công kèm theo ghi chép audit log tương ứng.

### 4. Lá chắn bảo mật định tuyến (Route Guard / Middleware Shield)

- **REQ-LOGIN-007 (BRULE-07):** Áp dụng Next.js Middleware kiểm tra
  Token/Session từ Cookies.
- **REQ-LOGIN-008:** Chặn toàn bộ các yêu cầu HTTP truy cập trái phép vào các
  trang quản trị `/admin/*` (trừ `/admin/login`, `/admin/forgot-password`,
  `/admin/reset-password`) hoặc các API nội bộ của admin.
- **REQ-LOGIN-009:** Nếu chưa đăng nhập, Middleware tự động chuyển hướng người
  dùng (Redirect 302) về trang `/admin/login`.

### 5. Giới hạn tần suất và Khôi phục mật khẩu (Security Rate Limiting & Recovery)

- **REQ-LOGIN-010:** Để ngăn chặn các cuộc tấn công dò mật khẩu (Brute-Force),
  các điểm cuối API đăng nhập hoặc Server Actions đăng nhập phải được giới hạn
  tần suất truy cập từ cùng một địa chỉ IP (Rate Limiting).
- **REQ-LOGIN-011 (BRULE-16):** Tính năng khôi phục mật khẩu phải gửi liên kết
  đặt lại mật khẩu kèm Token bảo mật qua email đã đăng ký của Admin.
- **REQ-LOGIN-012:** Link khôi phục mật khẩu chứa Token chỉ có hiệu lực tối đa
  **15 phút** kể từ thời điểm khởi tạo và Token chỉ được sử dụng duy nhất một
  lần.
