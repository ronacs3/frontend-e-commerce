"use client";

import dynamic from "next/dynamic";

const CompareFloatingBar = dynamic(() => import("@/components/CompareFloatingBar"), {
  ssr: false,
});
const ChatBot = dynamic(() => import("@/components/ChatBot.client"), {
  ssr: false,
});

export default function ClientWidgets({ showChat = true }) {
  return (
    <>
      <CompareFloatingBar />
      {showChat && <ChatBot />}
    </>
  );
}
