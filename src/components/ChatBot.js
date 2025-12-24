"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSelector } from "react-redux";

// Ant Design
import {
  FloatButton,
  Card,
  Input,
  Avatar,
  Button,
  Spin,
  Typography,
  Space,
  Result,
} from "antd";

import {
  MessageOutlined,
  CloseOutlined,
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  LoadingOutlined,
  LoginOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

/* ================= CONSTANT ================= */

const INITIAL_MESSAGE = [
  {
    role: "ai",
    content:
      "Xin chào! 👋\nTôi là trợ lý ảo **TechShop**.\nTôi có thể giúp bạn tìm kiếm sản phẩm, kiểm tra đơn hàng hoặc tư vấn.",
  },
];

/* ================= COMPONENT ================= */

export default function ChatBot() {
  /* ===== STATE ===== */
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGE);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");

  const messagesEndRef = useRef(null);

  /* ===== REDUX ===== */
  const { userInfo } = useSelector(
    (state) => state.auth || state.userLogin || {}
  );

  /* ===== EFFECTS ===== */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedText, isOpen]);

  /* ===== HANDLERS ===== */

  const handleSendMessage = async () => {
    if (!input.trim() || !userInfo || isLoading) return;

    const userMessage = { role: "user", content: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamedText("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!res.ok) throw new Error("Network error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      let accumulated = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        const chunk = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });

        accumulated += chunk;
        setStreamedText((prev) => prev + chunk);
      }

      setMessages((prev) => [...prev, { role: "ai", content: accumulated }]);
      setStreamedText("");
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "❌ Lỗi kết nối tới máy chủ." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <>
      {/* ===== CHAT WINDOW ===== */}
      <div
        className={`fixed bottom-24 right-6 z-50 transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <Card
          title={
            <Space>
              <RobotOutlined style={{ color: "#1677ff" }} />
              <Text strong>TechShop Support</Text>
            </Space>
          }
          extra={
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setIsOpen(false)}
            />
          }
          style={{
            width: 380,
            height: 550,
            display: "flex",
            flexDirection: "column",
          }}
          styles={{
            body: {
              flex: 1,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            },
          }}
        >
          {userInfo ? (
            <>
              {/* ===== MESSAGES ===== */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex mb-4 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "ai" && (
                      <Avatar
                        icon={<RobotOutlined />}
                        style={{ backgroundColor: "#1677ff", marginRight: 8 }}
                      />
                    )}

                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    {msg.role === "user" && (
                      <Avatar
                        src={userInfo.avatar}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: "#87d068", marginLeft: 8 }}
                      />
                    )}
                  </div>
                ))}

                {/* ===== STREAMING ===== */}
                {isLoading && streamedText && (
                  <div className="flex mb-4 justify-start">
                    <Avatar
                      icon={<RobotOutlined />}
                      style={{ backgroundColor: "#1677ff", marginRight: 8 }}
                    />
                    <div className="max-w-[80%] p-3 bg-white border rounded-lg rounded-bl-none shadow-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {streamedText}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* ===== LOADING ===== */}
                {isLoading && !streamedText && (
                  <div className="flex mb-4 items-center">
                    <Avatar
                      icon={<RobotOutlined />}
                      style={{ backgroundColor: "#1677ff", marginRight: 8 }}
                    />
                    <div className="bg-white border p-3 rounded-lg shadow-sm">
                      <Spin
                        indicator={
                          <LoadingOutlined style={{ fontSize: 22 }} spin />
                        }
                      />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ===== INPUT ===== */}
              <div className="p-3 border-t bg-white">
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    placeholder="Nhập câu hỏi..."
                    value={input}
                    disabled={isLoading}
                    onChange={(e) => setInput(e.target.value)}
                    onPressEnter={handleSendMessage}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    disabled={isLoading || !input.trim()}
                    onClick={handleSendMessage}
                  >
                    Gửi
                  </Button>
                </Space.Compact>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <Result
                status="403"
                title="Cần đăng nhập"
                icon={<RobotOutlined style={{ color: "#1677ff" }} />}
                extra={
                  <Button type="primary" icon={<LoginOutlined />} shape="round">
                    Đăng nhập ngay
                  </Button>
                }
              />
            </div>
          )}
        </Card>
      </div>

      {/* ===== FLOAT BUTTON ===== */}
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24 }}
        onClick={() => setIsOpen((prev) => !prev)}
      />
    </>
  );
}
