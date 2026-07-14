# Hướng dẫn Đóng góp (Contributing Guidelines)

Cảm ơn bạn đã quan tâm đến việc đóng góp cho dự án này! Dưới đây là một số quy
tắc cần tuân thủ để giữ cho dự án luôn gọn gàng và dễ bảo trì.

## 1. Cấu trúc và Tài liệu (Docs-First)

Dự án này áp dụng triết lý **Docs-First**. Trước khi viết code hoặc thay đổi cấu
trúc, bạn phải cập nhật các tài liệu tương ứng trong thư mục `docs/` hoặc
`modules/`. Mọi thiết kế phải rõ ràng trước khi lập trình.

## 2. Quy ước Commit (Conventional Commits)

Dự án sử dụng [Conventional Commits](https://www.conventionalcommits.org/). Các
commit messages phải tuân theo định dạng sau:

`<type>[optional scope]: <description>`

Các type phổ biến:

- `feat:` Một tính năng mới
- `fix:` Sửa lỗi
- `docs:` Chỉ thay đổi tài liệu
- `style:` Các thay đổi không ảnh hưởng đến logic code (khoảng trắng, format
  code, v.v.)
- `refactor:` Cấu trúc lại code mà không sửa lỗi hay thêm tính năng mới
- `test:` Thêm tests hoặc sửa tests hiện có
- `chore:` Thay đổi quá trình build hoặc các công cụ phụ trợ (cập nhật thư viện,
  v.v.)

Ví dụ: `docs(readme): thêm huy hiệu trạng thái CI`

Dự án này đã sử dụng công cụ `husky` và `commitlint` (nếu có cấu hình) để tự
động hóa định dạng.

## 3. Quy trình Đóng góp qua Pull Request

1. Fork dự án và tạo một nhánh mới từ `main` (ví dụ: `feat/new-feature`).
2. Code tính năng mới và/hoặc sửa lỗi. Hãy đảm bảo bạn đã chạy `npm install` để
   kích hoạt các hook tự động.
3. Chạy các lệnh kiểm tra tự động trước khi commit (`npm run lint:md`, v.v.).
4. Đẩy (Push) nhánh của bạn lên GitHub.
5. Mở Pull Request (PR) và điền đầy đủ thông tin vào mẫu PR đã được chuẩn bị
   sẵn.

Chúng tôi rất mong chờ những đóng góp của bạn!
