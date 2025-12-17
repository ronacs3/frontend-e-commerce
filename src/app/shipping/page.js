"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { saveShippingAddress } from "@/redux/slices/cartSlice";
import CheckoutSteps from "@/components/CheckoutSteps";

export default function ShippingPage() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Điền sẵn dữ liệu nếu đã từng nhập
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const router = useRouter();

  const submitHandler = (e) => {
    e.preventDefault();
    // 1. Lưu vào Redux
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    // 2. Chuyển sang bước tiếp theo: Thanh toán
    router.push("/payment");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hiển thị thanh tiến trình: Đang ở bước 2 */}
      <CheckoutSteps step1 step2 />

      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow border">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Địa chỉ giao hàng
        </h1>

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Địa chỉ
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, tên đường..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Thành phố
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Hà Nội, TP.HCM..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Mã bưu điện
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="10000"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
              Quốc gia
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Việt Nam"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Tiếp tục
          </button>
        </form>
      </div>
    </div>
  );
}
