---
id: DOC-CHANGES
type: document
title: changes
status: approved
version: 1.1
owner: PO
tags:
  - changelog
  - history
last_updated: 2026-07-18
---

# Change Log

Tất cả các thay đổi lớn đối với hệ thống MyPortfolio sẽ được tài liệu hóa tại
đây.

## [1.1.0] - 2026-07-18

### Added

- **Next.js Middleware (`src/middleware.ts`)**: Lớp bảo vệ bảo mật ở biên (Route
  Guard). Chặn mọi truy cập trái phép vào `/admin/*` và `/dashboard/*`, chuyển
  hướng về `/admin/login` kèm theo `callbackUrl`. Trả về mã lỗi
  `401 Unauthorized` dạng JSON đối với các API/Server Action requests trái phép.
- **Admin Auth Shield Utility (`src/lib/auth-shield.ts`)**: Helper
  `verifyAdminSession()` phục vụ cơ chế bảo mật chiều sâu (Defense-in-depth) bên
  trong các Server Actions quản trị sau này.

### Affected Requirements

- **BRULE-07 / BR-02**: Chỉ Portfolio Owner mới có quyền truy cập CMS.
- **REQ-LOGIN-007, REQ-LOGIN-008, REQ-LOGIN-009** (Route Guard / Middleware
  Shield).
