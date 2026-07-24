---
id: modules/admin/password-recovery/requirements.md
type: document
title: requirements
module: MOD-ADMIN-RECOVERY
status: approved
version: 1.0
owner: PO
tags:
  - admin
  - password-recovery
  - requirements
last_updated: 2026-07-20
---

# Password Recovery Module Requirements

> [!NOTE] **EN:** Detail the specific business and functional requirements for
> this module. **VI:** Trình bày chi tiết các yêu cầu nghiệp vụ và chức năng cụ
> thể cho module khôi phục mật khẩu.

## Yêu Cầu Nghiệp Vụ & Chức Năng (Requirements & Business Rules)

Các yêu cầu của phân hệ khôi phục mật khẩu quản trị được xây dựng dựa trên đặc
tả hệ thống:

### 1. Giao diện Yêu cầu Khôi phục Mật khẩu (`/admin/forgot-password`)

- **REQ-RECOVERY-001:** Cung cấp biểu mẫu cho phép nhập địa chỉ email của quản
  trị viên để yêu cầu gửi liên kết đặt lại mật khẩu.
- **REQ-RECOVERY-002:** Hệ thống chỉ chấp nhận địa chỉ email trùng khớp với địa
  chỉ email duy nhất của tài khoản Admin được cấu hình và lưu trữ trong cơ sở dữ
  liệu MongoDB Atlas.
- **REQ-RECOVERY-003:** Khi email hợp lệ, hệ thống tự động:
  - Tạo token khôi phục mật khẩu ngẫu nhiên có độ dài bảo mật cao (sử dụng chuỗi
    Hex sinh từ `crypto.randomBytes(32)`).
  - Xác định thời gian hết hạn của token là đúng **15 phút** kể từ thời điểm
    khởi tạo.
  - Lưu trữ thông tin token, email liên kết và thời gian hết hạn vào bảng
    `PasswordResetToken` (đồng thời dọn dẹp/xóa bỏ các token cũ của email này để
    tối ưu hóa dữ liệu và tránh tấn công tái sử dụng).
- **REQ-RECOVERY-004:** Gửi email chứa liên kết đặt lại mật khẩu tới hòm thư của
  Admin thông qua dịch vụ SMTP được cấu hình bảo mật trên máy chủ.
- **REQ-RECOVERY-005:** Định dạng liên kết đặt lại mật khẩu gửi qua email phải
  tuân thủ cấu trúc:  
  `[NEXTAUTH_URL]/admin/reset-password?token=[TOKEN_GIÁ_TRỊ]`
- **REQ-RECOVERY-010 (Rate Limiting):** Hệ thống phải giới hạn số lần yêu cầu
  gửi email khôi phục mật khẩu từ cùng một địa chỉ IP trong một khoảng thời gian
  xác định nhằm ngăn chặn hành vi lạm dụng, spam email và tấn công dò quét (ví
  dụ: tối đa 3 yêu cầu trong vòng 15 phút từ cùng một IP).
- **REQ-RECOVERY-011 (Nội dung Email):** Email khôi phục mật khẩu được gửi đi
  bắt buộc phải bao gồm đầy đủ các thông tin sau:
  - **Tiêu đề thư:** Mang tính chất cảnh báo bảo mật rõ ràng (ví dụ:
    `[MyPortfolio] Yêu cầu đặt lại mật khẩu tài khoản quản trị`).
  - **Thời gian hết hạn:** Ghi rõ liên kết chỉ có hiệu lực trong vòng **15
    phút** kể từ thời điểm yêu cầu.
  - **Link Reset:** Đường dẫn đặt lại mật khẩu chứa token hợp lệ dưới dạng nút
    bấm hoặc liên kết rõ ràng.
  - **Khuyến cáo bảo mật:** Lời nhắc nhở người nhận bỏ qua email này nếu họ
    không phải là người thực hiện yêu cầu khôi phục mật khẩu.

### 2. Giao diện Đặt lại Mật khẩu (`/admin/reset-password`)

- **REQ-RECOVERY-006 (Kiểm tra Token - Phase 1):** Khi Admin truy cập trang bằng
  liên kết từ email, hệ thống phải tự động kiểm tra token thông qua cơ sở dữ
  liệu:
  - Nếu token không tồn tại hoặc đã hết hạn (quá 15 phút): Lập tức chặn truy
    cập, hiển thị thông báo lỗi trực quan (ví dụ: "Token không hợp lệ hoặc đã
    hết hạn") và cung cấp nút liên kết quay lại trang yêu cầu khôi phục.
  - Nếu token hợp lệ và còn hạn: Cho phép hiển thị biểu mẫu nhập mật khẩu mới.
- **REQ-RECOVERY-007 (Xác nhận Mật khẩu - Phase 2):** Biểu mẫu đặt lại mật khẩu
  phải cung cấp ô nhập mật khẩu mới và ô xác nhận mật khẩu mới. Kiểm tra và đảm
  bảo hai mật khẩu nhập vào trùng khớp hoàn toàn trước khi cho phép submit.
- **REQ-RECOVERY-014 (Độ phức tạp mật khẩu):** Mật khẩu mới bắt buộc phải có độ
  dài tối thiểu là **8 ký tự** và phải thỏa mãn tất cả các ràng buộc độ phức tạp
  sau để tăng cường bảo mật:
  - Ít nhất một chữ cái viết hoa (A-Z).
  - Ít nhất một chữ cái viết thường (a-z).
  - Ít nhất một chữ số (0-9).
  - Ít nhất một ký tự đặc biệt (ví dụ: `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`,
    v.v.).
- **REQ-RECOVERY-008 (Cập nhật dữ liệu):** Khi submit thành công:
  - Mã hóa một chiều mật khẩu mới bằng thuật toán `bcrypt` trước khi lưu đè vào
    trường `passwordHash` của tài khoản Admin trong bảng `User`.
  - **Duy nhất 1 lần:** Xóa bỏ token khôi phục mật khẩu này khỏi cơ sở dữ liệu
    ngay lập tức để ngăn chặn hành vi sử dụng lại token cũ.
  - Tự động chuyển hướng (Redirect) người dùng về trang đăng nhập `/admin/login`
    sau khi hiển thị thông báo thành công.
- **REQ-RECOVERY-015 (Vô hiệu hóa phiên đăng nhập cũ):** Sau khi đặt lại mật
  khẩu thành công, hệ thống bắt buộc phải **vô hiệu hóa toàn bộ các phiên đăng
  nhập (Sessions) hiện có** của tài khoản Admin trên mọi thiết bị và trình duyệt
  để phòng ngừa rủi ro tài khoản bị chiếm đoạt trước đó vẫn duy trì đăng nhập.

### 3. Nhật ký kiểm toán bảo mật (Audit Logging)

- **REQ-RECOVERY-009:** Ghi nhận nhật ký kiểm toán cho toàn bộ vòng đời khôi
  phục mật khẩu vào bảng `AuditLog` thông qua hàm `createAuditLog`:
  - **Khi có yêu cầu gửi mail khôi phục:** Ghi nhận sự kiện
    `PASSWORD_RESET_REQUEST`, mô tả chi tiết email yêu cầu và IP nguồn của máy
    khách.
  - **Khi khôi phục mật khẩu thành công:** Ghi nhận sự kiện
    `PASSWORD_RESET_SUCCESS`, mô tả chi tiết tài khoản đã khôi phục thành công
    kèm IP nguồn.
  - **Khi cố tình thử token sai/hết hạn:** Ghi nhận sự kiện
    `PASSWORD_RESET_FAILED` kèm mô tả chi tiết để phục vụ phân tích các hành vi
    dò tìm hoặc tấn công.

### 4. Yêu cầu Hiệu năng (Performance Requirements)

- **REQ-RECOVERY-012 (Thời gian phản hồi API):** Thời gian phản hồi (Response
  Time) của các API/Server Actions liên quan đến yêu cầu khôi phục mật khẩu và
  đặt lại mật khẩu phải **nhỏ hơn 2 giây** (< 2 giây).
- **REQ-RECOVERY-013 (Thời gian gửi Email):** Email khôi phục mật khẩu phải được
  máy chủ gửi đi và đến hộp thư của Admin trong vòng tối đa **30 giây** kể từ
  thời điểm hệ thống phản hồi API thành công.
