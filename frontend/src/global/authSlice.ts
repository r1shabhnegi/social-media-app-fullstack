import { createSlice } from '@reduxjs/toolkit';

type AuthInitialTypes = {
  isAuth: boolean;
  // userId: string;
};

const initialState: AuthInitialTypes = {
  isAuth: false,
  // userId: '',
};

// export const authValidation = createAsyncThunk('auth/validation', () => {
//   const res = ApiClient.validateToken;
//   return res;
// });

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuth = !!action.payload;
    },
  },
  //   extraReducers: (builder) => {
  //     builder
  //       .addCase(authValidation.pending, (state) => {
  //         state.authStatus = 'PENDING';
  //       })
  //       .addCase(authValidation.fulfilled, (state) => {
  //         state.authStatus = 'SUCCESS';
  //         state.isAuth = true;
  //       })

  //       .addCase(authValidation.rejected, (state) => {
  //         state.authStatus = 'ERROR';
  //         state.isAuth = false;
  //       });
  //   },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
