"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import { Form, Input, Button, Alert, Card, Typography } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [error, setError] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  /* ================= SUBMIT ================= */
  const submitHandler = async (values) => {
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(setCredentials(data));
        router.push("/");
      } else {
        setError(data.message || "Đăng ký thất bại");
      }
    } catch {
      setError("Lỗi kết nối server");
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md shadow-md border">
        <Title level={3} className="text-center mb-6">
          Đăng ký tài khoản
        </Title>

        {error && (
          <Alert type="error" message={error} showIcon className="mb-4" />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={submitHandler}
          requiredMark={false}
        >
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nguyễn Văn A"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="nhap@email.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="********"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu nhập lại không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="********"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            className="mt-2"
          >
            Đăng ký
          </Button>
        </Form>

        <div className="text-center mt-4">
          <Text type="secondary">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-blue-500">
              Đăng nhập
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}
