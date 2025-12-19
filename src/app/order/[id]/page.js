"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Card,
  Descriptions,
  Table,
  Spin,
  Row,
  Col,
  Steps,
  message,
  Button,
  Popconfirm,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CarOutlined,
  SolutionOutlined,
  DollarOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

/* ================= CLIENT DATE (FIX HYDRATION) ================= */
function ClientDate({ value }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (value) {
      setText(new Date(value).toLocaleString("vi-VN"));
    }
  }, [value]);

  return <span>{text}</span>;
}

export default function OrderDetailsPage({ params }) {
  const { id: orderId } = use(params);
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCancel, setLoadingCancel] = useState(false);

  /* ================= FETCH ORDER ================= */
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
          message.error("Không tìm thấy đơn hàng");
        }
      } catch {
        message.error("Lỗi kết nối");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [userInfo, orderId, router]);

  /* ================= CANCEL ORDER ================= */
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
        message.success("Đã hủy đơn hàng");
        router.refresh(); // ✅ App Router
      } else {
        message.error("Hủy thất bại");
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

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "image",
      render: (img, record) => (
        <div className="flex items-center gap-4">
          <img
            src={img}
            alt={record.name}
            className="w-12 h-12 object-cover rounded border"
          />
          <Link
            href={`/product/${record.product}`}
            className="text-blue-600 font-medium hover:underline"
          >
            {record.name}
          </Link>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      align: "right",
      render: formatPrice,
    },
    {
      title: "SL",
      dataIndex: "qty",
      align: "center",
    },
    {
      title: "Tổng",
      align: "right",
      render: (_, r) => formatPrice(r.price * r.qty),
    },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );

  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/profile"
        className="inline-flex items-center text-gray-500 mb-6 hover:text-blue-600"
      >
        <ArrowLeftOutlined className="mr-2" /> Quay lại lịch sử đơn hàng
      </Link>

      {/* ================= STEPS ================= */}
      <Card className="mb-8 shadow-sm">
        {order.isCancelled ? (
          <div className="text-center py-6">
            <CloseCircleOutlined className="text-5xl text-red-500 mb-3" />
            <h2 className="text-xl font-bold text-red-600">
              Đơn hàng đã bị hủy
            </h2>
            <ClientDate value={order.cancelledAt || order.updatedAt} />
          </div>
        ) : (
          <Steps
            current={getCurrentStep()}
            items={[
              {
                title: "Đã đặt hàng",
                content: <ClientDate value={order.createdAt} />,
                icon: <SolutionOutlined />,
              },
              {
                title: "Thanh toán",
                content: order.isPaid ? (
                  <ClientDate value={order.paidAt} />
                ) : (
                  "Chờ thanh toán"
                ),
                icon: <DollarOutlined />,
              },
              {
                title: "Giao hàng",
                content: order.isDelivered ? (
                  <ClientDate value={order.deliveredAt} />
                ) : order.isPaid ? (
                  "Đang giao hàng"
                ) : (
                  "Chờ xử lý"
                ),
                icon: <CarOutlined />,
              },
            ]}
          />
        )}
      </Card>

      {/* ================= CONTENT ================= */}
      <Row gutter={24} className="pt-[24px]">
        <Col span={24} lg={16}>
          <Card title="Chi tiết đơn hàng" className="mb-6 shadow-sm">
            <Descriptions column={1} bordered size="small" className="mb-6">
              <Descriptions.Item label="Mã đơn hàng">
                <span className="font-mono font-bold">#{order._id}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ nhận">
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.country}
              </Descriptions.Item>
              <Descriptions.Item label="Thanh toán">
                {order.paymentMethod}
              </Descriptions.Item>
            </Descriptions>

            <Table
              dataSource={order.orderItems}
              columns={columns}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col span={24} lg={8}>
          <Card title="Tổng thanh toán" className="bg-gray-50 shadow-md">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Tiền hàng</span>
                <span>{formatPrice(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Vận chuyển</span>
                <span>{formatPrice(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Thuế</span>
                <span>{formatPrice(order.taxPrice)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-red-600">
                <span>Tổng cộng</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>

              {!order.isDelivered && !order.isCancelled && (
                <Popconfirm
                  title="Hủy đơn hàng?"
                  content="Hành động này không thể hoàn tác"
                  onConfirm={cancelOrderHandler}
                  okButtonProps={{ danger: true }}
                  icon={<ExclamationCircleOutlined />}
                >
                  <Button danger block size="large" loading={loadingCancel}>
                    HỦY ĐƠN HÀNG
                  </Button>
                </Popconfirm>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
