"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  SparklesOutlined,
} from "@ant-design/icons";
import Tilt3DCard from "@/components/Tilt3DCard";

const benefits = [
  {
    icon: <RocketOutlined />,
    title: "Giao hàng 2H",
    desc: "Nội thành Hà Nội & TP.HCM",
    accent: "from-teal-500/20 to-emerald-500/10",
    border: "border-teal-500/30",
    iconBg: "bg-teal-400/20 text-teal-300",
    depthClass: "translate-z-30",
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "100% Chính hãng",
    desc: "Bảo hành 24 tháng minh bạch",
    accent: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
    iconBg: "bg-emerald-400/20 text-emerald-300",
    depthClass: "translate-z-40",
  },
  {
    icon: <CheckCircleOutlined />,
    title: "Đổi mới 30 ngày",
    desc: "1 đổi 1 tận nơi nếu có lỗi",
    accent: "from-cyan-500/20 to-teal-500/10",
    border: "border-cyan-500/30",
    iconBg: "bg-cyan-400/20 text-cyan-300",
    depthClass: "translate-z-30",
  },
];

export default function HeroBanner() {
  return (
    <section className="mb-8 perspective-1200">
      <Tilt3DCard
        maxTilt={4.5}
        perspective={1200}
        scale={1.008}
        glare={true}
        glareOpacity={0.2}
        className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-2xl shadow-teal-950/20 preserve-3d"
      >
        {/* Background Image & Glowing Gradient Layers */}
        <Image
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&auto=format&fit=crop&q=80"
          alt="Không gian làm việc với thiết bị công nghệ"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-900/60 pointer-events-none" />

        {/* 3D Ambient Glowing Orbs */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl pointer-events-none animate-pulse-glow"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none animate-pulse-glow"
        />

        {/* Main Content Grid */}
        <div className="relative grid min-h-[360px] grid-cols-1 gap-8 p-6 sm:p-9 lg:grid-cols-12 lg:p-11 items-center preserve-3d">
          {/* Left Column: Typography & CTAs */}
          <div className="flex flex-col justify-center lg:col-span-7 preserve-3d space-y-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-400/30 bg-teal-950/60 px-3.5 py-1.5 text-xs font-semibold text-teal-200 backdrop-blur-md shadow-inner translate-z-20">
              <ThunderboltOutlined className="text-amber-300 animate-bounce" />
              <span>Công nghệ thế hệ mới 2026</span>
            </div>

            <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl tracking-tight translate-z-30">
              Chọn đúng thiết bị,
              <span className="block bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-100 bg-clip-text text-transparent">
                tận hưởng trọn trải nghiệm.
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base translate-z-20">
              Khám phá laptop, điện thoại và phụ kiện chính hãng với ưu đãi đặc quyền. Cần gợi ý? Trợ lý TechShop AI luôn sẵn sàng hỗ trợ bạn 24/7.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 translate-z-40">
              <Link
                href="/?category=Laptop"
                prefetch={true}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/25 transition-all duration-300 hover:scale-105 hover:shadow-teal-400/40"
              >
                Khám phá sản phẩm <ArrowRightOutlined />
              </Link>
              <Link
                href="/?category=Phụ kiện"
                prefetch={true}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-105"
              >
                <GiftOutlined className="text-amber-300" /> Xem phụ kiện hot
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Floating Benefit Cards */}
          <div className="grid content-center gap-3 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1 preserve-3d">
            {benefits.map((item, idx) => (
              <div
                key={item.title}
                className={`group flex items-center gap-3.5 rounded-xl border ${item.border} bg-gradient-to-r ${item.accent} p-3.5 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-teal-300 hover:scale-105 ${item.depthClass} ${
                  idx % 2 === 0 ? "animate-float-3d" : "animate-float-3d-reverse"
                }`}
                style={{
                  animationDelay: `${idx * 0.8}s`,
                }}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg} text-xl shadow-inner transition-transform group-hover:scale-110`}
                >
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    {item.title}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-300 line-clamp-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Tilt3DCard>
    </section>
  );
}
