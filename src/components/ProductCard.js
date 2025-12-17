import Link from "next/link";

export default function ProductCard({ product }) {
  // Format tiền tệ Việt Nam
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/product/${product._id}`}>
        <div className="relative h-64 w-full">
          {/* Lưu ý: Trong thực tế nên dùng component Image của Next.js */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 truncate">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1">{product.category}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-red-600">
            {formatPrice(product.price)}
          </span>
          <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
