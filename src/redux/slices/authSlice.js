import { createSlice } from "@reduxjs/toolkit";

// Kiểm tra xem có dữ liệu trong LocalStorage không (chỉ chạy ở Client)
const userInfoFromStorage =
  typeof window !== "undefined" && localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const initialState = {
  userInfo: userInfoFromStorage, // Chứa: _id, name, email, isAdmin, token
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      // Lưu vào LocalStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.userInfo = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("userInfo");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
