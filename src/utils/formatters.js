/**
/**
 * Dynamic utility functions for formatting and common data helpers
 */

// Format price in VND (e.g. 15.000.000 ₫)
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format concise price (e.g. 15 Tr, 500K)
export const formatShortCurrency = (amount) => {
  if (!amount) return "0đ";
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} Tr`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toLocaleString("vi-VN", { maximumFractionDigits: 0 })}K`;
  }
  return `${amount}đ`;
};

// Format Date string
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  };
  return new Intl.DateTimeFormat("vi-VN", options).format(date);
};

// Fallback image helper
export const DEFAULT_IMAGE = "/images/default-image.jpg";

export const getValidImage = (url) => {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return DEFAULT_IMAGE;
  }
  return url;
};
