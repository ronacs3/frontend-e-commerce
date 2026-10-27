import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ChatBot from "@/components/ChatBot.client";
import ThemeProvider from "@/components/ThemeProvider";
import Footer from "@/components/Footer";
import ReduxProvider from "@/redux/ReduxProvider";
import CompareFloatingBar from "@/components/CompareFloatingBar";
import MotionEffects from "@/components/MotionEffects";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TechShop - E-commerce",
  description: "Mua sắm đồ công nghệ trực tuyến",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeProvider>
            <MotionEffects />
            <Header />
            <main className="site-main">{children}</main>
            <Footer />
            <CompareFloatingBar />
            <ChatBot />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
