"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import { Trash2, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const dispatch = useDispatch();
  // Lấy dữ liệu từ Redux Store
  const { cartItems, itemsPrice, shippingPrice, totalPrice } = useSelector(
    (state) => state.cart
  );

  // Hàm thay đổi số lượng
  const addToCartHandler = (product, qty) => {
    const quantity = Number(qty);
    // Gọi action addToCart để cập nhật số lượng mới (Logic trong slice sẽ tự đè cái cũ)
    dispatch(addToCart({ ...product, qty: quantity }));
  };

  // Hàm xóa sản phẩm
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  // Format tiền tệ
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Trường hợp giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 mb-8">
          Hãy thêm vài món đồ công nghệ xịn sò vào nhé!
        </p>
        <Link
          href="/"
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <ArrowLeft className="mr-2" size={20} /> Quay lại mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Giỏ hàng ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 mb-4 rounded-lg shadow-sm border"
            >
              {/* Ảnh */}
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Tên & Danh mục */}
              <div className="flex-grow text-center md:text-left">
                <Link
                  href={`/product/${item._id}`}
                  className="font-semibold text-lg hover:text-blue-600"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>

              {/* Giá */}
              <div className="font-bold text-gray-700">
                {formatPrice(item.price)}
              </div>

              {/* Chọn số lượng */}
              <div className="flex items-center">
                <select
                  value={item.qty}
                  onChange={(e) => addToCartHandler(item, e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                >
                  {/* Tạo danh sách option từ 1 đến số lượng tồn kho (countInStock) */}
                  {[...Array(item.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nút xóa */}
              <button
                onClick={() => removeFromCartHandler(item._id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Cộng giỏ hàng
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">{formatPrice(itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium">
                  {shippingPrice === 0 ? (
                    <span className="text-green-600">Miễn phí</span>
                  ) : (
                    formatPrice(shippingPrice)
                  )}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-bold text-lg">Tổng cộng:</span>
                <span className="font-bold text-xl text-red-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
            <Link href="/shipping" className="block w-full">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
                Tiến hành thanh toán
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
