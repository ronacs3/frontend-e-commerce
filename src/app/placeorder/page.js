"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCartItems } from "@/redux/slices/cartSlice";
import CheckoutSteps from "@/components/CheckoutSteps";
// Import Ant Design components
import { Input, Button, message } from "antd";

export default function PlaceOrderPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // --- STATE CHO COUPON ---
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0); // % giảm giá
  const [applicableCategories, setApplicableCategories] = useState([]); // <--- STATE MỚI: Danh mục áp dụng
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  // Kiểm tra: Nếu chưa có địa chỉ hoặc phương thức thanh toán -> Redirect
  useEffect(() => {
    if (!cart.shippingAddress.address) {
      router.push("/shipping");
    } else if (!cart.paymentMethod) {
      router.push("/payment");
    }
  }, [cart, router]);

  // --- LOGIC TÍNH TOÁN TIỀN ---
  const addDecimals = (num) => {
    return Math.round(num * 100) / 100;
  };

  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Phí ship: Miễn phí nếu đơn > 10 triệu, ngược lại 30k
  const shippingPrice = itemsPrice > 10000000 ? 0 : 30000;

  // Thuế (10% VAT)
  const taxPrice = addDecimals(Number((0.1 * itemsPrice).toFixed(0)));

  // --- LOGIC MỚI: TÍNH TIỀN GIẢM GIÁ THEO TỪNG SẢN PHẨM ---
  const calculateDiscount = () => {
    if (!isCouponApplied || discountPercent === 0) return 0;

    let totalDiscount = 0;

    cart.cartItems.forEach((item) => {
      // Điều kiện 1: Mã áp dụng toàn sàn (mảng danh mục rỗng)
      const isGlobal = applicableCategories.length === 0;

      // Điều kiện 2: Sản phẩm thuộc danh mục được phép
      // (Lưu ý: item.category phải tồn tại trong object sản phẩm ở Redux)
      const isMatch = applicableCategories.includes(item.category);

      if (isGlobal || isMatch) {
        // Chỉ tính giảm giá cho món hàng này
        totalDiscount += (item.price * item.qty * discountPercent) / 100;
      }
    });

    return totalDiscount;
  };

  const discountAmount = addDecimals(calculateDiscount());

  // Tổng tiền cuối cùng = Tiền hàng + Ship + Thuế - Giảm giá
  const totalPrice =
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice) -
    Number(discountAmount);

  // Format tiền tệ hiển thị
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // --- HÀM XỬ LÝ ÁP DỤNG COUPON ---
  const applyCouponHandler = async () => {
    if (!couponCode.trim()) {
      message.error("Vui lòng nhập mã giảm giá");
      return;
    }
    setLoadingCoupon(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: couponCode,
            cartItems: cart.cartItems, // Gửi kèm giỏ hàng để Backend check hợp lệ
          }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setDiscountPercent(data.discount);
        setApplicableCategories(data.applicableCategories || []); // <--- LƯU DANH MỤC TỪ API
        setIsCouponApplied(true);
        message.success(
          `Áp dụng mã ${data.code} giảm ${data.discount}% thành công!`
        );
      } else {
        message.error(data.message || "Mã không hợp lệ hoặc đã hết hạn");
        setDiscountPercent(0);
        setApplicableCategories([]);
        setIsCouponApplied(false);
      }
    } catch (error) {
      message.error("Lỗi kết nối kiểm tra mã");
    } finally {
      setLoadingCoupon(false);
    }
  };

  // --- XỬ LÝ ĐẶT HÀNG ---
  const placeOrderHandler = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems: cart.cartItems.map((item) => ({
            ...item,
            product: item._id,
          })),
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice, // Giá cuối cùng (đã trừ discount chính xác)
          couponCode: isCouponApplied ? couponCode : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        message.success("Đặt hàng thành công!");
        dispatch(clearCartItems());
        router.push(`/order/${data._id}`);
      } else {
        message.error(`Lỗi: ${data.message}`);
      }
    } catch (error) {
      message.error("Lỗi kết nối tới server");
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
                      {/* Hiển thị tag nếu sản phẩm này được giảm giá */}
                      {isCouponApplied &&
                        (applicableCategories.length === 0 ||
                          applicableCategories.includes(item.category)) && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded mt-1 inline-block border border-green-200">
                            Được giảm {discountPercent}%
                          </span>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: TỔNG KẾT & MÃ GIẢM GIÁ */}
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

              {/* HIỂN THỊ GIẢM GIÁ NẾU CÓ */}
              {isCouponApplied && (
                <div className="flex justify-between text-green-600 font-bold bg-green-50 p-2 rounded border border-green-200">
                  <span>Mã giảm ({discountPercent}%):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              {/* INPUT NHẬP MÃ GIẢM GIÁ */}
              <div className="border-t pt-4 mt-4">
                <p className="font-medium mb-2 text-gray-700">Mã khuyến mãi</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập mã (VD: SALE10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isCouponApplied || cart.cartItems.length === 0}
                  />
                  <Button
                    type="primary"
                    onClick={applyCouponHandler}
                    loading={loadingCoupon}
                    disabled={isCouponApplied || cart.cartItems.length === 0}
                  >
                    {isCouponApplied ? "Đã dùng" : "Áp dụng"}
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4 mt-4 flex justify-between items-center text-base">
                <span className="font-bold">Tổng thanh toán:</span>
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
