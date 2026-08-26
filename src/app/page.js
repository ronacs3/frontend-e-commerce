import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import HeroBanner from "@/components/HeroBanner";
import Link from "next/link";
import { AppstoreOutlined, FireOutlined, ThunderboltOutlined, TagOutlined } from "@ant-design/icons";

async function getProducts({ category, keyword, min, max }) {
  try {
    const params = new URLSearchParams();

    if (category) params.append("category", category);
    if (keyword) params.append("keyword", keyword);
    if (min) params.append("minPrice", min);
    if (max) params.append("maxPrice", max);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
}

export default async function Home({ searchParams }) {
  const { category, keyword, min, max } = await searchParams;
  const products = await getProducts({ category, keyword, min, max });

  let pageTitle = "Tất cả sản phẩm";
  if (keyword) pageTitle = `Kết quả tìm kiếm: "${keyword}"`;
  else if (category) pageTitle = `Danh mục: ${category}`;

  const isFiltered = Boolean(category || keyword || min || max);

  return (
    <div className="space-y-8">
      {/* Show Hero Banner only on main page without active filter */}
      {!isFiltered && <HeroBanner />}

      {/* Category Pills Quick Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/"
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            !category
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <AppstoreOutlined /> tất cả
        </Link>
        {["Laptop", "Điện thoại", "Phụ kiện", "Tai nghe", "Màn hình", "Đồng hồ"].map((cat) => (
          <Link
            key={cat}
            href={`/?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              category === cat
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <TagOutlined /> {cat}
          </Link>
        ))}
      </div>

      {/* Layout Grid (Sidebar Filter + Products) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar Filter */}
        <div className="w-full lg:w-1/4 sticky top-24">
          <ProductFilter />
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-3/4 space-y-6">
          {/* Section Header */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <FireOutlined className="text-rose-500" />
                <span>{pageTitle}</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Hiển thị <span className="font-bold text-slate-700">{products.length}</span> sản phẩm công nghệ chính hãng
              </p>
            </div>

            {isFiltered && (
              <Link
                href="/"
                className="text-xs text-indigo-600 hover:underline font-semibold bg-indigo-50 px-3 py-1.5 rounded-lg"
              >
                Xóa tất cả bộ lọc ✕
              </Link>
            )}
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm space-y-4">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                <ThunderboltOutlined />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Không tìm thấy sản phẩm nào</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Rất tiếc, không có sản phẩm nào phù hợp với bộ lọc hiện tại của bạn. Vui lòng thử tìm kiếm từ khóa khác hoặc bỏ bớt tiêu chí lọc.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-indigo-600/20"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
