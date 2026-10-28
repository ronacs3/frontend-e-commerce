"use client";

import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

import { useCallback, useEffect, useState } from "react";
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
  Upload,
  Spin,
  Switch,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  LoadingOutlined,
  SearchOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import ProductImage from "@/components/ProductImage";
import { formatCurrency } from "@/utils/formatters";
import { useMounted } from "@/utils/useMounted";

export default function ProductListPage() {
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth || {});
  const [form] = Form.useForm();

  const mounted = useMounted();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [resProducts, resCats] = await Promise.all([
        apiFetch(`${API_BASE_URL}/products`, {
          cache: "no-store",
        }),
        apiFetch(`${API_BASE_URL}/categories`),
      ]);

      const dataProducts = await resProducts.json();
      const dataCats = await resCats.json();

      setProducts(dataProducts.map((p) => ({ ...p, key: p._id })));
      setCategories(dataCats);
    } catch {
      message.error("Lỗi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!userInfo || !userInfo.isAdmin) {
      router.push("/login");
      return;
    }

    fetchData();
  }, [mounted, userInfo, router, fetchData]);

  const uploadFileHandler = async ({ file }) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await apiFetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${userInfo.token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        message.success("Tải ảnh lên thành công");
        form.setFieldValue("image", data.image);
        setImageUrl(data.image);
      } else {
        message.error(data.message || "Tải ảnh thất bại");
      }
    } catch {
      message.error("Lỗi kết nối khi tải ảnh");
    } finally {
      setUploading(false);
    }
  };

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

  const handleModalSubmit = async (values) => {
    setSubmitting(true);
    try {
      const res = await apiFetch(
        `${API_BASE_URL}/products${
          editingProduct ? `/${editingProduct._id}` : ""
        }`,
        {
          method: editingProduct ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({
            name: values.name,
            category: values.category,
            brand: values.brand || "",
            description: values.description || "",
            price: values.price,
            countInStock: values.countInStock,
            images: values.images || [],
            image: values.image || "/images/default-image.jpg",
          }),
        }
      );

      if (res.ok) {
        message.success(
          editingProduct ? "Đã cập nhật sản phẩm" : "Đã tạo mới sản phẩm thành công"
        );
        setIsModalOpen(false);
        fetchData();
      } else {
        message.error("Thao tác thất bại");
      }
    } catch {
      message.error("Lỗi kết nối máy chủ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await apiFetch(
        `${API_BASE_URL}/products/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (res.ok) {
        message.success("Đã xóa sản phẩm");
        fetchData();
      } else {
        message.error("Không thể xóa sản phẩm này");
      }
    } catch {
      message.error("Lỗi thao tác xóa");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      render: (_, r) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shrink-0">
            <ProductImage src={r.image} alt={r.name} className="max-h-full object-contain" />
          </div>
          <div>
            <div className="font-bold text-slate-800 text-sm line-clamp-1">{r.name}</div>
            <div className="text-[11px] text-slate-400 font-mono">ID: {r._id?.substring(0, 8)}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      render: (p) => <span className="font-black text-rose-600">{formatCurrency(p)}</span>,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      render: (c) => (
        <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg text-xs">
          {c || "Khác"}
        </span>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "countInStock",
      align: "center",
      render: (stock) => (
        <span
          className={`font-bold text-xs px-2.5 py-1 rounded-lg ${
            stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {stock > 0 ? `${stock} cái` : "Hết hàng"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      align: "center",
      render: (_, r) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(r)}
            className="rounded-lg text-indigo-600 hover:text-indigo-700 border-indigo-200"
          />
          <Popconfirm
            title="Xác nhận xóa sản phẩm?"
            description="Hành động này không thể khôi phục."
            onConfirm={() => handleDelete(r._id)}
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} className="rounded-lg" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Action Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingOutlined className="text-indigo-600" />
            <span>Quản Lý Sản Phẩm</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Danh sách sản phẩm trong kho cửa hàng TechShop</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Tìm theo tên hoặc danh mục..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="rounded-xl border-slate-200"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            className="bg-indigo-600 hover:!bg-indigo-700 font-bold rounded-xl h-10 shadow-md shadow-indigo-600/20 shrink-0"
          >
            Thêm Sản Phẩm Mới
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredProducts}
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 750 }}
          className="custom-admin-table"
        />
      </div>

      {/* Edit / Create Modal */}
      <Modal
        title={
          <span className="font-extrabold text-slate-900 text-lg">
            {editingProduct ? "Cập Nhật Thông Tin Sản Phẩm" : "Thêm Sản Phẩm Mới"}
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        width={680}
        centered
        forceRender
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
          initialValues={{ price: 0, countInStock: 0, isPreOrder: false }}
          className="pt-2 space-y-3"
        >
          <Form.Item
            name="name"
            label={<span className="font-bold text-xs uppercase text-slate-700">Tên sản phẩm</span>}
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input className="rounded-xl" placeholder="Ví dụ: iPhone 16 Pro Max 256GB" />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              name="category"
              label={<span className="font-bold text-xs uppercase text-slate-700">Danh mục</span>}
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <Select className="rounded-xl" placeholder="Chọn danh mục">
                {categories.map((c) => (
                  <Select.Option key={c._id} value={c.name}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="isPreOrder"
              label={<span className="font-bold text-xs uppercase text-slate-700">Sản phẩm đặt trước?</span>}
              valuePropName="checked"
            >
              <Switch checkedChildren="Có" unCheckedChildren="Không" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              name="price"
              label={<span className="font-bold text-xs uppercase text-slate-700">Giá bán (VND)</span>}
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} className="rounded-xl" />
            </Form.Item>

            <Form.Item
              name="countInStock"
              label={<span className="font-bold text-xs uppercase text-slate-700">Số lượng kho</span>}
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} className="rounded-xl" />
            </Form.Item>
          </div>

          <Form.Item
            name="image"
            label={<span className="font-bold text-xs uppercase text-slate-700">Đường dẫn hình ảnh</span>}
            rules={[{ required: true }]}
          >
            <Input
              placeholder="https://..."
              className="rounded-xl"
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </Form.Item>

          <div className="flex items-center gap-4">
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={uploadFileHandler}
            >
              <Button icon={uploading ? <LoadingOutlined /> : <UploadOutlined />} className="rounded-xl">
                {uploading ? "Đang tải lên..." : "Tải ảnh từ thiết bị"}
              </Button>
            </Upload>

            {imageUrl && (
              <div className="w-16 h-16 bg-slate-50 rounded-xl border p-1 flex items-center justify-center overflow-hidden">
                <ProductImage src={imageUrl} alt="preview" className="max-h-full object-contain" />
              </div>
            )}
          </div>

          <Form.Item
            name="description"
            label={<span className="font-bold text-xs uppercase text-slate-700">Mô tả sản phẩm</span>}
          >
            <Input.TextArea rows={4} className="rounded-xl" placeholder="Mô tả cấu hình, tính năng nổi bật..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
