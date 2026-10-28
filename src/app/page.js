import Link from "next/link";
import { ArrowUpRight, Headphones, Laptop, Smartphone, Mouse, ShieldCheck, Truck, SearchX, PackageOpen, BookOpen } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import HeroBanner from "@/components/HeroBanner";
import { ShowcaseGallery } from "@/components/ProductShowcase";
import { selectFeaturedProduct } from "@/lib/showcase.mjs";
import ShowcaseStories from "@/components/ShowcaseStories";
import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

async function getProducts({ category, keyword, min, max }) {
  try {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (keyword) params.set("keyword", keyword);
    if (min) params.set("minPrice", min);
    if (max) params.set("maxPrice", max);
    const res = await apiFetch(API_BASE_URL + "/products?" + params, { next: { revalidate: 60 } });
    if (!res.ok) return { products: [], failed: true };
    const data = await res.json();
    return { products: Array.isArray(data) ? data : [], failed: !Array.isArray(data) };
  } catch { return { products: [], failed: true }; }
}
const collections = [
  { name: "Laptop", title: "Góc làm việc, nâng tầm.", description: "Cho ý tưởng đi xa hơn.", icon: Laptop, color: "blue" },
  { name: "Điện thoại", title: "Kết nối theo cách bạn.", description: "Cả thế giới trong tay.", icon: Smartphone, color: "pink" },
  { name: "Tai nghe", title: "Bật nhạc. Tắt ồn ào.", description: "Tìm âm thanh đúng gu.", icon: Headphones, color: "green" },
  { name: "Phụ kiện", title: "Chi tiết nhỏ, khác biệt lớn.", description: "Hoàn thiện bộ thiết bị của bạn.", icon: Mouse, color: "sand" },
];

export default async function Home({ searchParams }) {
  const filters = await searchParams;
  const { category, keyword, min, max } = filters;
  const { products, failed } = await getProducts(filters);
  const isFiltered = Boolean(category || keyword || min || max);
  const featured = selectFeaturedProduct(products);
  const title = keyword ? 'Kết quả cho “' + keyword + '”' : category || "Tìm thiết bị đúng gu.";
  const CatalogHeading = isFiltered ? "h1" : "h2";
  return <div className="storefront">
    {!isFiltered && <>
      <HeroBanner product={featured} />
      <ShowcaseGallery product={featured} />
      <div className="store-benefits"><div><ShieldCheck size={22} /><span><strong>An tâm lựa chọn</strong><small>Thông tin sản phẩm minh bạch</small></span></div><div><Truck size={22} /><span><strong>Giao hàng tận nơi</strong><small>Miễn phí cho đơn trên 10 triệu</small></span></div><div><PackageOpen size={22} /><span><strong>Mua sắm dễ dàng</strong><small>Theo dõi đơn hàng trong tài khoản</small></span></div></div>
      <section className="collection-section" aria-labelledby="collection-title"><div className="store-section-heading"><div><h2 id="collection-title">Bạn muốn khám phá gì?</h2><p>Một thiết bị phù hợp. Nhiều điều để trải nghiệm.</p></div><a href="#catalog" className="text-button">Xem tất cả <ArrowUpRight size={17} /></a></div><div className="collections-grid">{collections.map(({ name, title, description, icon: Icon, color }) => <Link className={"collection-tile collection-" + color} key={name} href={"/?category=" + encodeURIComponent(name) + "#catalog"}><div className="collection-top"><span>{name}</span><ArrowUpRight size={18} /></div><Icon className="collection-icon" size={65} strokeWidth={1.25} /><h3>{title}</h3><p>{description}</p></Link>)}</div></section>
    </>}
    <section className="catalog-section" id="catalog" aria-labelledby="catalog-title">
      <div className="store-section-heading"><div><CatalogHeading id="catalog-title">{title}</CatalogHeading><p>{failed ? "Danh sách sản phẩm tạm thời chưa tải được." : products.length + " sản phẩm để bạn khám phá"}</p></div>{isFiltered && <Link href="/#catalog" className="text-button">Xóa bộ lọc</Link>}</div>
      <div className="catalog-layout"><aside className="catalog-sidebar"><ProductFilter key={[category, keyword, min, max].join("-")} initialCategory={category || ""} initialKeyword={keyword || ""} initialMin={min || 0} initialMax={max || 50000000} /></aside>
        <div className="catalog-content"><div className="catalog-toolbar"><span>{isFiltered ? "Sản phẩm phù hợp với bạn" : "Khám phá bộ sưu tập"}</span><span>Chọn lọc bởi TechShop</span></div>{products.length ? <div className="store-product-grid">{products.map(product => <ProductCard key={product._id} product={product} />)}</div> : <div className="catalog-empty">{isFiltered ? <SearchX size={44} strokeWidth={1.2} /> : <PackageOpen size={44} strokeWidth={1.2} />}<h3>{failed ? "Chưa tải được sản phẩm" : isFiltered ? "Chưa tìm thấy lựa chọn phù hợp" : "Những trải nghiệm mới đang đến"}</h3><p>{failed ? "Hãy tải lại trang để thử kết nối lại với cửa hàng." : isFiltered ? "Thử một từ khóa khác hoặc mở rộng khoảng giá để tìm thiết bị bạn cần." : "Sản phẩm sẽ xuất hiện tại đây khi cửa hàng cập nhật. Trong lúc chờ, khám phá những câu chuyện công nghệ cùng chúng tôi."}</p><Link href={failed ? "/" : isFiltered ? "/#catalog" : "/blog"} className="store-button">{failed ? "Thử lại" : isFiltered ? "Xem tất cả sản phẩm" : "Khám phá góc công nghệ"}<ArrowUpRight size={17} /></Link></div>}</div>
      </div>
    </section>
    {!isFiltered && <ShowcaseStories />}
    <section className="store-editorial"><div className="editorial-icon"><BookOpen size={45} strokeWidth={1.2} /></div><div><h2>Hiểu thiết bị. Chọn tự tin.</h2><p>Gợi ý mua sắm, đánh giá và những cách dùng công nghệ hay hơn mỗi ngày.</p></div><Link href="/blog" className="store-button store-button-light">Đọc góc công nghệ <ArrowUpRight size={18} /></Link></section>
  </div>;
}
