"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { savePaymentMethod } from "@/redux/slices/cartSlice";
import CheckoutSteps from "@/components/CheckoutSteps";
import { Form, Radio, Button } from "antd";
import { CreditCardOutlined, DollarOutlined, ArrowRightOutlined, BankOutlined } from "@ant-design/icons";

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { shippingAddress, paymentMethod } = useSelector((state) => state.cart || {});

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
    <div className="checkout-page">
      <CheckoutSteps step1 step2 />

      <div className="checkout-form-card">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <CreditCardOutlined className="text-blue-600" />
            <span>Phương thức thanh toán</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Chọn hình thức thanh toán thuận tiện nhất cho bạn</p>
        </div>

        <Form
          layout="vertical"
          initialValues={{
            paymentMethod: paymentMethod || "COD",
          }}
          onFinish={submitHandler}
        >
          <Form.Item
            name="paymentMethod"
            rules={[{ required: true, message: "Vui lòng chọn phương thức" }]}
          >
            <Radio.Group className="flex flex-col gap-4 w-full">
              <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 transition-all cursor-pointer">
                <Radio value="COD" className="w-full font-bold text-slate-800">
                  <div className="inline-flex items-center gap-3 ml-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                      <DollarOutlined />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">Thanh toán khi nhận hàng (COD)</div>
                      <div className="text-xs font-normal text-slate-400">Kiểm tra hàng trước khi nhận và trả tiền trực tiếp</div>
                    </div>
                  </div>
                </Radio>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 transition-all cursor-pointer">
                <Radio value="PayPal" className="w-full font-bold text-slate-800">
                  <div className="inline-flex items-center gap-3 ml-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                      <CreditCardOutlined />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">Thanh toán qua PayPal / Thẻ quốc tế</div>
                      <div className="text-xs font-normal text-slate-400">Thanh toán trực tuyến nhanh chóng và bảo mật 100%</div>
                    </div>
                  </div>
                </Radio>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 transition-all cursor-pointer">
                <Radio value="BankTransfer" className="w-full font-bold text-slate-800">
                  <div className="inline-flex items-center gap-3 ml-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center text-lg">
                      <BankOutlined />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">Chuyển khoản Ngân hàng (QR Code)</div>
                      <div className="text-xs font-normal text-slate-400">Quét mã QR chuyển khoản nhanh 24/7 không mất phí</div>
                    </div>
                  </div>
                </Radio>
              </div>
            </Radio.Group>
          </Form.Item>

          <Form.Item className="mb-0 pt-4">
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="bg-blue-600 hover:!bg-blue-700 font-bold rounded-2xl h-12 text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              <span>Xem lại & Đặt hàng</span>
              <ArrowRightOutlined />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
