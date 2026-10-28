import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";
import ProductShowcase, { ShowcaseGallery } from "@/components/ProductShowcase";
import ProductReviews from "@/components/ProductReviews";
import ProductCard from "@/components/ProductCard";

export default async function ProductDetailsShowcase({ product }) {
  let related = [];
  try {
    const response = await apiFetch(`${API_BASE_URL}/products/${product._id}/related`, { cache: "no-store" });
    if (response.ok) { const data = await response.json(); if (Array.isArray(data)) related = data; }
  } catch { /* The product remains available if related items cannot load. */ }
  return <div className="product-detail-showcase">
    <nav className="detail-breadcrumb" aria-label="Đường dẫn sản phẩm"><Link href="/#catalog"><ArrowLeft size={13} /> Tất cả sản phẩm</Link><span>/</span><span>{product.category}</span></nav>
    <ProductShowcase product={product} detail />
    <ShowcaseGallery product={product} />
    <section className="detail-description"><div><span className="showcase-kicker">Tìm hiểu sản phẩm</span><h2>Thiết bị dành cho bạn.</h2></div><p>{product.description || "Cửa hàng đang cập nhật mô tả chi tiết cho sản phẩm này."}</p></section>
    <ProductReviews product={product} />
    {related.length > 0 && <section className="detail-related"><div className="store-section-heading"><h2>Cùng bạn khám phá thêm.</h2><Link href="/#catalog" className="text-button">Tất cả sản phẩm</Link></div><div className="store-product-grid">{related.map((item) => <ProductCard key={item._id} product={item} />)}</div></section>}
  </div>;
}
