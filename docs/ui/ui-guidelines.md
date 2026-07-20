---
id: DOC-UI-GUIDELINES
type: ui
title: ui-guidelines
status: approved
description:
  Visual system, typography, colors, layout components, and dark-mode styling
  rules.
---

# User Interface Guidelines

Tài liệu này đặc tả quy chuẩn thiết kế giao diện (UI/UX) cho hệ thống
**MyPortfolio**, bao gồm hệ thống định hình thị giác (Visual Tokens), bố cục
(Layouts), thành phần giao diện (UI Components) và các nguyên lý tương tác đồ
họa.

---

## 1. Hệ thống Visual Tokens (Design System)

Hệ thống mặc định sử dụng phong cách **Premium Light Theme** (sạch sẽ, thanh
lịch, chuyên nghiệp) kết hợp với hiệu ứng **Glassmorphism (Kính mờ)**. Đồng
thời, website cung cấp một nút bấm chuyển đổi (Theme Toggle Switch) cho phép
người dùng chuyển đổi mượt mà sang **Premium Dark Theme** (đậm nét công nghệ,
hiện đại).

### 1.1. Bảng Màu Bản Ghi (Dual-Theme Color Palette)

Bảng màu sử dụng hệ CSS Variables ánh xạ theo lớp `.dark` ở thẻ `<html>` hoặc
`<body>`.

| CSS Variable           | Ứng dụng thực tế            | Light Mode (Mặc định)                     | Dark Mode (Chuyển đổi)                     |
| :--------------------- | :-------------------------- | :---------------------------------------- | :----------------------------------------- |
| `--color-bg-primary`   | Nền chính toàn trang        | `hsl(210, 20%, 98%)` (Trắng xám dịu)      | `hsl(224, 71%, 4%)` (Xanh đen đậm)         |
| `--color-bg-card`      | Nền các thẻ hiển thị        | `hsla(0, 0%, 100%, 0.7)` (Trắng mờ)       | `hsla(224, 71%, 7%, 0.6)` (Xanh đen mờ)    |
| `--color-border-glass` | Viền mờ các khung kính      | `hsla(214, 32%, 91%, 0.6)` (Xám nhạt mờ)  | `hsla(224, 71%, 20%, 0.4)` (Xanh viền tối) |
| `--color-primary`      | Màu nhấn chính (CTA, Link)  | `hsl(222, 100%, 50%)` (Xanh Sapphire đậm) | `hsl(180, 100%, 50%)` (Neon Cyan)          |
| `--color-secondary`    | Màu nhấn phụ (Badges, Tags) | `hsl(262, 80%, 50%)` (Tím hoàng gia)      | `hsl(270, 100%, 60%)` (Neon Purple)        |
| `--color-success`      | Trạng thái Published        | `hsl(142, 72%, 29%)` (Xanh lá rừng sâu)   | `hsl(150, 80%, 45%)` (Xanh lá ngọc bảo)    |
| `--color-text-main`    | Chữ chính (Tiêu đề, Body)   | `hsl(224, 71%, 4%)` (Đen đá phiến đậm)    | `hsl(210, 40%, 98%)` (Trắng ngà sáng)      |
| `--color-text-muted`   | Chữ phụ, metadata, ngày     | `hsl(215, 16%, 47%)` (Xám đá phiến nhạt)  | `hsl(215, 20%, 65%)` (Xám tro sáng)        |
| `--box-shadow-glass`   | Bóng đổ hiệu ứng kính       | `rgba(31, 38, 135, 0.07)` (Bóng mờ dịu)   | `rgba(0, 0, 0, 0.37)` (Bóng tối sâu)       |

### 1.2. Kiểu Chữ (Typography)

- **Bộ phông chữ chính (Body Font):** `Inter`, sans-serif. Tạo cảm giác hiện
  đại, dễ đọc trên cả nền sáng và tối.
- **Bộ phông chữ tiêu đề (Heading Font):** `Outfit` hoặc `Syne`, sans-serif. Tạo
  điểm nhấn hình khối nghệ thuật cho các chữ lớn (`h1`, `h2`).
- **Quy chuẩn Phông chữ (Font Sizes & Weights):**
  - `Display Heading (Hero)`: `3.5rem` (56px) / Font-weight: `800` (Extra Bold)
    / Tracking: `-0.02em`
  - `Section Title (h2)`: `2.25rem` (36px) / Font-weight: `700` (Bold)
  - `Card Title (h3)`: `1.25rem` (20px) / Font-weight: `600` (Semi-Bold)
  - `Body Text`: `1.0rem` (16px) / Font-weight: `400` (Regular) / Leading: `1.6`
  - `Muted Text / Meta Info`: `0.875rem` (14px) / Font-weight: `400` / Leading:
    `1.5`

### 1.3. Hiệu ứng Kính Mờ & Hiệu ứng Chuyển đổi (Glassmorphism & Transitions)

Tất cả các thành phần nổi trên nền chính (Navigation Bar, Project Cards, Contact
Form, Sidebar CMS) đều phải tuân thủ chuẩn hiệu ứng kính và hỗ trợ chuyển đổi
giao diện mượt mà:

```css
/* Khung panel kính mờ */
.glass-panel {
  background: var(--color-bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border-glass);
  box-shadow: 0 8px 32px 0 var(--box-shadow-glass);
  border-radius: 12px;
  /* Chuyển đổi màu nền và viền mượt mà khi đổi theme */
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

/* Áp dụng transition toàn cục để đổi theme không bị giật giáp */
body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-main);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
```

### 1.4. Nút Chuyển đổi Giao diện (Theme Toggle Switch)

- **Vị trí hiển thị:** Cố định ở góc trên bên phải màn hình (nằm trong
  Navigation Bar của Public Website và góc trên Header của CMS).
- **Trạng thái nút:**
  - _Chế độ Sáng (Mặc định):_ Hiển thị biểu tượng Mặt trời (`Sun` icon). Click
    vào sẽ thêm class `.dark` vào thẻ `<html>` và đổi thành biểu tượng Mặt
    trăng.
  - _Chế độ Tối:_ Hiển thị biểu tượng Mặt trăng (`Moon` icon). Click vào sẽ gỡ
    class `.dark` ra khỏi thẻ `<html>` và đổi về biểu tượng Mặt trời.
- **Lưu trữ trạng thái (Persistence):**
  - Sử dụng `localStorage` (ví dụ: `theme: 'light' | 'dark'`) hoặc cookie để lưu
    lựa chọn của người dùng.
  - Khi tải trang, hệ thống đọc trạng thái từ bộ nhớ và áp dụng class thích hợp
    ngay trước khi render để tránh hiện tượng nháy giao diện (Theme Flash).

### 1.5. Nút Chuyển đổi Ngôn ngữ (Language Switcher)

- **Vị trí hiển thị:** Cố định ở góc trên bên phải màn hình, nằm bên cạnh Nút
  Chuyển đổi Giao diện (trên Navigation Bar ở Public Website và Header ở CMS).
- **Trạng thái ngôn ngữ:** Hỗ trợ song ngữ **Tiếng Anh (EN)** và **Tiếng Việt
  (VI)**.
- **Cách thức hoạt động:**
  - Hiển thị dưới dạng nút chuyển đổi nhỏ gọn (Toggle Button) hoặc Menu thả
    xuống (Dropdown) với biểu tượng quả địa cầu (`Globe` icon) đi kèm nhãn ngôn
    ngữ hiện tại (`VI` hoặc `EN`).
  - Khi người dùng click, hệ thống cập nhật locale/state ngôn ngữ toàn cục và
    chuyển đổi văn bản tương ứng của các thành phần giao diện mà không cần tải
    lại toàn trang (nếu sử dụng Client-side translation) hoặc điều hướng sang
    route ngôn ngữ tương ứng.
- **Lưu trữ trạng thái (Persistence):**
  - Lưu trạng thái ngôn ngữ đã chọn vào `localStorage` (ví dụ:
    `locale: 'vi' | 'en'`) hoặc Cookie để áp dụng tự động cho các phiên làm việc
    sau.

### 1.6. Hệ thống Phản hồi Đa màn hình (Responsive Design & Breakpoints)

Để mang lại trải nghiệm đồng nhất trên cả màn hình lớn (Desktop, Ultra-wide) và
màn hình nhỏ (Smartphones, Tablets), giao diện phải tuân thủ các quy tắc phản
hồi sau:

#### A. Các điểm ngắt (Responsive Breakpoints)

| Thiết bị                          | Điểm ngắt CSS (Breakpoints) | Đặc tả Layout chính                                                                                                                                                  |
| :-------------------------------- | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mobile (Màn hình nhỏ)**         | `< 640px`                   | 1 cột duy nhất, Side padding = `1rem` (16px).                                                                                                                        |
| **Tablet (Màn hình trung bình)**  | `640px` đến `1023px`        | Grid 2 cột cho danh sách thẻ. Side padding = `1.5rem` (24px).                                                                                                        |
| **Desktop (Màn hình lớn)**        | `1024px` đến `1439px`       | Grid 3 cột. Hiển thị Sidebar cố định trong CMS. Sidebar Nav ẩn thành hamburger trên Mobile/Tablet.                                                                   |
| **Ultra-wide (Màn hình cực đại)** | `>= 1440px`                 | Giới hạn chiều rộng nội dung tối đa `1280px` (`max-width: 1280px`) và căn giữa tự động (`margin: 0 auto`) để tránh nội dung bị kéo giãn quá mức trên màn hình 4K/2K. |

#### B. Quy tắc thích ứng kiểu chữ (Responsive Typography)

Sử dụng hàm CSS `clamp()` hoặc truy vấn `@media` để cỡ chữ tự động co giãn tối
ưu mà không bị vỡ bố cục:

- _Tiêu đề Hero (Display h1):_ Lớn nhất ở desktop: `3.5rem` (56px) -> Tự động
  giảm xuống `2.25rem` (36px) trên Mobile.
- _Tiêu đề Section (h2):_ Lớn nhất ở desktop: `2.25rem` (36px) -> Giảm xuống
  `1.75rem` (28px) trên Mobile.

#### C. Quy tắc tương tác cảm ứng trên di động (Mobile Touch Targets)

- **Kích thước tương tác:** Tất cả các phần tử có thể nhấp (Buttons, Links,
  Inputs, Icons) phải đảm bảo vùng chạm cảm ứng tối thiểu là **`44px x 44px`**
  để dễ bấm trên điện thoại thông minh theo chuẩn của Apple/Google.
- **Khoảng cách các nút:** Khoảng cách tối thiểu giữa các liên kết hoặc nút liền
  kề là `8px` để tránh bấm nhầm.

#### D. Tối ưu hóa hiệu năng 3D (WebGL Performance Tuning)

- **Màn hình lớn (Desktop/Laptop):** Render mô hình 3D với mật độ hạt
  (particles) tối đa và bật hiệu ứng làm mịn (anti-aliasing) để có trải nghiệm
  thị giác Premium tốt nhất.
- **Màn hình nhỏ (Mobile/Tablet):** Tự động giảm mật độ hạt xuống 50%, tắt các
  hiệu ứng xử lý hậu kỳ (post-processing) không cần thiết và giảm tần suất
  render (FPS cap) để tiết kiệm pin thiết bị di động và tránh gây nóng máy.

---

## 2. Giao diện Công khai (Public Website Layout)

### 2.1. Cấu trúc Trang chủ (Landing Page - Single-Page Scroll)

Trang chủ là một **dải cuộn dài liền mạch** chia thành các Section sau:

1. **Hero Section (WebGL 3D):**
   - Nền là khung Canvas chứa thành phần đồ họa 3D tương tác sử dụng React Three
     Fiber (ví dụ: quả cầu hạt mạng lưới chuyển động theo con trỏ chuột).
   - Chữ tiêu đề chào mừng nổi bật bên trên kèm theo CTA "Xem dự án" và "Liên
     hệ".
2. **About / Profile Section:**
   - Giới thiệu tóm tắt bản thân, hiển thị avatar hình tròn có viền gradient
     phát sáng.
   - Đường link trực tiếp tải file CV dạng PDF có đếm lượt tải.
3. **Experience Section (Dạng Timeline):**
   - Trục dọc ở giữa (hoặc bên trái trên mobile) nối các mốc kinh nghiệm làm
     việc theo thứ tự thời gian giảm dần.
   - Mỗi công ty hiển thị trong một `glass-panel` chứa chức danh, tên công ty,
     thời gian và các gạch đầu dòng công việc đạt được.
4. **Skills Section:**
   - Hiển thị theo nhóm kỹ năng (Backend, Frontend, Tools) dưới dạng các thẻ
     Badge mờ. Kỹ năng chủ đạo có viền sáng Neon Cyan.
5. **Projects Section (Danh sách Dự án Nổi bật):**
   - Bố cục dạng lưới (Grid 1 cột trên mobile, 2 cột trên tablet, 3 cột trên
     desktop).
   - Mỗi thẻ dự án hiển thị ảnh Thumbnail sắc nét, tiêu đề, mô tả ngắn, danh
     sách tech stack (Badge).
   - Hiệu ứng hover: Ảnh zoom nhẹ, card nâng lên một chút và viền đổi màu sáng
     hơn.
   - **Tương tác:** Click vào card dự án sẽ chuyển hướng sang trang chi tiết dự
     án độc lập `/projects/[slug]`.
6. **Contact Section:**
   - Chứa Contact Form (Tên, Email, Tiêu đề, Nội dung) sử dụng thiết kế kính mờ
     tối giản.
   - Nút gửi đi có hiệu ứng micro-animation (đổi màu, hiển thị icon spinner khi
     đang gửi).

### 2.2. Trang Chi tiết Dự án (`/projects/[slug]`)

Trang chi tiết dự án được thiết kế để nhà tuyển dụng đọc sâu. Không dùng cuộn
dài tràn lan mà tập trung vào khả năng đọc (Readability):

- **Hero Banner:** Banner hình ảnh lớn phía trên cùng với hiệu ứng overlay tối
  dần, tiêu đề dự án chữ lớn màu trắng nằm đè lên.
- **Metadata Sidebar (hoặc Top Bar):** Hiển thị các thông tin cô đọng:
  - _Thời gian thực hiện:_ (Ví dụ: `Tháng 10/2025 - Hiện tại`)
  - _Quy mô nhóm:_ (Ví dụ: `Nhóm 3 người` hoặc `Cá nhân`)
  - _Vai trò:_ (Ví dụ: `Backend Developer`)
  - _Công nghệ sử dụng:_ (Hiển thị các tag CSS)
  - _Nút Live Demo & GitHub Link:_ Nút bấm rõ ràng có biểu tượng tương ứng.
- **Nội dung chính:** Render trực tiếp từ Markdown hoặc Rich Text đã lưu trong
  database. Font chữ lớn, khoảng cách dòng rộng rãi (`line-height: 1.8`), các
  đoạn code mẫu hiển thị trong khung code có cú pháp màu nổi bật (Syntax
  Highlighting).

### 2.3. Khung Chat AI Trợ lý ảo (AI Chat Widget)

Khung chat AI được hiển thị dưới dạng một widget nổi (Floating Widget) động xuất
hiện trên tất cả các trang của khu vực công khai (Public facing pages).

#### A. Nút bấm kích hoạt (Floating Action Button - FAB)

- **Vị trí:** Cố định ở góc dưới cùng bên phải màn hình
  (`position: fixed; bottom: 2rem; right: 2rem; z-index: 100;`). Trên màn hình
  điện thoại di động, khoảng cách giảm xuống còn `1rem` (16px) để tránh chắn các
  nội dung khác.
- **Thiết kế:** Hình tròn đường kính `56px`, có nền màu nhấn chính
  (`--color-primary`) và đổ bóng lớn. Sử dụng biểu tượng Robot (`Bot`) hoặc tin
  nhắn (`MessageSquare`). Khi click mở khung chat, nút quay nhẹ 90 độ và chuyển
  sang biểu tượng Đóng (`X`).

#### B. Hộp thoại Trò chuyện (Chat Window Container)

- **Kích thước & Thích ứng màn hình:**
  - _Desktop (Màn hình lớn):_ Chiều rộng cố định `360px`, chiều cao `520px`.
    Định vị ngay trên nút FAB (`bottom: 6rem; right: 2rem;`).
  - _Mobile (Màn hình nhỏ):_ Tự động chiếm toàn bộ màn hình
    (`width: 100vw; height: 100vh; top: 0; left: 0; border-radius: 0;`).
- **Visual Style:** Sử dụng cấu trúc kính mờ `.glass-panel`.
- **Thành phần cấu trúc:**
  1. **Header (Thanh tiêu đề):** Nền mờ, chứa Avatar chatbot, tiêu đề chính "Trợ
     lý ảo AI của Sơn" (xưng tên chủ sở hữu) và chỉ báo trạng thái hoạt động
     (dấu chấm xanh lá nhỏ nhấp nháy phát sáng biểu thị "Trạng thái trực
     tuyến").
  2. **Message Area (Khu vực tin nhắn):**
     - Có thanh cuộn mượt (custom scrollbar mờ), tự động cuộn xuống dưới cùng
       khi có tin nhắn mới.
     - _Tin nhắn Người dùng (User Bubble):_ Nằm bên phải, nền màu nhấn phụ
       `--color-secondary` (Tím) hoặc `--color-primary` (Xanh Sapphire ở Light
       Mode), chữ trắng.
     - _Tin nhắn Trợ lý (AI Bubble):_ Nằm bên trái, nền mờ `--color-bg-card`,
       viền mảnh `--color-border-glass`, chữ màu chính.
     - _Typing Indicator (Đang nhập):_ Khi đang chờ phản hồi, hiển thị 3 dấu
       chấm nhấp nháy trễ nhịp (bounce delay animation) đặt trong bong bóng AI.
  3. **Input Area (Thanh nhập liệu):** Nằm dưới cùng, chứa ô nhập text rộng rãi
     và nút Gửi (Send). Ô nhập bị vô hiệu hóa (disabled) khi hệ thống đang xử lý
     tải luồng phản hồi từ Gemini.

---

## 3. Giao diện Quản trị (CMS Dashboard Workspace Layout)

Giao diện quản trị hướng tới sự thực dụng, rõ ràng và tập trung tối đa vào hiệu
suất biên tập dữ liệu.

### 3.1. Bố cục Vỏ Dashboard (Top Navbar Shell Layout - Option A)

Hệ thống CMS áp dụng mô hình **Single Top Navbar Layout (Thanh điều hướng ngang
trên cùng duy nhất)**. Thiết kế này loại bỏ hoàn toàn Sidebar để tối ưu hóa 100%
không gian màn hình theo chiều ngang cho việc hiển thị bảng dữ liệu, biểu đồ và
bộ soạn thảo Markdown full-width.

- **Thanh điều hướng ngang trên cùng (Top Navigation Bar):**
  - Định vị cố định ở phía trên cùng màn hình
    (`position: sticky; top: 0; z-index: 50;`).
  - Áp dụng hiệu ứng kính mờ `.glass-panel` mượt mà hỗ trợ cả Light/Dark Mode.
  - **Bên trái (Brand):** Logo / Tiêu đề "MyPortfolio CMS".
  - **Ở giữa (Navigation Tabs):** Các đường dẫn chuyển phân hệ: 📊 _Dashboard_,
    📁 _Dự án_, 👤 _Hồ sơ & CV_, 📥 _Hộp thư (kèm Badge đếm số tin nhắn mới)_,
    📜 _Audit Log_, 💾 _Sao lưu_.
  - **Bên phải (Control Center & User Profile):**
    - Bộ chuyển đổi ngôn ngữ (Language Switcher: `VI/EN`).
    - Nút chuyển đổi giao diện (Theme Switcher: `Sun/Moon` icon).
    - Menu thả xuống người dùng (User Profile Dropdown): Avatar Admin, liên kết
      _Cài đặt & Đổi mật khẩu_, liên kết _Xem Website công khai_ và nút _Đăng
      xuất (Sign Out)_.
  - **Trên thiết bị Di động/Máy tính bảng:** Tự động co gọn các Tab menu vào nút
    bấm Hamburger Menu mở ra Dropdown Mega Menu tiện lợi.
- **Khu vực hiển thị nội dung chính (Main Content Area):**
  - Chiếm 100% chiều rộng màn hình (Full Width), sử dụng khoảng đệm chuẩn
    (`padding: 2rem` trên Desktop, `1rem` trên Mobile) tạo khoảng thở cho giao
    diện.
  - Phía trên cùng nội dung có tiêu đề trang, Breadcrumb và các nút thao tác
    nhanh (ví dụ: nút "+ Tạo mới Dự án").

### 3.2. Form Soạn thảo nội dung (Project/Blog Editor Form)

- **Bố cục phân màn (Split Screen hoặc Two-Column Layout):**
  - _Cột bên trái (Lớn):_ Nhập nội dung tiêu đề, mô tả ngắn, và editor soạn thảo
    nội dung bài viết chi tiết (hỗ trợ preview Markdown thời gian thực).
  - _Cột bên phải (Nhỏ):_ Các cấu hình trạng thái: Trạng thái
    (Draft/Published/Archived), Ảnh Thumbnail (hỗ trợ kéo thả file), Cấu hình
    SEO (Meta Title, Description, Image), và bộ chọn ngày giờ lên lịch xuất bản
    (Scheduled Date-Time Picker).
- **Trình chuyển trạng thái nội dung (Status Switcher):**
  - Trực quan hóa trạng thái bằng màu sắc rõ rệt (`Draft` màu xám, `Published`
    xanh lục, `Archived` màu vàng).
