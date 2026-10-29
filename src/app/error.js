"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function ErrorPage({ reset }) {
  return <section className="empty-state" role="alert"><div className="empty-state-icon"><RefreshCw size={28} /></div><h1>Trang tạm thời chưa tải được</h1><p>Đã có lỗi khi tải nội dung. Bạn có thể thử lại hoặc quay về cửa hàng để tiếp tục.</p><div className="error-actions"><button type="button" className="store-button" onClick={reset}>Thử lại</button><Link href="/" className="text-button">Về cửa hàng</Link></div></section>;
}
