"use client";

import { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        message.success("Đã gửi link khôi phục vào email của bạn!");
      } else {
        message.error(data.message || "Không tìm thấy email này");
      }
    } catch (error) {
      message.error("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quên mật khẩu?</h1>
          <p className="text-gray-500 mt-2">
            Nhập email của bạn, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
          </p>
        </div>

        <Form
          name="forgot_password"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập Email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Nhập địa chỉ Email"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-600 h-10 font-semibold"
              loading={loading}
            >
              GỬI YÊU CẦU
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Link
            href="/login"
            className="text-gray-600 hover:text-blue-600 flex items-center justify-center gap-2"
          >
            <ArrowLeftOutlined /> Quay lại đăng nhập
          </Link>
        </div>
      </Card>
    </div>
  );
}
