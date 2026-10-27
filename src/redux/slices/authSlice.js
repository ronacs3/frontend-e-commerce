import { createSlice } from "@reduxjs/toolkit";

const getInitialUserInfo = () => {
  if (typeof window === "undefined") return null;
  try {
    const fromLocal = localStorage.getItem("userInfo");
    if (fromLocal) return JSON.parse(fromLocal);
    const fromSession = sessionStorage.getItem("userInfo");
    if (fromSession) return JSON.parse(fromSession);
  } catch {
    return null;
  }
  return null;
};

const initialState = {
  userInfo: getInitialUserInfo(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("userInfo", JSON.stringify(action.payload));
          sessionStorage.setItem("userInfo", JSON.stringify(action.payload));
        } catch {
          // Ignore storage quota errors
        }
      }
    },

    logout: (state) => {
      state.userInfo = null;

      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("userInfo");
          sessionStorage.removeItem("userInfo");
        } catch {
          // Ignore storage errors
        }
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
