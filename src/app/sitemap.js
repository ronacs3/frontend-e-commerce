import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";
import { BLOG_POSTS } from "@/data/blogPosts";

export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "https://techshop.com";
  const apiUrl = API_BASE_URL;

  let products = [];

  if (apiUrl) {
    try {
      const res = await apiFetch(`${apiUrl}/products`, {
        next: { revalidate: 3600 },
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

  const blogUrls = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const staticRoutes = ["", "/blog", "/cart", "/login", "/register"];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : route === "/blog" ? 0.9 : 0.7,
  }));

  return [...staticUrls, ...blogUrls, ...productUrls];
}
