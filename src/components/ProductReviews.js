"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Rate, Button, Input, Avatar, message, Card, Alert, Flex } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

/* ================= REVIEW DATE (FIX HYDRATION) ================= */
function ReviewDate({ date }) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    if (date) {
      setFormatted(new Date(date).toLocaleDateString("vi-VN"));
    }
  }, [date]);

  return <span className="text-xs text-gray-400">{formatted}</span>;
}

/* ================= MAIN ================= */
export default function ProductReviews({ product }) {
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= SUBMIT REVIEW ================= */
  const submitHandler = async () => {
    if (rating === 0) {
      message.error("Vui lòng chọn số sao!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({
            rating,
            comment,
            user: userInfo,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        message.success("Đánh giá thành công!");
        setRating(0);
        setComment("");

        // ✅ App Router chuẩn
        router.refresh();
      } else {
        message.error(data.message || "Lỗi khi gửi đánh giá");
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 border-t pt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ================= LEFT: REVIEW LIST ================= */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Đánh giá từ khách hàng ({product.numReviews})
          </h2>

          {product.reviews.length === 0 ? (
            <Alert title="Chưa có đánh giá nào." type="info" showIcon />
          ) : (
            <div className="flex flex-col gap-4">
              {product.reviews.map((item) => (
                <Card
                  key={item._id}
                  className="shadow-sm"
                  styles={{ body: { padding: 16 } }}
                >
                  <Flex gap={12} align="flex-start">
                    <Avatar icon={<UserOutlined />} />

                    <div className="flex-1">
                      <div className="font-bold">{item.name}</div>

                      <Rate
                        disabled
                        allowHalf
                        value={item.rating}
                        style={{ fontSize: 14 }}
                      />

                      <p className="text-gray-700 mt-2">{item.comment}</p>

                      <ReviewDate date={item.createdAt} />
                    </div>
                  </Flex>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT: REVIEW FORM ================= */}
        <div>
          <Card title="Viết đánh giá của bạn" className="shadow-sm bg-gray-50">
            {userInfo ? (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đánh giá chất lượng:
                  </label>
                  <Rate value={rating} onChange={setRating} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bình luận:
                  </label>
                  <Input.TextArea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chia sẻ cảm nhận của bạn..."
                  />
                </div>

                <Button
                  type="primary"
                  onClick={submitHandler}
                  loading={loading}
                  disabled={loading}
                  className="bg-blue-600 w-full md:w-auto"
                >
                  Gửi đánh giá
                </Button>

                <p className="text-xs text-gray-500 mt-2">
                  * Bạn cần mua sản phẩm này trước khi đánh giá.
                </p>
              </div>
            ) : (
              <Alert
                title="Vui lòng đăng nhập để đánh giá"
                type="warning"
                showIcon
                action={
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => router.push("/login")}
                  >
                    Đăng nhập ngay
                  </Button>
                }
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
