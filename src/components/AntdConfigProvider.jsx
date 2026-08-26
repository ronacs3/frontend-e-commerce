"use client";

import { ConfigProvider } from "antd";

export default function AntdConfigProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#4f46e5", // Indigo 600
          colorSuccess: "#10b981", // Emerald 500
          colorWarning: "#f59e0b", // Amber 500
          colorError: "#ef4444",   // Red 500
          colorInfo: "#3b82f6",    // Blue 500
          borderRadius: 10,
          borderRadiusLG: 14,
          borderRadiusSM: 6,
          fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          colorBgContainer: "#ffffff",
          colorBgElevated: "#ffffff",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
          boxShadowSecondary: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)",
        },
        components: {
          Button: {
            colorPrimary: "#4f46e5",
            colorPrimaryHover: "#4338ca",
            colorPrimaryActive: "#3730a3",
            borderRadius: 8,
            controlHeight: 40,
            fontWeight: 600,
          },
          Card: {
            borderRadiusLG: 16,
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
      {children}
    </ConfigProvider>
  );
}
