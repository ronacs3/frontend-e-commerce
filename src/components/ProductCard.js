"use client";

import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { Card, Button, Typography, Tag, message } from "antd";
import { ShoppingCartOutlined, CalendarOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Text, Title } = Typography;

const DEFAULT_IMAGE = "/images/default-image.jpg";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const [imgSrc, setImgSrc] = useState(product?.image || DEFAULT_IMAGE);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleAddToCart = () => {
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
          {/* ⚠️ parent bắt buộc relative khi dùng fill */}
          <div className="relative w-full h-64 overflow-hidden">
            <Image
              src={imgSrc}
              alt={product?.name || "product"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover hover:scale-110 transition-transform duration-500"
              onError={() => setImgSrc(DEFAULT_IMAGE)}
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
        {product.isPreOrder && <Tag color="orange">Đặt trước</Tag>}
      </div>

      <div className="mt-auto flex items-center justify-between">
        <Text strong className="text-red-600 text-lg">
          {formatPrice(product.price)}
        </Text>

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
