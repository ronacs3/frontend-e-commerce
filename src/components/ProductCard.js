"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { addToCompare } from "@/redux/slices/compareSlice";
import { Button, Tag, Rate, message, Tooltip } from "antd";
import {
  ShoppingCartOutlined,
  CalendarOutlined,
  SwapOutlined,
  EyeOutlined,
  StarFilled,
} from "@ant-design/icons";
import { formatCurrency, DEFAULT_IMAGE } from "@/utils/formatters";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [imgSrc, setImgSrc] = useState(product?.image || DEFAULT_IMAGE);

  const { compareItems } = useSelector((state) => state.compare || { compareItems: [] });
  const isCompared = compareItems?.some((x) => x._id === product?._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(addToCart({ ...product, qty: 1 }));
    message.success(
      product.isPreOrder
        ? `Đã thêm suất đặt trước "${product.name}" vào giỏ`
        : `Đã thêm "${product.name}" vào giỏ hàng`
    );
  };

  const handleAddToCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCompare(product));
  };

  const isOutOfStock = product.countInStock === 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Image & Badges Container */}
      <div className="relative w-full h-56 bg-gradient-to-b from-slate-50 to-white overflow-hidden p-4 flex items-center justify-center">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.category && (
            <span className="px-2.5 py-1 rounded-lg bg-indigo-600/90 backdrop-blur-md text-white text-[11px] font-bold shadow-sm">
              {product.category}
            </span>
          )}
          {product.isPreOrder && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[11px] font-bold shadow-sm flex items-center gap-1">
              <CalendarOutlined /> Đặt trước
            </span>
          )}
        </div>

        {/* Quick Action Overlay Floating Buttons */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Tooltip title={isCompared ? "Đã chọn so sánh" : "So sánh sản phẩm"}>
            <button
              onClick={handleAddToCompare}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 shadow-md transition-all ${
                isCompared
                  ? "bg-indigo-600 text-white"
                  : "bg-white/90 backdrop-blur-md hover:bg-indigo-600 hover:text-white"
              }`}
            >
              <SwapOutlined />
            </button>
          </Tooltip>

          <Tooltip title="Xem chi tiết">
            <Link
              href={`/product/${product._id}`}
              className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:bg-indigo-600 hover:text-white shadow-md transition-all"
            >
              <EyeOutlined />
            </Link>
          </Tooltip>
        </div>

        {/* Image */}
        <Link href={`/product/${product._id}`} className="relative w-full h-full block">
          <Image
            src={imgSrc}
            alt={product?.name || "Sản phẩm TechShop"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-2 group-hover:scale-110 transition-transform duration-500 ease-out"
            onError={() => setImgSrc(DEFAULT_IMAGE)}
          />
        </Link>
      </div>

      {/* Product Information Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating Summary */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <div className="flex items-center text-amber-400">
              <StarFilled className="text-sm" />
              <span className="ml-1 font-bold text-slate-800">
                {product.rating ? Number(product.rating).toFixed(1) : "5.0"}
              </span>
            </div>
            <span>({product.numReviews || 0} đánh giá)</span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product._id}`}>
            <h3 className="font-bold text-slate-800 text-base line-clamp-2 hover:text-indigo-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action Button Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Giá niêm yết</span>
            <span className="text-lg font-black text-rose-600 tracking-tight">
              {formatCurrency(product.price)}
            </span>
          </div>

          <Button
            type={product.isPreOrder ? "default" : "primary"}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`font-semibold rounded-xl px-4 flex items-center justify-center ${
              product.isPreOrder
                ? "bg-amber-500 text-white hover:!bg-amber-600 hover:!text-white border-none shadow-md shadow-amber-500/20"
                : "bg-indigo-600 hover:!bg-indigo-700 shadow-md shadow-indigo-600/20"
            }`}
            icon={product.isPreOrder ? <CalendarOutlined /> : <ShoppingCartOutlined />}
          >
            {isOutOfStock
              ? "Hết hàng"
              : product.isPreOrder
              ? "Đặt trước"
              : "Thêm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
