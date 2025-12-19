import { createSlice } from "@reduxjs/toolkit";

/* ================= HELPERS ================= */
const calculatePrices = (cartItems) => {
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 10_000_000 ? 0 : 30_000;
  const totalPrice = itemsPrice + shippingPrice;

  return {
    itemsPrice,
    shippingPrice,
    totalPrice,
  };
};

/* ================= INITIAL STATE ================= */
const initialState = {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: "PayPal",
  itemsPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
};

/* ================= SLICE ================= */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, action) => {
      return { ...state, ...action.payload };
    },

    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems.push(item);
      }

      Object.assign(state, calculatePrices(state.cartItems));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

      Object.assign(state, calculatePrices(state.cartItems));
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      Object.assign(state, calculatePrices([]));
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
