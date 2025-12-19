"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { savePaymentMethod } from "@/redux/slices/cartSlice";
import CheckoutSteps from "@/components/CheckoutSteps";

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { shippingAddress } = useSelector((state) => state.cart);

  // Nếu chưa nhập địa chỉ thì đá về trang shipping
  useEffect(() => {
    if (!shippingAddress.address) {
      router.push("/shipping");
    }
  }, [shippingAddress, router]);

  const [paymentMethod, setPaymentMethod] = useState("PayPal"); // Mặc định

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    router.push("/placeorder"); // Chuyển sang bước cuối
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Bước 3 */}
      <CheckoutSteps step1 step2 />

      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow border">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Phương thức thanh toán
        </h1>

        <form onSubmit={submitHandler}>
          <div className="mb-6 space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === "PayPal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="PayPal"
                className="ml-3 text-gray-700 font-medium cursor-pointer"
              >
                PayPal hoặc Thẻ tín dụng
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="COD"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="COD"
                className="ml-3 text-gray-700 font-medium cursor-pointer"
              >
                Thanh toán khi nhận hàng (COD)
              </label>
            </div>
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
