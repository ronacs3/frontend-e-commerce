import Link from "next/link";
import { ChevronLeft, ShoppingCart, Star } from "lucide-react";
import AddToCartBtn from "@/components/AddToCartBtn";

// Hàm lấy dữ liệu 1 sản phẩm
async function getProduct(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null; // Xử lý nếu không tìm thấy
  }

  return res.json();
}

// Format tiền
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default async function ProductDetailPage({ params }) {
  // params.id chính là ID trên URL
  const product = await getProduct(params.id);

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
    <div className="max-w-6xl mx-auto">
      {/* Nút quay lại */}
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 mb-6 hover:text-blue-600"
      >
        <ChevronLeft size={20} /> Quay lại mua sắm
      </Link>

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

          {/* Rating giả lập */}
          <div className="flex items-center mt-2 mb-4">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} fill="currentColor" />
              ))}
            </div>
            <span className="text-gray-500 text-sm ml-2">(12 đánh giá)</span>
          </div>

          <div className="text-3xl font-bold text-red-600 mb-6">
            {formatPrice(product.price)}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Trạng thái kho hàng */}
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

          {/* Nút thêm vào giỏ */}
          <AddToCartBtn product={product} />
          {/* <button
            disabled={product.countInStock === 0}
            className={`w-full py-4 rounded-lg flex items-center justify-center font-bold text-lg transition-colors ${
              product.countInStock > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="mr-2" />
            {product.countInStock > 0 ? "Thêm vào giỏ hàng" : "Tạm hết hàng"}
          </button> */}
        </div>
      </div>
    </div>
  );
}
