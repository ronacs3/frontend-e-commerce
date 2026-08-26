"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSelector } from "react-redux";
import { Input, Avatar, Button, Spin, Typography, Result } from "antd";
import {
  MessageOutlined,
  CloseOutlined,
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  LoadingOutlined,
  LoginOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Text } = Typography;

const INITIAL_MESSAGES = [
  {
    role: "ai",
    content:
      "Xin chào! 👋\nTôi là **TechShop Assistant**.\nTôi có thể tư vấn sản phẩm, giải đáp thắc mắc hoặc kiểm tra đơn hàng giúp bạn!",
  },
];

const QUICK_PROMPTS = [
  "Tư vấn laptop dưới 20 triệu",
  "Chính sách bảo hành",
  "Sản phẩm nào đang giảm giá?",
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const router = useRouter();
  const messagesEndRef = useRef(null);

  const { userInfo } = useSelector(
    (state) => state.auth || state.userLogin || {}
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, streamedText, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || !userInfo || isLoading) return;

    const userMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamedText("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ message: query }),
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
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "❌ Không thể kết nối tới máy chủ AI. Vui lòng thử lại sau." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center text-2xl shadow-2xl shadow-indigo-600/40 hover:scale-110 transition-all duration-300"
        aria-label="Mở Chat AI"
      >
        {isOpen ? <CloseOutlined /> : <MessageOutlined />}
      </button>

      {/* Floating Chat Dialog Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-8 pointer-events-none"
        }`}
      >
        {/* Chat Window Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg">
              <RobotOutlined />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm leading-none">TechShop AI Assistant</h4>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Trực tuyến 24/7
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Chat Window Body */}
        {userInfo ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "ai" && (
                    <Avatar
                      icon={<RobotOutlined />}
                      className="bg-indigo-600 text-white shrink-0 mt-1"
                    />
                  )}

                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none font-medium"
                        : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-none"
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
                      className="bg-emerald-600 text-white shrink-0 mt-1"
                    />
                  )}
                </div>
              ))}

              {/* Streaming Output */}
              {isLoading && streamedText && (
                <div className="flex gap-3 justify-start">
                  <Avatar icon={<RobotOutlined />} className="bg-indigo-600 text-white shrink-0 mt-1" />
                  <div className="max-w-[82%] p-3.5 bg-white border border-slate-200 rounded-2xl rounded-tl-none text-xs sm:text-sm text-slate-800 shadow-xs">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {streamedText}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Loading Spinner */}
              {isLoading && !streamedText && (
                <div className="flex gap-3 items-center">
                  <Avatar icon={<RobotOutlined />} className="bg-indigo-600 text-white shrink-0" />
                  <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl rounded-tl-none">
                    <Spin indicator={<LoadingOutlined className="text-indigo-600 text-lg" spin />} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-3 py-2 bg-slate-100/70 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <ThunderboltOutlined className="text-amber-500 shrink-0" />
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 font-medium whitespace-nowrap transition"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2">
              <Input
                placeholder="Nhập tin nhắn..."
                value={input}
                disabled={isLoading}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={() => handleSendMessage()}
                className="rounded-xl border-slate-200 text-sm"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                disabled={isLoading || !input.trim()}
                onClick={() => handleSendMessage()}
                className="bg-indigo-600 hover:!bg-indigo-700 font-bold rounded-xl shrink-0"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
            <Result
              status="403"
              title="Đăng nhập để Chat"
              subTitle="Bạn cần đăng nhập tài khoản TechShop để sử dụng trợ lý AI."
              icon={<RobotOutlined className="text-indigo-600 text-5xl" />}
              extra={
                <Button
                  type="primary"
                  icon={<LoginOutlined />}
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/login");
                  }}
                  className="bg-indigo-600 font-bold rounded-xl"
                >
                  Đăng nhập ngay
                </Button>
              }
            />
          </div>
        )}
      </div>
    </>
  );
}
