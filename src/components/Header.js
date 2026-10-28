"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Drawer, App } from "antd";
import { ArrowUpRight, ChevronDown, LogOut, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { logout } from "@/redux/slices/authSlice";
import { resetCart } from "@/redux/slices/cartSlice";
import { useMounted } from "@/utils/useMounted";
import SearchBox from "./SearchBox";

const adminLinks = [["/admin/dashboard", "Thống kê"], ["/admin/productlist", "Sản phẩm"], ["/admin/categories", "Danh mục"], ["/admin/orderlist", "Đơn hàng"], ["/admin/userlist", "Người dùng"], ["/admin/coupons", "Mã giảm giá"]];
const navLinks = [["/#catalog", "Khám phá"], ["/?category=Laptop#catalog", "Laptop"], ["/?category=%C4%90i%E1%BB%87n%20tho%E1%BA%A1i#catalog", "Điện thoại"], ["/?category=Tai%20nghe#catalog", "Âm thanh"], ["/?category=Ph%E1%BB%A5%20ki%E1%BB%87n#catalog", "Phụ kiện"], ["/blog", "Góc công nghệ"]];

export default function Header() {
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { message } = App.useApp();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const account = mounted ? userInfo : null;
  const count = mounted ? cartItems.reduce((total, item) => total + item.qty, 0) : 0;
  const logoutHandler = () => {
    dispatch(logout()); dispatch(resetCart()); message.success("Đã đăng xuất"); router.push("/login");
  };
  const items = [
    { key: "profile", label: <Link href="/profile">Hồ sơ & Đơn hàng</Link> },
    ...(account?.isAdmin ? [{ type: "divider" }, ...adminLinks.map(([href, label]) => ({ key: href, label: <Link href={href}>Quản lý {label.toLowerCase()}</Link> }))] : []),
    { type: "divider" },
    { key: "logout", label: "Đăng xuất", icon: <LogOut size={16} />, onClick: logoutHandler },
  ];
  return (
    <header className="store-header">
      <div className="site-container header-main">
        <Link href="/" className="store-brand" aria-label="TechShop - Trang chủ"><span>TECHSHOP<span className="brand-dot">.</span></span></Link>
        <nav className="header-desktop-links" aria-label="Điều hướng chính"><Link href="/#catalog">Sản phẩm</Link><Link href="/#collection-title">Bộ sưu tập</Link><Link href="/blog" aria-current={pathname.startsWith("/blog") ? "page" : undefined}>Câu chuyện công nghệ</Link></nav>
        <div className="header-actions">
          <button type="button" className="header-search-toggle" onClick={() => setOpen(true)} aria-label="Mở tìm kiếm sản phẩm"><Search size={19} /></button>
          {account ? <Dropdown menu={{ items }} trigger={["click"]}><button className="account-button" aria-label="Mở menu tài khoản"><UserRound size={20} /><span>{account.name?.split(" ").at(-1)}</span><ChevronDown size={13} /></button></Dropdown> : <Link href="/login" className="account-button"><UserRound size={20} /><span>Đăng nhập</span></Link>}
          <Link href="/cart" data-cart-target className="cart-button" aria-label={"Giỏ hàng, " + count + " sản phẩm"}><ShoppingBag size={21} />{count > 0 && <span className="cart-counter" key={count}>{count}</span>}</Link>
          <button className="mobile-menu-button" onClick={() => setOpen(true)} aria-label="Mở menu điều hướng"><Menu size={23} /></button>
        </div>
      </div>
      <Drawer title="Khám phá TechShop" open={open} onClose={() => setOpen(false)} placement="right" size={320}>
        <div className="mobile-navigation"><SearchBox onSearch={() => setOpen(false)} />{navLinks.map(([href, label]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={16} /></Link>)}<Link href="/profile" onClick={() => setOpen(false)}>Tài khoản & Đơn hàng</Link>{account?.isAdmin && adminLinks.map(([href, label]) => <Link href={href} key={href} onClick={() => setOpen(false)}>Quản lý {label.toLowerCase()}</Link>)}</div>
      </Drawer>
    </header>
  );
}
