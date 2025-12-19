"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { notification } from "antd";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty: 1 }));

    // ✅ FIX: title -> message
    notification.success({
      title: "Thành công",
      description: `Đã thêm ${product.name} vào giỏ hàng của bạn.`,
      placement: "topRight",
      duration: 2,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/product/${product._id}`}>
        <div className="relative h-64 w-full">
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

          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              product.countInStock > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
