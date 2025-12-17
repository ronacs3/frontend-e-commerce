"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Để hiển thị lỗi nếu đăng nhập sai

  const router = useRouter();
  const dispatch = useDispatch();

  // Kiểm tra nếu đã đăng nhập rồi thì đá về trang chủ
  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, [userInfo, router]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Đăng nhập thành công -> Lưu vào Redux
        dispatch(setCredentials(data));
        router.push("/"); // Chuyển hướng
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError("Lỗi kết nối server");
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Đăng Nhập
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="nhap@email.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Đăng Nhập
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
