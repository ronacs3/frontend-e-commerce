"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCartItems } from "@/redux/slices/cartSlice"; // Action xóa giỏ hàng
import CheckoutSteps from "@/components/CheckoutSteps";
import { toast } from "react-toastify"; // (Tùy chọn) hoặc dùng alert

export default function PlaceOrderPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // Kiểm tra: Nếu chưa có địa chỉ giao hàng, đá về trang shipping
  useEffect(() => {
    if (!cart.shippingAddress.address) {
      router.push("/shipping");
    } else if (!cart.paymentMethod) {
      router.push("/payment");
    }
  }, [cart, router]);

  // --- LOGIC TÍNH TOÁN TIỀN (Helper) ---
  const addDecimals = (num) => {
    return Math.round(num * 100) / 100;
  };

  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Phí ship: Miễn phí nếu đơn > 10 triệu, ngược lại 30k
  const shippingPrice = itemsPrice > 10000000 ? 0 : 30000;

  // Thuế (Ví dụ 10% VAT)
  const taxPrice = addDecimals(Number((0.1 * itemsPrice).toFixed(0)));

  const totalPrice =
    Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice);

  // Format tiền tệ hiển thị
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // --- XỬ LÝ ĐẶT HÀNG ---
  const placeOrderHandler = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`, // Gửi kèm Token để xác thực
        },
        body: JSON.stringify({
          orderItems: cart.cartItems.map((item) => ({
            ...item,
            product: item._id, // Backend cần field tên là 'product' chứa ID
          })),
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Đặt hàng thành công!");
        dispatch(clearCartItems()); // Xóa giỏ hàng trong Redux/LocalStorage
        router.push("/"); // Quay về trang chủ (Hoặc trang chi tiết đơn hàng nếu bạn làm thêm)
      } else {
        alert(`Lỗi: ${data.message}`);
      }
    } catch (error) {
      alert("Lỗi kết nối tới server");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Giao hàng */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Giao hàng tới
            </h2>
            <p className="mb-1">
              <span className="font-semibold">Địa chỉ: </span>
              {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
              {cart.shippingAddress.country}
            </p>
          </div>

          {/* 2. Thanh toán */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Thanh toán</h2>
            <p>
              <span className="font-semibold">Phương thức: </span>{" "}
              {cart.paymentMethod}
            </p>
          </div>

          {/* 3. Sản phẩm */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Sản phẩm đặt mua
            </h2>
            {cart.cartItems.length === 0 ? (
              <p>Giỏ hàng trống</p>
            ) : (
              <div className="divide-y">
                {cart.cartItems.map((item, index) => (
                  <div key={index} className="flex items-center py-4">
                    <div className="w-16 h-16 flex-shrink-0 border rounded overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <Link
                        href={`/product/${item._id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {item.qty} x {formatPrice(item.price)} ={" "}
                        <span className="font-bold">
                          {formatPrice(item.qty * item.price)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: TỔNG KẾT & NÚT ĐẶT HÀNG */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow border sticky top-24">
            <h2 className="text-xl font-bold mb-4 border-b pb-4">
              Tổng đơn hàng
            </h2>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tiền hàng:</span>
                <span className="font-medium">{formatPrice(itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium">
                  {formatPrice(shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thuế (VAT 10%):</span>
                <span className="font-medium">{formatPrice(taxPrice)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center text-base">
                <span className="font-bold">Tổng cộng:</span>
                <span className="font-bold text-xl text-red-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
              disabled={cart.cartItems.length === 0}
              onClick={placeOrderHandler}
            >
              ĐẶT HÀNG NGAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
