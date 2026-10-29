"use client";

import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Rate, Button, Input, Avatar, message, Alert } from "antd";
import { UserOutlined, MessageOutlined, StarFilled } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatters";

export default function ProductReviews({ product }) {
  const { userInfo } = useSelector((state) => state.auth || {});
  const router = useRouter();

  const reviews = product?.reviews || [];

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const submitHandler = async () => {
    if (rating === 0) {
      message.error("Vui lòng chọn số sao đánh giá!");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch(
        `${API_BASE_URL}/products/${product._id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        message.success("Đã gửi đánh giá thành công!");
        setRating(0);
        setComment("");
        router.refresh ? router.refresh() : window.location.reload();
      } else {
        message.error(data.message || "Lỗi khi gửi đánh giá");
      }
    } catch {
      message.error("Lỗi kết nối tới máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-slate-200/80">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
          <MessageOutlined />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Đánh giá từ khách hàng ({product?.numReviews || 0})
          </h2>
          <p className="text-xs text-slate-400">Ý kiến thực tế từ những người đã trải nghiệm sản phẩm</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: REVIEW LIST */}
        <div className="lg:col-span-7 space-y-4">
          {reviews.length === 0 ? (
            <Alert
              title="Chưa có đánh giá nào"
              description="Hãy là người đầu tiên để lại nhận xét cho sản phẩm này!"
              type="info"
              showIcon
              className="rounded-2xl"
            />
          ) : (
            <div className="space-y-4">
              {reviews.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar
                        icon={<UserOutlined />}
                        className="bg-blue-600 text-white font-bold"
                      >
                        {item.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-none">{item.name}</h4>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(item.createdAt, true)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                      <StarFilled className="text-amber-400 text-xs" />
                      <span className="text-xs font-bold text-amber-700">{item.rating}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed pl-12">{item.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: SUBMIT FORM */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="font-semibold text-slate-800 text-base border-b border-slate-100 pb-3">
              Viết đánh giá của bạn
            </h3>

            {userInfo ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Đánh giá trải nghiệm
                  </label>
                  <Rate value={rating} onChange={setRating} className="text-amber-400 text-2xl" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Nhận xét chi tiết
                  </label>
                  <Input.TextArea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chia sẻ cảm nhận của bạn về chất lượng sản phẩm..."
                    className="rounded-xl border-slate-200"
                  />
                </div>

                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={submitHandler}
                  loading={loading}
                  disabled={loading}
                  className="bg-blue-600 hover:!bg-blue-700 font-bold rounded-xl shadow-md shadow-blue-600/20"
                >
                  Gửi Đánh Giá
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <p className="text-sm text-slate-500">Vui lòng đăng nhập tài khoản để viết nhận xét đánh giá.</p>
                <Button
                  type="primary"
                  onClick={() => router.push("/login")}
                  className="bg-blue-600 font-bold rounded-xl"
                >
                  Đăng Nhập Ngay
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
