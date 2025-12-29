"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
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
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

export default function ProductListPage() {
  /* ================= HOOKS (KHÔNG ĐIỀU KIỆN) ================= */
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const [mounted, setMounted] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  /* ================= CLIENT READY ================= */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= AUTH + LOAD DATA ================= */
  useEffect(() => {
    if (!mounted) return;

    if (!userInfo || !userInfo.isAdmin) {
      router.push("/login");
      return;
    }

    fetchData();
  }, [mounted, userInfo]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProducts, resCats] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          cache: "no-store",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
      ]);

      const dataProducts = await resProducts.json();
      const dataCats = await resCats.json();

      setProducts(dataProducts.map((p) => ({ ...p, key: p._id })));
      setCategories(dataCats);
    } catch {
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPLOAD ================= */
  const uploadFileHandler = async ({ file }) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        message.success("Upload ảnh thành công");
        form.setFieldValue("image", data.image);
        setImageUrl(data.image);
      } else {
        message.error(data.message || "Upload thất bại");
      }
    } catch {
      message.error("Lỗi upload");
    } finally {
      setUploading(false);
    }
  };

  /* ================= MODAL ================= */
  const openCreateModal = () => {
    setEditingProduct(null);
    setImageUrl("");
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingProduct(record);
    setImageUrl(record.image || "");
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  /* ================= SUBMIT ================= */
  const handleModalSubmit = async (values) => {
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products${
          editingProduct ? `/${editingProduct._id}` : ""
        }`,
        {
          method: editingProduct ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({
            ...values,
            image: values.image || "/images/sample.jpg",
          }),
        }
      );

      if (res.ok) {
        message.success(
          editingProduct ? "Cập nhật thành công" : "Tạo mới thành công"
        );
        setIsModalOpen(false);
        fetchData();
      } else {
        message.error("Thao tác thất bại");
      }
    } catch {
      message.error("Lỗi kết nối");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
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
        message.success("Đã xóa");
        fetchData();
      } else {
        message.error("Xóa thất bại");
      }
    } catch {
      message.error("Lỗi xóa");
    }
  };

  /* ================= TABLE ================= */
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      render: (_, r) => (
        <div className="flex items-center gap-3">
          <Image
            src={r.image || "/images/default-image.jpg"}
            width={40}
            height={40}
            preview={false}
            fallback="/images/default-image.jpg"
          />
          <span className="font-medium">{r.name}</span>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (p) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(p),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      render: (c) => <Tag color="blue">{c}</Tag>,
    },
    {
      title: "Kho",
      dataIndex: "countInStock",
      align: "center",
    },
    {
      title: "Hành động",
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(r)} />
          <Popconfirm title="Xóa?" onConfirm={() => handleDelete(r._id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* ================= RENDER ================= */
  return (
    <>
      {!mounted ? null : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            >
              Thêm mới
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={products}
            loading={loading}
            pagination={{ pageSize: 8 }}
            scroll={{ x: 700 }}
          />

          <Modal
            title={editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={() => form.submit()}
            confirmLoading={submitting}
            width={700}
            forceRender
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleModalSubmit}
              initialValues={{ price: 0, countInStock: 0 }}
            >
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true }]}
              >
                <Select>
                  {categories.map((c) => (
                    <Select.Option key={c._id} value={c.name}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>

              <Form.Item
                name="countInStock"
                label="Kho"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>

              <Form.Item
                name="image"
                label="Hình ảnh"
                rules={[{ required: true }]}
              >
                <Input onChange={(e) => setImageUrl(e.target.value)} />
              </Form.Item>

              <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={uploadFileHandler}
              >
                <Button
                  icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
                >
                  {uploading ? "Đang tải..." : "Chọn ảnh"}
                </Button>
              </Upload>

              {imageUrl && (
                <div className="mt-3">
                  <Image src={imageUrl} width={120} />
                </div>
              )}

              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      )}
    </>
  );
}
