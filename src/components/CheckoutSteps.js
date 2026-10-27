"use client";

import Link from "next/link";
import { Steps } from "antd";
import {
  EnvironmentOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

export default function CheckoutSteps({ step1, step2, step3 }) {
  let current = 0;
  if (step1) current = 0;
  if (step2) current = 1;
  if (step3) current = 2;

  const steps = [
    {
      title: "Thông tin giao hàng",
      link: "/shipping",
      isEnabled: step1,
      icon: <EnvironmentOutlined />,
    },
    {
      title: "Phương thức thanh toán",
      link: "/payment",
      isEnabled: step2,
      icon: <CreditCardOutlined />,
    },
    {
      title: "Xác nhận & Đặt hàng",
      link: "/placeorder",
      isEnabled: step3,
      icon: <CheckCircleOutlined />,
    },
  ];

  const items = steps.map((item, index) => ({
    key: item.title,
    title: item.isEnabled ? (
      <Link href={item.link} className="font-bold text-slate-800 hover:text-indigo-600">
        {item.title}
      </Link>
    ) : (
      <span className="text-slate-400 font-medium cursor-not-allowed">{item.title}</span>
    ),
    icon: item.icon,
  }));

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm mb-8">
      <div className="max-w-4xl mx-auto">
        <Steps current={current} items={items} className="custom-checkout-steps" />
      </div>
    </div>
  );
}
