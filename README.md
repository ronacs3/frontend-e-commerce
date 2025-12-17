Dưới đây là file **`README.md`** chi tiết, được trình bày chuyên nghiệp bằng Markdown. Bạn có thể copy toàn bộ nội dung trong khung code bên dưới và lưu thành file `README.md` ở thư mục gốc dự án.

````markdown
# 🛍️ TechShop - Fullstack E-commerce Project

Dự án website thương mại điện tử hoàn chỉnh (Fullstack) được xây dựng dựa trên nền tảng **MERN Stack** (MongoDB, Express, React/Next.js, Node.js). Hệ thống bao gồm đầy đủ quy trình từ xem hàng, giỏ hàng, thanh toán cho đến trang quản trị (Admin Dashboard).

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)
![Next.js](https://img.shields.io/badge/Frontend-Next.js_14-black)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)

---

## 🚀 Công nghệ sử dụng

### Backend (Server-side)

- **Node.js & Express:** Xây dựng RESTful API mạnh mẽ.
- **MongoDB & Mongoose:** Cơ sở dữ liệu NoSQL và ODM để quản lý dữ liệu linh hoạt.
- **JWT (JSON Web Token):** Cơ chế xác thực và phân quyền (Authentication & Authorization).
- **Bcrypt.js:** Mã hóa mật khẩu người dùng.

### Frontend (Client-side)

- **Next.js 14 (App Router):** Framework React hiện đại, hỗ trợ Server Side Rendering (SSR) tối ưu SEO.
- **Redux Toolkit:** Quản lý trạng thái toàn cục (Global State Management) cho Giỏ hàng và User.
- **Tailwind CSS:** Framework CSS utility-first giúp xây dựng giao diện nhanh chóng, chuẩn responsive.
- **Lucide React:** Bộ icon hiện đại, nhẹ nhàng.

---

## 🛠️ Yêu cầu cài đặt

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:

1.  **Node.js** (Phiên bản 18 trở lên).
2.  **MongoDB** (Đã cài đặt MongoDB Compass hoặc có tài khoản MongoDB Atlas).

---

## ⚙️ Hướng dẫn Cài đặt & Chạy

### 1. Thiết lập Backend (Server)

Mở terminal và di chuyển vào thư mục backend:

```bash
cd my-ecommerce-backend
```
````

**Bước 1: Cài đặt các gói phụ thuộc (Dependencies)**

```bash
npm install

```

**Bước 2: Cấu hình biến môi trường**
Tạo file `.env` tại thư mục gốc của `my-ecommerce-backend` và điền thông tin sau:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce_db
JWT_SECRET=techshop_secret_key_123456

```

_(Lưu ý: Nếu dùng MongoDB Atlas, hãy thay `MONGO_URI` bằng chuỗi kết nối của bạn)._

**Bước 3: Nạp dữ liệu mẫu (Seeding)**
Chạy lệnh sau để tạo Admin, User và các Sản phẩm mẫu vào Database:

```bash
npm run data:import

```

**Bước 4: Khởi chạy Server**

```bash
npm run dev

```

> Server sẽ hoạt động tại: `http://localhost:5000`

---

### 2. Thiết lập Frontend (Client)

Mở một terminal **mới** (giữ terminal backend đang chạy) và di chuyển vào thư mục frontend:

```bash
cd frontend

```

**Bước 1: Cài đặt các gói phụ thuộc**

```bash
npm install

```

**Bước 2: Cấu hình kết nối API**
Tạo file `.env.local` tại thư mục gốc của `frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

```

**Bước 3: Khởi chạy ứng dụng**

```bash
npm run dev

```

> Website sẽ hoạt động tại: `http://localhost:3000`

---

## 🔑 Tài khoản Test (Mặc định)

Sau khi chạy lệnh `npm run data:import`, hệ thống sẽ tạo sẵn các tài khoản sau:

| Vai trò   | Email               | Mật khẩu | Quyền hạn                                                                         |
| --------- | ------------------- | -------- | --------------------------------------------------------------------------------- |
| **Admin** | `admin@example.com` | `123`    | Truy cập Admin Dashboard (Menu "Quản trị"), Quản lý sản phẩm, Xem tất cả đơn hàng |
| **User**  | `user@example.com`  | `123`    | Mua hàng, Quản lý giỏ hàng, Đặt hàng                                              |

---

## 📂 Cấu trúc Dự án

```text
/
├── my-ecommerce-backend/       # --- SERVER SIDE ---
│   ├── config/db.js            # Cấu hình kết nối MongoDB
│   ├── controllers/            # Logic xử lý nghiệp vụ (Product, User, Order)
│   ├── models/                 # Định nghĩa Schema dữ liệu (Mongoose)
│   ├── routes/                 # Định tuyến API (/api/...)
│   ├── middleware/             # Middleware xác thực (Auth) & Admin
│   ├── data/                   # Dữ liệu mẫu (Products, Users)
│   ├── server.js               # File khởi chạy chính
│   └── seeder.js               # Script nạp dữ liệu mẫu
│
└── frontend/                   # --- CLIENT SIDE (Next.js) ---
    ├── src/app/                # App Router (Cấu trúc trang)
    │   ├── admin/              # Các trang quản trị (Protected Route)
    │   ├── cart/               # Trang giỏ hàng
    │   ├── login/              # Trang đăng nhập
    │   ├── placeorder/         # Trang xác nhận đơn hàng
    │   ├── shipping/           # Trang nhập địa chỉ
    │   └── product/[id]/       # Trang chi tiết sản phẩm
    ├── src/components/         # Các component tái sử dụng (Header, Steps...)
    ├── src/redux/              # Redux Store & Slices (Quản lý State)
    └── public/                 # Tài nguyên tĩnh (Ảnh...)

```

## ✨ Các tính năng chính

### Người dùng (Customer)

1. **Authentication:** Đăng ký, Đăng nhập, Đăng xuất, Tự động lưu trạng thái đăng nhập.
2. **Sản phẩm:** Xem danh sách, Xem chi tiết, Kiểm tra trạng thái tồn kho (Còn hàng/Hết hàng).
3. **Giỏ hàng:** Thêm sản phẩm, Thay đổi số lượng, Xóa sản phẩm, Tính tổng tiền tự động.
4. **Đặt hàng (Checkout Wizard):** Quy trình 3 bước chuyên nghiệp:

- Bước 1: Nhập địa chỉ giao hàng.
- Bước 2: Chọn phương thức thanh toán.
- Bước 3: Xem lại tổng quan (Tiền hàng + Phí ship + Thuế) và Xác nhận đặt hàng.

### Quản trị viên (Admin)

1. **Quản lý Sản phẩm (CRUD):**

- Xem danh sách sản phẩm.
- Xóa sản phẩm.
- Tạo sản phẩm mới.
- Chỉnh sửa thông tin chi tiết (Tên, Giá, Ảnh, Mô tả, Tồn kho).

2. **Quản lý Đơn hàng:**

- Xem danh sách toàn bộ đơn hàng của hệ thống.
- Theo dõi trạng thái thanh toán và giao hàng.

---

**QUANGHM**

```

```
# frontend-e-commerce
