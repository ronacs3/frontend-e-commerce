"use client";

import Link from "next/link";


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
    },
    {
      title: "Phương thức thanh toán",
      link: "/payment",
      isEnabled: step2,
    },
    {
      title: "Xác nhận & Đặt hàng",
      link: "/placeorder",
      isEnabled: step3,
    },
  ];

  return (
    <nav className="checkout-steps" aria-label="Các bước thanh toán"><ol>{steps.map((item, index) => <li key={item.link} aria-current={index === current ? "step" : undefined} className={index <= current ? "is-reached" : ""}>
      <span className="checkout-step-number">{index + 1}</span>
      {item.isEnabled ? <Link href={item.link}>{item.title}</Link> : <span>{item.title}</span>}
    </li>)}</ol></nav>
  );
}
