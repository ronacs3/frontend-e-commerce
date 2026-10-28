"use client";

import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import { Alert, Button, Form, Input } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
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
    <div className="auth-screen register-screen fixed inset-0 z-[100] min-h-dvh overflow-y-auto bg-[#f4f8f6]">
      <div className="grid min-h-dvh lg:grid-cols-2">
        <section className="relative isolate flex min-h-[230px] flex-col justify-between overflow-hidden bg-[#1c302d] px-6 py-6 text-white sm:min-h-[280px] sm:px-10 sm:py-8 lg:min-h-dvh lg:px-12 lg:py-10 xl:px-16">
          <Image
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&auto=format&fit=crop&q=85"
            alt="Không gian làm việc hiện đại với thiết bị công nghệ"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="-z-20 object-cover opacity-55"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#142824]/90 via-[#1e3933]/70 to-[#477f77]/55" />

          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="inline-flex items-center gap-2.5 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-lg backdrop-blur-sm">
                <ThunderboltOutlined />
              </span>
              <span className="text-xl font-bold">TechShop</span>
            </Link>
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/20 px-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
            >
              <ArrowLeftOutlined /> <span className="hidden sm:inline">Về cửa hàng</span>
            </Link>
          </div>

          <div className="max-w-xl py-6 lg:py-12">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#c5e7dd]">
              <SafetyCertificateOutlined /> Thành viên TechShop
            </p>
            <h1 className="max-w-lg text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
              Bắt đầu hành trình công nghệ của bạn.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/80 sm:text-base">
              Tạo tài khoản để lưu sản phẩm yêu thích, theo dõi đơn hàng và nhận tư vấn phù hợp từ trợ lý AI.
            </p>
          </div>

          <p className="hidden text-xs text-white/60 lg:block">
            Thiết bị phù hợp. Trải nghiệm tốt hơn.
          </p>
        </section>

        <section className="flex items-center justify-center px-5 py-8 sm:px-10 lg:px-12">
          <div className="w-full max-w-[420px]">
            <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#356b62] lg:hidden">
              <ArrowLeftOutlined /> Về cửa hàng
            </Link>
            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold text-[#477f77]">Tài khoản TechShop</p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Tạo tài khoản</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Điền thông tin bên dưới để tham gia TechShop.
              </p>
            </div>

            {error && <Alert type="error" message={error} showIcon className="mb-5 rounded-lg" />}

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
              <Link href="/login" className="font-semibold text-[#477f77] hover:text-[#315f59]">
                Đăng nhập
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
