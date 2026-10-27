export default function robots() {
  const baseUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "https://techshop.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/cart", "/placeorder", "/shipping", "/payment"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
