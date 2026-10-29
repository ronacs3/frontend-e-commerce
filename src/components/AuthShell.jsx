import Link from "next/link";
import { ArrowLeft, ShieldCheck, ShoppingBag } from "lucide-react";

export default function AuthShell({ children }) {
  return <div className="auth-screen">
    <header className="auth-header"><Link href="/" className="store-brand">TECHSHOP<span className="brand-dot">.</span></Link><Link href="/" className="auth-back"><ArrowLeft size={16} /> Về cửa hàng</Link></header>
    <div className="auth-content"><div className="auth-symbol"><ShoppingBag size={25} strokeWidth={1.5} /></div><div className="auth-card">{children}</div><p className="auth-assurance"><ShieldCheck size={15} /> Thông tin tài khoản được bảo mật</p></div>
    <footer className="auth-footer">© {new Date().getFullYear()} TechShop · Công nghệ cho mỗi ngày.</footer>
  </div>;
}
