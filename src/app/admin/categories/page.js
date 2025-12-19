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
  const [form] = Form.useForm();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho Modal (Thêm/Sửa)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // State cho Drawer (Xem chi tiết sản phẩm)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);

  // --- 1. Fetch Danh sách ---
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      const data = await res.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      message.error("Lỗi tải danh mục");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- 2. Xử lý Thêm/Sửa ---
  const handleSubmit = async (values) => {
    const url = editingCategory
      ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${editingCategory._id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/categories`;

    const method = editingCategory ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        message.success(
          editingCategory ? "Cập nhật thành công" : "Tạo mới thành công"
        );
        setIsModalOpen(false);
        form.resetFields();
        setEditingCategory(null);
        fetchCategories(); // Load lại bảng
      } else {
        message.error(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      message.error("Lỗi kết nối");
    }
  };

  // --- 3. Xử lý Xóa ---
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
        fetchCategories();
      } else {
        const data = await res.json();
        message.error(data.message || "Xóa thất bại");
      }
    } catch (error) {
      message.error("Lỗi kết nối");
    }
  };

  // --- 4. Xem chi tiết (Lấy sản phẩm) ---
  const handleViewDetails = async (category) => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
    setCategoryProducts([]); // Reset trước khi load

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${category._id}`
      );
      const data = await res.json();
      setCategoryProducts(data.products || []);
    } catch (error) {
      message.error("Không tải được danh sách sản phẩm");
    }
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      className: "font-bold",
    },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          {/* Nút Xem chi tiết */}
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />

          {/* Nút Sửa */}
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

          {/* Nút Xóa */}
          <Popconfirm
            title="Xóa danh mục này?"
            description="Hành động này không thể hoàn tác"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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

      {/* MODAL THÊM / SỬA */}
      <Modal
        title={editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
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

      {/* DRAWER XEM CHI TIẾT SẢN PHẨM */}
      <Drawer
        title={`Sản phẩm thuộc: ${selectedCategory?.name}`}
        width={500}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        {categoryProducts.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            Chưa có sản phẩm nào thuộc danh mục này.
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
