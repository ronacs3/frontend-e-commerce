"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { addToCompare } from "@/redux/slices/compareSlice";
import { Button, InputNumber, Space, Tooltip, message } from "antd";
import { ShoppingCartOutlined, DiffOutlined } from "@ant-design/icons";

export default function ProductActionButtons({ product }) {
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);

  // Xử lý thêm vào giỏ
  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }));
    message.success("Đã thêm vào giỏ hàng");
  };

  // Xử lý so sánh
  const handleCompare = () => {
    dispatch(addToCompare(product));
    // addToCompare slice thường đã có message success rồi
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Chọn số lượng */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-700">Số lượng:</span>
        <InputNumber
          min={1}
          max={product.countInStock}
          value={qty}
          onChange={setQty}
        />
      </div>

      {/* Các nút hành động */}
      <Space>
        <Button
          type="primary"
          size="large"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
          className="bg-blue-600 hover:bg-blue-700 h-11"
        >
          Thêm vào giỏ
        </Button>

        <Tooltip title="Thêm vào so sánh">
          <Button
            size="large"
            icon={<DiffOutlined />}
            onClick={handleCompare}
            className="h-11 border-blue-600 text-blue-600 hover:text-blue-700 hover:border-blue-700"
          >
            So sánh
          </Button>
        </Tooltip>
      </Space>
    </div>
  );
}
