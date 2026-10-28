"use client";

import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import { Alert, Button, Form, Input, App } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  UserOutlined,
  CrownOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const DEMO_ACCOUNTS = [
  {
    role: "Quản trị viên (Admin)",
    email: "admin@example.com",
    password: "123123",
    badge: "Toàn quyền quản trị",
    icon: <CrownOutlined className="text-amber-500" />,
    style: "border-amber-200 bg-amber-50/50 hover:border-amber-400",
    badgeStyle: "bg-amber-100 text-amber-800",
  },
  {
    role: "Khách hàng (User)",
    email: "user@example.com",
    password: "123",
    badge: "Mua hàng & Hồ sơ",
    icon: <UserOutlined className="text-teal-600" />,
    style: "border-teal-200 bg-teal-50/50 hover:border-teal-400",
    badgeStyle: "bg-teal-100 text-teal-800",
  },
];

function LoginForm() {
  const { message } = App.useApp();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoFilledRole, setAutoFilledRole] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) router.replace(redirect);
  }, [userInfo, router, redirect]);

  const handleFillDemo = (account, autoSubmit = false) => {
    setError("");
    form.setFieldsValue({
      email: account.email,
      password: account.password,
    });
    setAutoFilledRole(account.role);

    if (autoSubmit) {
      submitHandler({
        email: account.email,
        password: account.password,
      });
    } else {
      message.info(`Đã điền thông tin ${account.role}`);
    }
  };

  const submitHandler = async (values) => {
    setError("");
    setIsSubmitting(true);

    try {
      const res = await apiFetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(
          data.message ||
            "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại hoặc dùng tài khoản mẫu bên dưới."
        );
        return;
      }

      message.success(`Đăng nhập thành công! Chào mừng ${data.name || ""}`);
      dispatch(setCredentials(data));
      router.push(redirect);
    } catch {
      setError("Không thể kết nối máy chủ. Vui lòng kiểm tra lại backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[440px]">
      <div className="mb-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#356b62] lg:hidden"
        >
          <ArrowLeftOutlined /> Về cửa hàng
        </Link>
        <p className="mb-2 text-sm font-semibold text-[#477f77]">Tài khoản TechShop</p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Đăng nhập</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Nhập thông tin tài khoản hoặc bấm chọn tài khoản mẫu bên dưới để trải nghiệm.
        </p>
      </div>

      {/* Demo Accounts Quick-Fill Section */}
      <div className="mb-6 space-y-2.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Tài khoản dùng thử (1-Click)
          </span>
          <span className="text-[11px] text-slate-400">Bấm để tự động điền</span>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              type="button"
              disabled={isSubmitting}
              onClick={() => handleFillDemo(acc)}
              className={`flex flex-col items-start gap-1 rounded-xl border p-2.5 text-left transition duration-150 cursor-pointer ${
                acc.style
              } ${autoFilledRole === acc.role ? "ring-2 ring-[#477f77]" : ""}`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  {acc.icon} {acc.role.split(" ")[0]}
                </span>
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${acc.badgeStyle}`}>
                  {acc.badge}
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-500 truncate w-full">
                {acc.email}
              </span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          className="mb-5 rounded-xl border-rose-200 bg-rose-50/80 text-rose-800"
        />
      )}

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
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#477f77] hover:text-[#315f59]"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isSubmitting}
          className="h-12 rounded-lg font-semibold bg-[#477f77] hover:!bg-[#386e66]"
          icon={!isSubmitting && <ArrowRightOutlined />}
          iconPlacement="end"
        >
          Đăng nhập
        </Button>
      </Form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="font-semibold text-[#477f77] hover:text-[#315f59]">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="auth-screen login-screen fixed inset-0 z-[100] min-h-dvh overflow-y-auto bg-[#f4f8f6]">
      <div className="grid min-h-dvh lg:grid-cols-2">
        {/* Left Visual Hero */}
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

          <div className="hidden space-y-2 text-xs text-white/70 lg:block border-t border-white/10 pt-4">
            <p className="font-semibold text-white/90">Thông tin hỗ trợ đăng nhập:</p>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1">
                <CheckCircleOutlined className="text-emerald-400" /> Admin: admin@example.com / 123123
              </span>
              <span className="flex items-center gap-1">
                <CheckCircleOutlined className="text-emerald-400" /> User: user@example.com / 123
              </span>
            </div>
          </div>
        </section>

        {/* Right Form */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <Suspense
            fallback={
              <div className="w-full max-w-[440px] animate-pulse space-y-4">
                <div className="h-8 w-40 rounded bg-slate-200" />
                <div className="h-12 w-full rounded bg-slate-200" />
                <div className="h-12 w-full rounded bg-slate-200" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
