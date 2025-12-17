import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TechShop - E-commerce",
  description: "Mua sắm đồ công nghệ trực tuyến",
};

import ReduxProvider from "@/redux/ReduxProvider"; // Import mới

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-50`}>
        {/* Bọc ReduxProvider ở đây */}
        <ReduxProvider>
          <Header />
          <main className="container mx-auto px-4 py-8 min-h-screen">
            {children}
          </main>
          {/* Footer... */}
        </ReduxProvider>
      </body>
    </html>
  );
}
