import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import compareReducer from "./slices/compareSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    compare: compareReducer,
  },
  devTools: process.env.NODE_ENV !== "production", // Bật DevTools khi không phải Production
});

export default store;
