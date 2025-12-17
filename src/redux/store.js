import { configureStore } from "@reduxjs/toolkit";
import cartSliceReducer from "./slices/cartSlice";
import authSliceReducer from "./slices/authSlice"; // <--- Import mới

export const store = configureStore({
  reducer: {
    cart: cartSliceReducer,
    auth: authSliceReducer, // <--- Thêm vào đây
  },
});
