# 🚀 MyPortfolio — Premium Serverless Portfolio & CMS

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**MyPortfolio** là một hệ thống quản lý và trình bày hồ sơ cá nhân cao cấp, kết
hợp giữa giao diện công khai tương tác 3D WebGL (React Three Fiber) và trang
quản trị nội dung (CMS/Dashboard) bảo mật tối ưu cho môi trường Serverless.

Dự án được xây dựng dựa trên triết lý **"Docs-First, Code Later"** (Tài liệu
trước, Lập trình sau), giúp các nhà phát triển và AI cộng tác hiệu quả thông qua
cấu trúc phân tích nghiệp vụ rõ ràng và hệ thống liên kết kiến trúc (Knowledge
Graph).

---

## 🌟 Tính năng Nổi bật

- **Public Portfolio UI (Premium UX):** Giao diện công khai ấn tượng tích hợp đồ
  họa WebGL 3D (React Three Fiber & Drei), đảm bảo tốc độ tải trang tức thì
  (<1.5s) và duy trì hiệu ứng mượt mà 60 FPS.
- **Content Management System (CMS):** Dashboard quản trị cho phép Portfolio
  Owner CRUD hồ sơ cá nhân, học vấn, kinh nghiệm, kỹ năng, chứng chỉ, và các dự
  án mà không cần can thiệp mã nguồn.
- **Content Lifecycle & Versioning:** Quản lý vòng đời nội dung thông qua các
  trạng thái `DRAFT`, `PUBLISHED`, và `ARCHIVED`. Tự động tạo phiên bản lịch sử
  mỗi khi xuất bản và hỗ trợ Rollback về phiên bản cũ.
- **Scheduled Publishing:** Lên lịch hẹn giờ tự động xuất bản hoặc ẩn dự án dựa
  trên tác vụ định kỳ (Vercel Cron Job).
- **AI Chat Assistant:** Khung chat trợ lý ảo AI trả lời trực tiếp các câu hỏi
  của nhà tuyển dụng dựa trên dữ liệu lý lịch của chủ sở hữu (sử dụng Gemini 1.5
  Flash và Vercel AI SDK).
- **Portfolio Analytics & Audit Logs:** Thu thập thống kê tương tác phi danh
  tính (lượt tải CV, lượt xem dự án, gửi liên hệ) và ghi nhật ký hoạt động của
  Admin để đảm bảo an toàn bảo mật.
- **Không Tốn Chi Phí (Zero-Cost Infrastructure):** Thiết kế hệ thống tối ưu hóa
  hoàn toàn để vận hành miễn phí lâu dài (Free Tier) trên các dịch vụ Vercel,
  MongoDB Atlas, Resend và Cloudinary.

---

## 📂 Cấu trúc Thư mục Dự án

```text
├── .agents/              # Cấu hình, Rules và Kỹ năng dành riêng cho AI Agents
├── .ai/                  # Quy trình Routing và Hiến pháp dự án hướng dẫn cho AI
├── docs/                 # Hệ thống tài liệu phân tích nghiệp vụ & kiến trúc (SSOT)
│   ├── analysis/         # SRS, Business Rules, Use Cases, User Flows
│   ├── architecture/     # Thiết kế hệ thống, Database Schema, API spec
│   ├── project/          # Vision, Tech-Stack, Glossary, Status, Metadata Schema
│   ├── requirements/     # BRD, PRD, RTM (Traceability)
│   └── ui/               # Quy chuẩn UI Guidelines & Mockups
├── graph/                # Công cụ tự sinh và hiển thị trực quan đồ thị tài liệu dự án
├── prisma/               # Định nghĩa Prisma Schema liên kết MongoDB
├── public/               # Tài nguyên tĩnh (Fonts, Logos, Hình ảnh)
└── src/                  # Mã nguồn chính của ứng dụng Next.js App Router
    ├── app/              # Các routes giao diện public, admin dashboard và API
    └── lib/              # Các hàm bổ trợ (Audit log helper, Prisma client)
```

---

## 🛠️ Hướng dẫn Cài đặt & Khởi chạy (Local Development)

### 1. Chuẩn bị trước

Đảm bảo bạn đã cài đặt các công cụ sau trên máy:

- **Node.js** (Phiên bản v18 trở lên)
- Trình quản lý gói **pnpm** (hoặc `npm`)
- Cơ sở dữ liệu **MongoDB** (Khuyên dùng cluster MongoDB Atlas miễn phí)

### 2. Cài đặt thư viện

Tại thư mục gốc của dự án, chạy lệnh:

```bash
pnpm install
# hoặc: npm install
```

### 3. Cấu hình biến môi trường

1. Nhân bản file `.env.example` thành `.env`:

   ```bash
   cp .env.example .env
   ```

2. Mở file `.env` và cập nhật các thông số:
   - `DATABASE_URL`: Đường dẫn kết nối MongoDB Atlas của bạn.
   - `NEXTAUTH_SECRET`: Tạo một chuỗi bí mật ngẫu nhiên dùng để mã hóa session.
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Thông tin xác thực Google
     OAuth.
   - `ADMIN_GOOGLE_EMAIL`: Email quản trị viên duy nhất được phép đăng nhập vào
     trang CMS qua Google OAuth.

### 4. Khởi tạo Cơ sở dữ liệu với Prisma

Đồng bộ cấu trúc schema của Prisma sang MongoDB Atlas và sinh code Client:

```bash
npx prisma generate
npx prisma db push
```

### 5. Chạy Server phát triển

```bash
pnpm dev
# hoặc: npm run dev
```

Truy cập `http://localhost:3000` trên trình duyệt để kiểm tra ứng dụng.

---

## 🔄 Quy trình Hợp tác Tài liệu & Lập trình (Docs-First)

Dự án này áp dụng nguyên tắc **Docs-First**: Không viết mã nguồn khi chưa đặc tả
rõ ràng tài liệu nghiệp vụ.

### Cập nhật Đồ thị Kiến trúc (Knowledge Graph)

Mỗi khi bạn thêm mới hoặc thay đổi một tài liệu nghiệp vụ/kỹ thuật trong thư mục
`docs/`, vui lòng chạy lệnh dưới đây để đồng bộ lại sơ đồ liên quan:

```bash
npm run generate-graph
```

Bạn có thể mở file `graph/graph.html` bằng trình duyệt để xem biểu đồ trực quan
mối liên hệ giữa các tài liệu, API và các mã nguồn trong dự án.

---

## 🤖 Hướng dẫn tích hợp AI Agents

Dự án được tối ưu hóa cho các trợ lý AI lập trình (như Cursor, Copilot,
Gemini/Claude). AI Agent khi làm việc với codebase này **phải tuân thủ**:

1. Đọc kỹ các quy tắc toàn cục tại `.agents/AGENTS.md`.
2. Tuân thủ quy trình Routing tại `.ai/routing.md` và tuân theo Hiến pháp dự án
   tại `.ai/constitution.md` trước khi đề xuất bất kỳ thay đổi nào.
