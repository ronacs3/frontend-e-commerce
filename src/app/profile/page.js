"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import { Tabs, Form, Input, Button, Table, Tag, message } from "antd";
import { UserOutlined, ShoppingOutlined } from "@ant-design/icons";
import Link from "next/link";

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
    } else {
      fetchMyOrders();
    }
  }, [userInfo, router]);

  // ================= FETCH ORDERS =================
  const fetchMyOrders = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/myorders`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
          cache: "no-store",
        }
      );

      const data = await res.json();

      // ✅ FIX CỐT LÕI: đảm bảo luôn là array
      setOrders(Array.isArray(data) ? data : data.orders || []);
      setLoadingOrders(false);
    } catch (error) {
      message.error("Lỗi tải lịch sử đơn hàng");
      setOrders([]);
      setLoadingOrders(false);
    }
  };

  // ================= UPDATE PROFILE =================
  const onFinishUpdate = async (values) => {
    const { name, email, password, confirmPassword } = values;

    if (password && password !== confirmPassword) {
      message.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({ name, email, password }),
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

  // ================= PROFILE FORM =================
  const UserProfileForm = () => (
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

  // ================= ORDERS TABLE =================
  const MyOrdersTable = () => (
    <div className="py-4">
      <Table
        dataSource={Array.isArray(orders) ? orders : []} // ✅ double-safe
        columns={orderColumns}
        rowKey="_id"
        loading={loadingOrders}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );

  // ================= TABS =================
  const items = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined /> Hồ sơ cá nhân
        </span>
      ),
      children: <UserProfileForm />,
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2">
          <ShoppingOutlined /> Lịch sử đơn hàng
        </span>
      ),
      children: <MyOrdersTable />,
    },
  ];

  // ================= RENDER =================
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Tài khoản của tôi
      </h1>

      <div className="bg-white p-6 rounded-lg shadow border min-h-[500px]">
        <Tabs defaultActiveKey="1" items={items} size="large" />
      </div>
    </div>
  );
}
