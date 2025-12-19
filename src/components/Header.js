"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice"; // Đảm bảo bạn đã export action này
import SearchBox from "./SearchBox";

// --- Ant Design Imports ---
import { Dropdown, Badge, Space, message, Avatar } from "antd";
import {
  ShoppingCartOutlined,
  AppstoreOutlined,
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  OrderedListOutlined,
  TeamOutlined,
  TagsOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Lấy state từ Redux
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // State lưu danh mục lấy từ API
  const [categories, setCategories] = useState([]);

  // --- 1. Load Danh mục từ API ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi tải danh mục header");
      }
    };
    fetchCategories();
  }, []);

  // --- 2. Xử lý Đăng xuất ---
  const logoutHandler = () => {
    dispatch(logout());
    message.success("Đăng xuất thành công");
    router.push("/login");
  };

  // --- 3. Cấu hình Menu Danh mục (Dropdown) ---
  const categoryItems = [
    {
      key: "all",
      label: (
        <Link href="/" className="font-bold">
          Tất cả sản phẩm
        </Link>
      ),
    },
    {
      type: "divider",
    },
    ...categories.map((cat) => ({
      key: cat._id, // Giả sử model Category có trường _id
      label: <Link href={`/?category=${cat.name}`}>{cat.name}</Link>,
    })),
  ];

  // --- 4. Cấu hình Menu User / Admin (Dropdown) ---
  const userMenuItems = userInfo
    ? [
        // A. PHẦN ADMIN (Chỉ hiện nếu isAdmin = true)
        ...(userInfo.isAdmin
          ? [
              {
                key: "admin-header",
                label: (
                  <span className="text-gray-500 font-bold text-xs">
                    QUẢN TRỊ VIÊN
                  </span>
                ),
                disabled: true,
              },
              {
                key: "admin-products",
                icon: <DashboardOutlined />,
                label: <Link href="/admin/productlist">Quản lý Sản phẩm</Link>,
              },
              {
                key: "admin-orders",
                icon: <OrderedListOutlined />,
                label: <Link href="/admin/orderlist">Quản lý Đơn hàng</Link>,
              },
              {
                key: "admin-users",
                icon: <TeamOutlined />,
                label: <Link href="/admin/userlist">Quản lý Người dùng</Link>,
              },
              {
                key: "admin-categories",
                icon: <TagsOutlined />, // Icon mới cho danh mục
                label: <Link href="/admin/categories">Quản lý Danh mục</Link>,
              },
              {
                key: "admin-coupon",
                icon: <TagsOutlined />, // Icon mới cho danh mục
                label: <Link href="/admin/coupons">Quản lý Mã giảm giá</Link>,
              },

              { type: "divider" },
            ]
          : []),

        // B. PHẦN USER (Chung cho mọi người)
        {
          key: "profile",
          icon: <ProfileOutlined />,
          label: <Link href="/profile">Hồ sơ & Đơn hàng</Link>,
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Đăng xuất",
          danger: true, // Màu đỏ
          onClick: logoutHandler,
        },
      ]
    : []; // Rỗng nếu chưa login

  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center gap-4">
        {/* === CỘT TRÁI: LOGO & DANH MỤC === */}
        <div className="flex items-center gap-6 shrink-0">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 tracking-tighter"
          >
            TechShop
          </Link>

          {/* Dropdown Danh Mục */}
          <Dropdown
            menu={{ items: categoryItems }}
            trigger={["hover"]}
            placement="bottomLeft"
          >
            <div className="cursor-pointer flex items-center gap-2 font-medium text-gray-700 hover:text-blue-600 transition">
              <AppstoreOutlined style={{ fontSize: "18px" }} />
              <span className="hidden sm:inline">Danh mục</span>
              <DownOutlined className="text-xs" />
            </div>
          </Dropdown>
        </div>

        {/* === CỘT GIỮA: THANH TÌM KIẾM (Ẩn trên mobile) === */}
        <div className="flex-1 px-8 hidden md:block max-w-2xl">
          <SearchBox />
        </div>

        {/* === CỘT PHẢI: GIỎ HÀNG & USER === */}
        <div className="flex items-center gap-6 shrink-0">
          {/* Giỏ hàng */}
          <Link href="/cart" className="relative group">
            <Badge
              count={cartItems.reduce((acc, item) => acc + item.qty, 0)}
              showZero
              color="blue"
            >
              <ShoppingCartOutlined
                style={{ fontSize: "26px", color: "#374151" }}
                className="group-hover:text-blue-600 transition"
              />
            </Badge>
          </Link>

          {/* User Menu */}
          {userInfo ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={["hover"]}
              placement="bottomRight"
              arrow
            >
              <div className="cursor-pointer flex items-center gap-2 py-1">
                <Avatar
                  style={{ backgroundColor: "#1890ff" }}
                  icon={<UserOutlined />}
                  src={userInfo.avatar} // Nếu user có avatar
                >
                  {userInfo.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <span className="font-medium text-gray-700 max-w-[100px] truncate hidden lg:block">
                  {userInfo.name}
                </span>
              </div>
            </Dropdown>
          ) : (
            // Nút Đăng nhập nếu chưa Login
            <Link
              href="/login"
              className="flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600"
            >
              <UserOutlined style={{ fontSize: "20px" }} />
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>

      {/* === THANH TÌM KIẾM MOBILE (Chỉ hiện khi màn hình nhỏ) === */}
      <div className="container mx-auto px-4 mt-3 md:hidden">
        <SearchBox />
      </div>
    </header>
  );
}
