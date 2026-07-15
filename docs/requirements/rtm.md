---
id: DOC-RTM
type: requirement
title: rtm
status: approved
version: 1.0
depends_on:
  - DOC-PRD
  - DOC-BRD
description: Matrix mapping requirements to design, code, and test artifacts.
---

# Requirements Traceability Matrix (RTM)

Bản ma trận này theo dõi việc hiện thực hóa các yêu cầu nghiệp vụ (từ tài liệu
BRD) thông qua các tính năng sản phẩm (PRD), mô hình dữ liệu (DB Schema), mã
nguồn (Code Implementation) và các kịch bản kiểm thử (Test Cases).

## Bảng Ma trận Truy vết Yêu cầu

| Mã BRD / Rule   | Mô tả Nghiệp vụ                                                                | Mã PRD tương ứng          | Thiết kế Database (DB)                                                                    | Mã nguồn (Code Modules)              | Kịch bản Kiểm thử        |     Trạng thái     |
| :-------------- | :----------------------------------------------------------------------------- | :------------------------ | :---------------------------------------------------------------------------------------- | :----------------------------------- | :----------------------- | :----------------: |
| **BR-01**       | Cho phép khách xem thông tin được công bố công khai.                           | PRD-2.1, PRD-2.2          | `DB-PROJECT`, `DB-PROFILE`, `DB-EXPERIENCE`, `DB-EDUCATION`, `DB-SKILL`, `DB-CERTIFICATE` | `src/app/(public)/*`                 | `TEST-PUBLIC-VIEWS`      | **Phân tích xong** |
| **BR-02**       | Cho phép chủ sở hữu quản trị nội dung qua khu vực quản trị riêng.              | PRD-2.1, PRD-2.2, PRD-2.5 | `DB-USER`, `DB-PROJECT`, `DB-PROFILE`, `DB-CONTACT-MESSAGE`                               | `src/app/(admin)/*`                  | `TEST-ADMIN-CRUD`        | **Phân tích xong** |
| **BR-03**       | Xuất bản và quản lý trạng thái nội dung (Draft/Publish/Archived).              | PRD-2.1, PRD-2.3          | `DB-PROJECT.state`                                                                        | `src/app/api/publish`                | `TEST-STATE-TRANSITION`  | **Phân tích xong** |
| **BR-04**       | Lưu trữ lịch sử thao tác của Admin (Audit Log).                                | PRD-2.4                   | `DB-AUDIT-LOG`                                                                            | `src/lib/audit.ts`                   | `TEST-AUDIT-LOGGING`     | **Phân tích xong** |
| **BR-05**       | Hỗ trợ quản lý tệp đính kèm (CV, Ảnh).                                         | PRD-2.1, PRD-2.2          | Lưu trữ CDN URL (`DB-PROFILE.cvUrl`, `DB-PROJECT.thumbnail`)                              | `src/lib/cloudinary.ts`              | `TEST-FILE-UPLOAD`       | **Phân tích xong** |
| **BR-06**       | Thống kê tương tác của người dùng.                                             | PRD-2.6                   | `DB-ANALYTICS-METRIC`                                                                     | `src/app/api/analytics`              | `TEST-ANALYTICS-TRACK`   | **Phân tích xong** |
| **BR-07**       | Cấu hình SEO và tối ưu hóa chia sẻ mạng xã hội.                                | PRD-2.1                   | `DB-PROJECT.seoTitle`, `DB-PROJECT.ogImage`                                               | `src/app/(public)/[slug]/layout.tsx` | `TEST-SEO-METATAGS`      | **Phân tích xong** |
| **BR-09**       | Quản lý phiên bản và khôi phục nội dung cũ.                                    | PRD-2.4                   | `DB-PROJECT-VERSION`                                                                      | `src/app/api/versions`               | `TEST-VERSION-RESTORE`   | **Phân tích xong** |
| **BR-11**       | Hẹn lịch xuất bản và ẩn nội dung tự động.                                      | PRD-2.3                   | `DB-PROJECT.schedulePublishAt`                                                            | `src/app/api/cron/publishing`        | `TEST-SCHEDULED-CRON`    | **Phân tích xong** |
| **BR-13**       | Hỗ trợ sao lưu và khôi phục dữ liệu nghiệp vụ (Logical).                       | PRD-2.4                   | Logical Backup / Restore                                                                  | `src/app/api/admin/backup`           | `TEST-BACKUP-RESTORE`    | **Phân tích xong** |
| **BR-14**       | Hỗ trợ đổi và khôi phục mật khẩu qua email đăng ký.                            | PRD-2.7                   | `DB-USER`                                                                                 | `src/app/actions/auth.ts`            | `TEST-PASSWORD-RESET`    | **Phân tích xong** |
| **BRULE-01,02** | Chỉ hiển thị nội dung `Published` ra ngoài; cấm hiển thị `Draft/Archived`.     | PRD-1.4, PRD-2.1          | Query filter (`state: 'PUBLISHED'`)                                                       | `src/app/(public)/projects`          | `TEST-STATE-BARRIER`     | **Phân tích xong** |
| **BRULE-05**    | Audit log lưu tối thiểu: Người thực hiện, thời gian, loại thao tác, đối tượng. | PRD-2.4                   | `DB-AUDIT-LOG`                                                                            | `src/lib/audit.ts`                   | `TEST-AUDIT-SCHEMAS`     | **Phân tích xong** |
| **BRULE-07**    | Chỉ Portfolio Owner mới có quyền chỉnh sửa dữ liệu.                            | PRD-1.4, PRD-3.1          | NextAuth Session check                                                                    | `src/middleware.ts`                  | `TEST-AUTH-SHIELD`       | **Phân tích xong** |
| **BRULE-09**    | Đếm lượt tải CV, xem dự án, gửi form để làm thống kê.                          | PRD-2.6                   | `DB-ANALYTICS-METRIC`                                                                     | `src/app/api/analytics`              | `TEST-EVENT-TRIGGER`     | **Phân tích xong** |
| **BRULE-11**    | Tự động đổi trạng thái khi đến lịch mà không cần thao tác thủ công.            | PRD-2.3                   | Trigger logic                                                                             | `src/app/api/cron/publishing`        | `TEST-CRON-AUTO-PUBLISH` | **Phân tích xong** |
| **BRULE-13**    | Mỗi Project phải có tiêu đề, mô tả, và một URL công khai duy nhất.             | PRD-2.1                   | `DB-PROJECT.slug` (Unique)                                                                | `src/app/(public)/projects/[slug]`   | `TEST-SEO-SLUG`          | **Phân tích xong** |
| **BRULE-16**    | Đổi/khôi phục mật khẩu xác thực email và ghi Audit Log.                        | PRD-2.7                   | `DB-USER`, `DB-AUDIT-LOG`                                                                 | `src/app/actions/auth.ts`            | `TEST-PASSWORD-SECURITY` | **Phân tích xong** |
| **BR-15**       | Cung cấp trợ lý ảo AI để trả lời thông tin cơ bản về Portfolio.                 | PRD-2.8                   | `DB-PROFILE`, `DB-PROJECT`, `DB-EXPERIENCE`, `DB-SKILL`                                   | `src/app/api/chat/route.ts`          | `TEST-AI-CHAT-STREAM`     | **Phân tích xong** |
| **BRULE-18**    | AI chỉ trả lời dữ liệu đã xuất bản công khai, không bịa đặt hay lộ thông tin.    | PRD-2.8                   | N/A                                                                                       | `src/app/api/chat/route.ts`          | `TEST-AI-CONTEXT-LIMIT`   | **Phân tích xong** |


_(Ghi chú: Cột "Thiết kế Database", "Mã nguồn" và "Kịch bản Kiểm thử" sẽ được
điền chi tiết tương ứng sau khi chúng ta hoàn thành các giai đoạn thiết kế
schema, lập trình và viết test)._
