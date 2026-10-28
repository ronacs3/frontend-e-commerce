import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";
import Link from "next/link";
import ProductActionButtons from "@/components/ProductActionButtons";
import ProductReviews from "@/components/ProductReviews";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import { Rate, Tag } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { formatCurrency } from "@/utils/formatters";

async function getRelatedProducts(id) {
  try {
    const res = await apiFetch(
      `${API_BASE_URL}/products/${id}/related`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ProductDetails({ product }) {
  const relatedProducts = await getRelatedProducts(product._id);

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Navigation Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition"
        >
          <ArrowLeftOutlined /> Quay lại mua sắm
        </Link>
        <div className="text-xs text-slate-400 font-medium">
          Mã sản phẩm: <span className="font-mono text-slate-600">{product._id?.substring(0, 8)}</span>
        </div>
      </div>

      {/* Main Product Display Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Product Image Preview */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full h-[420px] bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-center overflow-hidden">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="object-contain max-h-full transition-transform duration-300 hover:scale-105"
            />
            {product.isPreOrder && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md">
                Xuất hàng đặt trước
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Product Specs & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs">
                {product.category || "Công nghệ"}
              </span>
              {product.brand && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-xs">
                  {product.brand}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-3 mt-3">
              <Rate disabled allowHalf value={product.rating || 5} className="text-amber-400 text-sm" />
              <span className="text-xs font-bold text-slate-700">
                {product.rating ? Number(product.rating).toFixed(1) : "5.0"}
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500">
                {product.numReviews || 0} Đánh giá từ người dùng
              </span>
            </div>
          </div>

          {/* Price Header */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 flex items-baseline gap-3">
            <span className="text-3xl font-black text-rose-600 tracking-tight">
              {formatCurrency(product.price)}
            </span>
            <span className="text-xs text-indigo-600 font-bold bg-white px-2.5 py-1 rounded-lg shadow-xs">
              Đã gồm VAT
            </span>
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Mô tả sản phẩm</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>
          </div>

          {/* Stock availability tag */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Tình trạng:</span>
            {product.countInStock > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                <CheckCircleOutlined /> Còn hàng ({product.countInStock} sản phẩm)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">
                <CloseCircleOutlined /> Hết hàng tạm thời
              </span>
            )}
          </div>

          {/* Service Perks Bar */}
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <RocketOutlined className="text-indigo-600 text-base" />
              <span>Giao hàng 2H</span>
            </div>
            <div className="flex items-center gap-2">
              <SafetyCertificateOutlined className="text-indigo-600 text-base" />
              <span>Bảo hành 24T</span>
            </div>
            <div className="flex items-center gap-2">
              <SyncOutlined className="text-indigo-600 text-base" />
              <span>1 Đổi 1 30 Ngày</span>
            </div>
          </div>

          {/* Action Buttons */}
          <ProductActionButtons product={product} />
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ProductReviews product={product} />

      {/* Related Products Section */}
      <div className="space-y-6 pt-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Sản phẩm cùng danh mục</span>
        </h2>

        {relatedProducts.length === 0 ? (
          <p className="text-slate-400 text-sm italic">Chưa có sản phẩm liên quan khác.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
