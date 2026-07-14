---
id: DOC-ARCHITECTURE
type: architecture
title: architecture
status: approved
version: 1.0
owner: PO
tags:
  - architecture
  - design
  - system
last_updated: 2026-07-14
---

# System Architecture

## Mô hình Tổng thể

Hệ thống tuân theo kiến trúc **Serverless Full-stack** được tối ưu hóa cho
Vercel. Không có Server Backend độc lập (như Express hay NestJS) hoạt động 24/7.
Thay vào đó, backend logic được chạy theo từng Request.

## Luồng dữ liệu (Data Flow)

1. **Client (Browser)**: Trình duyệt tải trang tĩnh hoặc trang được Server Side
   Rendering (SSR) từ Vercel. Các hiệu ứng 3D (React Three Fiber) được render
   hoàn toàn ở phía Client.
2. **Next.js Server (Vercel Edge/Serverless)**:
   - Quản lý Routing.
   - Nhận các tương tác của người dùng thông qua **Server Actions**.
   - Kiểm tra quyền truy cập (Role) thông qua **NextAuth.js**.
3. **Database Layer**:
   - Server Actions sử dụng **Prisma Client** để mở kết nối an toàn tới
     **MongoDB Atlas**.
   - Dữ liệu được trả về và hiển thị ngay lập tức lên UI mà không qua bước gọi
     REST API trung gian, giảm độ trễ (latency).

## Môi trường Triển khai

- Mỗi khi code được push lên nhánh `main`, Vercel sẽ tự động kích hoạt tiến
  trình Build và đưa lên môi trường Production.
