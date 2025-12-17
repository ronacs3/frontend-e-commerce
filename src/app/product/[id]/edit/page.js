"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ArrowLeft, Save } from "lucide-react";

export default function ProductEditPage({ params }) {
  const productId = params.id; // Lấy ID từ URL
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);

  // Các biến State để lưu dữ liệu form
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);

  // 1. Load dữ liệu cũ khi vào trang
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      router.push("/login");
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
          {
            cache: "no-store",
          }
        );
        const product = await res.json();

        // Điền dữ liệu vào form
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, userInfo, router]);

  // 2. Xử lý khi bấm nút Cập nhật
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`, // Token Admin
          },
          body: JSON.stringify({
            name,
            price,
            description,
            image,
            category,
            countInStock,
          }),
        }
      );

      if (res.ok) {
        alert("Cập nhật sản phẩm thành công!");
        router.push("/admin/productlist"); // Quay về danh sách
      } else {
        alert("Cập nhật thất bại");
      }
    } catch (error) {
      alert("Lỗi kết nối");
    }
  };

  if (loading)
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/admin/productlist"
        className="inline-flex items-center text-gray-600 mb-6 hover:text-blue-600"
      >
        <ArrowLeft size={20} className="mr-1" /> Quay lại danh sách
      </Link>

      <div className="bg-white p-8 rounded-lg shadow border">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          Chỉnh sửa sản phẩm
        </h1>

        <form onSubmit={submitHandler} className="space-y-4">
          {/* Tên sản phẩm */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Tên sản phẩm
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Giá & Tồn kho (Nằm cùng 1 hàng) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Giá (VNĐ)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Tồn kho
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>
          </div>

          {/* Link ảnh */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Hình ảnh (URL)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/anh.jpg"
            />
            {/* Preview ảnh nhỏ bên dưới */}
            {image && (
              <img
                src={image}
                alt="Preview"
                className="h-20 mt-2 object-contain border"
              />
            )}
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Danh mục
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Mô tả chi tiết
            </label>
            <textarea
              rows="5"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
          >
            <Save size={20} /> CẬP NHẬT
          </button>
        </form>
      </div>
    </div>
  );
}
