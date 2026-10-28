"use client";

import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCompare, clearCompare } from "@/redux/slices/compareSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { Modal, Button, Table, message, Tooltip } from "antd";
import { CloseOutlined, RobotOutlined, SwapOutlined, ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import ProductImage from "@/components/ProductImage";
import { formatCurrency } from "@/utils/formatters";

export default function CompareFloatingBar() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth || {});
  const { compareItems } = useSelector((state) => state.compare || { compareItems: [] });

  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldRender = mounted && compareItems && compareItems.length > 0;
  if (!shouldRender) return null;

  const handleAnalyzeAI = async () => {
    if (compareItems.length < 2) {
      message.warning("Vui lòng chọn ít nhất 2 sản phẩm để thực hiện phân tích");
      return;
    }

    setAiLoading(true);
    setAiResult("");

    try {
      const res = await apiFetch(
        `${API_BASE_URL}/products/compare-ai`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {}) },
          body: JSON.stringify({ products: compareItems.map(({ _id }) => ({ _id })) }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể so sánh sản phẩm");
      setAiResult((data.result || "").replace(/```html|```/g, "").trim());
    } catch {
      message.error("Lỗi khi kết nối với trí tuệ nhân tạo AI");
    } finally {
      setAiLoading(false);
    }
  };

  const columns = [
    {
      title: "Thông số / Tiêu chí",
      dataIndex: "label",
      fixed: "left",
      width: 160,
      render: (text) => <span className="font-bold text-slate-800">{text}</span>,
    },
    ...compareItems.map((item) => ({
      title: (
        <div className="flex flex-col items-center gap-2 p-2">
          <div className="w-16 h-16 bg-slate-50 rounded-xl p-1 border border-slate-200 flex items-center justify-center">
            <ProductImage src={item.image} alt={item.name} className="max-h-full object-contain" />
          </div>
          <span className="font-bold text-slate-800 text-xs line-clamp-2">{item.name}</span>
          <Button
            size="small"
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => {
              dispatch(addToCart({ ...item, qty: 1 }));
              message.success(`Đã thêm ${item.name} vào giỏ`);
            }}
            className="bg-indigo-600 font-bold rounded-lg text-xs"
          >
            Thêm vào giỏ
          </Button>
        </div>
      ),
      dataIndex: item._id,
      align: "center",
      width: 240,
    })),
  ];

  const dataSource = [
    {
      key: "price",
      label: "Giá niêm yết",
      ...Object.fromEntries(
        compareItems.map((i) => [
          i._id,
          <span key={i._id} className="font-black text-rose-600">
            {formatCurrency(i.price)}
          </span>,
        ])
      ),
    },
    {
      key: "category",
      label: "Danh mục",
      ...Object.fromEntries(
        compareItems.map((i) => [
          i._id,
          <span key={i._id} className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">
            {i.category}
          </span>,
        ])
      ),
    },
    {
      key: "desc",
      label: "Mô tả vắn tắt",
      ...Object.fromEntries(
        compareItems.map((i) => [
          i._id,
          <span key={i._id} className="text-xs text-slate-600 leading-relaxed block text-left">
            {i.description || "N/A"}
          </span>,
        ])
      ),
    },
  ];

  return (
    <>
      {/* Floating Bottom Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 glass-card px-6 py-3 rounded-2xl shadow-2xl border border-white/40 flex items-center gap-6 max-w-4xl w-[90vw] justify-between transition-all animate-bounce-short">
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          <span className="text-xs font-bold text-slate-700 hidden sm:inline">So sánh:</span>
          {compareItems.map((item) => (
            <div key={item._id} className="relative group shrink-0">
              <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 p-1 flex items-center justify-center shadow-xs">
                <ProductImage src={item.image} alt={item.name} className="max-h-full object-contain" />
              </div>
              <button
                onClick={() => dispatch(removeFromCompare(item._id))}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shadow-md hover:bg-rose-600 transition"
              >
                <CloseOutlined />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<SwapOutlined />}
            className="bg-indigo-600 hover:!bg-indigo-700 font-bold rounded-xl h-10 shadow-md shadow-indigo-600/20"
          >
            So sánh ngay ({compareItems.length})
          </Button>
          <Tooltip title="Xóa tất cả">
            <button
              onClick={() => dispatch(clearCompare())}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            >
              <DeleteOutlined className="text-base" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Compare Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1000}
        centered
        title={
          <div className="flex items-center gap-2 font-black text-lg text-slate-800">
            <SwapOutlined className="text-indigo-600" />
            <span>So sánh chi tiết các sản phẩm</span>
          </div>
        }
      >
        <div className="space-y-6 pt-4">
          <div className="flex justify-between items-center bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100">
            <div>
              <h4 className="font-extrabold text-indigo-900 text-sm">Phân tích chuyên sâu từ AI TechShop</h4>
              <p className="text-xs text-indigo-600">Đưa ra nhận định so sánh chi tiết giữa các sản phẩm đã chọn</p>
            </div>
            <Button
              type="primary"
              icon={<RobotOutlined />}
              loading={aiLoading}
              onClick={handleAnalyzeAI}
              className="bg-indigo-600 hover:!bg-indigo-700 font-bold rounded-xl"
            >
              Phân tích ngay
            </Button>
          </div>

          {aiResult && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-sm leading-relaxed text-slate-700 space-y-2">
              <div dangerouslySetInnerHTML={{ __html: aiResult }} />
            </div>
          )}

          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            bordered
            scroll={{ x: true }}
            className="custom-compare-table"
          />
        </div>
      </Modal>
    </>
  );
}
