import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const authValidation = createAsyncThunk('auth/validation', async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/auth/validate-token`,
    {
      method: 'POST',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Token invalid');
  }

  return response.json();
});
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: {},
    isAuth: false,
  },
  reducers: {
    setAuth: (state, action) => {
      state.isAuth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authValidation.fulfilled, (state, action) => {
        state.isAuth = !!action.payload;
        state.userId = action.payload;
      })
      .addCase(authValidation.rejected, (state, action) => {
        state.isAuth = !!action.payload;
        state.userId = {};
      });
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
