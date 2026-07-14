# 🚀 Docs-First AI Boilerplate

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

_(🇺🇸 [Read in English](README.md))_

Welcome to the **Docs-First AI Boilerplate**! Đây là khung dự án (Template
Repository) được thiết kế đặc biệt theo triết lý **"Tài liệu trước, Code sau"
(Docs-First)**, tối ưu hóa cho quy trình làm việc kết hợp với Trí tuệ nhân tạo
(AI Agents) và Kiến trúc theo miền (Domain-Driven Design).

## 📸 Demo & Screenshots

> _Bạn có thể đặt ảnh chụp màn hình hoặc một đoạn GIF demo ngắn tại đây để người
> xem hình dung nhanh về dự án!_
>
> ![Demo Placeholder](https://via.placeholder.com/800x400.png?text=Your+App+Screenshot+Here)

## 🌟 Điểm Nổi Bật (Features)

- **Tech-Agnostic:** Hoàn toàn phi công nghệ. Dùng làm gốc cho dự án Web
  (React/Node), Mobile, AI, hay Desktop app đều được.
- **AI-Ready:** Tích hợp sẵn thư mục `.agents/` và `.ai/` chứa các luật (Rules)
  và quy trình chuẩn (Workflows) để AI hiểu ngữ cảnh và lập trình theo đúng
  khuôn khổ của bạn.
- **Bilingual Documentation:** Các file tài liệu đều có mẫu (Placeholder) song
  ngữ Anh-Việt.
- **Strict Quality Control:** Tự động ép chuẩn format văn bản và code với
  `Husky`, `Prettier`, và `Markdownlint` trước mỗi lần commit.

---

## 📂 Cấu Trúc Thư Mục Hệ Thống

```text
├── .agents/       # Các quy tắc (Skills) dành riêng cho AI Agents
├── .ai/           # Các luồng làm việc (Workflows) và prompts hướng dẫn AI
├── docs/          # Nơi chứa tài liệu tổng quan cấp độ toàn hệ thống (BRD, PRD, Architecture)
├── modules/       # Nơi chứa phân tích thiết kế chi tiết cho từng Tính năng/Nghiệp vụ riêng biệt
├── graph/         # Trực quan hóa cấu trúc dự án (Mạng lưới quan hệ tài liệu)
├── src/           # Nơi chứa Mã nguồn (Sẽ được tạo khi bạn bắt đầu code)
├── package.json   # Quản lý thư viện công cụ kiểm duyệt (Prettier, Husky, Lint)
└── branching-strategy.md # Chiến lược phân nhánh Git và quy trình quản lý các Stack công nghệ
```

---

## 🔄 Luồng Làm Việc Chuẩn (Standard Workflow)

Để hệ thống (và AI) phối hợp hiệu quả nhất, bạn **BẮT BUỘC** tuân thủ quy tắc:
**Không viết code khi chưa có tài liệu rõ ràng.**

Dưới đây là luồng hoạt động từng bước cho mọi dự án:

### Bước 1: Khởi tạo dự án

1. **Clone Repo:** Khởi tạo dự án mới từ template này.

   ```bash
   git clone https://github.com/your-username/your-project-name.git
   cd your-project-name
   ```

2. **Cài đặt công cụ:** Kích hoạt hệ thống kiểm duyệt lỗi tự động (Husky,
   Prettier, Markdownlint).

   ```bash
   # Đảm bảo bạn đã cài đặt Node.js (v18+)
   npm install
   ```

3. **Tạo nhánh (Branch):** Từ nhánh `main` (chứa tài liệu), rẽ nhánh ra công
   nghệ bạn muốn dùng.

   ```bash
   git checkout -b base-react
   # hoặc
   git checkout -b base-nestjs
   ```

### Bước 2: Đặc tả Yêu cầu Tổng quan (Cấp độ Project)

Trước khi làm chi tiết, hãy vào thư mục `docs/` để định nghĩa toàn cảnh bài toán
của bạn. Phải đảm bảo **KHÔNG CÓ FILE NÀO BỊ BỎ TRỐNG** trong các thư mục sau:

- **Thư mục `docs/project/` (Nền tảng dự án):**
  - `vision.md`: Định nghĩa Tầm nhìn, sứ mệnh và giá trị cốt lõi của toàn bộ dự
    án.
  - `tech-stack.md`: Khai báo danh sách các Công nghệ, ngôn ngữ, và thư viện sẽ
    sử dụng.
  - `project-structure.md`: Sơ đồ giải thích cấu trúc thư mục mã nguồn thực tế.
  - `glossary.md`: Từ điển thuật ngữ, giải thích các khái niệm chuyên ngành dùng
    trong dự án.
  - `status.md`: Bảng theo dõi tiến độ, version và trạng thái hiện tại của hệ
    thống.
  - `metadata-schema.md`: Quy định về mã định danh (ID) và cấu trúc Metadata cho
    mọi tài liệu.

- **Thư mục `docs/requirements/` (Yêu cầu nghiệp vụ):**
  - `brd.md`: Tài liệu yêu cầu kinh doanh (Mục tiêu, phạm vi, khách hàng mục
    tiêu).
  - `prd.md`: Tài liệu yêu cầu sản phẩm (Tính năng chi tiết, User Story).
  - `rtm.md`: Ma trận truy vết yêu cầu (Đảm bảo code đáp ứng đúng thiết kế).

- **Thư mục `docs/architecture/` (Kiến trúc hệ thống):**
  - `architecture.md`: Thiết kế cấu trúc hệ thống tổng thể (Frontend, Backend,
    Cloud).
  - `database.md`: Sơ đồ và cấu trúc Cơ sở dữ liệu (ERD).
  - `api.md`: Tiêu chuẩn và danh sách các giao thức mạng cấp độ hệ thống.

- **Thư mục `docs/analysis/` (Phân tích chi tiết):**
  - `business-rules.md`: Khai báo các quy tắc kinh doanh (Business Rules) phải
    tuân thủ nghiêm ngặt.
  - `use-cases.md`: Liệt kê các kịch bản sử dụng (Use Cases) của hệ thống.
  - `user-flows.md`: Liệt kê các luồng di chuyển tổng quan của người dùng.
  - `srs.md`: Đặc tả yêu cầu phần mềm (Software Requirements Specification) chi
    tiết hơn.

- **Thư mục `docs/ui/` và `docs/changelog/`:**
  - `ui/ui-guidelines.md`: Quy định về giao diện, mã màu, font chữ, components.
    Bạn cũng nên đặt các file HTML/CSS giao diện mẫu (Mockup/Template) vào thư
    mục `docs/ui/` này để tham khảo.
  - `changelog/changes.md`: Nơi ghi chép lịch sử thay đổi phiên bản (Release
    Notes) mỗi lần update dự án.

**Lưu ý các thư mục hỗ trợ code (Đừng để trống):**

- **`mock-data/`**: Chứa các file JSON chứa dữ liệu giả (fake data). Rất quan
  trọng để frontend hoặc AI có thể render giao diện thử nghiệm khi chưa có
  Database thật. Hãy điền data mẫu tương ứng với API của bạn.
- **`tests/`**: Nơi chứa các file kịch bản kiểm thử (Unit tests, E2E tests).
- **`graph/`**: Bộ công cụ tự động sinh ra sơ đồ mạng lưới quan hệ giữa các tài
  liệu.

### Bước 3: Phân tích & Thiết kế Module (Cấp độ Tính năng)

Khi chuẩn bị lập trình một tính năng cụ thể (ví dụ: Thanh toán, Đăng nhập), bạn
sẽ làm việc tại thư mục `modules/`:

1. Copy thư mục `modules/sample-module` và đổi tên thành tên tính năng của bạn
   (VD: `modules/payment`).
2. Điền đầy đủ thông tin vào các file trong đó:
   - `overview.md`: Mục đích và phạm vi của module này là gì?
   - `requirements.md`: Các yêu cầu chức năng (Functions) cụ thể phải có.
   - `flow.md`: Vẽ biểu đồ luồng hoạt động (bằng Mermaid JS).
   - `api.md`: Thiết kế luồng dữ liệu (API Request/Response).
3. **Luật định dạng:** Mọi file tài liệu phải tuân thủ chuẩn Markdown (sẽ bị
   `Markdownlint` báo lỗi nếu format sai). Đặc biệt, nội dung và cấu trúc tài
   liệu **BẮT BUỘC** phải tuân thủ các luật nội bộ được định nghĩa trong file
   `docs/project/metadata-schema.md` cùng với các quy tắc của AI tại `.agents/`.

### Bước 4: Triển khai Lập trình (Coding Phase)

Chỉ sau khi bước 3 hoàn tất (Tài liệu module đã chốt và commit xong):

- Bạn (hoặc AI Agent) mới được phép bắt tay vào viết Mã nguồn (Source Code).
- **Khi Lập trình Frontend:** Lập trình viên hoặc AI BẮT BUỘC phải tham chiếu
  đến các file HTML/CSS giao diện mẫu đã được người dùng chỉ định (đặt trong thư
  mục `docs/ui/`) để đảm bảo code ra chính xác với thiết kế.
- **Cấu trúc Source Code:** Mã nguồn có thể đặt tập trung vào thư mục `src/`,
  hoặc đặt trực tiếp vào trong folder của module đó (VD:
  `modules/payment/controller.ts` nếu bạn làm theo chuẩn Modular Architecture).

### Bước 5: Commit & Push

Gõ lệnh `git commit`. Hệ thống Husky + Lint-staged sẽ chặn lại một nhịp để tự
động format code bằng Prettier, kiểm tra lỗi chính tả markdown, rồi mới đẩy lên
Repository thành công.

---

## 🤖 Hướng dẫn tích hợp AI Agents (AI Integration Guide)

Bộ khung này đi kèm với thư mục `.agents/` chứa các bộ kỹ năng (Skills) và luật
(Rules) mặc định. Tùy thuộc vào công cụ AI bạn đang sử dụng, hãy làm theo hướng
dẫn dưới đây để AI có thể "hiểu" được các luật này:

### 1. Dành cho các AI tích hợp sẵn trong IDE (Cursor, VSCode Copilot, v.v.)

Khuyến nghị sử dụng phương pháp **Tạo file trỏ (Pointer)** để đảm bảo AI luôn
cập nhật luật mới nhất từ `.agents/` (Single Source of Truth).

- **Ví dụ với Cursor:** Tạo một file tên là `.cursorrules` ở thư mục gốc của dự
  án và dán dòng lệnh tiếng Anh sau vào:
  > _"Always read and strictly follow the global rules defined in
  > `.agents/AGENTS.md` and check `.agents/skills/` for specific task
  > instructions before writing any code."_

### 2. Dành cho các AI dạng Chat Web (ChatGPT, Claude, Gemini)

Các AI này không có quyền tự động quét file trong máy tính của bạn. Hãy sử dụng
phương pháp **Copy thủ công**:

- Trước khi bắt đầu một đoạn hội thoại hoặc dự án mới, hãy mở file
  `.agents/AGENTS.md` hoặc các file `SKILL.md` tương ứng.
- **Copy** nội dung bên trong và **Paste** vào phần _System Prompt_ (hoặc
  _Custom Instructions_) của AI, hoặc dán thẳng vào khung chat đầu tiên.
- Bằng cách này, bạn có thể chủ động mớm cho AI đúng bộ kỹ năng cần thiết cho
  task đó, giúp tiết kiệm bộ nhớ (Token) và giúp AI tập trung hơn.
