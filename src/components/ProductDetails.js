import Link from "next/link";
import { ChevronLeft } from "lucide-react"; // Bỏ Star, dùng Rate của Antd cho đẹp
import AddToCartBtn from "@/components/AddToCartBtn";
import ProductReviews from "@/components/ProductReviews"; // <--- IMPORT COMPONENT VỪA TẠO
import { Rate } from "antd"; // Import Rate để hiển thị sao read-only

// 1. Hàm lấy sản phẩm liên quan
async function getRelatedProducts(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}/related`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

// Hàm lấy dữ liệu 1 sản phẩm
async function getProduct(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

// Format tiền
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default async function ProductDetails({ params }) {
  const { id } = await params;

  // Gọi API song song
  const productData = getProduct(id);
  const relatedData = getRelatedProducts(id);
  const [product, relatedProducts] = await Promise.all([
    productData,
    relatedData,
  ]);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Không tìm thấy sản phẩm</h2>
        <Link href="/" className="text-blue-500 hover:underline">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Nút quay lại */}
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 mb-6 hover:text-blue-600"
      >
        <ChevronLeft size={20} /> Quay lại mua sắm
      </Link>

      {/* --- PHẦN 1: CHI TIẾT SẢN PHẨM --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-lg shadow-sm">
        {/* Cột Trái: Ảnh */}
        <div className="relative h-[400px] w-full border rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="object-contain max-h-full max-w-full"
          />
        </div>

        {/* Cột Phải: Thông tin */}
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            {product.name}
          </h1>

          {/* HIỂN THỊ RATING THẬT */}
          <div className="flex items-center mt-2 mb-4">
            <Rate disabled allowHalf value={product.rating} />
            <span className="text-gray-500 text-sm ml-2">
              ({product.numReviews} đánh giá)
            </span>
          </div>

          <div className="text-3xl font-bold text-red-600 mb-6">
            {formatPrice(product.price)}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="mb-6">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.countInStock > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.countInStock > 0 ? "Còn hàng" : "Hết hàng"}
            </span>
          </div>

          <AddToCartBtn product={product} />
        </div>
      </div>

      {/* --- PHẦN 2: ĐÁNH GIÁ (MỚI THÊM VÀO) --- */}
      <ProductReviews product={product} />

      {/* --- PHẦN 3: SẢN PHẨM LIÊN QUAN --- */}
      <div className="mt-16 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Sản phẩm cùng danh mục
        </h2>

        {relatedProducts.length === 0 ? (
          <p className="text-gray-500">Chưa có sản phẩm liên quan nào.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <Link
                key={item._id}
                href={`/product/${item._id}`}
                className="group"
              >
                <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-48 w-full p-4 flex items-center justify-center bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px]">
                      {item.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-red-600 font-bold">
                        {formatPrice(item.price)}
                      </span>
                      {item.countInStock === 0 && (
                        <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded">
                          Hết hàng
                        </span>
                      )}
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
