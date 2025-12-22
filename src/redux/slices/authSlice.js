import { createSlice } from "@reduxjs/toolkit";

/* ================= INITIAL STATE ================= */
// Tự động lấy thông tin user từ LocalStorage nếu có
const initialState = {
  userInfo:
    typeof window !== "undefined" && localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
};

/* ================= SLICE ================= */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Đăng nhập / Cập nhật thông tin
    setCredentials: (state, action) => {
      state.userInfo = action.payload;

      // Lưu ngay vào LocalStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      }
    },

    // Đăng xuất
    logout: (state) => {
      state.userInfo = null;

      // Xóa khỏi LocalStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("userInfo");
        // Lưu ý: Việc reset giỏ hàng (resetCart) sẽ được gọi riêng ở Component Header hoặc qua Thunk
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
