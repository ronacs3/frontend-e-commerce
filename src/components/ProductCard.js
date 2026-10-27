"use client";

import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { message } from "antd";
import { ArrowUpRight, CalendarDays, Check, Plus, Star } from "lucide-react";
import { addToCart } from "@/redux/slices/cartSlice";

const DEFAULT_IMAGE = "/images/default-image.jpg";
const priceFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [imgSrc, setImgSrc] = useState(product.image || DEFAULT_IMAGE);
  const [added, setAdded] = useState(false);
  const feedbackTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(feedbackTimer.current), []);
  const soldOut = Number(product.countInStock) <= 0;
  const handleAddToCart = () => {
    if (soldOut) return;
    dispatch(addToCart({ ...product, qty: 1 }));
    setAdded(true);
    window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setAdded(false), 1600);
    message.success(`Đã thêm “${product.name}” vào giỏ hàng`);
  };
  return <article className="product-card">
    <Link href={`/product/${product._id}`} className="product-image-link"><span className={`product-badge${soldOut ? " sold-out" : ""}`}>{soldOut ? "Tạm hết hàng" : product.isPreOrder ? "Đặt trước" : product.category || "TechShop chọn"}</span><div className="product-image"><Image src={imgSrc} alt={product.name || "Sản phẩm TechShop"} fill sizes="(max-width: 560px) 90vw, (max-width: 900px) 45vw, 25vw" className="object-contain" onError={() => setImgSrc(DEFAULT_IMAGE)} /></div><span className="product-view" aria-label="Xem chi tiết"><ArrowUpRight size={18} /></span></Link>
    <div className="product-info"><div className="product-meta"><span>{product.brand || product.category || "TECHSHOP"}</span>{Number(product.numReviews) > 0 && <span className="product-rating"><Star size={12} fill="currentColor" /> {Number(product.rating || 0).toFixed(1)} <small>({product.numReviews})</small></span>}</div><Link href={`/product/${product._id}`} className="product-title"><h3>{product.name}</h3></Link><div className="product-bottom"><div><span className="price-label">Giá sản phẩm</span><strong className="product-price">{priceFormatter.format(product.price || 0)}</strong></div><button type="button" className={`add-product${added ? " is-added" : ""}`} onClick={handleAddToCart} disabled={soldOut} aria-label={soldOut ? `${product.name} đã hết hàng` : `Thêm ${product.name} vào giỏ hàng`} title={soldOut ? "Hết hàng" : "Thêm vào giỏ"}>{added ? <Check size={21} /> : product.isPreOrder ? <CalendarDays size={19} /> : <Plus size={21} />}</button></div></div>
    <span className="sr-only" role="status">{added ? `Đã thêm ${product.name} vào giỏ hàng` : ""}</span>
  </article>;
}
