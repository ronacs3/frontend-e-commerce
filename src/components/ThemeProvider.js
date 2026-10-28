"use client";

import { ConfigProvider } from "antd";

export default function ThemeProvider({ children }) {
  return <ConfigProvider theme={{
    token: { colorPrimary: "#195b4c", colorInfo: "#195b4c", colorSuccess: "#328168", colorText: "#233b34", colorTextSecondary: "#748078", colorBorder: "#dfe5de", colorBgLayout: "#f7f8f3", borderRadius: 10, controlHeight: 40, fontFamily: "inherit" },
    components: { Button: { primaryShadow: "none", fontWeight: 600 }, Card: { borderRadiusLG: 18 }, Input: { activeShadow: "0 0 0 3px rgba(25,91,76,.08)" }, Table: { headerBg: "#f1f5ef", rowHoverBg: "#f6f9f3" } },
  }}>{children}</ConfigProvider>;
}
