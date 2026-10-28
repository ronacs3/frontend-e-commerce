"use client";

import { API_BASE_URL, apiFetch } from "@/lib/api.mjs";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSelector } from "react-redux";
import { Avatar, Button, Input, Result, Spin } from "antd";
import {
  CloseOutlined,
  LoadingOutlined,
  LoginOutlined,
  MessageOutlined,
  RobotOutlined,
  SendOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const INITIAL_MESSAGES = [
  {
    role: "ai",
    content:
      "Xin chào! Tôi là **TechShop Assistant**.\n\nTôi có thể tư vấn sản phẩm, giải đáp chính sách hoặc giúp bạn kiểm tra đơn hàng.",
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
  const inputRef = useRef(null);

  const { userInfo } = useSelector(
    (state) => state.auth || state.userLogin || {}
  );

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamedText, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || !userInfo || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setInput("");
    setIsLoading(true);
    setStreamedText("");

    try {
      const res = await apiFetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "AI service unavailable");
      }
      if (!res.body) throw new Error("AI service unavailable");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulated = "";
      let done = false;

      while (!done) {
        const result = await reader.read();
        done = result.done;
        const chunk = decoder.decode(result.value || new Uint8Array(), {
          stream: !done,
        });
        accumulated += chunk;
        setStreamedText(accumulated);
      }

      setMessages((prev) => [...prev, { role: "ai", content: accumulated }]);
      setStreamedText("");
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Hiện chưa thể kết nối với trợ lý AI. Vui lòng thử lại sau.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-800 text-xl text-white shadow-lg shadow-teal-950/20 transition hover:bg-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        aria-label={isOpen ? "Đóng trợ lý AI" : "Mở trợ lý AI"}
        aria-expanded={isOpen}
        aria-controls="techshop-ai-panel"
      >
        {isOpen ? <CloseOutlined /> : <MessageOutlined />}
      </button>

      <section
        id="techshop-ai-panel"
        role="dialog"
        aria-label="TechShop AI Assistant"
        aria-modal="true"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed bottom-[88px] right-4 z-50 flex h-[min(620px,calc(100dvh-120px))] w-[400px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15 transition duration-200 sm:right-5 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <header className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-4 py-3.5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-lg">
              <RobotOutlined />
            </div>
            <div>
              <h2 className="text-sm font-semibold leading-5">TechShop AI</h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Trợ lý mua sắm trực tuyến
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Đóng cửa sổ chat"
          >
            <CloseOutlined />
          </button>
        </header>

        {userInfo ? (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-end gap-2.5 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "ai" && (
                    <Avatar
                      size={30}
                      icon={<RobotOutlined />}
                      className="shrink-0 bg-teal-800"
                    />
                  )}
                  <div
                    className={`max-w-[84%] rounded-xl px-3.5 py-3 text-sm leading-6 ${
                      msg.role === "user"
                        ? "rounded-br-sm bg-teal-800 text-white"
                        : "rounded-bl-sm border border-slate-200 bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        a: ({ ...props }) => (
                          <a className="text-teal-700 underline" {...props} />
                        ),
                        ul: ({ ...props }) => (
                          <ul className="my-2 list-disc space-y-1 pl-5" {...props} />
                        ),
                        ol: ({ ...props }) => (
                          <ol className="my-2 list-decimal space-y-1 pl-5" {...props} />
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  {msg.role === "user" && (
                    <Avatar
                      size={30}
                      src={userInfo.avatar}
                      icon={<UserOutlined />}
                      className="shrink-0 bg-slate-500"
                    />
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-end gap-2.5">
                  <Avatar
                    size={30}
                    icon={<RobotOutlined />}
                    className="shrink-0 bg-teal-800"
                  />
                  <div className="max-w-[84%] rounded-xl rounded-bl-sm border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-700 shadow-sm">
                    {streamedText ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {streamedText}
                      </ReactMarkdown>
                    ) : (
                      <Spin indicator={<LoadingOutlined spin />} />
                    )}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-200 bg-white px-3 py-2.5">
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <ThunderboltOutlined className="text-amber-500" /> Gợi ý cho bạn
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isLoading}
                    className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <form
              className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
              onSubmit={(event) => {
                event.preventDefault();
                handleSendMessage();
              }}
            >
              <Input
                ref={inputRef}
                placeholder="Hỏi TechShop AI..."
                value={input}
                disabled={isLoading}
                onChange={(event) => setInput(event.target.value)}
                aria-label="Tin nhắn gửi cho trợ lý AI"
                className="h-11 rounded-lg border-slate-200 text-sm"
              />
              <Button
                htmlType="submit"
                type="primary"
                icon={<SendOutlined />}
                disabled={isLoading || !input.trim()}
                aria-label="Gửi tin nhắn"
                className="h-11 w-11 rounded-lg bg-teal-800 hover:!bg-teal-900"
              />
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-slate-50 p-5">
            <Result
              status="403"
              title="Đăng nhập để trò chuyện"
              subTitle="Đăng nhập tài khoản TechShop để được trợ lý AI tư vấn sản phẩm và đơn hàng."
              icon={<RobotOutlined className="text-teal-700" />}
              extra={
                <Button
                  type="primary"
                  icon={<LoginOutlined />}
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/login");
                  }}
                  className="rounded-lg bg-teal-800 font-semibold hover:!bg-teal-900"
                >
                  Đăng nhập
                </Button>
              }
            />
          </div>
        )}
      </section>
    </>
  );
}
