"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Result, Spin } from "antd";
import { useMounted } from "@/utils/useMounted";
import { BarChart3, Package, Tags, ShoppingBag, Users, Ticket, ArrowUpRight } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import ClientWidgets from "./ClientWidgets";

const adminLinks = [
  ["/admin/dashboard", "Tổng quan", BarChart3],
  ["/admin/productlist", "Sản phẩm", Package],
  ["/admin/categories", "Danh mục", Tags],
  ["/admin/orderlist", "Đơn hàng", ShoppingBag],
  ["/admin/userlist", "Khách hàng", Users],
  ["/admin/coupons", "Mã giảm giá", Ticket],
];

export default function SiteShell({ children }) {
  const pathname = usePathname();
  const mounted = useMounted();
  const { userInfo } = useSelector(state => state.auth);
  const auth = ["/login", "/register", "/forgot-password"].includes(pathname);
  const admin = pathname.startsWith("/admin");
  const kind = admin ? "management" : pathname === "/" ? "home" : pathname.startsWith("/product/") ? "product" : pathname.startsWith("/blog") ? "journal" : "commerce";
  if (auth) return <main id="main-content" className="auth-main">{children}</main>;
  return <>
    <Header />
    <div className={`site-frame site-container ${admin ? "admin-frame" : ""}`}>
      {admin && <aside className="admin-sidebar">
        <div className="admin-sidebar-label">KHÔNG GIAN QUẢN TRỊ</div>
        <nav aria-label="Quản trị cửa hàng">{adminLinks.map(([href, label, Icon]) => <Link href={href} key={href} aria-current={pathname === href || (href === "/admin/orderlist" && pathname.startsWith("/admin/order/")) ? "page" : undefined}><Icon size={18} />{label}</Link>)}</nav>
        <Link href="/" className="admin-back-link">Xem cửa hàng <ArrowUpRight size={16} /></Link>
      </aside>}
      <main id="main-content" className={`site-main page-${kind}`}>
        {admin && !mounted ? <div className="page-loading"><Spin size="large" /></div> : admin && !userInfo?.isAdmin ? <Result status="403" title="Không gian quản trị" subTitle="Đăng nhập bằng tài khoản quản trị để tiếp tục." extra={<Link className="store-button" href="/login?redirect=/admin/dashboard">Đăng nhập quản trị</Link>} /> : children}
      </main>
    </div>
    <Footer />
    {!admin && <ClientWidgets showChat={!["/cart", "/shipping", "/payment", "/placeorder"].includes(pathname)} />}
  </>;
}
