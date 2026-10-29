"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { saveShippingAddress } from "@/redux/slices/cartSlice";
import CheckoutSteps from "@/components/CheckoutSteps";
import { Form, Input, Button } from "antd";
import { UserOutlined, PhoneOutlined, HomeOutlined, EnvironmentOutlined, ArrowRightOutlined } from "@ant-design/icons";

export default function ShippingPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { shippingAddress } = useSelector((state) => state.cart || {});

  const [form] = Form.useForm();

  const submitHandler = (values) => {
    dispatch(saveShippingAddress(values));
    router.push("/payment");
  };

  return (
    <div className="checkout-page">
      <CheckoutSteps step1 />

      <div className="checkout-form-card">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <EnvironmentOutlined className="text-blue-600" />
            <span>Địa chỉ giao hàng</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Nhập chính xác thông tin để đơn hàng được giao đúng hẹn</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            fullName: shippingAddress?.fullName || "",
            phone: shippingAddress?.phone || "",
            address: shippingAddress?.address || "",
            city: shippingAddress?.city || "",
            postalCode: shippingAddress?.postalCode || "",
            country: shippingAddress?.country || "Việt Nam",
          }}
          onFinish={submitHandler}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="font-bold text-xs text-slate-700 uppercase">Họ và tên người nhận</span>}
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input
              prefix={<UserOutlined className="text-slate-400 mr-1" />}
              placeholder="Nguyễn Văn A"
              size="large"
              className="rounded-xl border-slate-200"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-bold text-xs text-slate-700 uppercase">Số điện thoại liên hệ</span>}
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: /^(0|\+84)[0-9]{9}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="text-slate-400 mr-1" />}
              placeholder="090xxxxxxx"
              size="large"
              className="rounded-xl border-slate-200"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-bold text-xs text-slate-700 uppercase">Địa chỉ chi tiết</span>}
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input
              prefix={<HomeOutlined className="text-slate-400 mr-1" />}
              placeholder="Số nhà, tên đường, phường/xã..."
              size="large"
              className="rounded-xl border-slate-200"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-bold text-xs text-slate-700 uppercase">Tỉnh / Thành phố</span>}
            name="city"
            rules={[{ required: true, message: "Vui lòng nhập thành phố" }]}
          >
            <Input
              prefix={<EnvironmentOutlined className="text-slate-400 mr-1" />}
              placeholder="Hà Nội, TP. Hồ Chí Minh, Đà Nẵng..."
              size="large"
              className="rounded-xl border-slate-200"
            />
          </Form.Item>

          <Form.Item className="pt-2 mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="bg-blue-600 hover:!bg-blue-700 font-bold rounded-2xl h-12 text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              <span>Tiếp tục chọn thanh toán</span>
              <ArrowRightOutlined />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
