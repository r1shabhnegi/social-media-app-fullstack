import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    username: null,
    userId: null,
    isLoggedIn: false,
    isLoading: true,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      const { accessToken, username, userId } = payload;
      state.accessToken = accessToken;
      state.username = username;
      state.userId = userId;
      state.isLoggedIn = !!accessToken;
    },
    setLogout: (state) => {
      state.accessToken = null;
      state.username = null;
      state.userId = null;
      state.isLoggedIn = false;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, setLogout, setIsLoading } = authSlice.actions;
export default authSlice.reducer;
