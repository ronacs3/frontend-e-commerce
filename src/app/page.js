import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter"; // Import Sidebar vừa tạo

// 1. Cập nhật hàm gọi API nhận thêm min, max
async function getProducts({ category, keyword, min, max }) {
  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (keyword) params.append("keyword", keyword);

  // --- SỬA ĐOẠN NÀY ---
  // Thay vì price[gte], dùng tên biến đơn giản để tránh lỗi mã hóa URL
  if (min) params.append("minPrice", min);
  if (max) params.append("maxPrice", max);
  // -------------------

  // Log ra để kiểm tra URL cuối cùng
  console.log(
    "API URL:",
    `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`
  );

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];
  return res.json();
}

export default async function Home({ searchParams }) {
  // 2. Lấy toàn bộ tham số từ URL
  const { category, keyword, min, max } = await searchParams;

  // 3. Gọi API với các tham số lọc
  const products = await getProducts({ category, keyword, min, max });

  // 4. Logic tiêu đề
  let pageTitle = "Tất cả sản phẩm";
  if (keyword) pageTitle = `Tìm kiếm: "${keyword}"`;
  else if (category) pageTitle = `Danh mục: ${category}`;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* --- LEFT SIDEBAR (Bộ lọc) --- */}
        <div className="w-full lg:w-1/4 h-fit">
          <ProductFilter />
        </div>

        {/* --- RIGHT CONTENT (Danh sách sản phẩm) --- */}
        <div className="w-full lg:w-3/4">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 uppercase border-l-4 border-blue-600 pl-3 bg-white p-2 rounded shadow-sm">
            {pageTitle}
            <span className="text-sm font-normal text-gray-500 ml-2 normal-case">
              (Tìm thấy {products.length} sản phẩm)
            </span>
          </h1>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">
                Không tìm thấy sản phẩm phù hợp.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
