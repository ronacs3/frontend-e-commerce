"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { addToCart } from "@/redux/slices/cartSlice";
import { addToCompare } from "@/redux/slices/compareSlice";
import { Button, InputNumber, message, Tooltip } from "antd";
import { ShoppingCartOutlined, SwapOutlined, ThunderboltOutlined, CalendarOutlined } from "@ant-design/icons";

import useCartFeedback from "@/utils/useCartFeedback";

export default function ProductActionButtons({ product }) {
  const dispatch = useDispatch();
  const { adding, feedback } = useCartFeedback();
  const router = useRouter();
  const [qty, setQty] = useState(1);

  const handleAddToCart = (event) => {
    feedback(event.currentTarget, product.image);
    dispatch(addToCart({ ...product, qty }));
    message.success(
      product.isPreOrder
        ? `Đã thêm suất đặt trước "${product.name}" vào giỏ hàng`
        : `Đã thêm ${qty} sản phẩm vào giỏ hàng`
    );
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ ...product, qty }));
    router.push("/cart");
  };

  const handleCompare = () => {
    dispatch(addToCompare(product));
  };

  const isOutOfStock = product.countInStock === 0;

  return (
    <div className="space-y-5 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
      {/* Quantity Select */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold text-slate-700">Số lượng:</span>
        <InputNumber
          min={1}
          max={product.countInStock || 1}
          value={qty}
          onChange={(v) => setQty(v || 1)}
          disabled={isOutOfStock}
          size="large"
          className="rounded-xl w-28 border-slate-300 font-bold"
        />
        <span className="text-xs text-slate-400">
          ({product.countInStock} sản phẩm có sẵn)
        </span>
      </div>

      {/* Buttons Action Group */}
      <div className="flex flex-wrap gap-3">
        <Button
          type={product.isPreOrder ? "default" : "primary"}
          size="large"
          icon={product.isPreOrder ? <CalendarOutlined /> : <ShoppingCartOutlined />}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 font-bold rounded-xl h-12 text-sm ${
            product.isPreOrder
              ? "bg-amber-500 text-white hover:!bg-amber-600 border-none shadow-md shadow-amber-500/20"
              : "bg-blue-600 hover:!bg-blue-700 shadow-md shadow-blue-600/20"
          }`}
        >
          {adding ? "Đã thêm vào giỏ" : product.isPreOrder ? "Đặt Trước Ngay" : "Thêm Vào Giỏ"}
        </Button>

        {!product.isPreOrder && (
          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="flex-1 font-bold rounded-xl h-12 text-sm bg-emerald-600 hover:!bg-emerald-700 shadow-md shadow-emerald-600/20"
          >
            Mua Ngay
          </Button>
        )}

        <Tooltip title="Thêm vào danh sách so sánh">
          <Button
            size="large"
            icon={<SwapOutlined />}
            onClick={handleCompare}
            className="h-12 w-12 rounded-xl border-slate-300 hover:border-blue-600 hover:text-blue-600 flex items-center justify-center"
          />
        </Tooltip>
      </div>
    </div>
  );
}
