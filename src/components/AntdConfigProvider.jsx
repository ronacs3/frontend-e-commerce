"use client";

import { ConfigProvider, App } from "antd";

export default function AntdConfigProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#477f77",
          colorSuccess: "#6fae9b",
          colorWarning: "#f59e0b", // Amber 500
          colorError: "#ef4444",   // Red 500
          colorInfo: "#3b82f6",    // Blue 500
          borderRadius: 8,
          borderRadiusLG: 10,
          borderRadiusSM: 6,
          fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          colorBgContainer: "#ffffff",
          colorBgElevated: "#ffffff",
          boxShadow: "0 8px 18px -10px rgba(15, 23, 42, 0.18)",
          boxShadowSecondary: "0 16px 30px -18px rgba(15, 23, 42, 0.24)",
        },
        components: {
          Button: {
            colorPrimary: "#477f77",
            colorPrimaryHover: "#386e66",
            colorPrimaryActive: "#315f59",
            borderRadius: 8,
            controlHeight: 40,
            fontWeight: 600,
          },
          Card: {
            borderRadiusLG: 8,
            boxShadowTertiary: "0 4px 20px 0 rgba(0,0,0,0.05)",
          },
          Table: {
            borderRadius: 12,
            headerBg: "#f8fafc",
            headerColor: "#334155",
            rowHoverBg: "#f1f5f9",
          },
          Badge: {
            indicatorThickness: 2,
          },
          Dropdown: {
            borderRadiusLG: 12,
          },
        },
      }}
    >
      <App className="min-h-screen flex flex-col flex-1">
        {children}
      </App>
    </ConfigProvider>
  );
}
