import Link from "next/link";
import { ChevronLeft } from "lucide-react";
// 1. Thay thế AddToCartBtn bằng component mới
import ProductActionButtons from "@/components/ProductActionButtons";
import ProductReviews from "@/components/ProductReviews";
import { Rate } from "antd";
import ProductImage from "@/components/ProductImage";

/* ================= DEFAULT IMAGE ================= */
const DEFAULT_IMAGE = "/images/default-image.jpg";

/* ================= RELATED ================= */
async function getRelatedProducts(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}/related`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/* ================= PRICE ================= */
const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

/* ================= COMPONENT ================= */
export default async function ProductDetails({ product }) {
  const relatedProducts = await getRelatedProducts(product._id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ===== BACK ===== */}
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 mb-6 hover:text-blue-600"
      >
        <ChevronLeft size={20} />
        Quay lại mua sắm
      </Link>

      {/* ===== PRODUCT ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-lg shadow-sm">
        {/* ===== IMAGE ===== */}
        <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="object-contain max-h-full"
          />
        </div>

        {/* ===== INFO ===== */}
        <div>
          <p className="text-sm text-gray-500 uppercase">{product.category}</p>

          <h1 className="text-3xl font-bold mt-2">{product.name}</h1>

          <div className="flex items-center mt-2 mb-4">
            <Rate disabled allowHalf value={product.rating} />
            <span className="ml-2 text-sm text-gray-500">
              ({product.numReviews} đánh giá)
            </span>
          </div>

          <div className="text-3xl font-bold text-red-600 mb-6">
            {formatPrice(product.price)}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <span
            className={`inline-block px-3 py-1 rounded-full text-sm ${
              product.countInStock > 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.countInStock > 0 ? "Còn hàng" : "Hết hàng"}
          </span>

          {/* 2. SỬ DỤNG COMPONENT NÚT BẤM MỚI Ở ĐÂY */}
          <div className="mt-6">
            <ProductActionButtons product={product} />
          </div>
        </div>
      </div>

      {/* ===== REVIEWS ===== */}
      <ProductReviews product={product} />

      {/* ===== RELATED ===== */}
      <div className="mt-16 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm cùng danh mục</h2>

        {relatedProducts.length === 0 ? (
          <p className="text-gray-500">Chưa có sản phẩm liên quan.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <Link key={item._id} href={`/product/${item._id}`}>
                <div className="bg-white border rounded-lg hover:shadow-md transition">
                  <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                    <ProductImage
                      src={item.image} // <-- Đã sửa: dùng item.image thay vì product.image
                      alt={item.name}
                      className="object-contain max-h-full"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-medium line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="mt-2 text-red-600 font-bold">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
