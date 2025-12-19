import ProductCard from "@/components/ProductCard";

// Hàm gọi API xây dựng query string động
async function getProducts({ category, keyword }) {
  // Tạo đối tượng URLSearchParams để xử lý query string chuyên nghiệp
  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (keyword) params.append("keyword", keyword);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function Home({ searchParams }) {
  // 1. Lấy cả category và keyword từ URL
  const { category, keyword } = await searchParams; // Next.js 15 await

  // 2. Gọi API
  const products = await getProducts({ category, keyword });

  // 3. Logic hiển thị tiêu đề trang
  let pageTitle = "Sản phẩm mới nhất";
  if (keyword) pageTitle = `Kết quả tìm kiếm: "${keyword}"`;
  else if (category) pageTitle = `Danh mục: ${category}`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800 uppercase border-l-4 border-blue-600 pl-3">
        {pageTitle}
      </h1>

      {/* Kết quả */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            Không tìm thấy sản phẩm nào{" "}
            {keyword ? `cho từ khóa "${keyword}"` : ""}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
