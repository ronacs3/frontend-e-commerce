export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ecommerce-backend-nestjs-liard.vercel.app/api"
).replace(/\/+$/, "");

// Keep native Response behavior for Next.js caching, uploads and AI streams.
export async function apiFetch(url, options) {
  const response = await fetch(url, options);
  if (response.ok) return response;

  const data = await response.clone().json().catch(() => null);
  if (!data) return response;
  if (Array.isArray(data.message)) {
    data.message = data.message.join("; ");
    return new Response(JSON.stringify(data), {
      status: response.status,
      statusText: response.statusText,
      headers: { "Content-Type": "application/json" },
    });
  }
  return response;
}
