"use client";

import Link from "next/link";
import { Steps } from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  CreditCardOutlined,
  SmileOutlined,
} from "@ant-design/icons";

export default function CheckoutSteps({ step1, step2, step3 }) {
  // 1. Logic xác định bước hiện tại (current index) cho Ant Design (0-based)
  // Nếu đang ở step4 (Place Order) -> index = 3
  // Nếu đang ở step3 (Payment) -> index = 2
  // ...
  let current = 0;
  if (step1) current = 0;
  if (step2) current = 1;
  if (step3) current = 2;

  // 2. Cấu hình danh sách các bước
  const steps = [
    {
      title: "Giao hàng",
      link: "/shipping",
      isEnabled: step1,
      icon: <SolutionOutlined />,
    },
    {
      title: "Thanh toán",
      link: "/payment",
      isEnabled: step2,
      icon: <CreditCardOutlined />,
    },
    {
      title: "Đặt hàng",
      link: "/placeorder",
      isEnabled: step3,
      icon: <SmileOutlined />,
    },
  ];

  // 3. Map dữ liệu sang format của Ant Design Items
  const items = steps.map((item) => ({
    key: item.title,
    title: item.isEnabled ? (
      <Link href={item.link} className="font-semibold">
        {item.title}
      </Link>
    ) : (
      <span className="text-gray-400 cursor-not-allowed">{item.title}</span>
    ),
    icon: item.icon,
  }));

  return (
    <div className="flex justify-center mb-8 mt-4">
      <div className="w-full max-w-4xl">
        <Steps
          current={current}
          items={items}
          // labelPlacement="vertical" // Bỏ comment nếu muốn text nằm dưới icon
        />
      </div>
    </div>
  );
}
