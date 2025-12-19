"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Table, Button, Popconfirm, message, Tag } from "antd";
import {
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

export default function UserListPage() {
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Load danh sách User
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        cache: "no-store",
      });
      const data = await res.json();

      // Gắn thêm key cho mỗi item để Antd Table không báo lỗi
      const usersWithKey = data.map((user) => ({ ...user, key: user._id }));
      setUsers(usersWithKey);
      setLoading(false);
    } catch (error) {
      message.error("Lỗi tải danh sách người dùng");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
    } else {
      router.push("/login");
    }
  }, [userInfo, router]);

  // 2. Xử lý Xóa User
  const deleteHandler = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (res.ok) {
        message.success("Đã xóa người dùng thành công");
        fetchUsers(); // Load lại bảng
      } else {
        const data = await res.json();
        message.error(data.message || "Xóa thất bại");
      }
    } catch (error) {
      message.error("Lỗi kết nối server");
    }
  };

  // 3. Cấu hình các cột cho bảng Antd
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (text) => (
        <span className="text-gray-500 font-mono text-xs">{text}</span>
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <a href={`mailto:${text}`}>{text}</a>,
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      key: "isAdmin",
      align: "center",
      render: (isAdmin) =>
        isAdmin ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Admin
          </Tag>
        ) : (
          <Tag color="default" icon={<CloseCircleOutlined />}>
            User
          </Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          {/* Không cho xóa chính mình hoặc xóa Admin khác (nếu muốn logic chặt chẽ) */}
          {!record.isAdmin && (
            <Popconfirm
              title="Xóa người dùng"
              description="Bạn có chắc chắn muốn xóa user này không?"
              onConfirm={() => deleteHandler(record._id)}
              okText="Có"
              cancelText="Không"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
              >
                Xóa
              </Button>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Quản lý Người dùng
      </h1>

      <div className="bg-white p-4 rounded-lg shadow border">
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          pagination={{ pageSize: 10 }} // Phân trang: 10 dòng/trang
          scroll={{ x: 600 }} // Cho phép cuộn ngang trên mobile
        />
      </div>
    </div>
  );
}
