"use client";

import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { ShoppingCart } from "lucide-react";
import { notification } from "antd";

export default function AddToCartBtn({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    // Dispatch action thêm vào giỏ với số lượng mặc định là 1
    dispatch(addToCart({ ...product, qty: 1 }));
    notification.success({
      title: "Thành công",
      description: `Đã thêm ${product.name} vào giỏ hàng của bạn.`,
      placement: "topRight", // Hiện ở góc phải
      duration: 2, // Tự tắt sau 2 giây
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={product.countInStock === 0}
      className={`w-full py-4 rounded-lg flex items-center justify-center font-bold text-lg transition-colors ${
        product.countInStock > 0
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      <ShoppingCart className="mr-2" />
      {product.countInStock > 0 ? "Thêm vào giỏ hàng" : "Tạm hết hàng"}
    </button>
  );
}
