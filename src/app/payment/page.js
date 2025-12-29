"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { savePaymentMethod } from "@/redux/slices/cartSlice";
import CheckoutSteps from "@/components/CheckoutSteps";

// Ant Design
import { Card, Form, Radio, Button } from "antd";

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { shippingAddress, paymentMethod } = useSelector((state) => state.cart);

  /* ===== GUARD: CHƯA CÓ SHIPPING ===== */
  useEffect(() => {
    if (!shippingAddress?.address) {
      router.push("/shipping");
    }
  }, [shippingAddress, router]);

  const submitHandler = (values) => {
    dispatch(savePaymentMethod(values.paymentMethod));
    router.push("/placeorder");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Step 3 */}
      <CheckoutSteps step1 step2 step3 />

      <div className="max-w-md mx-auto">
        <Card
          title="Phương thức thanh toán"
          variant="outlined"
          className="shadow-sm"
        >
          <Form
            layout="vertical"
            initialValues={{
              paymentMethod: paymentMethod || "PayPal",
            }}
            onFinish={submitHandler}
          >
            <Form.Item
              name="paymentMethod"
              rules={[{ required: true, message: "Vui lòng chọn phương thức" }]}
            >
              <Radio.Group className="flex flex-col gap-4">
                <Radio value="PayPal">PayPal hoặc Thẻ tín dụng</Radio>
                <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item className="mb-0">
              <Button type="primary" htmlType="submit" block size="large">
                Tiếp tục
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
