import ProductCard from "@/components/ProductCard";

// Hàm lấy dữ liệu từ Backend
async function getProducts() {
  // fetch dữ liệu từ server backend đang chạy ở port 5000
  // cache: 'no-store' giúp dữ liệu luôn mới (real-time)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Sản phẩm mới nhất
      </h1>

      {/* Grid Layout: Responsive cho điện thoại, tablet và desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
