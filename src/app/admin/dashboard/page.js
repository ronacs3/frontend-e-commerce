"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Row, Col, Statistic, Spin, message } from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  StarOutlined,
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

const COLORS = ["#0088FE", "#FF8042"];

export default function AdminDashboard() {
  const { userInfo } = useSelector((state) => state.auth);
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/stats`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        const data = await res.json();
        setStats(data);
      } catch {
        message.error("Lỗi tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userInfo]);

  const pieData = stats.statusStats.map((item) => ({
    name:
      item._id === true || item._id === "paid"
        ? "Đã thanh toán"
        : "Chưa thanh toán",
    value: item.count,
  }));

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Spin size="large" />
      </div>
    );

  const today = stats.dailyOrders.at(-1) || {};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Tổng quan kinh doanh
      </h1>

      {/* ===== SUMMARY ===== */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} md={8}>
          <Card className="shadow-sm">
            <Statistic
              title="Doanh thu hôm nay"
              value={today.totalSales || 0}
              suffix="₫"
              prefix={<DollarCircleOutlined />}
              styles={{
                content: {
                  color: "#3f8600",
                  fontWeight: 600,
                },
              }}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="shadow-sm">
            <Statistic
              title="Đơn hàng mới"
              value={today.count || 0}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="shadow-sm">
            <Statistic
              title="Sản phẩm bán chạy"
              value={stats.topProducts[0]?.name || "N/A"}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* ===== CHARTS ===== */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} lg={16}>
          <Card className="shadow-sm">
            <h3 className="font-bold mb-4">Doanh thu 7 ngày</h3>
            <ResponsiveContainer height={300}>
              <AreaChart data={stats.dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="_id"
                  tickFormatter={(v) => new Date(v).toLocaleDateString("vi-VN")}
                />
                <YAxis />
                <Tooltip />
                <Area dataKey="totalSales" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="shadow-sm">
            <h3 className="font-bold mb-4">Tỷ lệ thanh toán</h3>
            <ResponsiveContainer height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={60}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* ===== TOP PRODUCTS ===== */}
      <Card className="shadow-sm">
        <h3 className="font-bold mb-4">Top sản phẩm bán chạy</h3>
        <ResponsiveContainer height={300}>
          <BarChart data={stats.topProducts} layout="vertical">
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="totalQty" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
