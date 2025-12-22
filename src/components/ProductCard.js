"use client";

import Link from "next/link";
import Image from "next/image"; // <--- 1. IMPORT NEXT/IMAGE
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { Card, Button, Typography, Tag, message } from "antd";
import { ShoppingCartOutlined, CalendarOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleAddToCart = () => {
    // Dispatch action thêm vào giỏ (Redux sẽ tự xử lý isPreOrder nếu object product đã có)
    dispatch(addToCart({ ...product, qty: 1 }));

    message.success(
      product.isPreOrder
        ? `Đã thêm suất đặt trước "${product.name}" vào giỏ`
        : `Đã thêm "${product.name}" vào giỏ hàng`
    );
  };

  return (
    <Card
      hoverable
      className="shadow-md h-full flex flex-col"
      styles={{
        body: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
      cover={
        <Link href={`/product/${product._id}`}>
          {/* --- 2. TỐI ƯU HÌNH ẢNH VỚI NEXT/IMAGE --- */}
          <div className="relative w-full h-64 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill // Tự động co giãn theo khung cha
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover hover:scale-110 transition-transform duration-500"
            />
          </div>
        </Link>
      }
    >
      <Link href={`/product/${product._id}`}>
        <Title
          level={5}
          className="mb-1 truncate hover:text-blue-600 cursor-pointer"
        >
          {product.name}
        </Title>
      </Link>

      <div className="mb-3 flex flex-wrap gap-2">
        <Tag color="blue">{product.category}</Tag>
        {/* --- 3. HIỂN THỊ TAG PRE-ORDER --- */}
        {product.isPreOrder && <Tag color="orange">Đặt trước</Tag>}
      </div>

      <div className="mt-auto flex items-center justify-between">
        <Text strong className="text-red-600 text-lg">
          {formatPrice(product.price)}
        </Text>

        {/* --- 4. NÚT BẤM THÔNG MINH (XỬ LÝ PRE-ORDER / HẾT HÀNG) --- */}
        <Button
          type={product.isPreOrder ? "default" : "primary"}
          className={
            product.isPreOrder
              ? "bg-orange-600 text-white hover:!bg-orange-500 hover:!text-white border-none"
              : "bg-blue-600"
          }
          icon={
            product.isPreOrder ? <CalendarOutlined /> : <ShoppingCartOutlined />
          }
          disabled={product.countInStock === 0}
          onClick={handleAddToCart}
        >
          {product.countInStock === 0
            ? product.isPreOrder
              ? "Hết suất"
              : "Hết hàng"
            : product.isPreOrder
            ? "Đặt trước"
            : "Thêm"}
        </Button>
      </div>
    </Card>
  );
}
