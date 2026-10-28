"use client";

import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCartItems } from "@/redux/slices/cartSlice";
import CheckoutSteps from "@/components/CheckoutSteps";
import ProductImage from "@/components/ProductImage";
import { Button, Input, Tag, Spin, message } from "antd";
import { EnvironmentOutlined, CreditCardOutlined, TagOutlined, ShoppingCartOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { formatCurrency } from "@/utils/formatters";

export default function PlaceOrderPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const cart = useSelector((state) => state.cart || {});
  const { userInfo } = useSelector((state) => state.auth || {});

  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [applicableCategories, setApplicableCategories] = useState([]);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!cart.shippingAddress?.address) {
      router.push("/shipping");
    } else if (!cart.paymentMethod) {
      router.push("/payment");
    }
  }, [mounted, cart, router]);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  const round = (num) => Math.round(num * 100) / 100;

  const itemsPrice = round(
    (cart.cartItems || []).reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  const shippingPrice = itemsPrice > 10000000 ? 0 : 30000;
  const taxPrice = round((itemsPrice * 10) / 100);

  const calculateDiscount = () => {
    if (!isCouponApplied) return 0;
    return (cart.cartItems || []).reduce((acc, item) => {
      const isGlobal = applicableCategories.length === 0;
      const isMatch = applicableCategories.includes(item.category);
      if (isGlobal || isMatch) {
        return acc + (item.price * item.qty * discountPercent) / 100;
      }
      return acc;
    }, 0);
  };

  const discountAmount = round(calculateDiscount());
  const totalPrice = itemsPrice + shippingPrice + taxPrice - discountAmount;

  const applyCouponHandler = async () => {
    if (!couponCode.trim()) {
      message.error("Vui lòng nhập mã giảm giá");
      return;
    }

    setLoadingCoupon(true);
    try {
      const res = await apiFetch(
        `${API_BASE_URL}/coupons/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: couponCode,
            cartItems: cart.cartItems.map((item) => ({ product: item._id })),
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setDiscountPercent(data.discount);
        setApplicableCategories(data.applicableCategories || []);
        setIsCouponApplied(true);
        message.success(`Áp dụng mã ${data.code} thành công`);
      } else {
        message.error(data.message || "Mã không hợp lệ");
      }
    } catch {
      message.error("Lỗi kiểm tra mã giảm giá");
    } finally {
      setLoadingCoupon(false);
    }
  };

  const placeOrderHandler = async () => {
    if (!userInfo?.token) {
      router.push("/login?redirect=/placeorder");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiFetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems: cart.cartItems.map((item) => ({
            product: item._id,
            qty: item.qty,
          })),
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          ...(isCouponApplied ? { couponCode } : {}),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        message.success("Đặt hàng thành công!");
        dispatch(clearCartItems());
        router.push(`/order/${data._id}`);
      } else {
        message.error(data.message || "Không thể khởi tạo đơn hàng");
      }
    } catch {
      message.error("Lỗi kết nối tới máy chủ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <CheckoutSteps step1 step2 step3 />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SUMMARY DETAILS */}
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping Address Summary */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2">
                <EnvironmentOutlined className="text-indigo-600" />
                <span>Địa chỉ nhận hàng</span>
              </span>
              <Link href="/shipping" className="text-xs text-indigo-600 font-bold hover:underline">
                Thay đổi
              </Link>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700 pt-1">
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Người nhận</span>
                <span className="font-bold">{cart.shippingAddress?.fullName}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Số điện thoại</span>
                <span className="font-bold">{cart.shippingAddress?.phone}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-slate-400 block font-semibold">Địa chỉ giao hàng</span>
                <span className="font-medium text-slate-800">
                  {cart.shippingAddress?.address}, {cart.shippingAddress?.city}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Summary */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2">
                <CreditCardOutlined className="text-indigo-600" />
                <span>Phương thức thanh toán</span>
              </span>
              <Link href="/payment" className="text-xs text-indigo-600 font-bold hover:underline">
                Thay đổi
              </Link>
            </h3>
            <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs">
                {cart.paymentMethod === "COD" && "Thanh toán khi nhận hàng (COD)"}
                {cart.paymentMethod === "PayPal" && "Thanh toán qua PayPal / Thẻ quốc tế"}
                {cart.paymentMethod === "BankTransfer" && "Chuyển khoản ngân hàng qua mã QR"}
              </span>
            </div>
          </div>

          {/* Items List Summary */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShoppingCartOutlined className="text-indigo-600" />
              <span>Sản phẩm đơn hàng ({cart.cartItems?.length || 0})</span>
            </h3>

            <div className="space-y-4">
              {(cart.cartItems || []).map((item) => (
                <div key={item._id} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-b-0">
                  <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-200/80 p-2 flex items-center justify-center shrink-0">
                    <ProductImage src={item.image} alt={item.name} className="max-h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item._id}`} className="font-bold text-slate-800 hover:text-indigo-600 text-sm truncate block">
                      {item.name}
                    </Link>
                    <span className="text-xs text-slate-400">
                      Số lượng: <span className="font-bold text-slate-700">{item.qty}</span> × {formatCurrency(item.price)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-rose-600 text-sm block">
                      {formatCurrency(item.qty * item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT ORDER TOTAL CARD */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Tổng Cộng Đơn Hàng
            </h3>

            {/* Voucher Coupon Section */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Mã giảm giá
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã TECH2026"
                  prefix={<TagOutlined className="text-slate-400" />}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={isCouponApplied}
                  className="rounded-xl border-slate-200"
                />
                <Button
                  type="primary"
                  loading={loadingCoupon}
                  onClick={applyCouponHandler}
                  disabled={isCouponApplied}
                  className="rounded-xl font-bold bg-slate-900 text-white hover:!bg-slate-800 border-none"
                >
                  {isCouponApplied ? "Đã dùng" : "Áp dụng"}
                </Button>
              </div>
            </div>

            {/* Detailed Price Breakdown */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính tiền hàng:</span>
                <span className="font-bold text-slate-800">{formatCurrency(itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí vận chuyển:</span>
                <span className="font-bold">
                  {shippingPrice === 0 ? <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">Miễn phí</span> : formatCurrency(shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Thuế giá trị gia tăng (10%):</span>
                <span className="font-bold text-slate-800">{formatCurrency(taxPrice)}</span>
              </div>

              {isCouponApplied && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Khuyến mãi voucher ({discountPercent}%):</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-base font-black text-slate-900">Tổng thanh toán:</span>
                <span className="text-2xl font-black text-rose-600">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <Button
              type="primary"
              block
              size="large"
              loading={submitting}
              disabled={cart.cartItems?.length === 0 || submitting}
              onClick={placeOrderHandler}
              className="bg-emerald-600 hover:!bg-emerald-700 font-extrabold rounded-2xl h-13 text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <CheckCircleOutlined />
              <span>XÁC NHẬN ĐẶT HÀNG NGAY</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
