"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import { Table, Card, Button, Select, Empty, Typography, Spin } from "antd";
import { DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { ChevronLeft } from "lucide-react";
import ProductImage from "@/components/ProductImage";

const { Title, Text } = Typography;

export default function CartPage() {
  /* ================= MOUNT FIX (QUAN TRỌNG) ================= */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= REDUX ================= */
  const dispatch = useDispatch();
  const { cartItems, itemsPrice, shippingPrice, totalPrice } = useSelector(
    (state) => state.cart
  );

  /* ================= HANDLERS ================= */
  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty: Number(qty) }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  /* ================= CHẶN HYDRATION ================= */
  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  /* ================= EMPTY CART ================= */
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Empty
          description={
            <Text type="secondary">Giỏ hàng của bạn đang trống</Text>
          }
        />
        <Link href="/">
          <Button type="primary" icon={<ArrowLeftOutlined />} className="mt-6">
            Quay lại mua sắm
          </Button>
        </Link>
      </div>
    );
  }

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "image",
      render: (img, record) => (
        <div className="flex items-center gap-4">
          <ProductImage
            src={img}
            alt={record.name}
            className="w-20 h-20 object-contain border rounded"
          />
          <div>
            <Link
              href={`/product/${record._id}`}
              className="font-medium hover:text-blue-600"
            >
              {record.name}
            </Link>
            <div className="text-xs text-gray-500">{record.category}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      align: "right",
      render: (price) => <Text strong>{formatPrice(price)}</Text>,
    },
    {
      title: "Số lượng",
      dataIndex: "qty",
      align: "center",
      render: (qty, record) => (
        <Select
          value={qty}
          style={{ width: 80 }}
          onChange={(value) => addToCartHandler(record, value)}
        >
          {[...Array(record.countInStock).keys()].map((x) => (
            <Select.Option key={x + 1} value={x + 1}>
              {x + 1}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Tổng",
      align: "right",
      render: (_, record) => (
        <Text strong>{formatPrice(record.price * record.qty)}</Text>
      ),
    },
    {
      title: "",
      align: "center",
      render: (_, record) => (
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => removeFromCartHandler(record._id)}
        />
      ),
    },
  ];

  /* ================= UI ================= */
  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 mb-6 hover:text-blue-600"
      >
        <ChevronLeft size={20} /> Quay lại mua sắm
      </Link>

      <Title level={3}>
        Giỏ hàng ({cartItems.reduce((a, c) => a + c.qty, 0)})
      </Title>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <Table
              dataSource={cartItems}
              columns={columns}
              rowKey="_id"
              pagination={false}
            />
          </Card>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="lg:col-span-1">
          <Card title="Cộng giỏ hàng" className="shadow-sm sticky top-4">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <Text>Tạm tính:</Text>
                <Text strong>{formatPrice(itemsPrice)}</Text>
              </div>

              <div className="flex justify-between">
                <Text>Phí vận chuyển:</Text>
                <Text strong>
                  {shippingPrice === 0 ? (
                    <span className="text-green-600">Miễn phí</span>
                  ) : (
                    formatPrice(shippingPrice)
                  )}
                </Text>
              </div>

              <div className="border-t pt-3 flex justify-between items-center">
                <Text strong>Tổng cộng:</Text>
                <Text strong className="text-red-600 text-lg">
                  {formatPrice(totalPrice)}
                </Text>
              </div>
            </div>

            <Link href="/shipping">
              <Button type="primary" block size="large">
                Tiến hành thanh toán
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
