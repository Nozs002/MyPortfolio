# Base Branch: `base-nodejs-nextjs-mongodb`

Nhánh này chứa Boilerplate (khuôn mẫu) đã được thiết lập sẵn các công nghệ:

## 💻 Tech Stack

- **Backend & Logic**: Node.js (thông qua Next.js Server Actions & API Routes).
- **Frontend**: Next.js (App Router).
- **Database**: MongoDB Atlas.
- **ORM**: Prisma.
- **Authentication**: NextAuth.js.
- **Styling**: Vanilla CSS & CSS Modules (Không dùng Tailwind).
- **3D Effects**: React Three Fiber & Drei.

## 🏗 Kiến trúc (Architecture)

- **Mono-repo**: Toàn bộ Front & Back nằm chung trong `/src/app`.
- **CSS Strategy**: Sử dụng CSS Variables trong `globals.css` làm Design System
  cốt lõi. Các component sử dụng `*.module.css` để cô lập scope.

## 🚀 Hướng dẫn Cài đặt & Khởi chạy (Dành cho thành viên mới)

Khi bạn clone nhánh này về máy tính mới, hãy làm tuần tự các bước sau:

**1. Khôi phục thư viện:**

```bash
pnpm install
```

**2. Thiết lập Biến môi trường:**

- Copy file `.env.example` và đổi tên thành `.env`.
- Cập nhật lại chuỗi kết nối `DATABASE_URL` bên trong file `.env` thành database
  của bạn.

**3. Đồng bộ Prisma (Sinh code gợi ý TypeScript):**

```bash
npx prisma generate
```

**4. Khởi chạy Server Development:**

```bash
pnpm dev
```

Truy cập `http://localhost:3000` để xem thành quả!
