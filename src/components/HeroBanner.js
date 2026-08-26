"use client";

import Link from "next/link";
import {
  RocketOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  GiftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

export default function HeroBanner() {
  return (
    <section className="mb-10">
      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-3xl gradient-bg text-white p-8 md:p-12 shadow-2xl shadow-indigo-500/20 border border-white/10">
        {/* Abstract background decorative shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 text-xs font-semibold">
              <ThunderboltOutlined className="text-amber-300" />
              <span>Sản phẩm Công Nghệ Mới Nhất 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Trải Nghiệm Công Nghệ <br />
              <span className="text-cyan-300">Đỉnh Cao & Đẳng Cấp</span>
            </h1>

            <p className="text-slate-100/90 text-sm md:text-base max-w-xl font-normal leading-relaxed">
              Khám phá bộ sưu tập Laptop, Điện thoại thông minh và Phụ kiện cao cấp chính hãng. Ưu đãi trả góp 0%, giao hàng siêu tốc trong 2h!
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/?category=Laptop"
                className="px-6 py-3 rounded-2xl bg-white text-indigo-700 font-bold text-sm shadow-lg shadow-black/10 hover:bg-slate-100 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <span>Khám phá ngay</span>
                <ArrowRightOutlined />
              </Link>
              <Link
                href="/?isPreOrder=true"
                className="px-6 py-3 rounded-2xl bg-white/15 backdrop-blur-md hover:bg-white/25 text-white font-bold text-sm border border-white/30 transition-all duration-300 flex items-center gap-2"
              >
                <GiftOutlined className="text-amber-300" />
                <span>Đặt trước nhận quà</span>
              </Link>
            </div>
          </div>

          {/* Hero Stat / Feature Card */}
          <div className="lg:col-span-5 hidden lg:grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-xl mb-3">
                <RocketOutlined />
              </div>
              <h4 className="font-bold text-lg text-white">Giao 2H</h4>
              <p className="text-xs text-slate-200 mt-1">Nội thành Hà Nội & TP.HCM</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center text-xl mb-3">
                <SafetyCertificateOutlined />
              </div>
              <h4 className="font-bold text-lg text-white">Bảo hành 24T</h4>
              <p className="text-xs text-slate-200 mt-1">1 đổi 1 trong 30 ngày</p>
            </div>

            <div className="col-span-2 p-5 rounded-2xl bg-gradient-to-r from-indigo-500/40 to-cyan-500/40 backdrop-blur-md border border-white/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-cyan-200 uppercase tracking-wider">Mã giảm giá hot</p>
                <h4 className="font-extrabold text-xl text-white">TECH2026 - Giảm 500K</h4>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-white text-indigo-900 font-bold text-xs shadow-sm">
                Áp dụng ngay
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
