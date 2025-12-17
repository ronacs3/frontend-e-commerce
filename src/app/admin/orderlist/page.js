"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Check, X, Eye } from "lucide-react"; // Icon check xanh và x đỏ

export default function OrderListPage() {
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Kiểm tra Admin & Load dữ liệu đơn hàng
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`, // Token Admin
          },
          cache: "no-store",
        });
        const data = await res.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, router]);

  // Format tiền tệ
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading)
    return (
      <div className="p-10 text-center">Đang tải danh sách đơn hàng...</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Quản lý Đơn hàng ({orders.length})
      </h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID Đơn hàng
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Đã thanh toán
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Đã giao hàng
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Chi tiết
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b border-gray-200 text-sm font-mono text-blue-600">
                  {order._id.substring(0, 10)}...{" "}
                  {/* Chỉ hiện 10 ký tự đầu cho gọn */}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap font-medium">
                    {order.user && order.user.name
                      ? order.user.name
                      : "Khách vãng lai"}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {order.createdAt.substring(0, 10)}{" "}
                    {/* Lấy ngày tháng năm */}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap font-bold">
                    {formatPrice(order.totalPrice)}
                  </p>
                </td>

                {/* Cột Thanh toán */}
                <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <div className="flex justify-center">
                    {order.isPaid ? (
                      <Check className="text-green-500" size={20} />
                    ) : (
                      <X className="text-red-500" size={20} />
                    )}
                  </div>
                </td>

                {/* Cột Giao hàng */}
                <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <div className="flex justify-center">
                    {order.isDelivered ? (
                      <Check className="text-green-500" size={20} />
                    ) : (
                      <X className="text-red-500" size={20} />
                    )}
                  </div>
                </td>

                {/* Cột Xem chi tiết (Tạm thời chưa link đi đâu) */}
                <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => alert(`Xem chi tiết đơn ${order._id}`)}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
