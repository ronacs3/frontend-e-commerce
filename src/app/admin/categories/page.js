"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Popconfirm,
  Drawer,
  Card,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { formatCurrency } from "@/utils/formatters";

export default function CategoryManagementPage() {
  const { userInfo } = useSelector((state) => state.auth || {});
  const [form] = Form.useForm();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch {
      message.error("Lỗi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (values) => {
    const isEdit = Boolean(editingCategory);
    const url = isEdit
      ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${editingCategory._id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/categories`;

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        message.success(isEdit ? "Đã cập nhật danh mục" : "Đã tạo mới danh mục thành công");
        setIsModalOpen(false);
        setEditingCategory(null);
        form.resetFields();
        fetchCategories();
      } else {
        message.error(data.message || "Không thể thực hiện thao tác");
      }
    } catch {
      message.error("Lỗi kết nối máy chủ");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (res.ok) {
        message.success("Đã xóa danh mục thành công");
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } else {
        message.error("Xóa danh mục thất bại");
      }
    } catch {
      message.error("Lỗi thao tác xóa");
    }
  };

  const handleViewDetails = async (category) => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
    setCategoryProducts([]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${category._id}`
      );
      if (res.ok) {
        const data = await res.json();
        setCategoryProducts(data.products || []);
      }
    } catch {
      message.error("Không thể tải sản phẩm thuộc danh mục");
    }
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      render: (text) => (
        <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <TagsOutlined className="text-indigo-600" />
          <span>{text}</span>
        </span>
      ),
    },
    {
      title: "Mô tả chi tiết",
      dataIndex: "description",
      render: (desc) => <span className="text-xs text-slate-500">{desc || "Chưa có mô tả"}</span>,
    },
    {
      title: "Thao tác",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            className="rounded-lg text-slate-600"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCategory(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
            className="rounded-lg text-indigo-600 border-indigo-200"
          />
          <Popconfirm
            title="Xác nhận xóa danh mục?"
            description="Bạn có chắc muốn xóa danh mục này?"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record._id)}
          >
            <Button icon={<DeleteOutlined />} danger className="rounded-lg" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <TagsOutlined className="text-indigo-600" />
            <span>Quản Lý Danh Mục</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Phân loại sản phẩm trên toàn bộ hệ thống TechShop</p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 hover:!bg-indigo-700 font-bold rounded-xl h-10 shadow-md shadow-indigo-600/20"
        >
          Thêm Danh Mục Mới
        </Button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 8 }}
          className="custom-admin-table"
        />
      </div>

      <Modal
        title={
          <span className="font-extrabold text-slate-900 text-lg">
            {editingCategory ? "Sửa Thông Tin Danh Mục" : "Thêm Danh Mục Mới"}
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="pt-2">
          <Form.Item
            name="name"
            label={<span className="font-bold text-xs uppercase text-slate-700">Tên danh mục</span>}
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input className="rounded-xl" placeholder="Ví dụ: Laptop, Smartphone..." />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="font-bold text-xs uppercase text-slate-700">Mô tả danh mục</span>}
          >
            <Input.TextArea rows={3} className="rounded-xl" placeholder="Mô tả nhóm sản phẩm..." />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={
          <span className="font-bold text-slate-900">
            Sản phẩm thuộc: {selectedCategory?.name || ""}
          </span>
        }
        width={500}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        {categoryProducts.length === 0 ? (
          <p className="text-slate-400 text-center mt-10">Chưa có sản phẩm nào trong danh mục này.</p>
        ) : (
          <div className="space-y-3">
            {categoryProducts.map((item) => (
              <div key={item._id} className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-50 rounded-xl p-1 border flex items-center justify-center shrink-0">
                  <ProductImage src={item.image} alt={item.name} className="max-h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item._id}`} target="_blank" className="font-bold text-slate-800 text-sm truncate block hover:text-indigo-600">
                    {item.name}
                  </Link>
                  <span className="font-black text-rose-600 text-xs">{formatCurrency(item.price)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
}
