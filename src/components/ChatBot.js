"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSelector } from "react-redux";

// Ant Design imports
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

const INITIAL_MESSAGE = [
  {
    role: "ai",
    content:
      "Xin chào! 👋 \nTôi là trợ lý ảo **TechShop**. \nTôi có thể giúp bạn tìm kiếm sản phẩm, check đơn hàng hoặc tư vấn.",
  },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGE);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. BIẾN STATE RIÊNG CHO STREAMING (Thay thế placeholderAI) ---
  const [streamedText, setStreamedText] = useState("");

  const { userInfo } = useSelector(
    (state) => state.auth || state.userLogin || {}
  );
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Cuộn xuống mỗi khi có tin nhắn mới HOẶC text đang chạy thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, streamedText]);

  const handleSendMessage = async () => {
    if (!input.trim() || !userInfo) return;

    // 1. Thêm tin nhắn User vào list ngay lập tức
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput(""); // Xóa ô nhập
    setIsLoading(true);
    setStreamedText(""); // Reset biến stream

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) throw new Error("Lỗi mạng");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let accumulatedText = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        const chunkValue = decoder.decode(value, { stream: true });
        accumulatedText += chunkValue;

        // --- 2. CẬP NHẬT BIẾN RIÊNG (Không đụng vào mảng messages) ---
        setStreamedText((prev) => prev + chunkValue);
      }

      // --- 3. KHI XONG HẾT: Mới đóng gói vào mảng messages ---
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: accumulatedText },
      ]);
      setStreamedText(""); // Xóa biến tạm
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "Lỗi kết nối!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`fixed bottom-24 right-6 z-50 transition-all duration-300 transform ${
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
              overflow: "hidden",
              padding: 0,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {userInfo ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-thin">
                {/* --- 4. RENDER TIN NHẮN CŨ (Đã xong) --- */}
                {messages.map((msg, index) => (
                  <div
                    key={index}
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

                {/* --- 5. RENDER RIÊNG PHẦN ĐANG CHẠY (STREAMING) --- */}
                {/* Chỉ hiện khi đang loading VÀ đã có chữ chạy về */}
                {isLoading && streamedText && (
                  <div className="flex mb-4 justify-start">
                    <Avatar
                      icon={<RobotOutlined />}
                      style={{ backgroundColor: "#1677ff", marginRight: 8 }}
                    />
                    <div className="max-w-[80%] p-3 rounded-lg text-sm shadow-sm bg-white border border-gray-200 text-gray-800 rounded-bl-none">
                      {/* Render Markdown ngay lập tức cho chữ đang chạy */}
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {streamedText}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* --- 6. LOADING DUMMY (Chỉ hiện khi loading mà CHƯA có chữ nào) --- */}
                {isLoading && !streamedText && (
                  <div className="flex justify-start items-center mb-4">
                    <Avatar
                      icon={<RobotOutlined />}
                      style={{ backgroundColor: "#1677ff", marginRight: 8 }}
                    />
                    <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm">
                      <Spin
                        indicator={
                          <LoadingOutlined style={{ fontSize: 24 }} spin />
                        }
                      />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t bg-white">
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    placeholder="Nhập câu hỏi..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onPressEnter={handleSendMessage}
                    disabled={isLoading}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                  >
                    Gửi
                  </Button>
                </Space.Compact>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
              <Result
                status="403"
                icon={<RobotOutlined style={{ color: "#1677ff" }} />}
                title="Cần Đăng Nhập"
                extra={
                  <Button type="primary" shape="round" icon={<LoginOutlined />}>
                    Đăng nhập ngay
                  </Button>
                }
              />
            </div>
          )}
        </Card>
      </div>

      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24 }}
        onClick={() => setIsOpen(!isOpen)}
      />
    </>
  );
}
