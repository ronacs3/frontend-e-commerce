"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { resetCart } from "@/redux/slices/cartSlice";
import SearchBox from "./SearchBox";

import { Dropdown, Badge, message, Avatar, Drawer } from "antd";
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
  MenuOutlined,
  ThunderboltOutlined,
  BookOutlined,
  HomeOutlined,
} from "@ant-design/icons";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [mounted, setMounted] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(resetCart());
    message.success("Đăng xuất thành công");
    router.push("/login");
  };

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
          {
            key: "user-info",
            label: (
              <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                <div className="font-bold text-slate-800 text-sm">{userInfo.name}</div>
                <div className="text-xs text-slate-500 truncate">{userInfo.email}</div>
                {userInfo.isAdmin && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                    Quản trị viên
                  </span>
                )}
              </div>
            ),
          },
          ...(userInfo.isAdmin
            ? [
                {
                  key: "admin-dashboard",
                  icon: <BarChartOutlined className="text-indigo-600" />,
                  label: <Link href="/admin/dashboard" className="font-medium">Thống kê chi tiết</Link>,
                },
                {
                  key: "admin-products",
                  icon: <DashboardOutlined className="text-indigo-600" />,
                  label: <Link href="/admin/productlist">Quản lý Sản phẩm</Link>,
                },
                {
                  key: "admin-orders",
                  icon: <OrderedListOutlined className="text-indigo-600" />,
                  label: <Link href="/admin/orderlist">Quản lý Đơn hàng</Link>,
                },
                {
                  key: "admin-users",
                  icon: <TeamOutlined className="text-indigo-600" />,
                  label: <Link href="/admin/userlist">Quản lý Người dùng</Link>,
                },
                {
                  key: "admin-categories",
                  icon: <TagsOutlined className="text-indigo-600" />,
                  label: <Link href="/admin/categories">Quản lý Danh mục</Link>,
                },
                {
                  key: "admin-coupon",
                  icon: <GifOutlined className="text-indigo-600" />,
                  label: <Link href="/admin/coupons">Quản lý Mã giảm giá</Link>,
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
    <header className="sticky top-0 z-50 glass-effect border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-indigo-600 font-bold text-[10px] uppercase tracking-wider animate-pulse">
              HOT
            </span>
            <span className="text-slate-300 hidden sm:inline">Khuyến mãi cực sốc mừng khai trương - Giảm ngay 15%</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <Link href="/blog" className="hover:text-indigo-400 font-semibold transition flex items-center gap-1">
              <BookOutlined /> Tin Tức SEO
            </Link>
            <span>|</span>
            <Link href="/profile" className="hover:text-indigo-400 transition">Tra cứu đơn hàng</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-4 py-3 max-w-7xl flex items-center justify-between gap-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <ThunderboltOutlined />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
              Tech<span className="text-indigo-600">Shop</span>
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Premium Tech</span>
          </div>
        </Link>

        {/* DESKTOP SEARCH & BLOG LINK */}
        <div className="hidden md:flex flex-1 items-center max-w-2xl mx-6 gap-4">
          <div className="flex-1">
            <SearchBox />
          </div>
          <Link
            href="/blog"
            className="px-3.5 py-2 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0"
          >
            <BookOutlined /> Tin tức
          </Link>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">
          {/* CART */}
          <button
            onClick={handleCartClick}
            className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100/80 transition group relative"
            aria-label="Giỏ hàng"
          >
            <Badge count={cartCount} showZero color="#4f46e5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-50 text-slate-700 group-hover:text-indigo-600 flex items-center justify-center transition">
                <ShoppingCartOutlined className="text-xl" />
              </div>
            </Badge>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[11px] text-slate-400 font-medium">Giỏ hàng</span>
              <span className="text-xs font-bold text-slate-800">{cartCount} sản phẩm</span>
            </div>
          </button>

          {/* USER DROPDOWN / LOGIN */}
          {mounted && userInfo ? (
            <Dropdown menu={{ items: userMenuItems }} trigger={["click", "hover"]} placement="bottomRight">
              <div className="cursor-pointer flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100/80 transition">
                <Avatar
                  className="bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20"
                  icon={<UserOutlined />}
                  src={userInfo.avatar}
                  size="medium"
                >
                  {userInfo.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                    {userInfo.name}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-medium">Tài khoản</span>
                </div>
              </div>
            </Dropdown>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition"
            >
              <UserOutlined />
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            aria-label="Mở menu"
          >
            <MenuOutlined className="text-lg" />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <Drawer
        title="Menu Nav"
        placement="right"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        width={280}
      >
        <div className="space-y-4">
          <SearchBox />
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMobileDrawerOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-indigo-50 text-slate-700 font-medium flex items-center gap-2"
            >
              <HomeOutlined /> Trang chủ
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileDrawerOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-indigo-50 text-indigo-700 font-bold flex items-center gap-2"
            >
              <BookOutlined /> Tin Tức Công Nghệ
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileDrawerOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-indigo-50 text-slate-700 font-medium flex justify-between items-center"
            >
              <span>Giỏ hàng</span>
              <Badge count={cartCount} color="#4f46e5" />
            </Link>
            {userInfo && (
              <Link
                href="/profile"
                onClick={() => setMobileDrawerOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-indigo-50 text-slate-700 font-medium"
              >
                Hồ sơ cá nhân
              </Link>
            )}
            {userInfo?.isAdmin && (
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileDrawerOpen(false)}
                className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-semibold"
              >
                Trang Admin
              </Link>
            )}
          </div>
        </div>
      </Drawer>
    </header>
  );
}
