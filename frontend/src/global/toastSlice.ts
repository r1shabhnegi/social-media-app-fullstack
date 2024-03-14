import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type initialStateTypes = {
  toastValue:
    | undefined
    | { message: string; type: 'ERROR' | 'SUCCESS'; onChange: () => void };
};

const initialState: initialStateTypes = {
  toastValue: undefined,
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<
        { message: string; type: 'ERROR' | 'SUCCESS' } | undefined
      >
    ) => {
      state.toastValue = action.payload;
    },
  },
});

export const { showToast } = toastSlice.actions;
export default toastSlice.reducer;
