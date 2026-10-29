"use client";

import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

import { useState } from "react";
import AuthShell from "@/components/AuthShell";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import { Alert, Button, Form, Input } from "antd";
import {
  ArrowRightOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const submitHandler = async (values) => {
    setError("");
    setIsSubmitting(true);

    try {
      const res = await apiFetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name, email: values.email, password: values.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng ký không thành công. Vui lòng thử lại.");
        return;
      }

      dispatch(setCredentials(data));
      router.push("/");
    } catch {
      setError("Không thể kết nối máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell>
          <div className="w-full max-w-[420px]">

            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold text-blue-600">Tài khoản TechShop</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tạo tài khoản</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Điền thông tin bên dưới để tham gia TechShop.
              </p>
            </div>

            {error && <Alert type="error" title={error} showIcon className="mb-5 rounded-lg" />}

            <Form
              form={form}
              layout="vertical"
              onFinish={submitHandler}
              requiredMark={false}
              size="large"
            >
              <Form.Item
                label={<span className="font-medium text-slate-700">Họ và tên</span>}
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input
                  autoComplete="name"
                  prefix={<UserOutlined className="text-slate-400" />}
                  placeholder="Nguyễn Văn An"
                  className="h-12 rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-medium text-slate-700">Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email chưa đúng định dạng" },
                ]}
              >
                <Input
                  autoComplete="email"
                  prefix={<MailOutlined className="text-slate-400" />}
                  placeholder="ban@email.com"
                  className="h-12 rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-medium text-slate-700">Mật khẩu</span>}
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                hasFeedback
              >
                <Input.Password
                  autoComplete="new-password"
                  prefix={<LockOutlined className="text-slate-400" />}
                  placeholder="Tạo mật khẩu"
                  className="h-12 rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-medium text-slate-700">Nhập lại mật khẩu</span>}
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
                      return Promise.reject(new Error("Mật khẩu nhập lại chưa khớp"));
                    },
                  }),
                ]}
                className="mb-5"
              >
                <Input.Password
                  autoComplete="new-password"
                  prefix={<LockOutlined className="text-slate-400" />}
                  placeholder="Nhập lại mật khẩu"
                  className="h-12 rounded-lg"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isSubmitting}
                className="h-12 rounded-lg font-semibold"
                icon={!isSubmitting && <ArrowRightOutlined />}
                iconPlacement="end"
              >
                Tạo tài khoản
              </Button>
            </Form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Đã có tài khoản?{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Đăng nhập
              </Link>
            </p>
          </div>
    </AuthShell>
  );
}
