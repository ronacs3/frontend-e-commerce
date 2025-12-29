"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { resetCart } from "@/redux/slices/cartSlice";
import SearchBox from "./SearchBox";

import { Dropdown, Badge, message, Avatar } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  OrderedListOutlined,
  TeamOutlined,
  TagsOutlined,
  ProfileOutlined,
  GifOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= LOGOUT ================= */
  const logoutHandler = () => {
    dispatch(logout());
    dispatch(resetCart());
    message.success("Đăng xuất thành công");
    router.push("/login");
  };

  /* ================= CART CLICK ================= */
  const handleCartClick = (e) => {
    e.preventDefault();

    if (!userInfo) {
      message.warning("Vui lòng đăng nhập để xem giỏ hàng");
      router.push("/login");
      return;
    }

    router.push("/cart");
  };

  const cartCount = mounted
    ? cartItems.reduce((acc, item) => acc + item.qty, 0)
    : 0;

  const userMenuItems =
    mounted && userInfo
      ? [
          ...(userInfo.isAdmin
            ? [
                {
                  key: "admin-products",
                  icon: <DashboardOutlined />,
                  label: (
                    <Link href="/admin/productlist">Quản lý Sản phẩm</Link>
                  ),
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
                  icon: <TagsOutlined />,
                  label: <Link href="/admin/categories">Quản lý Danh mục</Link>,
                },
                {
                  key: "admin-coupon",
                  icon: <GifOutlined />,
                  label: <Link href="/admin/coupons">Quản lý Mã giảm giá</Link>,
                },
                {
                  key: "admin-dashboard",
                  icon: <BarChartOutlined />,
                  label: <Link href="/admin/dashboard">Thống kê chi tiết</Link>,
                },
                { type: "divider" },
              ]
            : []),
          {
            key: "profile",
            icon: <ProfileOutlined />,
            label: <Link href="/profile">Hồ sơ & Đơn hàng</Link>,
          },
          {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Đăng xuất",
            danger: true,
            onClick: logoutHandler,
          },
        ]
      : [];

  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center gap-4">
        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 tracking-tighter"
        >
          TechShop
        </Link>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          {/* CART */}
          <a onClick={handleCartClick} className="cursor-pointer">
            <Badge count={cartCount} showZero color="blue">
              <ShoppingCartOutlined
                style={{ fontSize: "26px", color: "#374151" }}
              />
            </Badge>
          </a>

          {/* USER */}
          {mounted && userInfo ? (
            <Dropdown menu={{ items: userMenuItems }} trigger={["hover"]}>
              <div className="cursor-pointer flex items-center gap-2">
                <Avatar
                  style={{ backgroundColor: "#1890ff" }}
                  icon={<UserOutlined />}
                  src={userInfo.avatar}
                >
                  {userInfo.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <span className="hidden lg:block font-medium text-gray-700">
                  {userInfo.name}
                </span>
              </div>
            </Dropdown>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <UserOutlined />
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="container mx-auto px-4 mt-3 md:hidden">
        <SearchBox />
      </div>
    </header>
  );
}
