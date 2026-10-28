import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Headphones,
  Laptop,
  Mouse,
  PackageCheck,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Truck,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import HeroBanner from "@/components/HeroBanner";
import {
  AppstoreOutlined,
  FireOutlined,
  ThunderboltOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

async function getProducts({ category, keyword, min, max }) {
  try {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (keyword) params.append("keyword", keyword);
    if (min) params.append("minPrice", min);
    if (max) params.append("maxPrice", max);

    const res = await apiFetch(
      `${API_BASE_URL}/products?${params.toString()}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
}

const collections = [
  {
    title: "Góc làm việc",
    description: "Cảm hứng cho mọi ý tưởng",
    keyword: "laptop",
    icon: Laptop,
    color: "sage",
  },
  {
    title: "Thế giới âm thanh",
    description: "Đắm mình trong từng giai điệu",
    keyword: "tai nghe",
    icon: Headphones,
    color: "peach",
  },
  {
    title: "Phụ kiện mỗi ngày",
    description: "Nhỏ gọn. Khác biệt lớn.",
    keyword: "phụ kiện",
    icon: Mouse,
    color: "lavender",
  },
];

export default async function Home({ searchParams }) {
  const { category, keyword, min, max } = await searchParams;
  const products = await getProducts({ category, keyword, min, max });
  const categories = [
    "Laptop",
    "Điện thoại",
    "Phụ kiện",
    "Tai nghe",
    "Màn hình",
    "Đồng hồ",
  ];
  const isFiltered = Boolean(category || keyword || min || max);
  const pageTitle = keyword
    ? `Kết quả tìm kiếm: “${keyword}”`
    : category
      ? `Danh mục: ${category}`
      : "Tất cả sản phẩm";

  return (
    <div className="space-y-8">
      {!isFiltered && <HeroBanner />}

      <nav
        aria-label="Danh mục sản phẩm"
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
      >
        <Link
          href="/"
          prefetch={true}
          className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${!category ? "bg-teal-700 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-800"}`}
        >
          <AppstoreOutlined /> Tất cả
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/?category=${encodeURIComponent(cat)}`}
            prefetch={true}
            className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${category === cat ? "bg-teal-700 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-800"}`}
          >
            <TagOutlined /> {cat}
          </Link>
        ))}
      </nav>

      <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8">
        <aside className="lg:sticky lg:top-28">
          <ProductFilter
            key={`${category || ""}-${keyword || ""}-${min || ""}-${max || ""}`}
            initialCategory={category || ""}
            initialKeyword={keyword || ""}
            initialMin={min || 0}
            initialMax={max || 50000000}
          />
        </aside>

        <section className="min-w-0 space-y-5">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700">
                <FireOutlined /> TechShop lựa chọn
              </p>
              <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
              <p className="mt-1 text-sm text-slate-500">
                {products.length} sản phẩm công nghệ chính hãng
              </p>
            </div>
            {isFiltered && (
              <Link
                href="/"
                className="text-sm font-semibold text-teal-700 hover:text-teal-900"
              >
                Xóa bộ lọc
              </Link>
            )}
          </div>

          {products.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-xl text-teal-700">
                <ThunderboltOutlined />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Chưa tìm thấy sản phẩm phù hợp
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Thử đổi từ khóa hoặc điều chỉnh bộ lọc để xem thêm sản phẩm.
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex h-10 items-center rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
