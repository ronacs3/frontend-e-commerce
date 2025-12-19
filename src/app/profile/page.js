"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice"; // Import action để cập nhật Redux
import { Tabs, Form, Input, Button, Table, Tag, message } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link"; // Nhớ import Link

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // State cho đơn hàng
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // --- LOGIC 1: KHỞI TẠO & CHECK LOGIN ---
  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    } else {
      fetchMyOrders();
    }
  }, [userInfo, router]);

  // --- LOGIC 2: LẤY ĐƠN HÀNG ---
  const fetchMyOrders = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/myorders`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
          cache: "no-store",
        }
      );
      const data = await res.json();
      setOrders(data);
      setLoadingOrders(false);
    } catch (error) {
      message.error("Lỗi tải lịch sử đơn hàng");
      setLoadingOrders(false);
    }
  };

  // --- LOGIC 3: CẬP NHẬT THÔNG TIN ---
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
        // Cập nhật lại Redux Store để Header hiển thị tên mới ngay lập tức
        dispatch(setCredentials(data));
      } else {
        message.error(data.message || "Lỗi cập nhật");
      }
    } catch (err) {
      message.error("Lỗi kết nối server");
    }
  };

  // --- CẤU HÌNH CỘT BẢNG ĐƠN HÀNG ---
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
      render: (text) => text.substring(0, 10),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => (
        <>
          {/* LOGIC HIỂN THỊ MỚI: Ưu tiên check Đã Hủy trước */}
          {record.isCancelled ? (
            <Tag color="red">Đã hủy</Tag>
          ) : record.isDelivered ? (
            <Tag color="green">Đã giao hàng</Tag>
          ) : record.isPaid ? (
            <Tag color="blue">Đang xử lý</Tag>
          ) : (
            <Tag color="orange">Chờ thanh toán</Tag>
          )}
        </>
      ),
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

  // --- GIAO DIỆN CẬP NHẬT THÔNG TIN ---
  const UserProfileForm = () => (
    <div className="max-w-md mx-auto py-6">
      <Form
        layout="vertical"
        initialValues={{ name: userInfo?.name, email: userInfo?.email }}
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
          <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item label="Nhập lại mật khẩu" name="confirmPassword">
          <Input.Password size="large" placeholder="Xác nhận mật khẩu mới" />
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

  // --- GIAO DIỆN DANH SÁCH ĐƠN HÀNG ---
  const MyOrdersTable = () => (
    <div className="py-4">
      <Table
        dataSource={orders}
        columns={orderColumns}
        rowKey="_id"
        loading={loadingOrders}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );

  // --- TAB ITEMS ---
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
