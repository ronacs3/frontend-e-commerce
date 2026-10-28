import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ShowcaseStories() {
  return <div className="showcase-stories">
    <section className="showcase-story"><div className="story-photo"><Image src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1000&auto=format&fit=crop&q=85" alt="Tai nghe chụp tai với thiết kế tinh gọn" fill sizes="(max-width: 767px) 100vw, 50vw" /></div><div className="story-copy"><span className="showcase-kicker">Không gian của riêng bạn</span><h2>Giữ lại giai điệu.<br />Để ồn ào ở lại.</h2><p>Một bản nhạc khi làm việc, một podcast trên đường về. Khám phá tai nghe phù hợp với thói quen nghe và phong cách sống của bạn.</p><Link href="/?category=Tai%20nghe#catalog">Khám phá tai nghe <ArrowRight size={15} /></Link></div></section>
    <section className="showcase-story"><div className="story-photo"><Image src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000&auto=format&fit=crop&q=85" alt="Laptop trong không gian làm việc tối giản" fill sizes="(max-width: 767px) 100vw, 50vw" /></div><div className="story-copy"><span className="showcase-kicker">Cho mọi ý tưởng</span><h2>Gọn góc làm việc.<br />Rộng không gian sáng tạo.</h2><p>Từ chiếc laptop đồng hành mỗi ngày đến phụ kiện hoàn thiện bàn làm việc. Lựa chọn thiết bị theo nhu cầu thật của bạn.</p><Link href="/?category=Laptop#catalog">Tìm laptop của bạn <ArrowRight size={15} /></Link></div></section>
  </div>;
}
