import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    username: null,
    isLoggedIn: false,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      const { accessToken, username } = payload;
      state.accessToken = accessToken;
      state.username = username;
      state.isLoggedIn = !!accessToken;
    },
    setLogout: (state) => {
      state.accessToken = null;
      state.username = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setCredentials, setLogout } = authSlice.actions;
export default authSlice.reducer;
