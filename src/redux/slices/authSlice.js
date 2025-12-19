import { createSlice } from "@reduxjs/toolkit";

/* ================= INITIAL STATE ================= */
const initialState = {
  userInfo: null, // _id, name, email, isAdmin, token
};

/* ================= SLICE ================= */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth: (state, action) => {
      state.userInfo = action.payload;
    },

    setCredentials: (state, action) => {
      state.userInfo = action.payload;
    },

    logout: (state) => {
      state.userInfo = null;
    },
  },
});

export const { hydrateAuth, setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
