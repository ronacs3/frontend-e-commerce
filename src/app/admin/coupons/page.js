"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Card,
  message,
  Popconfirm,
  Tag,
  Row,
  Col,
  Select,
  Space,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function AdminCouponsPage() {
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();

  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resCoupons, resCategories] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/categories`),
      ]);

      if (resCoupons.ok) {
        setCoupons(await resCoupons.json());
      }

      if (resCategories.ok) {
        setCategories(await resCategories.json());
      }
    } catch {
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.isAdmin) {
      fetchData();
    } else {
      router.push("/login");
    }
  }, [userInfo, router]);

  /* ================= CREATE COUPON ================= */
  const handleCreate = async (values) => {
    try {
      const payload = {
        code: values.code.toUpperCase(),
        discount: values.discount,
        expirationDate: values.expirationDate.format("YYYY-MM-DD"),
        applicableCategories: values.categories || [],
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons`, {
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
        message.error(data.message || "Tạo thất bại");
      }
    } catch {
      message.error("Lỗi kết nối");
    }
  };

  /* ================= DELETE COUPON ================= */
  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (res.ok) {
        message.success("Đã xóa mã");
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      } else {
        message.error("Xóa thất bại");
      }
    } catch {
      message.error("Lỗi kết nối");
    }
  };

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: "Mã Code",
      dataIndex: "code",
      render: (text) => (
        <Tag color="blue" className="text-base font-bold">
          {text}
        </Tag>
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      render: (text) => (
        <span className="font-bold text-red-600">-{text}%</span>
      ),
    },
    {
      title: "Phạm vi áp dụng",
      dataIndex: "applicableCategories",
      render: (cats) =>
        cats && cats.length > 0 ? (
          cats.map((c) => (
            <Tag key={c} color="cyan">
              {c}
            </Tag>
          ))
        ) : (
          <Tag color="gold">Tất cả sản phẩm</Tag>
        ),
    },
    {
      title: "Hết hạn",
      dataIndex: "expirationDate",
      render: (date) => {
        const isExpired = dayjs(date).isBefore(dayjs(), "day");
        return (
          <span className={isExpired ? "text-gray-400 line-through" : ""}>
            {dayjs(date).format("DD/MM/YYYY")}
            {isExpired && (
              <Tag color="red" className="ml-2">
                Hết hạn
              </Tag>
            )}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Xóa mã này?"
          description="Hành động này không thể hoàn tác."
          onConfirm={() => handleDelete(record._id)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý Mã giảm giá</h1>

      <Row gutter={24}>
        {/* ================= LEFT: FORM ================= */}
        <Col span={24} lg={8}>
          <Card title="Tạo mã mới" className="shadow-sm mb-6 bg-gray-50">
            <Form
              layout="vertical"
              form={form}
              onFinish={handleCreate}
              initialValues={{ discount: 10 }}
            >
              <Form.Item
                label="Mã Code (VD: SALE50)"
                name="code"
                rules={[{ required: true, message: "Vui lòng nhập mã" }]}
              >
                <Input
                  placeholder="Nhập mã khuyến mãi"
                  style={{ textTransform: "uppercase" }}
                />
              </Form.Item>

              {/* ✅ FIX: KHÔNG addonAfter */}
              <Form.Item
                label="Phần trăm giảm (%)"
                name="discount"
                rules={[{ required: true, message: "Nhập số %" }]}
              >
                <Space.Compact style={{ width: "100%" }}>
                  <InputNumber min={1} max={100} className="w-full" />
                  <span className="px-3 flex items-center bg-gray-100 border rounded-r">
                    %
                  </span>
                </Space.Compact>
              </Form.Item>

              <Form.Item
                label="Ngày hết hạn"
                name="expirationDate"
                rules={[{ required: true, message: "Chọn ngày hết hạn" }]}
              >
                <DatePicker
                  className="w-full"
                  format="DD/MM/YYYY"
                  disabledDate={(current) =>
                    current && current < dayjs().endOf("day")
                  }
                />
              </Form.Item>

              <Form.Item
                label="Áp dụng cho danh mục (Để trống = Tất cả)"
                name="categories"
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Chọn danh mục áp dụng"
                  maxTagCount="responsive"
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
              >
                Tạo mã
              </Button>
            </Form>
          </Card>
        </Col>

        {/* ================= RIGHT: TABLE ================= */}
        <Col span={24} lg={16}>
          <Card className="shadow-sm">
            <Table
              dataSource={coupons}
              columns={columns}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 6 }}
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
