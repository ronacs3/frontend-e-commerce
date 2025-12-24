"use client"; // ⬅️ BẮT BUỘC – DÒNG ĐẦU TIÊN

import dynamic from "next/dynamic";

const ChatBot = dynamic(() => import("./ChatBot"), {
  ssr: false,
});

export default ChatBot;
