"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { App } from "antd";
import { ArrowUpRight, Plus, Check, GitCompareArrows, Star } from "lucide-react";
import { addToCart } from "@/redux/slices/cartSlice";
import { addToCompare } from "@/redux/slices/compareSlice";
import { formatCurrency, DEFAULT_IMAGE } from "@/utils/formatters";

import useCartFeedback from "@/utils/useCartFeedback";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cardRef = useRef(null);
  const { adding, feedback } = useCartFeedback();
  const { message } = App.useApp();
  const [image, setImage] = useState(product.image || DEFAULT_IMAGE);
  const { compareItems } = useSelector(state => state.compare);
  const compared = compareItems.some(item => item._id === product._id);
  const soldOut = product.countInStock === 0 && !product.isPreOrder;
  const add = () => { feedback(cardRef.current?.querySelector(".store-product-image img"), image); dispatch(addToCart({ ...product, qty: 1 })); message.success('Đã thêm "' + product.name + '" vào giỏ hàng'); };
  return <article ref={cardRef} className="store-product-card"><div className="store-product-image"><Link href={"/product/" + product._id} aria-label={"Xem " + product.name}><Image src={image} alt={product.name} fill sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 25vw" onError={() => setImage(DEFAULT_IMAGE)} /></Link><button type="button" className={"compare-button" + (compared ? " is-compared" : "")} aria-label={"So sánh " + product.name} aria-pressed={compared} onClick={() => dispatch(addToCompare(product))}>{compared ? <Check size={17} /> : <GitCompareArrows size={17} />}</button>{product.isPreOrder && <span className="product-preorder">Đặt trước</span>}</div><div className="store-product-info"><div className="product-meta"><span>{product.category}</span>{product.numReviews > 0 && <span><Star size={12} fill="currentColor" />{Number(product.rating).toFixed(1)} <small>({product.numReviews})</small></span>}</div><Link href={"/product/" + product._id}><h3>{product.name}</h3></Link><div className="product-buy-row"><strong>{formatCurrency(product.price)}</strong><button type="button" className={"product-add" + (adding ? " is-added" : "")} disabled={soldOut} onClick={add} aria-label={(soldOut ? "Hết hàng: " : "Thêm vào giỏ: ") + product.name}>{soldOut ? "Hết hàng" : adding ? <Check size={20} /> : product.isPreOrder ? <ArrowUpRight size={20} /> : <Plus size={20} />}</button></div><span className="cart-feedback-status" role="status">{adding ? "Đã thêm vào giỏ hàng" : ""}</span></div></article>;
}
