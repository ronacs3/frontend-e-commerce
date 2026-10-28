import Link from "next/link";
import { ArrowUpRight, CircuitBoard } from "lucide-react";

export default function Footer() {
  return <footer className="store-footer">
    <div className="site-container footer-main">
      <div className="footer-brand-block"><Link href="/" className="brand"><span className="brand-symbol"><CircuitBoard size={24} /></span><span>tech<span className="brand-light">shop</span><span className="brand-dot">.</span></span></Link><p>Một chút công nghệ.<br />Nhiều hơn những trải nghiệm.</p></div>
      <div className="footer-column"><h2>Khám phá</h2><Link href="/#catalog">Tất cả sản phẩm <ArrowUpRight size={14} /></Link><Link href="/?keyword=tai+nghe#catalog">Âm thanh</Link><Link href="/?keyword=phụ+kiện#catalog">Phụ kiện công nghệ</Link></div>
      <div className="footer-column"><h2>Đồng hành cùng bạn</h2><Link href="/profile">Tài khoản của tôi</Link><Link href="/profile">Theo dõi đơn hàng</Link><Link href="/cart">Giỏ hàng của bạn</Link></div>
      <div className="footer-note"><span className="eyebrow">THE EVERYDAY UPGRADE</span><p>Nâng cấp từng<br />khoảnh khắc<span>.</span></p><Link href="/#catalog">Tìm cảm hứng mới <ArrowUpRight size={18} /></Link></div>
    </div>
    <div className="site-container footer-bottom"><span>© {new Date().getFullYear()} TechShop. Công nghệ, theo cách của bạn.</span><span>Được lựa chọn với sự tận tâm <span className="footer-small-dot" /></span></div>
  </footer>;
}
