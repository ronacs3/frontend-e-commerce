import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems:
    typeof window !== "undefined" && localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart")).cartItems
      : [],
  shippingAddress:
    typeof window !== "undefined" && localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart")).shippingAddress
      : {},
  paymentMethod: "PayPal", // Mặc định
  itemsPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // Nếu đã có, ghi đè lại (để cập nhật số lượng)
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        // Nếu chưa có, thêm mới
        state.cartItems = [...state.cartItems, item];
      }

      // Tính lại tổng tiền (Logic đơn giản, có thể tách ra helper function)
      state.itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      state.shippingPrice = state.itemsPrice > 10000000 ? 0 : 30000; // Freeship nếu > 10tr
      state.totalPrice = state.itemsPrice + state.shippingPrice;

      // Lưu vào LocalStorage để F5 không mất (chạy ở browser)
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

      // Tính lại tiền sau khi xóa... (Copy logic tính tiền ở trên xuống)
      state.itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      state.totalPrice =
        state.itemsPrice + (state.itemsPrice > 10000000 ? 0 : 30000);

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
