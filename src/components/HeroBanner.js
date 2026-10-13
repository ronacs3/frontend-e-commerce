import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const benefits = [
  {
    icon: <RocketOutlined />,
    title: "Giao hàng nhanh",
    desc: "Theo dõi đơn hàng dễ dàng",
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Hàng chính hãng",
    desc: "Bảo hành minh bạch",
  },
  {
    icon: <CheckCircleOutlined />,
    title: "Đổi trả thuận tiện",
    desc: "Hỗ trợ tận tâm sau mua",
  },
];

export default function HeroBanner() {
  return (
    <section className="mb-8">
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-white">
        <Image
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&auto=format&fit=crop&q=80"
          alt="Không gian làm việc với thiết bị công nghệ"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/50" />

        <div className="relative grid min-h-[340px] grid-cols-1 gap-8 p-6 sm:p-9 lg:grid-cols-12 lg:p-10">
          <div className="flex flex-col justify-center lg:col-span-7">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-100">
              <ThunderboltOutlined className="text-amber-300" />
              Công nghệ cho cuộc sống mỗi ngày
            </div>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Chọn đúng thiết bị,
              <span className="block text-teal-300">tận hưởng trọn trải nghiệm.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Khám phá laptop, điện thoại và phụ kiện chính hãng. Cần tư vấn? TechShop AI luôn sẵn sàng giúp bạn chọn món phù hợp.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/?category=Laptop"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-teal-50"
              >
                Khám phá sản phẩm <ArrowRightOutlined />
              </Link>
              <Link
                href="/?category=Phụ kiện"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <GiftOutlined className="text-amber-300" /> Xem phụ kiện
              </Link>
            </div>
          </div>

          <div className="grid content-end gap-2 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900/55 p-3 backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-300/15 text-lg text-teal-200">
                  {item.icon}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">{item.title}</h2>
                  <p className="mt-0.5 text-xs text-slate-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
