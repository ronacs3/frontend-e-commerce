"use client";

import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Row, Col, Spin, message } from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  RiseOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { formatCurrency, formatDate } from "@/utils/formatters";

const COLORS = ["#2563eb", "#06b6d4", "#f59e0b", "#ef4444"];

export default function AdminDashboard() {
  const { userInfo } = useSelector((state) => state.auth || {});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    dailyOrders: [],
    statusStats: [],
    topProducts: [],
  });

  useEffect(() => {
    if (!userInfo?.isAdmin || !userInfo?.token) return;

    const fetchStats = async () => {
      try {
        const res = await apiFetch(
          `${API_BASE_URL}/orders/stats`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          message.error("Lỗi tải dữ liệu thống kê từ máy chủ");
        }
      } catch {
        message.error("Lỗi kết nối máy chủ");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userInfo]);

  const pieData = (stats.statusStats || []).map((item) => ({
    name:
      item._id === true || item._id === "paid"
        ? "Đã thanh toán"
        : "Chờ thanh toán",
    value: item.count,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  const today = stats.dailyOrders?.at(-1) || {};

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChartOutlined className="text-blue-600" />
            <span>Thống Kê Kinh Doanh TechShop</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Báo cáo tổng quan về doanh thu, đơn hàng và xu hướng bán hàng</p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs flex items-center gap-1.5">
          <RiseOutlined /> Cập nhật trực tiếp
        </div>
      </div>

      {/* STAT CARDS ROW */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={8}>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg shadow-blue-600/20 space-y-2 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl text-blue-200 mb-2">
              <DollarCircleOutlined />
            </div>
            <span className="text-xs text-blue-200 font-semibold uppercase tracking-wider block">
              Doanh thu hôm nay
            </span>
            <h3 className="text-2xl font-semibold tracking-tight text-white">
              {formatCurrency(today.totalSales || 0)}
            </h3>
            <p className="text-[11px] text-blue-200/80">Tự động tổng hợp từ tất cả giao dịch mới nhất</p>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-2 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-2xl text-cyan-600 mb-2">
              <ShoppingCartOutlined />
            </div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Đơn hàng mới hôm nay
            </span>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">
              {today.count || 0} <span className="text-sm font-normal text-slate-500">đơn hàng</span>
            </h3>
            <p className="text-[11px] text-slate-400">Khách đặt trực tuyến hôm nay</p>
          </div>
        </Col>

        <Col xs={24} sm={24} lg={8}>
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-2 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl text-amber-500 mb-2">
              <StarOutlined />
            </div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Sản phẩm bán chạy nhất
            </span>
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {stats.topProducts[0]?.name || "N/A"}
            </h3>
            <p className="text-[11px] text-emerald-600 font-bold">
              Đã bán: {stats.topProducts[0]?.totalQty || 0} sản phẩm
            </p>
          </div>
        </Col>
      </Row>

      {/* RECHARTS SECTION */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Biểu đồ doanh thu 7 ngày gần nhất
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={stats.dailyOrders || []}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="_id"
                  tickFormatter={(v) => formatDate(v)}
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                  labelFormatter={(v) => `Ngày: ${formatDate(v)}`}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                />
                <Area
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Tỷ lệ trạng thái thanh toán
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={65} outerRadius={95} paddingAngle={4}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>

      {/* TOP PRODUCTS BAR CHART */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
          Bảng xếp hạng Top sản phẩm tiêu biểu
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.topProducts || []} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis type="number" stroke="#64748b" fontSize={12} />
            <YAxis dataKey="name" type="category" width={160} stroke="#64748b" fontSize={12} />
            <Tooltip formatter={(value) => [`${value} lượt bán`, "Số lượng"]} />
            <Bar dataKey="totalQty" fill="#06b6d4" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
