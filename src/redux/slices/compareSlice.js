// src/redux/slices/compareSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initialState = {
  compareItems:
    typeof window !== "undefined" && localStorage.getItem("compareItems")
      ? JSON.parse(localStorage.getItem("compareItems"))
      : [],
};

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      const product = action.payload;
      const existItem = state.compareItems.find((x) => x._id === product._id);

      if (existItem) {
        message.warning("Sản phẩm đã có trong danh sách so sánh");
        return;
      }

      if (state.compareItems.length >= 3) {
        message.error("Chỉ được so sánh tối đa 3 sản phẩm");
        return;
      }

      state.compareItems.push(product);
      localStorage.setItem("compareItems", JSON.stringify(state.compareItems));
      message.success("Đã thêm vào so sánh");
    },
    removeFromCompare: (state, action) => {
      state.compareItems = state.compareItems.filter(
        (x) => x._id !== action.payload
      );
      localStorage.setItem("compareItems", JSON.stringify(state.compareItems));
    },
    clearCompare: (state) => {
      state.compareItems = [];
      localStorage.removeItem("compareItems");
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } =
  compareSlice.actions;
export default compareSlice.reducer;
