---
name: normalize-file
description:
  Kích hoạt khi người dùng yêu cầu "chuẩn hóa" hoặc "normalize" một file.
  Workflow này đảm bảo AI luôn đọc các quy tắc chuẩn hóa trước khi thực hiện.
---

# Workflow: Chuẩn hóa file theo Metadata Schema

Khi người dùng yêu cầu chuẩn hóa (normalize) một file bất kỳ, bạn (AI Agent)
**BẮT BUỘC** phải thực hiện theo trình tự sau trước khi chỉnh sửa file của người
dùng:

1. **Đọc Quy Tắc (Rules):** Sử dụng tool để mở và đọc toàn bộ nội dung của file
   `docs/project/metadata-schema.md`.
2. **Nắm Bắt Yêu Cầu:** Phân tích các quy tắc, cấu trúc bắt buộc (required
   fields), định dạng (format) được quy định trong schema đó.
3. **Thực Hiện Chuẩn Hóa:** Đọc file mục tiêu người dùng yêu cầu, sau đó áp dụng
   chính xác các quy tắc vừa học được để định dạng lại và bổ sung metadata cho
   file đó. **LƯU Ý QUAN TRỌNG:**
   - Trường `title` trong metadata bắt buộc phải được đặt giống với tên của file
     đó (chỉ lấy phần tên, bỏ đuôi mở rộng, ví dụ file là `brd.md` thì
     `title: brd`).
   - Chỉ được phép chỉnh sửa/thêm phần Metadata (như YAML frontmatter). TUYỆT
     ĐỐI KHÔNG được phép thay đổi, chỉnh sửa hay xóa bất kỳ nội dung nào thuộc
     về phần thân (body content) của file mục tiêu.
4. **Báo Cáo:** Hoàn tất chỉnh sửa và liệt kê ngắn gọn cho người dùng biết bạn
   đã chuẩn hóa những phần nào dựa trên schema.
