"use client";

import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Table, Button, Tag, Space, Input, message } from "antd";
import { EyeOutlined, OrderedListOutlined, SearchOutlined } from "@ant-design/icons";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function OrderListPage() {
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth || {});

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!userInfo || !userInfo.isAdmin) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await apiFetch(`${API_BASE_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.map((order) => ({ ...order, key: order._id })));
        } else {
          message.error("Lỗi tải danh sách đơn hàng");
        }
      } catch {
        message.error("Lỗi kết nối máy chủ");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [mounted, userInfo, router]);

  const filteredOrders = orders.filter(
    (o) =>
      o._id?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const columns = [
    {
      title: "Mã Đơn Hàng",
      dataIndex: "_id",
      key: "_id",
      render: (text) => (
        <span className="font-mono font-bold text-slate-800 text-xs bg-slate-100 px-2 py-1 rounded">
          #{text?.substring(0, 10)}...
        </span>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "user",
      key: "user",
      render: (user, r) => (
        <div>
          <div className="font-bold text-slate-800 text-sm">
            {r.shippingAddress?.fullName || user?.name || "Khách vãng lai"}
          </div>
          <div className="text-[11px] text-slate-400">{user?.email || "N/A"}</div>
        </div>
      ),
    },
    {
      title: "Ngày khởi tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <span className="text-xs text-slate-600 font-medium">{formatDate(text, true)}</span>,
    },
    {
      title: "Tổng thanh toán",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => <span className="font-semibold text-rose-600">{formatCurrency(price)}</span>,
    },
    {
      title: "Thanh toán",
      key: "isPaid",
      align: "center",
      render: (_, record) =>
        record.isPaid ? (
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            Đã thanh toán ({formatDate(record.paidAt)})
          </span>
        ) : (
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">
            Chưa thanh toán
          </span>
        ),
    },
    {
      title: "Trạng thái",
      key: "status",
      align: "center",
      render: (_, record) => {
        if (record.isCancelled) {
          return (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
              Đã hủy
            </span>
          );
        }
        if (record.isDelivered) {
          return (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              Đã giao hàng
            </span>
          );
        }
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
            Đang xử lý
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Link href={`/admin/order/${record._id}`}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            className="bg-blue-600 font-bold rounded-lg"
          >
            Chi tiết
          </Button>
        </Link>
      ),
    },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <OrderedListOutlined className="text-blue-600" />
            <span>Quản Lý Đơn Hàng</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Danh sách tất cả đơn hàng phát sinh trên toàn hệ thống ({orders.length} đơn hàng)</p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Tìm theo Mã đơn hoặc Tên khách..."
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
          dataSource={filteredOrders}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
          className="custom-admin-table"
        />
      </div>
    </div>
  );
}
