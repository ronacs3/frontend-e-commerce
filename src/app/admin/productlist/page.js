"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Edit, Trash2, Plus } from "lucide-react";

export default function ProductListPage() {
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Kiểm tra quyền Admin & Load dữ liệu
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      router.push("/login"); // Đá về login nếu không phải admin
      return;
    }
    fetchProducts();
  }, [userInfo, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        cache: "no-store",
      });
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi load sản phẩm:", error);
      setLoading(false);
    }
  };

  // 2. Xử lý Xóa sản phẩm
  const deleteHandler = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${userInfo.token}`, // Gửi Token Admin
            },
          }
        );

        if (res.ok) {
          alert("Đã xóa thành công!");
          fetchProducts(); // Load lại danh sách
        } else {
          alert("Xóa thất bại");
        }
      } catch (error) {
        alert("Lỗi kết nối");
      }
    }
  };

  // 3. Xử lý Tạo sản phẩm mới
  const createProductHandler = async () => {
    if (window.confirm("Bạn muốn tạo một sản phẩm mới?")) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          // Tạo xong thì chuyển hướng sang trang Sửa (Edit) để nhập liệu
          router.push(`/admin/product/${data._id}/edit`);
        } else {
          alert("Tạo thất bại");
        }
      } catch (error) {
        alert("Lỗi kết nối");
      }
    }
  };

  if (loading)
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
        <button
          onClick={createProductHandler}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <Plus size={20} className="mr-2" /> Tạo sản phẩm
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tên
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {product._id}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap font-medium">
                    {product.name}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {product.category}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <div className="flex justify-center items-center gap-3">
                    {/* Nút Sửa: Chuyển sang trang Edit (Sẽ làm ở bước sau) */}
                    <Link href={`/admin/product/${product._id}/edit`}>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit size={18} />
                      </button>
                    </Link>

                    {/* Nút Xóa */}
                    <button
                      onClick={() => deleteHandler(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
