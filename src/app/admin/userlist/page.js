"use client";

import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Table, Button, Popconfirm, message, Tag, Avatar, Input } from "antd";
import {
  DeleteOutlined,
  CheckCircleOutlined,
  UserOutlined,
  TeamOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useMounted } from "@/utils/useMounted";

export default function UserListPage() {
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth || {});

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const mounted = useMounted();

  const fetchUsers = useCallback(async () => {
    if (!userInfo?.token) return;

    try {
      setLoading(true);
      const res = await apiFetch(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.map((user) => ({ ...user, key: user._id })));
      } else {
        message.error("Lỗi tải danh sách người dùng");
      }
    } catch {
      message.error("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }, [userInfo?.token]);

  useEffect(() => {
    if (!mounted) return;

    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
    } else {
      router.push("/login");
    }
  }, [mounted, userInfo, router, fetchUsers]);

  const deleteHandler = async (id) => {
    try {
      const res = await apiFetch(
        `${API_BASE_URL}/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (res.ok) {
        message.success("Đã xóa tài khoản người dùng thành công");
        fetchUsers();
      } else {
        const data = await res.json();
        message.error(data.message || "Không thể xóa tài khoản này");
      }
    } catch {
      message.error("Lỗi thao tác xóa");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.avatar}
            icon={<UserOutlined />}
            className="bg-blue-600 font-bold shrink-0"
          >
            {record.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <div className="font-bold text-slate-800 text-sm">{record.name}</div>
            <div className="text-xs text-slate-400">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Mã tài khoản",
      dataIndex: "_id",
      key: "_id",
      render: (text) => (
        <span className="font-mono text-slate-500 text-xs bg-slate-100 px-2 py-1 rounded">
          #{text?.substring(0, 10)}...
        </span>
      ),
    },
    {
      title: "Vai trò hệ thống",
      dataIndex: "isAdmin",
      key: "isAdmin",
      align: "center",
      render: (isAdmin) =>
        isAdmin ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
            <CheckCircleOutlined /> Quản trị viên
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            Khách hàng
          </span>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          {!record.isAdmin && (
            <Popconfirm
              title="Xác nhận xóa tài khoản?"
              description="Bạn có chắc chắn muốn xóa tài khoản người dùng này không?"
              onConfirm={() => deleteHandler(record._id)}
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />} size="small" className="rounded-lg">
                Xóa
              </Button>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <TeamOutlined className="text-blue-600" />
            <span>Quản Lý Người Dùng</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Danh sách tất cả tài khoản đã đăng ký hệ thống ({users.length} tài khoản)</p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Tìm theo Tên hoặc Email..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="rounded-xl border-slate-200"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 650 }}
          className="custom-admin-table"
        />
      </div>
    </div>
  );
}
