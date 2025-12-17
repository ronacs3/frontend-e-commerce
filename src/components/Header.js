"use client";

import Link from "next/link";
import { ShoppingCart, User, LogOut } from "lucide-react"; // Thêm icon LogOut
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice"; // Import action logout
import { useRouter } from "next/navigation";

export default function Header() {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth); // Lấy user info
  console.log(userInfo);
  const dispatch = useDispatch();
  const router = useRouter();

  const logoutHandler = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo... (Giữ nguyên) */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          TechShop
        </Link>
        <nav className="hidden md:flex space-x-6 text-gray-600">
          <Link href="/">Trang chủ</Link>
        </nav>

        {/* Icons Area */}
        <div className="flex items-center space-x-6">
          {/* Giỏ hàng (Giữ nguyên) */}
          <Link href="/cart">
            <button className="relative hover:text-blue-600 flex items-center">
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </button>
          </Link>

          {/* LOGIC USER: Nếu có userInfo thì hiện tên, chưa có thì hiện nút Login */}
          {userInfo ? (
            <div className="flex items-center gap-4">
              {/* MENU ADMIN (MỚI) */}
              {userInfo.isAdmin && (
                <div className="relative group">
                  <button className="flex items-center gap-1 font-medium hover:text-blue-600">
                    Quản trị <span className="text-xs">▼</span>
                  </button>
                  {/* Dropdown content */}
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 hidden group-hover:block">
                    <Link
                      href="/admin/productlist"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Quản lý Sản phẩm
                    </Link>
                    <Link
                      href="/admin/orderlist"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Quản lý Đơn hàng
                    </Link>
                    <Link
                      href="/admin/userlist"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Quản lý User
                    </Link>
                  </div>
                </div>
              )}

              {/* MENU USER */}
              <div className="flex items-center gap-3 cursor-pointer group relative">
                <div className="flex items-center gap-2 hover:text-blue-600">
                  <User size={24} />
                  <span className="font-medium">{userInfo.name}</span>
                </div>
                <button
                  onClick={logoutHandler}
                  className="text-gray-500 hover:text-red-600"
                  title="Đăng xuất"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium"
            >
              <User size={24} />
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
