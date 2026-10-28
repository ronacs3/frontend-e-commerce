"use client";

import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  DatePicker,
  message,
  Popconfirm,
  Row,
  Col,
  Select,
  Space,
} from "antd";
import { DeleteOutlined, PlusOutlined, GifOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { formatDate } from "@/utils/formatters";
import { useMounted } from "@/utils/useMounted";

export default function AdminCouponsPage() {
  const { userInfo } = useSelector((state) => state.auth || {});
  const router = useRouter();

  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const mounted = useMounted();

  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    if (!userInfo?.token) return;

    setLoading(true);
    try {
      const [resCoupons, resCategories] = await Promise.all([
        apiFetch(`${API_BASE_URL}/coupons`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }),
        apiFetch(`${API_BASE_URL}/categories`),
      ]);

      if (resCoupons.ok) {
        setCoupons(await resCoupons.json());
      }

      if (resCategories.ok) {
        const catData = await resCategories.json();
        setCategories(catData.map((c) => c.name || c));
      }
    } catch {
      message.error("Lỗi tải dữ liệu mã giảm giá");
    } finally {
      setLoading(false);
    }
  }, [userInfo?.token]);

  useEffect(() => {
    if (!mounted) return;

    if (userInfo?.isAdmin) {
      fetchData();
    } else {
      router.push("/login");
    }
  }, [mounted, userInfo, router, fetchData]);

  const handleCreate = async (values) => {
    try {
      const payload = {
        code: values.code.toUpperCase(),
        discount: values.discount,
        expirationDate: values.expirationDate.format("YYYY-MM-DD"),
        applicableCategories: values.categories || [],
      };

      const res = await apiFetch(`${API_BASE_URL}/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        message.success("Tạo mã giảm giá thành công");
        form.resetFields();
        setCoupons((prev) => [...prev, data]);
      } else {
        message.error(data.message || "Tạo mã thất bại");
      }
    } catch {
      message.error("Lỗi kết nối máy chủ");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await apiFetch(
        `${API_BASE_URL}/coupons/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (res.ok) {
        message.success("Đã xóa mã giảm giá thành công");
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      } else {
        message.error("Xóa thất bại");
      }
    } catch {
      message.error("Lỗi kết nối");
    }
  };

  const columns = [
    {
      title: "Mã Code",
      dataIndex: "code",
      render: (text) => (
        <span className="font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl text-sm tracking-wider">
          {text}
        </span>
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      render: (text) => (
        <span className="font-black text-rose-600 text-sm">-{text}%</span>
      ),
    },
    {
      title: "Phạm vi áp dụng",
      dataIndex: "applicableCategories",
      render: (cats) =>
        cats && cats.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {cats.map((c) => (
              <span key={c} className="bg-cyan-50 text-cyan-700 font-bold px-2 py-0.5 rounded text-[11px]">
                {c}
              </span>
            ))}
          </div>
        ) : (
          <span className="bg-amber-50 text-amber-700 font-bold px-2.5 py-0.5 rounded text-xs">
            Tất cả sản phẩm
          </span>
        ),
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expirationDate",
      render: (date) => {
        const isExpired = dayjs(date).isBefore(dayjs(), "day");
        return (
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${isExpired ? "text-slate-400 line-through" : "text-slate-700"}`}>
              {formatDate(date)}
            </span>
            {isExpired && (
              <span className="bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded text-[10px]">
                Hết hạn
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Xóa mã giảm giá này?"
          description="Hành động này không thể hoàn tác."
          onConfirm={() => handleDelete(record._id)}
          okButtonProps={{ danger: true }}
        >
          <Button danger size="small" icon={<DeleteOutlined />} className="rounded-lg" />
        </Popconfirm>
      ),
    },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <GifOutlined className="text-indigo-600" />
          <span>Quản Lý Mã Giảm Giá (Vouchers)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Tạo mã khuyến mãi và cài đặt danh mục áp dụng</p>
      </div>

      <Row gutter={[24, 24]}>
        {/* CREATE FORM */}
        <Col xs={24} lg={9}>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-800 text-base border-b border-slate-100 pb-3">
              Tạo mã giảm giá mới
            </h3>

            <Form
              layout="vertical"
              form={form}
              onFinish={handleCreate}
              initialValues={{ discount: 10 }}
              className="space-y-3"
            >
              <Form.Item
                label={<span className="font-bold text-xs uppercase text-slate-700">Mã Code Vouchers</span>}
                name="code"
                rules={[{ required: true, message: "Vui lòng nhập mã" }]}
              >
                <Input
                  placeholder="Ví dụ: TECH2026, SUMMER50..."
                  className="rounded-xl font-bold uppercase"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold text-xs uppercase text-slate-700">Phần trăm giảm giá (%)</span>}
                name="discount"
                rules={[{ required: true, message: "Nhập % giảm giá" }]}
              >
                <InputNumber min={1} max={100} className="w-full rounded-xl" />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold text-xs uppercase text-slate-700">Ngày hết hạn</span>}
                name="expirationDate"
                rules={[{ required: true, message: "Chọn ngày hết hạn" }]}
              >
                <DatePicker
                  className="w-full rounded-xl"
                  format="DD/MM/YYYY"
                  disabledDate={(current) =>
                    current && current < dayjs().endOf("day")
                  }
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold text-xs uppercase text-slate-700">Danh mục áp dụng</span>}
                name="categories"
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Để trống = Áp dụng tất cả"
                  className="rounded-xl"
                >
                  {categories.map((cat) => (
                    <Select.Option key={cat} value={cat}>
                      {cat}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                block
                size="large"
                className="bg-indigo-600 hover:!bg-indigo-700 font-bold rounded-2xl h-12 shadow-md shadow-indigo-600/20"
              >
                Khởi Tạo Mã Khuyến Mãi
              </Button>
            </Form>
          </div>
        </Col>

        {/* COUPON LIST TABLE */}
        <Col xs={24} lg={15}>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <Table
              dataSource={coupons}
              columns={columns}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 6 }}
              scroll={{ x: 600 }}
              className="custom-admin-table"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
