"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Card,
  Descriptions,
  Table,
  Tag,
  Button,
  message,
  Spin,
  Row,
  Col,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { useParams } from "next/navigation";

const { Title, Text } = Typography;

/* ================= CLIENT DATE TIME (FIX HYDRATION) ================= */
function ClientDateTime({ value }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (value) {
      setText(new Date(value).toLocaleString("vi-VN"));
    }
  }, [value]);

  return <span>{text}</span>;
}

export default function AdminOrderPage({ params }) {
  /* ✅ FIX CHUẨN: KHÔNG DÙNG use(params) */
  const { id: orderId } = useParams();
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDeliver, setLoadingDeliver] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);

  /* ================= FETCH ORDER ================= */
  const fetchOrder = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
          cache: "no-store",
        }
      );

      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        message.error("Không tìm thấy đơn hàng");
      }
    } catch (error) {
      message.error("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      router.push("/login");
    } else {
      fetchOrder();
    }
  }, [userInfo, orderId, router]);

  /* ================= ACTIONS ================= */
  const deliverHandler = async () => {
    setLoadingDeliver(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/deliver`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (res.ok) {
        message.success("Đã cập nhật: Giao hàng thành công");
        fetchOrder();
      } else {
        message.error("Cập nhật thất bại");
      }
    } catch {
      message.error("Lỗi kết nối");
    } finally {
      setLoadingDeliver(false);
    }
  };

  const payHandler = async () => {
    setLoadingPay(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/pay`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (res.ok) {
        message.success("Đã cập nhật: Thanh toán thành công");
        fetchOrder();
      } else {
        message.error("Cập nhật thất bại");
      }
    } catch {
      message.error("Lỗi kết nối");
    } finally {
      setLoadingPay(false);
    }
  };

  /* ================= HELPERS ================= */
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
      title: "Đơn giá",
      dataIndex: "price",
      align: "right",
      render: formatPrice,
    },
    {
      title: "Số lượng",
      dataIndex: "qty",
      align: "center",
    },
    {
      title: "Thành tiền",
      align: "right",
      render: (_, r) => formatPrice(r.price * r.qty),
    },
  ];

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ===== BACK ===== */}
      <Link
        href="/admin/orderlist"
        className="inline-flex items-center text-gray-500 mb-6 hover:text-blue-600"
      >
        <ArrowLeftOutlined className="mr-2" />
        Quay lại danh sách đơn hàng
      </Link>

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-6">
        <Title level={2} style={{ margin: 0 }}>
          Đơn hàng #{order._id}
        </Title>
        <Text type="secondary">
          <ClientDateTime value={order.createdAt} />
        </Text>
      </div>

      <Row gutter={24}>
        {/* ================= LEFT ================= */}
        <Col span={24} lg={16}>
          <Card className="mb-6 shadow-sm" title="Thông tin vận chuyển">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Người nhận">
                {order.user?.name} ({order.user?.email})
              </Descriptions.Item>

              <Descriptions.Item label="Địa chỉ">
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.country}
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái giao hàng">
                {order.isDelivered ? (
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    Đã giao lúc <ClientDateTime value={order.deliveredAt} />
                  </Tag>
                ) : order.isPaid ? (
                  <Tag color="orange" icon={<CarOutlined />}>
                    Đang giao hàng
                  </Tag>
                ) : (
                  <Tag color="red" icon={<ClockCircleOutlined />}>
                    Chờ xử lý
                  </Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card className="mb-6 shadow-sm" title="Thanh toán">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Phương thức">
                {order.paymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {order.isPaid ? (
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    Đã thanh toán lúc <ClientDateTime value={order.paidAt} />
                  </Tag>
                ) : (
                  <Tag color="red" icon={<ClockCircleOutlined />}>
                    Chưa thanh toán
                  </Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Sản phẩm đã mua" className="shadow-sm">
            <Table
              dataSource={order.orderItems}
              columns={columns}
              rowKey="_id"
              pagination={false}
            />
          </Card>
        </Col>

        {/* ================= RIGHT ================= */}
        <Col span={24} lg={8}>
          <Card
            className="shadow-md border-t-4 border-t-blue-600"
            title="Tổng kết đơn hàng"
          >
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
            </div>

            <div className="mt-6 pt-6 border-t space-y-3">
              {!order.isPaid && (
                <Button
                  block
                  size="large"
                  loading={loadingPay}
                  onClick={payHandler}
                  className="bg-green-600 text-white hover:bg-green-700"
                  icon={<CheckCircleOutlined />}
                >
                  Xác nhận Đã Thanh Toán
                </Button>
              )}

              {!order.isDelivered && order.isPaid && (
                <Button
                  type="primary"
                  block
                  size="large"
                  loading={loadingDeliver}
                  onClick={deliverHandler}
                >
                  Xác nhận Đã Giao Hàng
                </Button>
              )}

              {order.isPaid && order.isDelivered && (
                <div className="bg-green-50 text-green-600 p-3 rounded text-center border">
                  <CheckCircleOutlined /> Đơn hàng hoàn tất
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
