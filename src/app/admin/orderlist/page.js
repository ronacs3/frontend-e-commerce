"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
// Import Ant Design
import { Table, Button, Tag, Space, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";

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
        // Thêm key cho bảng Antd
        const formattedData = data.map((order) => ({
          ...order,
          key: order._id,
        }));
        setOrders(formattedData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, router]);

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "ID Đơn hàng",
      dataIndex: "_id",
      key: "_id",
      render: (text) => (
        <span className="font-mono text-gray-500 text-xs">{text}</span>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "user",
      key: "user",
      render: (user) => (
        <span className="font-medium">{user?.name || "Khách vãng lai"}</span>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => (
        <span className="font-bold text-gray-700">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(price)}
        </span>
      ),
    },
    {
      title: "Thanh toán",
      key: "isPaid",
      align: "center",
      render: (_, record) =>
        record.isPaid ? (
          <Tag color="green">
            {new Date(record.paidAt).toLocaleDateString("vi-VN")}
          </Tag>
        ) : (
          <Tag color="red">Chưa</Tag>
        ),
    },
    {
      title: "Trạng thái",
      key: "status",
      align: "center",
      render: (_, record) => {
        // --- LOGIC HIỂN THỊ TRẠNG THÁI MỚI ---
        if (record.isCancelled) {
          return (
            <Tag color="red" className="font-bold">
              Đã hủy
            </Tag>
          );
        }
        if (record.isDelivered) {
          return <Tag color="green">Đã giao hàng</Tag>;
        }
        return <Tag color="orange">Đang xử lý</Tag>;
        // -------------------------------------
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Link href={`/admin/order/${record._id}`}>
          <Button type="link" icon={<EyeOutlined />} />
        </Link>
      ),
    },
  ];

  if (loading)
    return (
      <div className="p-10 text-center">Đang tải danh sách đơn hàng...</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Quản lý Đơn hàng ({orders.length})
      </h1>

      <div className="bg-white rounded-lg shadow border p-4">
        {/* Thay thế bảng HTML cũ bằng Ant Design Table */}
        <Table
          columns={columns}
          dataSource={orders}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }} // Cho phép cuộn ngang trên mobile
        />
      </div>
    </div>
  );
}
