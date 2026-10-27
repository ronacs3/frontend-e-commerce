"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Badge, Dropdown, message } from "antd";
import { ArrowUpRight, ChevronDown, CircuitBoard, LayoutDashboard, LogOut, Package, ShoppingBag, Ticket, Truck, UserRound, Users } from "lucide-react";
import { logout } from "@/redux/slices/authSlice";
import { resetCart } from "@/redux/slices/cartSlice";
import SearchBox from "./SearchBox";

const subscribe = () => () => {};

export default function Header() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const user = mounted ? userInfo : null;
  const cartCount = mounted ? cartItems.reduce((sum, item) => sum + Number(item.qty), 0) : 0;
  const logoutHandler = () => {
    dispatch(logout()); dispatch(resetCart());
    message.success("Đã đăng xuất thành công"); router.push("/login");
  };
  const menuItems = [
    ...(user?.isAdmin ? [
      { key: "dashboard", icon: <LayoutDashboard size={16} />, label: <Link href="/admin/dashboard">Tổng quan kinh doanh</Link> },
      { key: "products", icon: <Package size={16} />, label: <Link href="/admin/productlist">Quản lý sản phẩm</Link> },
      { key: "orders", icon: <ShoppingBag size={16} />, label: <Link href="/admin/orderlist">Quản lý đơn hàng</Link> },
      { key: "users", icon: <Users size={16} />, label: <Link href="/admin/userlist">Quản lý người dùng</Link> },
      { key: "categories", icon: <CircuitBoard size={16} />, label: <Link href="/admin/categories">Quản lý danh mục</Link> },
      { key: "coupons", icon: <Ticket size={16} />, label: <Link href="/admin/coupons">Mã giảm giá</Link> },
      { type: "divider" },
    ] : []),
    { key: "profile", icon: <UserRound size={16} />, label: <Link href="/profile">Tài khoản & đơn hàng</Link> },
    { key: "logout", icon: <LogOut size={16} />, label: "Đăng xuất", danger: true, onClick: logoutHandler },
  ];
  return (
    <>
      <div className="announcement-bar"><span><Truck size={14} /> Miễn phí vận chuyển cho đơn hàng trên 10 triệu</span><Link href="/#catalog">Khám phá ngay <ArrowUpRight size={13} /></Link></div>
      <header className="store-header">
        <div className="site-container header-main">
          <Link href="/" className="brand" aria-label="TechShop — Trang chủ"><span className="brand-symbol"><CircuitBoard size={24} strokeWidth={1.8} /></span><span>tech<span className="brand-light">shop</span><span className="brand-dot">.</span></span></Link>
          <div className="header-search"><SearchBox /></div>
          <div className="header-actions">
            {user ? <Dropdown menu={{ items: menuItems }} trigger={["click"]}><button type="button" className="account-button" aria-label="Mở menu tài khoản"><span className="header-icon user-initial">{user.name?.charAt(0).toUpperCase()}</span><span className="account-copy"><small>Xin chào,</small><strong>{user.name}</strong></span><ChevronDown size={14} /></button></Dropdown> : <Link href="/login" className="account-button"><span className="header-icon"><UserRound size={21} /></span><span className="account-copy"><small>Tài khoản của bạn</small><strong>Đăng nhập</strong></span></Link>}
            <span className="header-divider" />
            <Link href="/cart" className="cart-link" aria-label={`Giỏ hàng, ${cartCount} sản phẩm`}><Badge count={cartCount} size="small" color="#195b4c" offset={[-1, 3]}><span key={cartCount} className={`header-icon${cartCount > 0 ? " cart-feedback" : ""}`}><ShoppingBag size={22} /></span></Badge><span className="cart-label">Giỏ hàng</span></Link>
          </div>
        </div>
        <div className="header-nav-wrap"><nav className="site-container header-nav" aria-label="Điều hướng chính"><div className="nav-links"><Link href="/" className={pathname === "/" ? "nav-link active" : "nav-link"}>Trang chủ</Link><Link href="/#catalog" className="nav-link">Khám phá sản phẩm <ChevronDown size={13} /></Link><Link href="/?keyword=tai+nghe#catalog" className="nav-link">Âm thanh</Link><Link href="/?keyword=phụ+kiện#catalog" className="nav-link">Phụ kiện</Link></div><span className="nav-caption"><span className="status-dot" /> Công nghệ cho mỗi ngày</span></nav></div>
        <div className="site-container mobile-search"><SearchBox /></div>
      </header>
    </>
  );
}
