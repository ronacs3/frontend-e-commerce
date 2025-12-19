"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
// Import Ant Design components
import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Tag,
  Space,
  Image,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";

export default function ProductListPage() {
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Tạo mới, object = Sửa

  // --- 1. Load Dữ Liệu Ban Đầu ---
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [userInfo, router]);

  const fetchData = async () => {
    try {
      // Gọi song song lấy SP và Danh mục
      const [resProducts, resCats] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          cache: "no-store",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
      ]);

      const dataProducts = await resProducts.json();
      const dataCats = await resCats.json();

      setProducts(dataProducts.map((item) => ({ ...item, key: item._id })));
      setCategories(dataCats);
      setLoading(false);
    } catch (error) {
      message.error("Lỗi tải dữ liệu");
      setLoading(false);
    }
  };

  // --- 2. Các Hàm Mở Modal ---

  // Mở Modal để TẠO MỚI
  const openCreateModal = () => {
    setEditingProduct(null); // Chế độ tạo mới
    form.resetFields(); // Xóa trắng form
    setIsModalOpen(true);
  };

  // Mở Modal để SỬA
  const openEditModal = (record) => {
    setEditingProduct(record); // Chế độ sửa
    // Điền dữ liệu cũ vào form
    form.setFieldsValue({
      name: record.name,
      price: record.price,
      image: record.image,
      category: record.category,
      countInStock: record.countInStock,
      description: record.description,
    });
    setIsModalOpen(true);
  };

  // --- 3. Xử Lý Submit (Chung cho cả Tạo và Sửa) ---
  const handleModalSubmit = async (values) => {
    setSubmitting(true);

    // Xác định URL và Method dựa trên editingProduct
    const url = editingProduct
      ? `${process.env.NEXT_PUBLIC_API_URL}/products/${editingProduct._id}` // URL Sửa
      : `${process.env.NEXT_PUBLIC_API_URL}/products`; // URL Tạo

    const method = editingProduct ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          ...values,
          // Nếu tạo mới mà không nhập ảnh thì dùng ảnh mẫu
          image: values.image || "/images/sample.jpg",
        }),
      });

      if (res.ok) {
        message.success(
          editingProduct ? "Cập nhật thành công!" : "Tạo mới thành công!"
        );
        setIsModalOpen(false); // Đóng modal
        fetchData(); // Load lại bảng
      } else {
        message.error("Thao tác thất bại");
      }
    } catch (error) {
      message.error("Lỗi kết nối");
    } finally {
      setSubmitting(false);
    }
  };

  // --- 4. Xử Lý Xóa ---
  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (res.ok) {
        message.success("Đã xóa sản phẩm");
        fetchData();
      } else {
        message.error("Xóa thất bại");
      }
    } catch (error) {
      message.error("Lỗi kết nối");
    }
  };

  // --- Cấu hình cột bảng ---
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Image
            src={record.image}
            width={40}
            height={40}
            className="rounded border object-contain bg-white"
            preview={false} // Tắt preview lớn ở đây cho gọn
          />
          <span className="font-medium line-clamp-2">{text}</span>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price) => (
        <span className="font-semibold text-gray-700">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(price)}
        </span>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Kho",
      dataIndex: "countInStock",
      key: "countInStock",
      width: 80,
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 150,
      render: (_, record) => (
        <Space>
          {/* Nút Sửa: Gọi hàm openEditModal */}
          <Button
            icon={<EditOutlined />}
            type="primary"
            ghost
            onClick={() => openEditModal(record)}
          />

          {/* Nút Xóa */}
          <Popconfirm
            title="Xóa sản phẩm này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header trang */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={openCreateModal} // Mở form tạo mới
        >
          Thêm mới
        </Button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <Table
          columns={columns}
          dataSource={products}
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 700 }}
        />
      </div>

      {/* --- MODAL (Dùng chung cho cả Tạo & Sửa) --- */}
      <Modal
        title={editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()} // Kích hoạt submit form
        confirmLoading={submitting}
        okText={editingProduct ? "Lưu thay đổi" : "Tạo mới"}
        cancelText="Hủy bỏ"
        width={700}
        forceRender // Render form kể cả khi chưa mở (để reset fields hoạt động ổn định)
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
          initialValues={{ countInStock: 0, price: 0 }}
        >
          {/* Hàng 1: Tên & Danh mục */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input placeholder="Ví dụ: iPhone 15" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: "Chọn danh mục" }]}
            >
              <Select placeholder="-- Chọn --">
                {categories.map((cat) => (
                  <Select.Option key={cat._id} value={cat.name}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Hàng 2: Giá & Kho */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="price"
              label="Giá (VNĐ)"
              rules={[{ required: true, message: "Nhập giá" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              name="countInStock"
              label="Số lượng kho"
              rules={[{ required: true, message: "Nhập số lượng" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </div>

          {/* Hình ảnh */}
          <Form.Item
            name="image"
            label="Đường dẫn hình ảnh"
            rules={[{ required: true, message: "Vui lòng nhập link ảnh" }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>

          {/* Mô tả */}
          <Form.Item name="description" label="Mô tả chi tiết">
            <Input.TextArea rows={4} placeholder="Nhập thông tin chi tiết..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
