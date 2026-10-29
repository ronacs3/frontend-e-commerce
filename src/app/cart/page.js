"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import { InputNumber, Spin } from "antd";
import { ArrowLeft, ArrowRight, ShoppingBag, Trash2, ShieldCheck, Truck } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import PageHeading from "@/components/PageHeading";
import { formatCurrency } from "@/utils/formatters";
import { useMounted } from "@/utils/useMounted";

export default function CartPage() {
  const mounted = useMounted();
  const dispatch = useDispatch();
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(state => state.cart);
  if (!mounted) return <div className="page-loading" role="status" aria-label="Loading cart"><Spin size="large" /></div>;
  const count = cartItems.reduce((total, item) => total + item.qty, 0);
  return <div className="cart-page">
    <PageHeading eyebrow="GIỎ HÀNG" title="Những lựa chọn của bạn" description={`${count} sản phẩm trong giỏ hàng`} actions={<Link className="text-button" href="/#catalog"><ArrowLeft size={16} /> Tiếp tục mua sắm</Link>} />
    {!cartItems.length ? <section className="empty-state"><div className="empty-state-icon"><ShoppingBag size={32} strokeWidth={1.5} /></div><h2>Giỏ hàng đang trống</h2><p>Khám phá những thiết bị phù hợp và thêm lựa chọn yêu thích vào giỏ hàng.</p><Link className="store-button" href="/#catalog">Khám phá sản phẩm <ArrowRight size={16} /></Link></section> :
      <div className="checkout-layout">
        <section className="cart-items" aria-label="Sản phẩm trong giỏ">{cartItems.map(item => <article key={item._id} className="cart-item">
          <Link href={`/product/${item._id}`} className="cart-item-image"><ProductImage src={item.image} alt={item.name} className="cart-item-photo" /></Link>
          <div className="cart-item-details"><span className="cart-item-category">{item.category}{item.isPreOrder ? " · Đặt trước" : ""}</span><Link href={`/product/${item._id}`}><h2>{item.name}</h2></Link><span className="cart-item-unit">{formatCurrency(item.price)} / sản phẩm</span>
            <div className="cart-item-controls"><InputNumber aria-label={`Số lượng ${item.name}`} min={1} max={Math.max(item.qty, item.countInStock || 1)} precision={0} value={item.qty} onChange={value => { if (value) dispatch(addToCart({ ...item, qty: value })); }} /><button type="button" className="cart-remove" aria-label={`Xóa ${item.name} khỏi giỏ hàng`} onClick={() => dispatch(removeFromCart(item._id))}><Trash2 size={15} /> Xóa</button></div>
          </div><strong className="cart-item-total">{formatCurrency(item.price * item.qty)}</strong>
        </article>)}<p className="cart-delivery-note"><Truck size={17} /> Miễn phí vận chuyển cho đơn trên 10 triệu đồng.</p></section>
        <aside className="order-summary"><h2>Tóm tắt đơn hàng</h2><dl><div><dt>Tiền hàng</dt><dd>{formatCurrency(itemsPrice)}</dd></div><div><dt>Phí vận chuyển</dt><dd>{shippingPrice === 0 ? "Miễn phí" : formatCurrency(shippingPrice)}</dd></div><div><dt>Thuế VAT</dt><dd>{formatCurrency(taxPrice)}</dd></div><div className="summary-total"><dt>Tổng thanh toán</dt><dd>{formatCurrency(totalPrice)}</dd></div></dl><p className="summary-help">Bạn có thể áp dụng mã giảm giá ở bước xác nhận đơn hàng.</p><Link href="/shipping" className="store-button">Tiến hành thanh toán <ArrowRight size={17} /></Link><p className="summary-security"><ShieldCheck size={15} /> Thông tin thanh toán được bảo mật</p></aside>
      </div>}
  </div>;
}
