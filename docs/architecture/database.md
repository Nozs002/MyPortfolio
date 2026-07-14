---
id: DOC-ARCH-DATABASE
type: database
title: database
status: approved
version: 1.0
owner: PO
tags:
  - database
  - schema
  - mongodb
last_updated: 2026-07-14
---

# Database Architecture

## Hệ quản trị cơ sở dữ liệu

Dự án sử dụng **MongoDB Atlas** (Cloud NoSQL). Lý do: Phù hợp với kiến trúc
Serverless, loại bỏ hoàn toàn độ trễ khởi động (cold start) thường gặp ở các kết
nối SQL truyền thống.

## Công cụ ORM (Object-Relational Mapping)

Sử dụng **Prisma ORM**.

- **Schema**: Toàn bộ cấu trúc các Collections trong MongoDB được định nghĩa
  chặt chẽ bằng Prisma Schema File (`prisma/schema.prisma`).
- **Type Safety**: Prisma tự động sinh ra các Type cho TypeScript tại thư mục
  `src/generated/prisma`, giúp AI và Lập trình viên không bao giờ bị nhầm lẫn
  các trường dữ liệu.

## Chiến lược Backup & Scale

- Mọi vấn đề về quản lý ổ cứng, sao lưu (backup) và mở rộng (scale) đều được
  MongoDB Atlas tự động xử lý.
- Code ở Local kết nối trực tiếp đến database thông qua biến môi trường
  `DATABASE_URL`.
