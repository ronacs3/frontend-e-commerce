export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "https://techshop.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  let products = [];

  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl}/products`, {
        next: { revalidate: 3600 }, // Cache 1 giờ cho sitemap
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          products = data;
        }
      }
    } catch (err) {
      console.error("Sitemap fetch error:", err);
    }
  }

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product._id}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticRoutes = ["", "/cart", "/login", "/register"];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.7,
  }));

  return [...staticUrls, ...productUrls];
}
