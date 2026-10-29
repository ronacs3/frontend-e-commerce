"use client";

import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import { Tabs, Form, Input, Button, Table, Tag, message } from "antd";
import { UserOutlined, ShoppingOutlined } from "@ant-design/icons";
import Link from "next/link";

function UserProfileForm({ userInfo, onFinishUpdate }) {
  return (
    <div className="max-w-md mx-auto py-6">
      <Form
        layout="vertical"
        initialValues={{
          name: userInfo?.name,
          email: userInfo?.email,
        }}
        onFinish={onFinishUpdate}
      >
        <Form.Item
          label="Họ tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Đổi mật khẩu (Bỏ trống nếu không đổi)"
          name="password"
          rules={[{ min: 8, max: 128, message: "Mật khẩu cần từ 8 đến 128 ký tự" }]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item label="Nhập lại mật khẩu" name="confirmPassword">
          <Input.Password size="large" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          className="mt-4 bg-blue-600"
        >
          Cập nhật thông tin
        </Button>
      </Form>
    </div>
  );
}


function MyOrdersTable({ orders, orderColumns, loadingOrders }) {
  return (
    <div className="py-4">
      <Table scroll={{ x: 640 }}
        dataSource={Array.isArray(orders) ? orders : []}
        columns={orderColumns}
        rowKey="_id"
        loading={loadingOrders}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}


export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // ================= STATE =================
  const [orders, setOrders] = useState([]); // ⚠️ PHẢI là array
  const [loadingOrders, setLoadingOrders] = useState(true);

  // ================= AUTH CHECK =================
  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await apiFetch(
          `${API_BASE_URL}/orders/myorders`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
            cache: "no-store",
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        // Keep API responses defensive: the endpoint may return either an array or { orders }.
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch {
        message.error("Không thể tải lịch sử đơn hàng");
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (userInfo.token) {
      fetchMyOrders();
    }
  }, [userInfo, router]);

  // ================= UPDATE PROFILE =================
  const onFinishUpdate = async (values) => {
    const { name, email, password, confirmPassword } = values;

    if (password && password !== confirmPassword) {
      message.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      const res = await apiFetch(
        `${API_BASE_URL}/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({ name, email, ...(password ? { password } : {}) }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        message.success("Cập nhật hồ sơ thành công!");
        dispatch(setCredentials(data));
      } else {
        message.error(data.message || "Lỗi cập nhật");
      }
    } catch (err) {
      message.error("Lỗi kết nối server");
    }
  };

  // ================= TABLE COLUMNS =================
  const orderColumns = [
    {
      title: "ID Đơn hàng",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <span className="font-mono text-xs">{text}</span>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => text?.substring(0, 10),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price || 0),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        if (record.isCancelled) return <Tag color="red">Đã hủy</Tag>;
        if (record.isDelivered) return <Tag color="green">Đã giao hàng</Tag>;
        if (record.isPaid) return <Tag color="blue">Đang xử lý</Tag>;
        return <Tag color="orange">Chờ thanh toán</Tag>;
      },
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (_, record) => (
        <Link href={`/order/${record._id}`}>
          <Button size="small">Xem</Button>
        </Link>
      ),
    },
  ];

  // ================= TABS =================
  const items = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined /> Hồ sơ cá nhân
        </span>
      ),
      children: (
        <UserProfileForm
          userInfo={userInfo}
          onFinishUpdate={onFinishUpdate}
        />
      ),
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2">
          <ShoppingOutlined /> Lịch sử đơn hàng
        </span>
      ),
      children: (
        <MyOrdersTable
          orders={orders}
          orderColumns={orderColumns}
          loadingOrders={loadingOrders}
        />
      ),
    },
  ];

  // ================= RENDER =================
  return (
    <div className="account-page">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Tài khoản của tôi
      </h1>

      <div className="account-panel">
        <Tabs defaultActiveKey="1" items={items} size="large" />
      </div>
    </div>
  );
}
