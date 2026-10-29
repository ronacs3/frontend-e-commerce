import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return <section className="empty-state"><div className="empty-state-icon"><SearchX size={30} /></div><h1>Không tìm thấy trang</h1><p>Đường dẫn này không còn tồn tại. Khám phá cửa hàng để tìm sản phẩm bạn đang cần.</p><Link href="/#catalog" className="store-button">Khám phá sản phẩm</Link></section>;
}
