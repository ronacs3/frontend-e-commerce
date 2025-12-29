"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { saveShippingAddress } from "@/redux/slices/cartSlice";
import CheckoutSteps from "@/components/CheckoutSteps";

// Ant Design
import { Form, Input, Button, Card } from "antd";

export default function ShippingPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { shippingAddress } = useSelector((state) => state.cart);

  const [form] = Form.useForm();

  const submitHandler = (values) => {
    // values gồm: fullName, phone, address, city, postalCode, country
    dispatch(saveShippingAddress(values));
    router.push("/payment");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Step 2 */}
      <CheckoutSteps step1 />

      <div className="max-w-md mx-auto">
        <Card
          title="Địa chỉ giao hàng"
          variant="outlined"
          className="shadow-sm"
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              fullName: shippingAddress.fullName || "",
              phone: shippingAddress.phone || "",
              address: shippingAddress.address || "",
              city: shippingAddress.city || "",
              postalCode: shippingAddress.postalCode || "",
              country: shippingAddress.country || "",
            }}
            onFinish={submitHandler}
          >
            {/* ===== HỌ TÊN ===== */}
            <Form.Item
              label="Họ và tên người nhận"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>

            {/* ===== SĐT ===== */}
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^(0|\+84)[0-9]{9}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              ]}
            >
              <Input placeholder="090xxxxxxx" />
            </Form.Item>

            {/* ===== ĐỊA CHỈ ===== */}
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input placeholder="Số nhà, tên đường..." />
            </Form.Item>

            {/* ===== THÀNH PHỐ ===== */}
            <Form.Item
              label="Thành phố"
              name="city"
              rules={[{ required: true, message: "Vui lòng nhập thành phố" }]}
            >
              <Input placeholder="Hà Nội, TP.HCM..." />
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
