"use client";

import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

import { useEffect, useState, Suspense } from "react";
import AuthShell from "@/components/AuthShell";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import { Alert, Button, Form, Input, App } from "antd";
import {
  ArrowRightOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
  CrownOutlined,
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
    icon: <UserOutlined className="text-blue-600" />,
    style: "border-blue-200 bg-blue-50/50 hover:border-blue-400",
    badgeStyle: "bg-blue-100 text-blue-800",
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

        <p className="mb-2 text-sm font-semibold text-blue-600">Tài khoản TechShop</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Đăng nhập</h1>
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
              } ${autoFilledRole === acc.role ? "ring-2 ring-blue-500" : ""}`}
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
          title={error}
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
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isSubmitting}
          className="h-12 rounded-lg font-semibold bg-blue-600 hover:!bg-blue-700"
          icon={!isSubmitting && <ArrowRightOutlined />}
          iconPlacement="end"
        >
          Đăng nhập
        </Button>
      </Form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return <AuthShell><Suspense fallback={<div className="auth-loading" role="status">Loading...</div>}><LoginForm /></Suspense></AuthShell>;
}
