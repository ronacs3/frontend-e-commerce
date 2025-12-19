"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { Card, Button, Typography, Tag, notification } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty: 1 }));

    notification.success({
      message: "Thành công",
      description: `Đã thêm ${product.name} vào giỏ hàng`,
      placement: "topRight",
      duration: 2,
    });
  };

  return (
    <Card
      hoverable
      className="shadow-md"
      cover={
        <Link href={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-64 w-full object-cover"
          />
        </Link>
      }
    >
      <Link href={`/product/${product._id}`}>
        <Title level={5} className="mb-1 truncate hover:text-blue-600">
          {product.name}
        </Title>
      </Link>

      <Tag color="blue" className="mb-3">
        {product.category}
      </Tag>

      <div className="flex items-center justify-between mt-3">
        <Text strong className="text-red-600 text-lg">
          {formatPrice(product.price)}
        </Text>

        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          disabled={product.countInStock === 0}
          onClick={handleAddToCart}
        >
          Thêm
        </Button>
      </div>

      {product.countInStock === 0 && (
        <div className="mt-2">
          <Tag color="red">Hết hàng</Tag>
        </div>
      )}
    </Card>
  );
}
