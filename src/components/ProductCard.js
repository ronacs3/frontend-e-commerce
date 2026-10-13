"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { addToCompare } from "@/redux/slices/compareSlice";
import { Button, message, Tooltip } from "antd";
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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg">
      {/* Image & Badges Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 p-5">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.category && (
            <span className="rounded-md bg-teal-800 px-2.5 py-1 text-[11px] font-semibold text-white">
              {product.category}
            </span>
          )}
          {product.isPreOrder && (
            <span className="flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-1 text-[11px] font-semibold text-white">
              <CalendarOutlined /> Đặt trước
            </span>
          )}
        </div>

        {/* Quick Action Overlay Floating Buttons */}
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <Tooltip title={isCompared ? "Đã chọn so sánh" : "So sánh sản phẩm"}>
            <button
              onClick={handleAddToCompare}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 shadow-md transition-all ${
                isCompared
                  ? "bg-teal-700 text-white"
                  : "bg-white hover:bg-teal-700 hover:text-white"
              }`}
            >
              <SwapOutlined />
            </button>
          </Tooltip>

          <Tooltip title="Xem chi tiết">
            <Link
              href={`/product/${product._id}`}
              prefetch={true}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm transition hover:bg-teal-700 hover:text-white"
            >
              <EyeOutlined />
            </Link>
          </Tooltip>
        </div>

        {/* Image */}
        <Link href={`/product/${product._id}`} prefetch={true} className="relative w-full h-full block">
          <Image
            src={imgSrc}
            alt={product?.name || "Sản phẩm TechShop"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgSrc(DEFAULT_IMAGE)}
          />
        </Link>
      </div>

      {/* Product Information Body */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-4">
        <div>
          {/* Rating Summary */}
          <div className="mb-2 flex items-center gap-1.5 text-xs text-slate-500">
            <div className="flex items-center text-amber-500">
              <StarFilled className="text-sm" />
              <span className="ml-1 font-bold text-slate-800">
                {product.rating ? Number(product.rating).toFixed(1) : "5.0"}
              </span>
            </div>
            <span>({product.numReviews || 0} đánh giá)</span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product._id}`} prefetch={true}>
            <h3 className="line-clamp-2 min-h-11 text-[15px] font-semibold leading-5 text-slate-800 transition-colors group-hover:text-teal-800">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action Button Row */}
        <div className="flex items-end justify-between gap-2 border-t border-slate-100 pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Giá niêm yết</span>
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(product.price)}
            </span>
          </div>

          <Button
            type={product.isPreOrder ? "default" : "primary"}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`flex items-center justify-center rounded-lg px-3 font-semibold ${
              product.isPreOrder
                ? "border-amber-500 bg-amber-500 text-white hover:!bg-amber-600 hover:!text-white"
                : "bg-teal-700 hover:!bg-teal-800"
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
    </article>
  );
}
