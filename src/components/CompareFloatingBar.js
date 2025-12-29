"use client";

import { useDispatch, useSelector } from "react-redux";
import { removeFromCompare } from "@/redux/slices/compareSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import {
  Modal,
  Button,
  Image,
  message,
  Card,
  Table,
  Space,
  Typography,
  Divider,
} from "antd";
import {
  CloseOutlined,
  RobotOutlined,
  ThunderboltFilled,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

export default function CompareFloatingBar() {
  /* ================= HOOKS (PHẢI Ở TRÊN CÙNG) ================= */
  const dispatch = useDispatch();
  const { compareItems } = useSelector((state) => state.compare);

  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= GUARD SAU KHI HOOK ĐÃ CHẠY ================= */
  const shouldRender = mounted && compareItems.length > 0;
  if (!shouldRender) return null;

  /* ================= HELPERS ================= */
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  /* ================= AI CALL ================= */
  const handleAnalyzeAI = async () => {
    if (compareItems.length < 2) {
      message.warning("Cần chọn ít nhất 2 sản phẩm để so sánh");
      return;
    }

    setAiLoading(true);
    setAiResult("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/compare-ai`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products: compareItems }),
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setAiResult((data.result || "").replace(/```html|```/g, "").trim());
    } catch {
      message.error("Lỗi phân tích AI");
    } finally {
      setAiLoading(false);
    }
  };

  /* ================= TABLE ================= */
  const columns = [
    {
      title: "Thông số",
      dataIndex: "label",
      fixed: "left",
      width: 180,
      render: (text) => <Text strong>{text}</Text>,
    },
    ...compareItems.map((item) => ({
      title: (
        <Space orientation="vertical" align="center">
          <Image src={item.image} width={80} preview={false} />
          <Text strong ellipsis>
            {item.name}
          </Text>
          <Button
            size="small"
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => dispatch(addToCart({ ...item, qty: 1 }))}
          >
            Mua
          </Button>
        </Space>
      ),
      dataIndex: item._id,
      align: "center",
      width: 260,
    })),
  ];

  const dataSource = [
    {
      key: "price",
      label: "Giá",
      ...Object.fromEntries(
        compareItems.map((i) => [
          i._id,
          <Text strong type="danger">
            {formatPrice(i.price)}
          </Text>,
        ])
      ),
    },
    {
      key: "desc",
      label: "Mô tả",
      ...Object.fromEntries(compareItems.map((i) => [i._id, i.description])),
    },
  ];

  /* ================= RENDER ================= */
  return (
    <>
      {/* FLOAT BAR */}
      <Card
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Space>
            {compareItems.map((item) => (
              <div key={item._id} style={{ position: "relative" }}>
                <Image src={item.image} width={50} preview={false} />
                <Button
                  danger
                  size="small"
                  shape="circle"
                  icon={<CloseOutlined />}
                  style={{ position: "absolute", top: -6, right: -6 }}
                  onClick={() => dispatch(removeFromCompare(item._id))}
                />
              </div>
            ))}
          </Space>

          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            So sánh ({compareItems.length})
          </Button>
        </Space>
      </Card>

      {/* MODAL */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1100}
        centered
        title="So sánh chi tiết sản phẩm"
      >
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Title level={4}>
            <ThunderboltFilled /> Góc nhìn chuyên gia AI
          </Title>

          <Button
            type="primary"
            icon={<RobotOutlined />}
            loading={aiLoading}
            onClick={handleAnalyzeAI}
          >
            Phân tích
          </Button>
        </Space>

        {aiResult && (
          <Card style={{ marginTop: 16 }}>
            <div dangerouslySetInnerHTML={{ __html: aiResult }} />
          </Card>
        )}

        <Divider />

        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
          scroll={{ x: true }}
        />
      </Modal>
    </>
  );
}
