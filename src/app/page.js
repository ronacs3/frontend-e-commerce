import Link from "next/link";
import { Suspense } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Headphones, Laptop, Mouse, PackageCheck, SearchX, SlidersHorizontal, Sparkles, ShieldCheck, Truck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";

async function getProducts({ category, keyword, min, max }) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (keyword) params.set("keyword", keyword);
  if (min) params.set("minPrice", min);
  if (max) params.set("maxPrice", max);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/products?${params.toString()}`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { products: [], unavailable: true };
    const data = await res.json();
    return { products: Array.isArray(data) ? data : data.products || [], unavailable: false };
  } catch { return { products: [], unavailable: true }; }
}

const collections = [
  { title: "Góc làm việc", description: "Cảm hứng cho mọi ý tưởng", keyword: "laptop", icon: Laptop, color: "sage" },
  { title: "Thế giới âm thanh", description: "Đắm mình trong từng giai điệu", keyword: "tai nghe", icon: Headphones, color: "peach" },
  { title: "Phụ kiện mỗi ngày", description: "Nhỏ gọn. Khác biệt lớn.", keyword: "phụ kiện", icon: Mouse, color: "lavender" },
];

export default async function Home({ searchParams }) {
  const filters = await searchParams;
  const { category, keyword, min, max } = filters;
  const { products, unavailable } = await getProducts(filters);
  const hasFilters = Boolean(category || keyword || min || max);
  const title = keyword ? `Kết quả cho “${keyword}”` : category || "Tìm món đồ hợp gu bạn";
  return <div className="storefront site-container">
    {!hasFilters && <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-copy"><span className="hero-kicker"><span className="status-dot" /> CHỌN CÔNG NGHỆ. CHỌN PHONG CÁCH.</span><h1 id="hero-heading">Một nâng cấp nhỏ.<br /><span>Trải nghiệm lớn.</span></h1><p>Những món đồ công nghệ dành cho cách bạn làm việc,<br className="desktop-break" /> giải trí và tận hưởng mỗi ngày.</p><div className="hero-actions"><Link href="#catalog" className="button-primary">Khám phá sản phẩm <ArrowUpRight size={19} /></Link><a href="#collections" className="hero-secondary">Tìm cảm hứng <ArrowDown size={16} /></a></div><div className="hero-footnote"><span className="mini-spark"><Sparkles size={16} /></span><span>Công nghệ hợp gu. Trải nghiệm hợp ý.</span></div></div>
        <div className="hero-visual"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><span className="hero-watermark" aria-hidden="true">SOUND</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-headphones.svg" width="560" height="500" alt="Tai nghe chụp tai màu xanh ngọc với đệm tai mềm" className="hero-product" fetchPriority="high" />
          <div className="floating-label"><span className="floating-label-icon"><Headphones size={18} /></span><span><strong>Chạm vào giai điệu</strong><small>Để thế giới ồn ào ở lại phía sau</small></span><ArrowUpRight size={16} /></div><span className="hero-visual-caption">ÂM THANH HAY. MỖI NGÀY.</span><span className="hero-plus plus-one" aria-hidden="true">+</span><span className="hero-plus plus-two" aria-hidden="true">+</span></div>
      </section>
      <section className="benefits-strip" aria-label="Trải nghiệm mua sắm"><div><Truck size={22} /><span><strong>Giao hàng tận nơi</strong><small>Miễn phí cho đơn trên 10 triệu</small></span></div><div><ShieldCheck size={22} /><span><strong>Mua sắm an tâm</strong><small>Thông tin sản phẩm rõ ràng</small></span></div><div><PackageCheck size={22} /><span><strong>Lựa chọn dễ dàng</strong><small>So sánh trước khi quyết định</small></span></div><div><Headphones size={22} /><span><strong>Luôn sẵn sàng cùng bạn</strong><small>Khám phá điều phù hợp với mình</small></span></div></section>
      <section id="collections" className="collections-section" aria-labelledby="collections-heading"><div className="section-heading"><div><span className="eyebrow">DÀNH CHO NHỊP SỐNG CỦA BẠN</span><h2 id="collections-heading">Mỗi sở thích, một lựa chọn.</h2></div><a href="#catalog" className="text-link">Khám phá tất cả <ArrowUpRight size={16} /></a></div><div className="collection-grid">{collections.map(({ title: name, description, keyword: search, icon: Icon, color }) => <Link href={`/?keyword=${encodeURIComponent(search)}#catalog`} className={`collection-card ${color}`} key={name}><span className="collection-icon"><Icon size={31} strokeWidth={1.4} /></span><span><strong>{name}</strong><small>{description}</small></span><span className="collection-arrow"><ArrowUpRight size={20} /></span></Link>)}</div></section>
    </>}
    <section id="catalog" className="catalog-section" aria-labelledby="catalog-heading">
      <div className="section-heading catalog-heading"><div><span className="eyebrow">KHÁM PHÁ TECHSHOP</span><h2 id="catalog-heading">{title}<span className="heading-dot">.</span></h2></div><span className="product-count">{products.length} sản phẩm <SlidersHorizontal size={16} /></span></div>
      {hasFilters && <div className="active-filters"><span>Đang lọc theo:</span>{keyword && <span className="filter-chip">{keyword}</span>}{category && <span className="filter-chip">{category}</span>}{(min || max) && <span className="filter-chip">Khoảng giá đã chọn</span>}<Link href="/#catalog">Xóa bộ lọc <ArrowRight size={14} /></Link></div>}
      <div className="catalog-layout"><aside className="catalog-sidebar"><Suspense fallback={<div className="filter-panel">Đang tải bộ lọc…</div>}><ProductFilter key={[category, keyword, min, max].join("|")} /></Suspense></aside><div className="catalog-results">{products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div> : <div className="catalog-empty"><span className="empty-icon"><SearchX size={32} strokeWidth={1.3} /></span><h3>{unavailable ? "Sản phẩm sẽ sớm trở lại" : "Chưa tìm thấy món đồ phù hợp"}</h3><p>{unavailable ? "Hiện chưa thể tải danh sách sản phẩm. Bạn vui lòng quay lại sau nhé." : "Thử một từ khóa khác hoặc thay đổi bộ lọc để khám phá thêm."}</p>{hasFilters && <Link href="/#catalog" className="button-primary">Xem tất cả sản phẩm <ArrowUpRight size={17} /></Link>}</div>}</div></div>
    </section>
    <section className="editorial-banner"><span className="editorial-icon"><Sparkles size={30} strokeWidth={1.3} /></span><div><span className="eyebrow">ÍT HƠN, NHƯNG TỐT HƠN</span><h2>Đồ công nghệ tốt. Ngày thường tuyệt hơn.</h2><p>Bắt đầu từ một món đồ bạn thực sự yêu thích.</p></div><a href="#catalog" className="editorial-link" aria-label="Khám phá sản phẩm"><ArrowUpRight size={29} /></a></section>
  </div>;
}
