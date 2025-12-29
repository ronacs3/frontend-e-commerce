// app/sitemap.js

export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  let products = [];

  try {
    const res = await fetch(`${apiUrl}/products`, {
      cache: "no-store",
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

  // ===== Product URLs =====
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product._id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // ===== Static routes =====
  const staticRoutes = ["", "/cart", "/login", "/register"];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  }));

  return [...staticUrls, ...productUrls];
}
