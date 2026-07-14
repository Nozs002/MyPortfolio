---
id: DOC-TECH-STACK
type: document
title: tech-stack
status: approved
version: 1.0
owner: PO
tags:
  - tech-stack
  - technologies
  - tools
last_updated: 2026-07-14
---

# Tech Stack

## Tổng quan

Dự án sử dụng bộ công cụ hiện đại, tập trung vào hiệu năng cao, trải nghiệm
người dùng cao cấp (Premium UX), và khả năng triển khai nhanh (Serverless).

## Ngôn ngữ cốt lõi

- **TypeScript**: Sử dụng cho toàn bộ Full-stack (Frontend & Backend) để đảm bảo
  type-safety và dễ bảo trì.

## Frontend

- **Framework**: Next.js (App Router).
- **Styling**: Vanilla CSS & CSS Modules (Không sử dụng Tailwind để đảm bảo tính
  độc quyền của thiết kế).
- **3D & Đồ họa**: React Three Fiber & Drei để tạo các trải nghiệm WebGL cao
  cấp.
- **Thư viện UI**: React.js (tích hợp sẵn trong Next.js).

## Backend & API

- **Kiến trúc API**: Next.js Server Actions & API Routes (Không tách rời backend
  server).
- **Xác thực (Authentication)**: NextAuth.js (Quản lý phiên đăng nhập bảo mật
  cho CMS Admin).
- **Lưu trữ ảnh & Media**: Cloudinary (Tối ưu hóa ảnh tự động, phân phối qua
  CDN).

## Cơ sở dữ liệu (Database)

- **Database**: MongoDB Atlas (NoSQL Cloud Database - Lựa chọn tối ưu để tránh
  cold-start trên Serverless).
- **ORM**: Prisma (Quản lý schema chặt chẽ, tự động sinh Type cho TypeScript).

## Cơ sở hạ tầng (Infrastructure)

- **Hosting / Deployment**: Vercel (Tối ưu hóa tuyệt đối cho Next.js, tự động
  scale).
- **Quản lý Package**: pnpm.
