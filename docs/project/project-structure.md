---
id: DOC-PROJECT-STRUCTURE
type: document
title: project-structure
status: approved
version: 1.0
owner: PO
tags:
  - structure
  - directory
  - conventions
last_updated: 2026-07-14
---

# Project Structure

## Kiến trúc Thư mục (Mono-repo Next.js)

Dự án áp dụng mô hình Mono-repo, nơi toàn bộ Frontend và Backend được đặt chung
trong thư mục `src/app` của Next.js.

```text
/
├── .agents/              # Cấu hình, Rules và Kỹ năng dành riêng cho AI Agents
├── docs/                 # Tài liệu hệ thống (DDD, Kiến trúc, Phân tích)
├── prisma/
│   └── schema.prisma     # Định nghĩa cấu trúc Database cho MongoDB
├── src/
│   ├── app/
│   │   ├── (public)/     # Nhóm Route giao diện người dùng công khai (Trang chủ, Giới thiệu...)
│   │   ├── (admin)/      # Nhóm Route CMS dành cho quản trị viên (Đăng nhập, Dashboard)
│   │   ├── api/          # Các REST API phụ trợ (nếu có)
│   │   ├── globals.css   # Biến CSS và Style dùng chung (Design System)
│   │   └── layout.tsx    # Layout bọc ngoài cùng của toàn bộ ứng dụng
│   └── generated/
│       └── prisma/       # Code TypeScript tự sinh ra bởi Prisma Client
├── public/               # File tĩnh (fonts, icons, hình ảnh tĩnh)
└── .env                  # Biến môi trường (DATABASE_URL, NEXTAUTH_SECRET)
```
