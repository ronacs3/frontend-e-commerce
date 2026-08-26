"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Descriptions, Table, Spin, Steps, message, Button, Popconfirm } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CarOutlined,
  SolutionOutlined,
  DollarOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ProductImage from "@/components/ProductImage";
import { formatCurrency, formatDate } from "@/utils/formatters";

function ClientDate({ value }) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (value) setText(formatDate(value, true));
  }, [value]);
  return <span className="text-xs font-semibold">{text}</span>;
}

export default function OrderDetailsPage() {
  const { id: orderId } = useParams();
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth || {});

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCancel, setLoadingCancel] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
            cache: "no-store",
          }
        );

        if (res.ok) {
          setOrder(await res.json());
        } else {
          message.error("Không tìm thấy thông tin đơn hàng");
        }
      } catch {
        message.error("Lỗi kết nối máy chủ");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [userInfo, orderId, router]);

  const cancelOrderHandler = async () => {
    setLoadingCancel(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (res.ok) {
        message.success("Đã hủy đơn hàng thành công");
        router.refresh ? router.refresh() : window.location.reload();
      } else {
        message.error("Không thể hủy đơn hàng");
      }
    } catch {
      message.error("Lỗi kết nối");
    } finally {
      setLoadingCancel(false);
    }
  };

  const getCurrentStep = () => {
    if (!order) return 0;
    if (order.isDelivered) return 2;
    if (order.isPaid) return 1;
    return 0;
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "image",
      render: (img, record) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shrink-0">
            <ProductImage src={img} alt={record.name} className="max-h-full object-contain" />
          </div>
          <Link href={`/product/${record.product}`} className="text-slate-800 hover:text-indigo-600 font-bold text-sm truncate max-w-xs">
            {record.name}
          </Link>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      align: "right",
      render: (price) => <span className="font-semibold text-slate-700">{formatCurrency(price)}</span>,
    },
    {
      title: "SL",
      dataIndex: "qty",
      align: "center",
      render: (qty) => <span className="font-bold text-slate-800">{qty}</span>,
    },
    {
      title: "Thành tiền",
      align: "right",
      render: (_, r) => <span className="font-black text-rose-600">{formatCurrency(r.price * r.qty)}</span>,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition"
        >
          <ArrowLeftOutlined /> Quay lại danh sách đơn hàng
        </Link>
        <div className="text-xs text-slate-400 font-medium">
          Đơn hàng <span className="font-mono font-bold text-slate-800">#{order._id}</span>
        </div>
      </div>

      {/* Steps Tracking Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        {order.isCancelled ? (
          <div className="text-center py-6 space-y-2">
            <CloseCircleOutlined className="text-5xl text-rose-500" />
            <h2 className="text-xl font-black text-rose-600">Đơn hàng đã bị hủy</h2>
            <p className="text-xs text-slate-400">
              Thời gian hủy: <ClientDate value={order.cancelledAt || order.updatedAt} />
            </p>
          </div>
        ) : (
          <Steps
            current={getCurrentStep()}
            items={[
              {
                title: "Đã tiếp nhận",
                description: <ClientDate value={order.createdAt} />,
                icon: <SolutionOutlined />,
              },
              {
                title: "Thanh toán",
                description: order.isPaid ? <ClientDate value={order.paidAt} /> : "Chờ thanh toán",
                icon: <DollarOutlined />,
              },
              {
                title: "Vận chuyển & Đã giao",
                description: order.isDelivered ? <ClientDate value={order.deliveredAt} /> : "Đang xử lý",
                icon: <CarOutlined />,
              },
            ]}
          />
        )}
      </div>

      {/* Main Order Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Thông Tin Đơn Hàng
            </h3>
            <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small" className="custom-desc">
              <Descriptions.Item label="Mã đơn hàng">
                <span className="font-mono font-bold text-slate-800">#{order._id}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày khởi tạo">
                <ClientDate value={order.createdAt} />
              </Descriptions.Item>
              <Descriptions.Item label="Người nhận">
                {order.shippingAddress?.fullName || userInfo.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {order.shippingAddress?.phone || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao" span={2}>
                {order.shippingAddress?.address}, {order.shippingAddress?.city}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán" span={2}>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg text-xs">
                  {order.paymentMethod}
                </span>
              </Descriptions.Item>
            </Descriptions>

            <div className="pt-2">
              <h4 className="font-extrabold text-slate-800 text-sm mb-3">Danh sách sản phẩm trong đơn</h4>
              <Table
                dataSource={order.orderItems}
                columns={columns}
                rowKey="_id"
                pagination={false}
                size="small"
              />
            </div>
          </div>
        </div>

        {/* Right Summary Card */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Tổng Cộng Hóa Đơn
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Tiền hàng:</span>
                <span className="font-bold text-slate-800">{formatCurrency(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí vận chuyển:</span>
                <span className="font-bold text-slate-800">{formatCurrency(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Thuế VAT:</span>
                <span className="font-bold text-slate-800">{formatCurrency(order.taxPrice)}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-base font-black text-slate-900">Tổng thanh toán:</span>
                <span className="text-2xl font-black text-rose-600">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>

            {!order.isDelivered && !order.isCancelled && (
              <Popconfirm
                title="Xác nhận hủy đơn hàng?"
                description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                onConfirm={cancelOrderHandler}
                okButtonProps={{ danger: true, loading: loadingCancel }}
                icon={<ExclamationCircleOutlined className="text-rose-500" />}
              >
                <Button
                  danger
                  block
                  size="large"
                  loading={loadingCancel}
                  className="font-bold rounded-2xl h-12 text-sm mt-2 shadow-md shadow-rose-500/10"
                >
                  HỦY ĐƠN HÀNG NÀY
                </Button>
              </Popconfirm>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
