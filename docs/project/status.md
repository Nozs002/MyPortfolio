---
id: DOC-STATUS
type: document
title: status
status: approved
version: 1.0
owner: PO
tags:
  - status
  - progress
  - roadmap
related:
  - DOC-VISION
  - DOC-BRD
  - DOC-PRD
  - DOC-SRS
  - DOC-RULES
  - DOC-USE-CASES
  - DOC-USER-FLOWS
  - DOC-ARCHITECTURE
  - DOC-ARCH-API
  - DOC-ARCH-DATABASE
  - DOC-RTM
last_updated: 2026-07-14
---

# Project Status & Tracking

Tài liệu này theo dõi tiến độ thiết kế nghiệp vụ, kiến trúc và phát triển phần
mềm cho hệ thống **MyPortfolio**.

## 1. Trạng thái Tài liệu Nghiệp vụ (Documentation Status)

| Tài liệu           | ID                                                                                              | Trạng thái | Phiên bản | Ghi chú                                                                    |
| :----------------- | :---------------------------------------------------------------------------------------------- | :--------: | :-------: | :------------------------------------------------------------------------- |
| **Vision**         | [vision.md](file:///d:/Workspace/Projects/my-portfolio/docs/project/vision.md)                  | `approved` |    1.0    | Định vị cốt lõi, nỗi đau bài toán và lộ trình sản phẩm.                    |
| **BRD**            | [brd.md](file:///d:/Workspace/Projects/my-portfolio/docs/requirements/brd.md)                   | `approved` |    1.0    | Nghiệp vụ cốt lõi, Business Rules đã được duyệt.                           |
| **PRD**            | [prd.md](file:///d:/Workspace/Projects/my-portfolio/docs/requirements/prd.md)                   | `approved` |    1.1    | Đã hoàn thành các mục 1, 2, 3 về tính năng và NFR.                         |
| **SRS**            | [srs.md](file:///d:/Workspace/Projects/my-portfolio/docs/analysis/srs.md)                       | `approved` |    1.0    | Đặc tả chi tiết 8 Yêu cầu Chức năng (FR) và 5 Yêu cầu Phi chức năng (NFR). |
| **Business Rules** | [business-rules.md](file:///d:/Workspace/Projects/my-portfolio/docs/analysis/business-rules.md) | `approved` |    1.0    | Phân loại quy tắc: Vòng đời, Hẹn giờ, Phiên bản, Audit và Analytics.       |
| **Use Cases**      | [use-cases.md](file:///d:/Workspace/Projects/my-portfolio/docs/analysis/use-cases.md)           | `approved` |    1.0    | Đặc tả chi tiết 7 Use Cases cốt lõi và các luồng xử lý chính.              |
| **User Flows**     | [user-flows.md](file:///d:/Workspace/Projects/my-portfolio/docs/analysis/user-flows.md)         | `approved` |    1.0    | Sơ đồ Mermaid: Vòng đời nội dung, NextAuth route guard và liên hệ.         |
| **Architecture**   | [architecture.md](file:///d:/Workspace/Projects/my-portfolio/docs/architecture/architecture.md) | `approved` |    1.0    | Sơ đồ Mermaid tổng thể, NextAuth và cơ chế Scheduled Cron.                 |
| **API Spec**       | [api.md](file:///d:/Workspace/Projects/my-portfolio/docs/architecture/api.md)                   | `approved` |    1.0    | Đặc tả chi tiết Server Actions quản trị và các REST API Endpoints.         |
| **Database Spec**  | [database.md](file:///d:/Workspace/Projects/my-portfolio/docs/architecture/database.md)         | `approved` |    1.0    | Định nghĩa 11 Model trên Prisma & MongoDB Atlas đã hoàn thành.             |
| **RTM Matrix**     | [rtm.md](file:///d:/Workspace/Projects/my-portfolio/docs/requirements/rtm.md)                   | `approved` |    1.0    | Ma trận truy vết yêu cầu BRD sang PRD đã hoàn thành.                       |

## 2. Tiến trình Phát triển (Development Progress)

- [x] Khởi tạo dự án Next.js (App Router, TypeScript).
- [x] Tích hợp cấu hình Prisma Client & MongoDB Atlas connection.
- [x] Hoàn thiện tài liệu Yêu cầu Nghiệp vụ (BRD) & Đặc tả Sản phẩm (PRD).
- [x] Thiết kế cơ sở dữ liệu và viết Schema (`prisma/schema.prisma`).
- [ ] Thiết kế các API / Server Actions quản trị CMS.
- [ ] Xây dựng Frontend UI Client (3D WebGL / React Three Fiber).
- [ ] Xây dựng Dashboard quản trị CMS.
- [ ] Viết bộ test kiểm thử hệ thống.
- [ ] Triển khai (Deploy) lên Vercel Production.
