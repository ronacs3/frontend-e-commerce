"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import { Form, Input, Button, Alert, Card, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [error, setError] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { userInfo } = useSelector((state) => state.auth);

  /* ================= REDIRECT IF LOGGED ================= */
  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, [userInfo, router]);

  /* ================= SUBMIT ================= */
  const submitHandler = async (values) => {
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();

      if (res.ok) {
        dispatch(setCredentials(data));
        router.push("/");
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch {
      setError("Lỗi kết nối server");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4 overflow-hidden bg-gray-50">
      <Card className="w-full max-w-md shadow-lg rounded-xl border">
        <Title level={3} className="text-center mb-1">
          Đăng nhập
        </Title>
        <Text type="secondary" className="block text-center mb-6">
          Chào mừng bạn quay lại 👋
        </Text>

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
            className="mb-2"
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="********"
              size="large"
            />
          </Form.Item>

          <div className="flex justify-end mb-4">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Button type="primary" htmlType="submit" block size="large">
            Đăng nhập
          </Button>
        </Form>

        <div className="text-center mt-6">
          <Text type="secondary">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-blue-600 font-medium">
              Đăng ký ngay
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}
