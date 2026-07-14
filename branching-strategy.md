# Git Workflow & Branching Strategy

Tài liệu này quy định chiến lược phân nhánh (Branching Strategy) dành riêng cho
mô hình **Template Repository with Stack Branches**.

Mục tiêu: Đảm bảo bản mẫu (Boilerplate) luôn được cập nhật các quy tắc AI mới
nhất, đồng thời hỗ trợ khởi tạo nhanh nhiều loại dự án với các Stack công nghệ
khác nhau (vd: Spring Boot, React, Node.js).

## 1. Cấu trúc Nhánh (Branch Structure)

### Nhánh Lõi (`main`)

- **Vai trò:** Là lõi (Core) của toàn bộ Boilerplate.
- **Nội dung:** CHỈ chứa các tập tin cấu hình hệ thống, AI Agents (`.agents/`,
  `.ai/`), bộ tiêu chuẩn tài liệu (`docs/`), và cấu trúc thư mục rỗng. KHÔNG
  CHỨA CODE thực tế của dự án.
- **Quy tắc:** Bất cứ khi nào có cập nhật về Prompt, quy trình làm việc
  (Workflows) hoặc luật AI mới, hãy commit trực tiếp vào nhánh này.

### Nhánh Công Nghệ (`base-<stack>`)

- **Vai trò:** Là các phiên bản "dự án mẫu" đã được cấu hình sẵn cho một công
  nghệ cụ thể.
- **Nội dung:** Kế thừa toàn bộ từ `main` nhưng có thêm source code nền tảng
  (VD: `base-spring-react`, `base-nextjs`).
- **Cách tạo:**

  ```bash
  git checkout main
  git checkout -b base-<stack-name>
  ```

## 2. Khởi tạo Dự Án Mới (New Project Workflow)

Khi bắt đầu một dự án thực tế MỚI (ví dụ: cần Stack Spring + React):

1. **Clone chính xác nhánh công nghệ:**

   ```bash
   git clone -b base-spring-react --single-branch https://github.com/Nozs002/project-template.git my-new-project
   ```

2. **Cắt đứt liên kết với Template (Standalone):** Để dự án mới không bị ảnh
   hưởng bởi những nâng cấp của Template sau này, cần reset lại Git:

   ```bash
   cd my-new-project
   rm -rf .git
   git init
   git add .
   git commit -m "Initial commit from template"
   ```

   _(Sau đó gắn vào một kho lưu trữ GitHub hoàn toàn mới của dự án)._

## 3. Cập Nhật Luật Mới Cho Các Nhánh Công Nghệ

Khi bạn cập nhật một luật AI mới (`.agents/`) trên nhánh `main`, bạn cần lan
truyền bản cập nhật đó xuống các nhánh `base-<stack>` để các dự án khởi tạo sau
này có thể sử dụng:

```bash
# 1. Chuyển sang nhánh stack cần cập nhật
git checkout base-<stack-name>

# 2. Hợp nhất thay đổi từ main
git merge main

# 3. Resolve conflict (nếu có) và Push
git push origin base-<stack-name>
```

> **Lưu ý quan trọng:** Các dự án _đang chạy_ (đã được clone và tạo repo riêng)
> sẽ KHÔNG kéo (pull) những nâng cấp này về. Chúng chấp nhận sử dụng luật cũ để
> đảm bảo tính ổn định của hệ thống.
