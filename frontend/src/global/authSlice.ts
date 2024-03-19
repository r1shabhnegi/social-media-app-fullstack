import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    username: null,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      const { token, userData } = payload;
      state.accessToken = token;
      state.username = userData;
    },
    logout: (state) => {
      state.accessToken = null;
      state.username = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
