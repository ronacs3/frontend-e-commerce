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
  List,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Link from "next/link";

export default function CategoryManagementPage() {
  const { userInfo } = useSelector((state) => state.auth);

  /* ================= FORM (HOOK Ở TOP LEVEL) ================= */
  const [form] = Form.useForm();

  /* ================= STATE ================= */
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch {
      message.error("Lỗi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= SUBMIT ================= */
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
        message.success(isEdit ? "Cập nhật thành công" : "Tạo mới thành công");
        setIsModalOpen(false);
        setEditingCategory(null);
        form.resetFields();
        fetchCategories();
      } else {
        message.error(data.message || "Có lỗi xảy ra");
      }
    } catch {
      message.error("Lỗi kết nối");
    }
  };

  /* ================= DELETE ================= */
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
        message.success("Đã xóa danh mục");
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } else {
        message.error("Xóa thất bại");
      }
    } catch {
      message.error("Lỗi kết nối");
    }
  };

  /* ================= VIEW DETAIL ================= */
  const handleViewDetails = async (category) => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
    setCategoryProducts([]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${category._id}`
      );
      const data = await res.json();
      setCategoryProducts(data.products || []);
    } catch {
      message.error("Không tải được sản phẩm");
    }
  };

  /* ================= TABLE ================= */
  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      className: "font-bold",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />

          <Button
            icon={<EditOutlined />}
            type="primary"
            ghost
            onClick={() => {
              setEditingCategory(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          />

          <Popconfirm
            title="Xóa danh mục?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record._id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* ================= RENDER ================= */
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Danh mục</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Thêm danh mục
        </Button>
      </div>

      <Table
        dataSource={categories}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      {/* ================= MODAL ================= */}
      <Modal
        title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= DRAWER ================= */}
      <Drawer
        title={`Sản phẩm thuộc: ${selectedCategory?.name || ""}`}
        size="large"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        {categoryProducts.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            Chưa có sản phẩm nào
          </p>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={categoryProducts}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.image} shape="square" size={64} />}
                  title={
                    <Link href={`/product/${item._id}`} target="_blank">
                      {item.name}
                    </Link>
                  }
                  description={
                    <span className="text-red-600 font-bold">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </div>
  );
}
