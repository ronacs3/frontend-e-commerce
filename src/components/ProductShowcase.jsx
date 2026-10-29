"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { App } from "antd";
import { ArrowRight, Check, ChevronLeft, ChevronRight, GitCompareArrows, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { addToCart } from "@/redux/slices/cartSlice";
import { addToCompare } from "@/redux/slices/compareSlice";
import { formatCurrency, DEFAULT_IMAGE } from "@/utils/formatters";
import useCartFeedback from "@/utils/useCartFeedback";
import { clampQuantity, getProductImages } from "@/lib/showcase.mjs";

const HeadphoneViewer = dynamic(() => import("./HeadphoneViewer"), {
  ssr: false,
  loading: () => <div className="viewer-loading"><Image src="/images/hero-headphones.svg" alt="Tai nghe minh họa" width={560} height={500} priority /></div>,
});
const finishes = [
  { name: "Đen midnight", color: "#292a2c" },
  { name: "Trắng pearl", color: "#e8dfd1" },
  { name: "Vàng champagne", color: "#bc9663" },
  { name: "Xanh navy", color: "#25384b" },
  { name: "Xanh forest", color: "#3d5144" },
];

export default function ProductShowcase({ product = null, detail = false }) {
  const [finish, setFinish] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [sticky, setSticky] = useState(false);
  const { adding, feedback } = useCartFeedback();
  const heroRef = useRef(null);
  const pictureRef = useRef(null);
  const { message } = App.useApp();
  const dispatch = useDispatch();
  const { compareItems } = useSelector((state) => state.compare);
  const compared = Boolean(product && compareItems.some((item) => item._id === product._id));
  const images = getProductImages(product);
  const stock = Math.max(0, Number(product?.countInStock) || 0);
  const canBuy = Boolean(product?._id && stock > 0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setSticky(!entry.isIntersecting && entry.boundingClientRect.bottom < 0), { threshold: 0 });
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const add = (event) => {
    if (!canBuy) return;
    const qty = clampQuantity(quantity, stock);
    dispatch(addToCart({ ...product, qty }));
    message.success(`Đã thêm ${qty} sản phẩm vào giỏ hàng`);
    const photo = pictureRef.current?.querySelector(".showcase-product-photo img");
    const origin = photo?.getBoundingClientRect();
    feedback(origin && origin.bottom > 0 && origin.top < window.innerHeight ? photo : event.currentTarget, photo?.currentSrc || images[activeImage]);
  };

  return <>
    <section className="luxury-showcase" ref={heroRef} aria-labelledby="showcase-title">
      <div className="showcase-media" ref={pictureRef}>
        {product ? <>
          <div className="showcase-product-photo"><Image src={images[activeImage] || DEFAULT_IMAGE} alt={product.name} fill priority sizes="(max-width: 800px) 100vw, 50vw" onError={(event) => { event.currentTarget.srcset = ""; event.currentTarget.src = DEFAULT_IMAGE; }} /></div>
          {images.length > 1 && <div className="product-thumbnails" aria-label="Ảnh sản phẩm">{images.map((image, index) => <button key={image} type="button" className={activeImage === index ? "is-active" : ""} onClick={() => setActiveImage(index)} aria-label={`Xem ảnh ${index + 1}`} aria-pressed={activeImage === index}><Image src={image} width={55} height={55} alt="" /></button>)}</div>}
        </> : <HeadphoneViewer color={finishes[finish].color} />}
        {!product && <span className="model-disclaimer">Mô hình minh họa thiết kế</span>}
      </div>
      <div className="showcase-info">
        <p className="showcase-kicker">{product ? product.category || "TechShop lựa chọn" : "TechShop Studio"}</p>
        <h1 id="showcase-title">{product ? product.name : <>Âm thanh.<br />Một thế giới riêng.</>}</h1>
        <p className="showcase-tagline">{product ? product.brand || "Thiết bị cho những trải nghiệm mỗi ngày." : "Chạm công nghệ. Cảm nhận khác biệt."}</p>
        {product && <div className="showcase-price">{formatCurrency(product.price)}</div>}
        <p className="showcase-description">{product ? product.description || "Khám phá hình ảnh và thông tin sản phẩm trước khi lựa chọn." : "Dành một khoảng lặng cho bản nhạc yêu thích. Khám phá thế giới tai nghe và tìm thiết bị đồng hành cùng nhịp sống của bạn."}</p>
        {!product && <div className="finish-selector"><p>Phối màu minh họa <strong>{finishes[finish].name}</strong></p><div role="group" aria-label="Chọn phối màu mô hình 3D">{finishes.map((item, index) => <button type="button" key={item.color} style={{ "--finish": item.color }} className={index === finish ? "is-active" : ""} onClick={() => setFinish(index)} aria-pressed={index === finish} aria-label={item.name} />)}</div><small>Màu sắc dùng để trải nghiệm mô hình, không phải tùy chọn đặt hàng.</small></div>}
        {product && <div className="showcase-quantity"><span>Số lượng</span><div><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={!canBuy || quantity <= 1} aria-label="Giảm số lượng"><Minus size={14} /></button><output aria-live="polite">{canBuy ? clampQuantity(quantity, stock) : 0}</output><button type="button" onClick={() => setQuantity(clampQuantity(quantity + 1, stock))} disabled={!canBuy || quantity >= stock} aria-label="Tăng số lượng"><Plus size={14} /></button></div></div>}
        <div className="showcase-assurance"><span><Check size={14} /> {product ? stock > 0 ? `Còn ${stock} sản phẩm` : "Tạm hết hàng" : "Khám phá mọi góc nhìn"}</span><span><Truck size={14} /> Giao hàng tận nơi</span></div>
        <div className="showcase-buy-actions">{product ? <><button type="button" className="luxury-button" onClick={add} disabled={!canBuy}>{adding ? <Check size={17} /> : <ShoppingBag size={17} />}{adding ? "Đã thêm vào giỏ" : canBuy ? "Thêm vào giỏ hàng" : "Tạm hết hàng"}</button><button type="button" className="showcase-compare" onClick={() => dispatch(addToCompare(product))} aria-label="So sánh sản phẩm" aria-pressed={compared}>{compared ? <Check size={18} /> : <GitCompareArrows size={18} />}</button></> : <Link href="/?category=Tai%20nghe#catalog" className="luxury-button">Khám phá bộ sưu tập <ArrowRight size={17} /></Link>}</div>
        {product ? <Link className="showcase-secondary" href={detail ? "/cart" : `/product/${product._id}`}>{detail ? "Xem giỏ hàng" : "Xem chi tiết sản phẩm"} <ArrowRight size={14} /></Link> : <a href="#catalog" className="showcase-secondary">Xem tất cả thiết bị <ArrowRight size={14} /></a>}
      </div>
    </section>
    {product && sticky && <div className="showcase-sticky"><div className="site-container"><div><strong>{product.name}</strong><span>{formatCurrency(product.price)}</span></div><button type="button" className="luxury-button" onClick={add} disabled={!canBuy}><ShoppingBag size={16} />{adding ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}</button></div></div>}
  </>;
}

export function ShowcaseGallery({ product }) {
  const realImages = getProductImages(product);
  const images = product ? realImages : [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&auto=format&fit=crop&q=85",
  ];
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  const go = (index) => {
    const next = Math.max(0, Math.min(images.length - 1, index));
    trackRef.current?.children[next]?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "nearest", inline: "start" });
  };
  return <section className="showcase-gallery" aria-label="Bộ ảnh sản phẩm"><div className="luxury-section-heading"><div><span className="showcase-kicker">{product ? "Từng góc nhìn" : "Cảm hứng âm thanh"}</span><h2>{product ? "Chi tiết tạo nên khác biệt." : "Dành cho những phút riêng bạn."}</h2></div><div className="gallery-navigation"><button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Ảnh trước"><ChevronLeft size={19} /></button><button type="button" onClick={() => go(active + 1)} disabled={active >= images.length - 1} aria-label="Ảnh tiếp theo"><ChevronRight size={19} /></button></div></div><div className="gallery-track" ref={trackRef} tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); go(active + (event.key === "ArrowRight" ? 1 : -1)); } }} onScroll={(event) => { const track = event.currentTarget; const width = track.children[0]?.getBoundingClientRect().width; if (width) setActive(Math.round(track.scrollLeft / (width + 20))); }}>{images.map((image, index) => <div className="gallery-slide" key={image}><Image src={image} alt={product ? `${product.name}, góc nhìn ${index + 1}` : `Ảnh cảm hứng tai nghe ${index + 1}`} fill sizes="(max-width: 800px) 85vw, 55vw" onError={(event) => { event.currentTarget.srcset = ""; event.currentTarget.src = DEFAULT_IMAGE; }} />{!product && <span>Không gian âm thanh của bạn</span>}</div>)}</div><div className="gallery-dots">{images.map((image, index) => <button key={image} type="button" className={index === active ? "is-active" : ""} aria-label={`Đến ảnh ${index + 1}`} aria-pressed={index === active} onClick={() => go(index)} />)}</div></section>;
}
