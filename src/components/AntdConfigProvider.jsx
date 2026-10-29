"use client";

import { ConfigProvider, App } from "antd";
import viVN from "antd/locale/vi_VN";

export default function AntdConfigProvider({ children }) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        cssVar: { key: "techshop" },
        token: {
          colorPrimary: "#2563eb",
          colorSuccess: "#44634d",
          colorWarning: "#f59e0b", // Amber 500
          colorError: "#ef4444",   // Red 500
          colorInfo: "#3b82f6",    // Blue 500
          colorText: "#111827",
          colorTextSecondary: "#64748b",
          colorBorder: "#e2e8f0",
          colorBgLayout: "#f8fafc",
          fontSize: 14,
          controlHeight: 40,
          borderRadius: 8,
          borderRadiusLG: 10,
          borderRadiusSM: 6,
          fontFamily: "var(--font-store), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          colorBgContainer: "#ffffff",
          colorBgElevated: "#ffffff",
          boxShadow: "0 8px 18px -10px rgba(15, 23, 42, 0.18)",
          boxShadowSecondary: "0 16px 30px -18px rgba(15, 23, 42, 0.24)",
        },
        components: {
          Button: {
            primaryShadow: "none",
            colorPrimary: "#2563eb",
            colorPrimaryHover: "#1d4ed8",
            colorPrimaryActive: "#1e40af",
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
            headerBg: "#f9fafb",
            headerColor: "#374151",
            rowHoverBg: "#eff6ff",
            cellPaddingBlock: 16,
            cellPaddingInline: 16,
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
