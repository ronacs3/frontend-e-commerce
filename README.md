# 🛍️ E-Commerce Frontend (Next.js)

Giao diện người dùng (Frontend) cho hệ thống **Thương mại điện tử**, được xây dựng bằng **Next.js 15 (App Router)**, **Redux Toolkit**, **Ant Design** và **Tailwind CSS**.

Dự án tập trung vào trải nghiệm người dùng mượt mà, responsive, xử lý logic giỏ hàng – thanh toán – mã giảm giá, đồng thời cung cấp giao diện quản trị (Admin) đầy đủ.

---

## 🎨 Công nghệ sử dụng

| Hạng mục             | Công nghệ                                      |
| -------------------- | ---------------------------------------------- |
| **Framework**        | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language**         | JavaScript (ES6+)                              |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) |
| **UI Library**       | [Ant Design v5](https://ant.design/)           |
| **Styling**          | [Tailwind CSS](https://tailwindcss.com/)       |
| **Icons**            | Lucide React & Ant Design Icons                |
| **Date Handling**    | [Day.js](https://day.js.org/)                  |
| **Notification**     | Ant Design Message / Notification              |

---

## 🚀 Tính năng chính

### 👤 Khách hàng (Customer)

- **Trang chủ:** Banner, sản phẩm mới, danh mục nổi bật.
- **Sản phẩm:**
  - Tìm kiếm, lọc theo danh mục.
  - Xem chi tiết sản phẩm, gallery hình ảnh.
  - **Đánh giá sản phẩm:** Chỉ cho phép đánh giá sau khi đã mua và thanh toán.
  - Hiển thị sản phẩm liên quan.
- **Giỏ hàng & Thanh toán:**
  - Thêm / sửa / xóa sản phẩm.
  - **Áp dụng mã giảm giá (Coupon):**
    - Kiểm tra điều kiện áp dụng theo danh mục hoặc toàn bộ cửa hàng.
  - Quy trình Checkout 4 bước:
    1. Login
    2. Shipping
    3. Payment
    4. Place Order
- **Tài khoản cá nhân:**
  - Đăng nhập / Đăng ký.
  - Xem lịch sử & chi tiết đơn hàng.

### 🛡️ Quản trị viên (Admin)

- **Dashboard:** Tổng quan đơn hàng & trạng thái.
- **Quản lý sản phẩm:** Thêm, sửa, xóa, upload ảnh.
- **Quản lý đơn hàng:** Cập nhật trạng thái thanh toán & giao hàng.
- **Quản lý Coupon:**
  - Tạo mã giảm giá.
  - Thiết lập % giảm giá & ngày hết hạn.
  - Áp dụng cho toàn sàn hoặc danh mục cụ thể.

---

## 📦 Hướng dẫn cài đặt

### 1️⃣ Yêu cầu tiên quyết

- Node.js **v18+** (khuyến nghị cho Next.js 15)
- Backend API đang chạy (mặc định: `http://localhost:5000`)

---

### 2️⃣ Clone & cài đặt

```bash
git clone <link-repo-frontend>
cd frontend
npm install
# hoặc
yarn install
```

---

### 3️⃣ Cấu hình biến môi trường

Tạo file `.env.local` tại thư mục gốc:

```env
# Backend API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# (Optional) Số sản phẩm trên 1 trang
NEXT_PUBLIC_PAGE_SIZE=8
```

---

### 4️⃣ Khởi chạy dự án

```bash
npm run dev
```

➡ Truy cập tại: **http://localhost:3000**

---

## 📂 Cấu trúc thư mục (App Router)

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login / Register
│   ├── admin/              # Admin pages (Protected)
│   ├── cart/               # Giỏ hàng
│   ├── order/              # Chi tiết đơn hàng
│   ├── placeorder/         # Checkout & Coupon
│   ├── product/[id]/       # Chi tiết sản phẩm & Reviews
│   ├── layout.js           # Root layout (Header, Footer, Redux Provider)
│   └── page.js             # Trang chủ
├── components/             # Component tái sử dụng
│   ├── Header.js
│   ├── ProductCard.js
│   ├── CheckoutSteps.js
│   ├── ProductReviews.js
│   └── admin/              # Admin components
├── redux/
│   ├── slices/             # cartSlice, authSlice...
│   └── store.js
├── utils/                  # Helper functions
└── styles/                 # Global styles & Tailwind
```

---

## 🧪 Kịch bản test tiêu biểu

### 🎟️ Test Coupon

1. Thêm sản phẩm vào giỏ hàng.
2. Vào bước **Place Order**.
3. Nhập mã `SALE50` (chỉ áp dụng cho danh mục _Giày_).
4. Kết quả:
   - Có sản phẩm Giày → Giảm giá.
   - Không có Giày → Thông báo không hợp lệ.

### ⭐ Test Review

1. Đăng nhập user **chưa mua** sản phẩm A → Không thấy form đánh giá.
2. Mua & thanh toán sản phẩm A.
3. Quay lại trang chi tiết → Có thể đánh giá sao & bình luận.

---

## 🤝 Đóng góp

1. Fork repository.
2. Tạo branch mới:
   ```bash
   git checkout -b feature/NewUI
   ```
3. Commit:
   ```bash
   git commit -m "Update UI"
   ```
4. Push & tạo Pull Request 🚀

---

## © 2025 E-Commerce Frontend

Developed by **QUANGHM**
