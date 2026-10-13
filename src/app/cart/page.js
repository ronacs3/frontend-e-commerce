"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import { Table, Button, Select, Empty, Spin, Input } from "antd";
import { DeleteOutlined, ArrowLeftOutlined, ShoppingCartOutlined, SafetyCertificateOutlined, TagOutlined } from "@ant-design/icons";
import ProductImage from "@/components/ProductImage";
import { formatCurrency } from "@/utils/formatters";
import { useMounted } from "@/utils/useMounted";

export default function CartPage() {
  const mounted = useMounted();
  const [couponCode, setCouponCode] = useState("");

  const dispatch = useDispatch();
  const { cartItems, itemsPrice, shippingPrice, totalPrice } = useSelector(
    (state) => state.cart
  );

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty: Number(qty) }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-4xl shadow-inner">
          <ShoppingCartOutlined />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800">Giỏ hàng của bạn đang trống</h2>
          <p className="text-slate-500 text-sm">Hãy tham khảo danh sách sản phẩm tuyệt vời của TechShop để lựa chọn ngay!</p>
        </div>
        <Link href="/">
          <Button
            type="primary"
            size="large"
            icon={<ArrowLeftOutlined />}
            className="bg-indigo-600 font-bold rounded-xl h-12 px-6 shadow-md shadow-indigo-600/20"
          >
            Quay lại mua sắm ngay
          </Button>
        </Link>
      </div>
    );
  }

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "image",
      render: (img, record) => (
        <div className="flex items-center gap-4 py-2">
          <div className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-200/80 p-2 flex items-center justify-center shrink-0">
            <ProductImage
              src={img}
              alt={record.name}
              className="max-h-full object-contain"
            />
          </div>
          <div className="space-y-1">
            <Link
              href={`/product/${record._id}`}
              className="font-bold text-slate-800 hover:text-indigo-600 transition text-sm line-clamp-2"
            >
              {record.name}
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {record.category}
              </span>
              {record.isPreOrder && (
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  Đặt trước
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      align: "right",
      render: (price) => (
        <span className="font-bold text-slate-800 text-sm">
          {formatCurrency(price)}
        </span>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "qty",
      align: "center",
      render: (qty, record) => (
        <Select
          value={qty}
          style={{ width: 80 }}
          onChange={(value) => addToCartHandler(record, value)}
          className="rounded-lg font-bold"
        >
          {[...Array(Math.max(record.countInStock || 1, 10)).keys()].map((x) => (
            <Select.Option key={x + 1} value={x + 1}>
              {x + 1}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Thành tiền",
      align: "right",
      render: (_, record) => (
        <span className="font-black text-rose-600 text-base">
          {formatCurrency(record.price * record.qty)}
        </span>
      ),
    },
    {
      title: "",
      align: "center",
      render: (_, record) => (
        <Button
          danger
          type="text"
          icon={<DeleteOutlined className="text-lg" />}
          onClick={() => removeFromCartHandler(record._id)}
          className="hover:bg-rose-50 rounded-lg"
        />
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Giỏ Hàng Của Bạn
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Có <span className="font-bold text-indigo-600">{cartItems.reduce((a, c) => a + c.qty, 0)}</span> sản phẩm trong giỏ hàng
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition"
        >
          <ArrowLeftOutlined /> Tiếp tục mua sắm
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <Table
            dataSource={cartItems}
            columns={columns}
            rowKey="_id"
            pagination={false}
            className="custom-cart-table"
          />
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <h3 className="text-lg font-extrabold text-slate-800 border-b border-slate-100 pb-3">
              Tóm Tắt Đơn Hàng
            </h3>

            {/* Promo Code Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Mã giảm giá / Voucher
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã TECH2026..."
                  prefix={<TagOutlined className="text-slate-400" />}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="rounded-xl border-slate-200"
                />
                <Button className="rounded-xl font-bold bg-slate-900 text-white hover:!bg-slate-800 hover:!text-white border-none">
                  Áp dụng
                </Button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính tiền hàng:</span>
                <span className="font-bold text-slate-800">{formatCurrency(itemsPrice)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Phí vận chuyển:</span>
                <span className="font-bold">
                  {shippingPrice === 0 ? (
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs">
                      Miễn phí
                    </span>
                  ) : (
                    formatCurrency(shippingPrice)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-base font-black text-slate-900 block">Tổng cộng thanh toán:</span>
                  <span className="text-[11px] text-slate-400">(Đã bao gồm thuế VAT)</span>
                </div>
                <span className="text-2xl font-black text-rose-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <Link href="/shipping" className="block pt-2">
              <Button
                type="primary"
                block
                size="large"
                className="bg-indigo-600 hover:!bg-indigo-700 font-bold rounded-2xl h-13 text-base shadow-lg shadow-indigo-600/30"
              >
                Tiến Hành Thanh Toán
              </Button>
            </Link>

            {/* Trust badge */}
            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
              <SafetyCertificateOutlined className="text-emerald-500 text-base" />
              <span>Thanh toán an toàn 100% & Bảo mật</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
