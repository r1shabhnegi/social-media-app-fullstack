import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    username: "",
    userId: null,
    isLoggedIn: false,
    isLoading: true,
    avatar: "",
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      const { accessToken, username, avatar, userId } = payload;
      state.accessToken = accessToken;
      state.username = username;
      state.userId = userId;
      state.avatar = avatar;
      state.isLoggedIn = !!accessToken;
    },
    setLogout: (state) => {
      state.accessToken = null;
      state.username = "";
      state.userId = null;
      state.isLoggedIn = false;
      state.avatar = "";
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, setLogout, setIsLoading } = authSlice.actions;
export default authSlice.reducer;
