import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo:
    typeof window !== "undefined" && sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo"))
      : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;

      if (typeof window !== "undefined") {
        sessionStorage.setItem("userInfo", JSON.stringify(action.payload));
      }
    },

    logout: (state) => {
      state.userInfo = null;

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("userInfo");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
