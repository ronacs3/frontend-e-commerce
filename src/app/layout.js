import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ChatBot from "@/components/ChatBot.client";
import ReduxProvider from "@/redux/ReduxProvider";
import AntdConfigProvider from "@/components/AntdConfigProvider";
import CompareFloatingBar from "@/components/CompareFloatingBar";
import Link from "next/link";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  GithubOutlined,
  FacebookOutlined,
  CustomerServiceOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "TechShop - Cửa Hàng Công Nghệ Hàng Đầu",
  description: "Mua sắm laptop, smartphone, phụ kiện công nghệ chính hãng với giá tốt nhất thị trường.",
  keywords: ["techshop", "công nghệ", "laptop", "điện thoại", "phụ kiện", "mua sắm trực tuyến"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${inter.className} ${inter.variable} bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white`}>
        <ReduxProvider>
          <AntdConfigProvider>
            <Header />

            <main className="flex-1 container mx-auto px-4 py-6 md:py-8 max-w-7xl">
              {children}
            </main>

            {/* Premium Footer */}
            <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 mt-16 border-t border-slate-800">
              <div className="container mx-auto px-4 max-w-7xl">
                {/* Feature highlights bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-slate-800">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="w-12 h-12 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-2xl">
                      <RocketOutlined />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">Giao Hàng Miễn Phí</h4>
                      <p className="text-xs text-slate-400">Cho tất cả đơn hàng từ 500K</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="w-12 h-12 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-2xl">
                      <SafetyCertificateOutlined />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">100% Chính Hãng</h4>
                      <p className="text-xs text-slate-400">Cam kết bảo hành chính hãng</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="w-12 h-12 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center text-2xl">
                      <SyncOutlined />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">Đổi Trả Dễ Dàng</h4>
                      <p className="text-xs text-slate-400">Đổi mới trong 30 ngày đầu</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="w-12 h-12 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center text-2xl">
                      <CustomerServiceOutlined />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">Hỗ Trợ 24/7</h4>
                      <p className="text-xs text-slate-400">Giải đáp thắc mắc nhanh chóng</p>
                    </div>
                  </div>
                </div>

                {/* Footer Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-10">
                  <div className="lg:col-span-2 space-y-4">
                    <Link href="/" className="inline-flex items-center gap-2">
                      <span className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-600/40">T</span>
                      <span className="text-2xl font-black text-white tracking-tight">Tech<span className="text-indigo-400">Shop</span></span>
                    </Link>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                      TechShop là hệ thống bán lẻ đồ công nghệ uy tín hàng đầu, mang đến sản phẩm chính hãng với mức giá ưu đãi nhất cùng chế độ hậu mãi chu đáo.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <a href="#" className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-indigo-600 flex items-center justify-center transition">
                        <FacebookOutlined />
                      </a>
                      <a href="#" className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-indigo-600 flex items-center justify-center transition">
                        <GithubOutlined />
                      </a>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Sản Phẩm</h4>
                    <ul className="space-y-2.5 text-sm text-slate-400">
                      <li><Link href="/?category=Laptop" className="hover:text-indigo-400 transition">Laptop & Máy tính</Link></li>
                      <li><Link href="/?category=Điện thoại" className="hover:text-indigo-400 transition">Smartphone & Tablet</Link></li>
                      <li><Link href="/?category=Phụ kiện" className="hover:text-indigo-400 transition">Phụ kiện công nghệ</Link></li>
                      <li><Link href="/?category=Tai nghe" className="hover:text-indigo-400 transition">Tai nghe & Âm thanh</Link></li>
                      <li><Link href="/?category=Đồng hồ" className="hover:text-indigo-400 transition">Đồng hồ thông minh</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Hỗ Trợ Khách Hàng</h4>
                    <ul className="space-y-2.5 text-sm text-slate-400">
                      <li><a href="#" className="hover:text-indigo-400 transition">Trung tâm bảo hành</a></li>
                      <li><a href="#" className="hover:text-indigo-400 transition">Chính sách đổi trả</a></li>
                      <li><a href="#" className="hover:text-indigo-400 transition">Hướng dẫn mua hàng</a></li>
                      <li><a href="#" className="hover:text-indigo-400 transition">Tra cứu đơn hàng</a></li>
                      <li><a href="#" className="hover:text-indigo-400 transition">Điều khoản dịch vụ</a></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Liên Hệ</h4>
                    <ul className="space-y-3 text-sm text-slate-400">
                      <li className="flex items-start gap-2.5">
                        <EnvironmentOutlined className="text-indigo-400 mt-1" />
                        <span>123 Đường Công Nghệ, Q. Cầu Giấy, Hà Nội</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <PhoneOutlined className="text-indigo-400" />
                        <span>Hotline: 1900 6789</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <MailOutlined className="text-indigo-400" />
                        <span>cskh@techshop.com</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                  <p>© {new Date().getFullYear()} TechShop Inc. Tất cả quyền được bảo lưu.</p>
                  <div className="flex gap-6">
                    <a href="#" className="hover:text-slate-400 transition">Bảo mật</a>
                    <a href="#" className="hover:text-slate-400 transition">Quyền riêng tư</a>
                    <a href="#" className="hover:text-slate-400 transition">Sitemap</a>
                  </div>
                </div>
              </div>
            </footer>

            <CompareFloatingBar />
            <ChatBot />
          </AntdConfigProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

