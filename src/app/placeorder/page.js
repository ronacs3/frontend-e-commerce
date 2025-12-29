"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCartItems } from "@/redux/slices/cartSlice";
import CheckoutSteps from "@/components/CheckoutSteps";
import ProductImage from "@/components/ProductImage";

// Ant Design
import {
  Card,
  Typography,
  Button,
  Input,
  Tag,
  Divider,
  Flex,
  message,
  Spin,
} from "antd";

const { Text } = Typography;

export default function PlaceOrderPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  /* ================= MOUNTED GUARD (FIX HYDRATION) ================= */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= COUPON STATE ================= */
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [applicableCategories, setApplicableCategories] = useState([]);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  /* ================= GUARD ROUTE ================= */
  useEffect(() => {
    if (!mounted) return;

    if (!cart.shippingAddress?.address) {
      router.push("/shipping");
    } else if (!cart.paymentMethod) {
      router.push("/payment");
    }
  }, [mounted, cart, router]);

  /* ================= BLOCK RENDER UNTIL CLIENT READY ================= */
  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  /* ================= PRICE LOGIC ================= */
  const round = (num) => Math.round(num * 100) / 100;

  const itemsPrice = round(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  const shippingPrice = itemsPrice > 10000000 ? 0 : 30000;
  const taxPrice = round((itemsPrice * 10) / 100);

  const calculateDiscount = () => {
    if (!isCouponApplied) return 0;

    return cart.cartItems.reduce((acc, item) => {
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

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  /* ================= APPLY COUPON ================= */
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
            cartItems: cart.cartItems,
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
      message.error("Lỗi kiểm tra mã");
    } finally {
      setLoadingCoupon(false);
    }
  };

  /* ================= PLACE ORDER ================= */
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
          totalPrice,
          couponCode: isCouponApplied ? couponCode : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        message.success("Đặt hàng thành công");
        dispatch(clearCartItems());
        router.push(`/order/${data._id}`);
      } else {
        message.error(data.message);
      }
    } catch {
      message.error("Lỗi kết nối server");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="flex flex-col gap-3 lg:col-span-2 space-y-6">
          <Card title="Thông tin giao hàng" variant="outlined">
            <Text className="block">
              <b>Người nhận:</b> {cart.shippingAddress.fullName}
            </Text>
            <Text className="block">
              <b>Số điện thoại:</b> {cart.shippingAddress.phone}
            </Text>
            <Divider />
            <Text className="block">
              <b>Địa chỉ:</b> {cart.shippingAddress.address},{" "}
              {cart.shippingAddress.city}, {cart.shippingAddress.country}
            </Text>
          </Card>

          <Card title="Thanh toán" variant="outlined">
            <Text>
              <b>Phương thức:</b> {cart.paymentMethod}
            </Text>
          </Card>

          <Card title="Sản phẩm" variant="outlined">
            {cart.cartItems.length === 0 ? (
              <Text>Giỏ hàng trống</Text>
            ) : (
              <div className="space-y-4">
                {cart.cartItems.map((item) => (
                  <Flex
                    key={item._id}
                    gap={16}
                    align="flex-start"
                    className="border-b pb-4 last:border-b-0"
                  >
                    <div className="w-16 h-16 border rounded overflow-hidden">
                      <ProductImage src={item.image} alt={item.name} />
                    </div>

                    <div className="flex-1">
                      <Link
                        href={`/product/${item._id}`}
                        className="text-blue-600 font-medium"
                      >
                        {item.name}
                      </Link>

                      <Text className="block text-sm">
                        {item.qty} × {formatPrice(item.price)} ={" "}
                        <b>{formatPrice(item.qty * item.price)}</b>
                      </Text>

                      {isCouponApplied &&
                        (applicableCategories.length === 0 ||
                          applicableCategories.includes(item.category)) && (
                          <Tag color="green" className="mt-1">
                            Giảm {discountPercent}%
                          </Tag>
                        )}
                    </div>
                  </Flex>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT */}
        <div>
          <Card title="Tổng đơn hàng" variant="outlined">
            <div className="space-y-3 text-sm">
              <Flex justify="space-between">
                <Text>Tiền hàng</Text>
                <Text>{formatPrice(itemsPrice)}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text>Vận chuyển</Text>
                <Text>{formatPrice(shippingPrice)}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text>Thuế (10%)</Text>
                <Text>{formatPrice(taxPrice)}</Text>
              </Flex>

              {isCouponApplied && (
                <Flex justify="space-between" className="text-green-600">
                  <Text>Mã giảm ({discountPercent}%)</Text>
                  <Text>-{formatPrice(discountAmount)}</Text>
                </Flex>
              )}

              <Divider />

              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã giảm giá"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={isCouponApplied}
                />
                <Button
                  type="primary"
                  loading={loadingCoupon}
                  onClick={applyCouponHandler}
                  disabled={isCouponApplied}
                >
                  {isCouponApplied ? "Đã áp dụng" : "Áp dụng"}
                </Button>
              </div>

              <Divider />

              <Flex justify="space-between" className="text-lg font-bold">
                <Text>Tổng thanh toán</Text>
                <Text type="danger">{formatPrice(totalPrice)}</Text>
              </Flex>

              <Button
                type="primary"
                size="large"
                block
                disabled={cart.cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                ĐẶT HÀNG NGAY
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
