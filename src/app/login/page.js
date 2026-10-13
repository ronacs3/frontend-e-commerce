"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import { Alert, Button, Form, Input } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) router.replace("/");
  }, [userInfo, router]);

  const submitHandler = async (values) => {
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng nhập không thành công. Vui lòng thử lại.");
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
    <div className="auth-screen login-screen fixed inset-0 z-[100] min-h-dvh overflow-y-auto bg-[#f4f8f6]">
      <div className="grid min-h-dvh lg:grid-cols-2">
        <section className="relative isolate flex min-h-[250px] flex-col justify-between overflow-hidden bg-[#1c302d] px-6 py-6 text-white sm:min-h-[300px] sm:px-10 sm:py-8 lg:min-h-dvh lg:px-12 lg:py-10 xl:px-16">
          <Image
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&auto=format&fit=crop&q=85"
            alt="Góc làm việc hiện đại với máy tính và thiết bị công nghệ"
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

          <div className="max-w-xl py-7 lg:py-12">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#c5e7dd]">
              <SafetyCertificateOutlined /> Mua sắm công nghệ an tâm
            </p>
            <h1 className="max-w-lg text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
              Chào mừng bạn trở lại với TechShop.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/80 sm:text-base">
              Đăng nhập để tiếp tục khám phá sản phẩm, theo dõi đơn hàng và nhận tư vấn từ trợ lý AI.
            </p>
          </div>

          <p className="hidden text-xs text-white/60 lg:block">
            Thiết bị phù hợp. Trải nghiệm tốt hơn.
          </p>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#356b62] lg:hidden">
                <ArrowLeftOutlined /> Về cửa hàng
              </Link>
              <p className="mb-2 text-sm font-semibold text-[#477f77]">Tài khoản TechShop</p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Đăng nhập</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Nhập thông tin tài khoản để tiếp tục.
              </p>
            </div>

            {error && <Alert type="error" message={error} showIcon className="mb-5 rounded-lg" />}

            <Form
              form={form}
              layout="vertical"
              onFinish={submitHandler}
              requiredMark={false}
              size="large"
              className="login-form"
            >
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
                className="mb-2"
              >
                <Input.Password
                  autoComplete="current-password"
                  prefix={<LockOutlined className="text-slate-400" />}
                  placeholder="Nhập mật khẩu"
                  className="h-12 rounded-lg"
                />
              </Form.Item>

              <div className="mb-6 flex justify-end">
                <Link href="/forgot-password" className="text-sm font-medium text-[#477f77] hover:text-[#315f59]">
                  Quên mật khẩu?
                </Link>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isSubmitting}
                className="h-12 rounded-lg font-semibold"
                icon={!isSubmitting && <ArrowRightOutlined />}
                iconPosition="end"
              >
                Đăng nhập
              </Button>
            </Form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="font-semibold text-[#477f77] hover:text-[#315f59]">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
