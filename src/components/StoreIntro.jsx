import { ArrowDown, ShoppingBag } from "lucide-react";

export default function StoreIntro() {
  return <section className="store-intro" aria-labelledby="store-intro-title">
    <span className="intro-label"><ShoppingBag size={14} /> TECHSHOP COLLECTION</span>
    <h1 id="store-intro-title">Thiết bị bạn thích.<br /><span>Mua sắm thật nhẹ nhàng.</span></h1>
    <p>Khám phá công nghệ cho mỗi ngày. Chọn sản phẩm yêu thích,<br className="intro-break" /> thêm vào giỏ và để chúng tôi lo phần còn lại.</p>
    <a href="#catalog" className="store-button">Khám phá sản phẩm <ArrowDown size={16} /></a>
    <div className="intro-caption"><span /> Một lựa chọn nhỏ. Một trải nghiệm mới.</div>
  </section>;
}
