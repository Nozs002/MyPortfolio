---
id: DOC-PRD
type: requirement
title: prd
status: approved
version: 1.3
project: PROJ-TEMPLATE
depends_on:
  - DOC-BRD
---

# Product Requirements Document (PRD)

## 1. Giới Thiệu (Introduction)

### 1.1. Tổng quan Sản phẩm (Product Overview)

Sản phẩm **MyPortfolio** hướng tới mục tiêu kép: Không chỉ là một Portfolio trực
quan cao cấp dành cho nhà tuyển dụng (Front-facing website), mà còn là một Hệ
thống Quản trị Nội dung (CMS) độc lập, thông minh và an toàn dành riêng cho chủ
sở hữu.

Hệ thống giúp chủ sở hữu quản lý và công bố toàn bộ thông tin năng lực từ một
nguồn dữ liệu duy nhất mà không cần can thiệp vào mã nguồn, đồng thời đo lường
được hiệu quả tiếp cận nhà tuyển dụng.

### 1.2. Mục tiêu Sản phẩm (Product Goals)

Mục tiêu sản phẩm được xây dựng dựa trên 3 trụ cột cốt lõi:

#### Định vị Thương hiệu Cá nhân & Trải nghiệm Premium (Branding & UX)

- **Mục tiêu**: Giúp nhà tuyển dụng/đối tác nhanh chóng đánh giá năng lực của
  ứng viên và để lại ấn tượng chuyên nghiệp sâu sắc ngay từ lần truy cập đầu
  tiên.
- **Hành động nghiệp vụ**:
  - Ứng dụng công nghệ đồ họa WebGL (React Three Fiber) để tạo trải nghiệm tương
    tác 3D mượt mượt, cao cấp.
  - Tối ưu hóa SEO nâng cao và Open Graph để khi chia sẻ liên kết CV/dự án lên
    các mạng xã hội (LinkedIn, Facebook, Github, Zalo) hiển thị đầy đủ hình ảnh,
    mô tả ấn tượng.

#### Quản trị Nội dung Độc lập & Linh hoạt (CMS)

- **Mục tiêu**: Cho phép chủ sở hữu kiểm soát 100% nội dung hiển thị mà không
  phụ thuộc vào lập trình viên hoặc phải tự tay sửa code.
- **Hành động nghiệp vụ**:
  - Xây dựng trang Dashboard quản trị trực quan để quản lý: Thông tin cá nhân,
    Kinh nghiệm, Kỹ năng, Dự án, Chứng chỉ, Blog, CV.
  - Quản lý trạng thái nội dung nghiêm ngặt: Một dự án đang viết dở (Draft) sẽ
    không bị lộ ra ngoài. Hệ thống hỗ trợ lên lịch xuất bản tự động (Scheduled
    Publishing) để tối ưu thời gian tiếp cận độc giả.

#### Đo lường Tương tác & Bảo toàn Dữ liệu (Analytics & Audit)

- **Mục tiêu**: Cung cấp số liệu thực tế về mức độ quan tâm của nhà tuyển dụng
  và bảo vệ dữ liệu portfolio khỏi những sai sót trong quá trình quản trị.
- **Hành động nghiệp vụ**:
  - Ghi nhận các hành vi có giá trị chuyển đổi: lượt click tải file CV, lượt
    click xem chi tiết dự án, lượt gửi contact form.
  - Tự động sao lưu lịch sử chỉnh sửa nội dung (Audit Log) và quản lý phiên bản
    nội dung (Versioning) để chủ sở hữu có thể khôi phục về trạng thái cũ bất cứ
    lúc nào.

### 1.3. Đối tượng Người dùng (User Personas)

Hệ thống phục vụ 3 nhóm đối tượng có vai trò và quyền hạn khác nhau:

- **Portfolio Owner (Chủ sở hữu hồ sơ - Quản trị viên)**: Người dùng duy nhất có
  quyền kiểm soát toàn bộ dữ liệu và cấu hình hệ thống.
- **Recruiter (Nhà tuyển dụng / Đối tác)**: Đối tượng mục tiêu quan trọng nhất
  của trang hiển thị công khai (Public Website), truy cập để đánh giá và liên hệ
  với ứng viên.
- **Visitor (Khách truy cập chung)**: Cộng đồng lập trình viên, đồng nghiệp,
  hoặc bạn bè muốn tham khảo bài viết chia sẻ (Blog) hoặc dự án mẫu.

### 1.4. Vai trò và Phân quyền (Roles and Permissions)

Hệ thống được thiết kế theo mô hình Đơn Quản Trị (Single-Admin). Chỉ tồn tại duy
nhất hai cấp độ truy cập:

- **Portfolio Owner (Quản trị viên)**: Có toàn quyền (CRUD) đối với dữ liệu hệ
  thống thông qua xác thực bảo mật.
- **Visitor / Recruiter (Khách truy cập / Nhà tuyển dụng)**: Truy cập công khai,
  không cần đăng nhập, chỉ có quyền xem nội dung được công bố và gửi tin nhắn
  liên hệ.

#### Permission Matrix

| Nghiệp vụ / Tính năng            | Portfolio Owner (Admin) | Visitor / Recruiter (Public) | Ghi chú / Quy tắc ràng buộc (Rules & Constraints)                                                                                                        |
| :------------------------------- | :---------------------: | :--------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Đăng ký tài khoản                |      Không hỗ trợ       |         Không hỗ trợ         | CT-02: Hệ thống đóng hoàn toàn tính năng đăng ký tài khoản công khai.                                                                                    |
| Đăng nhập hệ thống               |        Cho phép         |            Bị cấm            | Chỉ cho phép 1 tài khoản quản trị duy nhất đăng nhập thông qua NextAuth.js.                                                                              |
| Quản trị Thông tin cá nhân       |          CRUD           |    Chỉ xem (đã xuất bản)     | Quản lý tên, kỹ năng, kinh nghiệm, học vấn, chứng chỉ.                                                                                                   |
| Quản trị Dự án & Blog            |          CRUD           |    Chỉ xem (đã xuất bản)     | Admin có thể đổi trạng thái nội dung (Nháp/Xuất bản/Lưu trữ). Khách chỉ xem trạng thái Published.                                                        |
| Lên lịch xuất bản                |        Cho phép         |            Bị cấm            | Admin cấu hình thời gian; hệ thống tự động đổi trạng thái hiển thị.                                                                                      |
| Tải lên & Quản lý File (CV, Ảnh) |        Cho phép         |       Chỉ tải xuống CV       | Tệp tải lên phải thuộc định dạng cho phép (ví dụ: PDF cho CV, JPG/PNG cho ảnh).                                                                          |
| Đọc tin nhắn liên hệ (Contact)   |          CRUD           |       Chỉ gửi tin nhắn       | Khách gửi thông tin liên hệ; Admin quản lý và đánh dấu trạng thái tin nhắn.                                                                              |
| Xem thống kê (Analytics)         |        Cho phép         |            Bị cấm            | Hệ thống tự động ghi nhận tương tác phi danh tính của khách để thống kê cho Admin.                                                                       |
| Xem nhật ký thao tác (Audit Log) |        Cho phép         |            Bị cấm            | Hệ thống tự động ghi lại lịch sử thao tác của Admin đối với dữ liệu quan trọng.                                                                          |
| Sao lưu & Khôi phục dữ liệu      |        Cho phép         |            Bị cấm            | Sao lưu và khôi phục ở mức dữ liệu nghiệp vụ (Logical Backup).                                                                                           |
| Đổi mật khẩu                     |        Cho phép         |            Bị cấm            | Hệ thống cho phép người quản trị đổi mật khẩu tài khoản (Ưu tiên hỗ trợ khôi phục qua Email thông qua Email Service để giảm chi phí so với SMS Gateway). |

#### Giới hạn Quyền hạn (Role Restrictions)

##### Portfolio Owner Restrictions

Mặc dù là quản trị viên tối cao, Portfolio Owner vẫn chịu một số ràng buộc hệ
thống để đảm bảo an toàn dữ liệu:

- **Không thể tự xóa lịch sử Audit Log**: Nhằm đảm bảo tính minh bạch, Admin
  không được cung cấp tính năng xóa thủ công nhật ký hoạt động hệ thống.
- **Không thể xóa vĩnh viễn các phiên bản cũ khi khôi phục (BRULE-06)**: Việc
  khôi phục (Restore) một phiên bản nội dung cũ không được làm mất đi các phiên
  bản trung gian khác.
- **Không thể tạo thêm tài khoản quản trị phụ (CT-04)**: Phiên bản đầu tiên
  không hỗ trợ phân quyền nhiều cấp hoặc nhiều tài khoản quản trị.

##### Visitor / Recruiter Restrictions

Để bảo vệ an toàn cho hệ thống và thông tin cá nhân của chủ sở hữu:

- **Tuyệt đối không thể truy cập khu vực quản trị**: Mọi cố gắng truy cập
  `/admin/*` hoặc gọi Server Actions/API quản trị mà không có session hợp lệ sẽ
  bị NextAuth.js và Middleware của Next.js chặn lại ngay lập tức.
- **Không thể xem nội dung nháp/lưu trữ (BRULE-02)**: Mọi tài nguyên ở trạng
  thái Draft hoặc Archived sẽ không bao giờ được trả về phía Client.
- **Không thể can thiệp vào mã nguồn hoặc dữ liệu tĩnh**: Chỉ tương tác với dữ
  liệu động được hệ thống cho phép (gửi liên hệ).

## 2. Các Tính Năng Cốt Lõi (Core Features)

### 2.1. Phân hệ Quản lý Dự án (Project Management)

- **Mô tả:** Cho phép Admin quản lý các dự án cá nhân hiển thị trên portfolio,
  tự động sinh trang chi tiết `/projects/[slug]` khi xuất bản.
- **Trường dữ liệu của một Dự án (Project Schema Fields):**
  - `id`: Định danh duy nhất (ObjectId của MongoDB).
  - `title`: Tiêu đề dự án (Bắt buộc).
  - `slug`: URL thân thiện phục vụ SEO (Bắt buộc, duy nhất).
  - `description`: Mô tả tóm tắt dự án (Bắt buộc).
  - `content`: Bài viết chi tiết (Markdown/Rich Text - Bắt buộc).
  - `thumbnail`: Ảnh đại diện chính (Bắt buộc, lưu link Cloudinary).
  - `images`: Mảng ảnh phụ làm album/carousel (Tùy chọn, lưu link Cloudinary).
  - `techStack`: Danh sách công nghệ sử dụng, ví dụ:
    `['Next.js', 'TypeScript', 'MongoDB']` (Bắt buộc).
  - `liveUrl`: Đường dẫn chạy thử (Tùy chọn).
  - `githubUrl`: Đường dẫn mã nguồn (Tùy chọn).
  - `startDate`: Ngày bắt đầu dự án (Tùy chọn).
  - `endDate`: Ngày kết thúc dự án (Tùy chọn - nếu để trống/null nghĩa là dự án
    đang tiếp diễn "Ongoing").
  - `teamSize`: Quy mô nhóm thực hiện dưới dạng số lượng người (Tùy chọn).
  - `role`: Vai trò/Vị trí của Admin trong dự án (Tùy chọn, ví dụ: "Leader &
    Backend Dev").
  - `state`: Trạng thái nội dung (`DRAFT`, `PUBLISHED`, `ARCHIVED` - Bắt buộc).
  - `publishedAt`: Thời điểm xuất bản thực tế (Tự động cập nhật khi chuyển trạng
    thái).
  - Cấu hình SEO: `seoTitle`, `seoDescription`, `ogImage` (Tùy chọn).
- **User Stories:**
  - _As a_ Portfolio Owner, _I want to_ tạo mới hoặc chỉnh sửa dự án với đầy đủ
    thông tin thời gian, vai trò và quy mô nhóm trong Dashboard, _so that_ tôi
    có thể chứng minh chi tiết năng lực chuyên môn và đóng góp cụ thể của mình.
  - _As a_ Recruiter, _I want to_ xem trang chi tiết dự án để biết thời điểm ứng
    viên thực hiện, họ làm việc một mình hay làm việc nhóm, và vai trò thực tế
    của họ trong dự án là gì.

### 2.2. Phân hệ Quản lý Hồ sơ & Lý lịch (Profile & Resume Management)

- **Mô tả:** Quản lý thông tin giới thiệu bản thân, học vấn, kinh nghiệm làm
  việc, kỹ năng và chứng chỉ.
- **Tính năng chính:**
  - Cập nhật thông tin liên hệ (Email, Số điện thoại, Địa chỉ, Link mạng xã
    hội).
  - Quản lý quá trình làm việc (Công ty, thời gian, mô tả công việc, vai trò).
  - Quản lý quá trình học tập (Trường học, niên khóa, ngành học, xếp loại).
  - Phân loại và quản lý Kỹ năng (Ngôn ngữ lập trình, Frameworks, Công cụ, Kỹ
    năng mềm).
  - Quản lý Chứng chỉ (Tên chứng chỉ, tổ chức cấp, ngày cấp, link xác minh).
  - Tải lên và quản lý file CV (PDF) chính thức.

### 2.3. Lên lịch Xuất bản Tự động (Scheduled Publishing)

- **Mô tả:** Lên lịch xuất bản hoặc ẩn nội dung dự án/bài viết blog tự động theo
  thời gian định trước.
- **Tính năng chính:**
  - Thiết lập ngày/giờ tự động chuyển trạng thái nội dung sang `Published` hoặc
    `Archived`.
  - Tiến trình nền (Background Cron Job/Scheduler) quét và cập nhật trạng thái
    tự động 24/7.

### 2.4. Quản lý Phiên bản & Lịch sử Thay đổi (Versioning & Audit)

- **Mô tả:** Hệ thống lưu lại lịch sử chỉnh sửa dữ liệu, cho phép xem lại các
  phiên bản cũ và khôi phục (Restore) khi cần thiết.
- **Tính năng chính:**
  - Mỗi khi Admin nhấn "Cập nhật" hoặc "Xuất bản" nội dung quan trọng (Dự án,
    Bài viết, Hồ sơ), hệ thống tự động lưu bản sao phiên bản hiện tại
    (`Version`).
  - Ghi nhật ký hoạt động (`Audit Log`): Lưu thông tin người thực hiện, thời
    gian, hành động (Thêm/Sửa/Xóa/Đăng nhập) và đối tượng bị tác động. Không cho
    phép xóa nhật ký này.
  - Khôi phục phiên bản nghiệp vụ: Khôi phục một phiên bản lịch sử nhưng không
    được xóa các phiên bản khác trong danh sách lịch sử.

### 2.5. Hộp thư Liên hệ (Contact Form & Inbox)

- **Mô tả:** Cho phép khách truy cập gửi tin nhắn liên hệ trực tiếp cho chủ sở
  hữu từ website.
- **Tính năng chính:**
  - Form liên hệ ngoài trang public kiểm tra tính hợp lệ dữ liệu (Tên, Email,
    Tiêu đề, Nội dung).
  - Dashboard CMS hiển thị danh sách tin nhắn nhận được (Hộp thư đến), hỗ trợ
    lọc tin nhắn theo trạng thái (Mới, Đã đọc, Đã lưu trữ) và xóa tin nhắn.
  - Tích hợp dịch vụ email thông báo tức thì cho Portfolio Owner khi có tin nhắn
    mới.

### 2.6. Thống kê Tương tác (Analytics Dashboard)

- **Mô tả:** Đo lường các chỉ số tương tác phi danh tính để Portfolio Owner đánh
  giá mức độ quan tâm của nhà tuyển dụng.
- **Tính năng chính:**
  - Biểu đồ thống kê lượt truy cập website chung (Page Views).
  - Đếm chi tiết lượt xem của từng trang dự án (Project Views).
  - Thống kê số lượt click tải file CV PDF (CV Downloads).
  - Thống kê số lượng biểu mẫu liên hệ được gửi thành công.

### 2.7. Phân hệ Quản lý Tài khoản & Mật khẩu (Account & Password Management)

- **Mô tả:** Cho phép Admin đổi mật khẩu tài khoản an toàn trong trang quản trị,
  hoặc yêu cầu khôi phục lại mật khẩu thông qua địa chỉ email đăng ký nếu quên
  mật khẩu.
- **Tính năng chính:**
  - **Đổi mật khẩu (Change Password):** Form đổi mật khẩu trong Dashboard yêu
    cầu nhập cả 3 trường (`currentPassword`, `newPassword`, `confirmPassword`).
    Sau khi kiểm tra Rate Limit (khóa 30 phút nếu sai 5 lần/15 phút), hệ thống
    mở Database Transaction mã hóa mật khẩu mới (bcrypt), cập nhật DB và ghi
    Audit Log đồng thời. Tiếp đó, hệ thống thực hiện hủy toàn bộ các phiên làm
    việc đang tồn tại trên tất cả thiết bị (Global Sign-out) và gửi một Email
    cảnh báo bảo mật chứa chi tiết thời gian, địa chỉ IP, trình duyệt và loại
    thiết bị.
  - **Quên mật khẩu / Khôi phục mật khẩu (Password Recovery):**
    - Khách truy cập vào route `/admin/forgot-password`, điền địa chỉ email đã
      đăng ký của Admin.
    - Hệ thống tạo một mã xác thực (Token/OTP) ngẫu nhiên, lưu vào DB kèm thời
      hạn hết hiệu lực (15 phút) và gửi một email chứa liên kết khôi phục tới
      hòm thư của Admin thông qua Email Service.
    - Admin click vào link có định dạng `/admin/reset-password?token=XYZ`, hệ
      thống kiểm tra token hợp lệ và cho phép nhập mật khẩu mới.
    - Hành động khôi phục này được ghi vết an toàn trong Audit Log.

### 2.8. Phân hệ Trợ lý ảo AI (AI Portfolio Assistant)

- **Mô tả:** Cung cấp khung trò chuyện thông minh (Floating Chat Widget) ngoài
  website công khai để nhà tuyển dụng và khách truy cập tự do hỏi đáp thông tin
  năng lực, kinh nghiệm, kỹ năng và dự án của chủ sở hữu.
- **Tính năng chính:**
  - **Giao diện Chatbot Nổi (Floating Widget):** Thu nhỏ thành bong bóng chat
    (FAB) ở góc phải dưới; click vào mở ra hộp thoại chat tiện lợi.
  - **Tích hợp mô hình ngôn ngữ lớn (LLM):** Sử dụng thư viện Vercel AI SDK kết
    nối trực tiếp với Google Gemini API (model `gemini-1.5-flash`).
  - **Nạp dữ liệu ngữ cảnh động (Dynamic Context):**
    - Khi nhận câu hỏi từ Client, Server tự động truy vấn MongoDB Atlas để lấy
      các thông tin đã xuất bản: Profile cá nhân, Kinh nghiệm làm việc, Kỹ năng,
      Học vấn, Chứng chỉ, các Dự án công khai.
    - Dữ liệu này được cấu trúc thành System Prompt gửi làm ngữ cảnh gốc cho mô
      hình Gemini, đảm bảo AI trả lời trung thực và chính xác về ứng viên.
  - **Không lưu lịch sử trên Server:** Để tối ưu hóa tài nguyên cơ sở dữ liệu và
    bảo vệ quyền riêng tư, lịch sử hội thoại chỉ được duy trì trong bộ nhớ tạm
    thời của React state trên trình duyệt của khách hàng.
  - **Giới hạn lưu lượng (Rate Limiting):** Áp dụng giới hạn tối đa 10 lượt
    chat/phút trên mỗi địa chỉ IP để chống spam và phá hoại hạn mức API key miễn
    phí.

## 3. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

### 3.1. Bảo mật & Xác thực (Security & Authentication)

- **Kiểm soát truy cập:** Sử dụng NextAuth.js để quản lý phiên đăng nhập
  (Session) của Admin. Áp dụng Next.js Middleware để chặn mọi truy cập trái phép
  vào `/admin/*` hoặc các API/Server Actions quản trị.
- **Phương thức Xác thực:**
  - **Credentials:** Đăng nhập bằng tên tài khoản/mật khẩu truyền thống của
    Admin được mã hóa bằng chuẩn `bcrypt`.
  - **Google OAuth 2.0 (Google Provider):** Tích hợp đăng nhập nhanh qua Google.
    Để đảm bảo tính bảo mật của hệ thống Đơn quản trị (Single-Admin),
    NextAuth.js callback signIn bắt buộc phải kiểm tra và chỉ cho phép duy nhất
    email Google của chủ sở hữu được định cấu hình tại biến môi trường
    `ADMIN_GOOGLE_EMAIL` đăng nhập thành công. Mọi email khác sẽ bị chặn và trả
    về mã lỗi 403/Unauthorized.
- **Ghi nhật ký bảo mật:** Các hành động quan trọng (Đăng nhập thất bại, đăng
  nhập qua Google thành công/thất bại, đổi mật khẩu, cập nhật quyền hạn) phải tự
  động ghi lại trong Audit Log.

### 3.2. Vận hành Miễn phí & Sẵn sàng 24/7 (Free Tier & 24/7 Availability)

- **Chi phí vận hành tối ưu (Zero-Cost Hosting):** Toàn bộ cơ sở hạ tầng của dự
  án phải chạy trên các gói dịch vụ đám mây miễn phí lâu dài (Free Tier):
  - **Ứng dụng & Routing:** Vercel Hobby Plan (Miễn phí 100%, tự động scale, hỗ
    trợ SSL miễn phí).
  - **Cơ sở dữ liệu:** MongoDB Atlas Shared M0 Cluster (Miễn phí 512MB bộ nhớ,
    sao lưu tự động mức nghiệp vụ, đảm bảo hoạt động 24/7 không sleep).
  - **Lưu trữ tệp tin (CV, Ảnh):** Tích hợp Cloudinary / Supabase Storage (Free
    Tier với hạn mức băng thông và dung lượng rộng rãi, hỗ trợ phân phối CDN).
  - **Dịch vụ Email:** Resend / Brevo (Free Tier hỗ trợ gửi email thông báo và
    khôi phục tài khoản).
- **Khả dụng 24/7 (High Availability):** Hệ thống Serverless và Cloud DB đảm bảo
  website luôn trực tuyến 24/7, loại bỏ hoàn toàn hiện tượng "Cold Start" (khởi
  động nguội) hoặc "Sleep/Tắt nguồn" thường gặp ở các hosting hoặc VPS miễn phí
  thông thường.

## 4. Giao Diện Người Dùng (User Interface)

### 4.1. Kiến trúc Trang & Định tuyến (Sitemap & Page Structure)

Giao diện hệ thống được chia làm hai khu vực hoàn toàn độc lập:

#### A. Khu vực Công khai (Public Facing Website)

- **Trang chủ (`/`):** Thiết kế dưới dạng **dải trang dài cuộn (Single-page
  scroll)**. Tích hợp tương tác 3D WebGL (React Three Fiber) để tăng trải nghiệm
  Premium. Các phần nội dung hiển thị tuần tự: Hero -> Profile/About ->
  Experience -> Education & Certifications -> Skills -> Featured Projects ->
  Contact & CV Download.
- **Trang chi tiết dự án (`/projects/[slug]`):** Trang độc lập hiển thị thông
  tin chi tiết của từng dự án (ngày thực hiện, vai trò, quy mô nhóm, techstack
  và nội dung Markdown của dự án). Hỗ trợ Dynamic SEO Metadata cho từng trang.
- **Trang chi tiết bài viết blog (`/blog/[slug]`):** Trang độc lập hiển thị nội
  dung bài viết chia sẻ công nghệ (được triển khai ở Phase 2).

#### B. Khu vực Quản trị (CMS Workspace - Admin Area)

- **Trang Đăng nhập (`/admin/login`):** Giao diện đăng nhập bảo mật (Credentials
  & Google OAuth).
- **Trang Dashboard quản trị (`/dashboard`):** Bố cục Dashboard Shell gồm thanh
  điều hướng (Sidebar) bên trái và khu vực hiển thị dữ liệu bên phải.
- **Các phân hệ quản lý dữ liệu:** `/dashboard/profile`, `/dashboard/projects`,
  `/dashboard/blog`, `/dashboard/contacts`, `/dashboard/audit-logs`,
  `/dashboard/analytics`.

### 4.2. Nguyên tắc Thiết kế & Hướng dẫn Giao diện (UI Guidelines)

- Đặc tả chi tiết về mã màu (Color Palette), kiểu chữ (Typography), lưới (Grid
  Layout), linh kiện giao diện (UI Components), Glassmorphism và hiệu ứng chuyển
  động (Animations) được tài liệu hóa chi tiết tại
  [ui-guidelines.md](file:///d:/Workspace/Projects/my-portfolio/docs/ui/ui-guidelines.md).
