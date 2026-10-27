/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "5000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "5000", pathname: "/uploads/**" },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Ví dụ nếu bạn dùng Cloudinary
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Ví dụ ảnh mẫu
      },
      {
        protocol: "https", // Chấp nhận ảnh từ bất kỳ nguồn nào (Dùng cẩn thận)
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
