import { configureStore } from "@reduxjs/toolkit";
import authReducer, { hydrateAuth } from "./slices/authSlice";
import cartReducer, { hydrateCart } from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

/* ================= CLIENT SIDE ONLY ================= */
if (typeof window !== "undefined") {
  // --- AUTH ---
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    store.dispatch(hydrateAuth(JSON.parse(userInfo)));
  }

  // --- CART ---
  const cart = localStorage.getItem("cart");
  if (cart) {
    store.dispatch(hydrateCart(JSON.parse(cart)));
  }

  // --- SUBSCRIBE SAVE ---
  store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem("userInfo", JSON.stringify(state.auth.userInfo));
    localStorage.setItem("cart", JSON.stringify(state.cart));
  });
}
