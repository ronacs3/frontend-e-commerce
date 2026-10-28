import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import NavigationProgressBar from "@/components/NavigationProgressBar";
import ReduxProvider from "@/redux/ReduxProvider";
import AntdConfigProvider from "@/components/AntdConfigProvider";
import ClientWidgets from "@/components/ClientWidgets";
import Footer from "@/components/Footer";

const inter = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-store",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://techshop.com";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "TechShop - Cửa Hàng Công Nghệ Hàng Đầu",
    template: "%s | TechShop",
  },
  description:
    "TechShop - Mua sắm laptop, smartphone, phụ kiện công nghệ chính hãng giá tốt nhất thị trường với dịch vụ giao hàng 2h và bảo hành 24T.",
  keywords: [
    "techshop",
    "công nghệ",
    "laptop",
    "điện thoại",
    "phụ kiện",
    "mua sắm trực tuyến",
    "smartphone",
    "bảo hành chính hãng",
  ],
  authors: [{ name: "TechShop Team" }],
  creator: "TechShop Inc.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: baseUrl,
    siteName: "TechShop",
    title: "TechShop - Cửa Hàng Công Nghệ Hàng Đầu",
    description:
      "Cửa hàng bán lẻ đồ công nghệ uy tín hàng đầu. Cam kết 100% chính hãng, giao hàng siêu tốc 2h.",
    images: [
      {
        url: `${baseUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "TechShop E-Commerce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechShop - Cửa Hàng Công Nghệ Hàng Đầu",
    description:
      "Mua sắm laptop, smartphone, phụ kiện công nghệ chính hãng giá tốt nhất.",
    images: [`${baseUrl}/images/og-image.jpg`],
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({ children }) {
  // JSON-LD Structured Data Schema.org cho Organization & WebSite
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TechShop",
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84-1900-6789",
      contactType: "customer service",
      areaServed: "VN",
      availableLanguage: "Vietnamese",
    },
    sameAs: [
      "https://facebook.com/techshop",
      "https://twitter.com/techshop",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TechShop",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/?keyword={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="vi">
      <head><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema]) }} /></head>
      <body className={inter.className + " " + inter.variable}>
        <a href="#main-content" className="skip-link">Đến nội dung chính</a>
        <ReduxProvider><AntdConfigProvider>
          <NavigationProgressBar />
          <Header />
          <main id="main-content" className="site-main site-container">{children}</main>
          <Footer />
          <ClientWidgets />
        </AntdConfigProvider></ReduxProvider>
      </body>
    </html>
  );
}
