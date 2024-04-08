import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userCommunitiesList: [],
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    userCommunitiesList: (state, action) => {
      state.userCommunitiesList = action.payload;
    },
  },
});

export const { userCommunitiesList } = communitySlice.actions;

export default communitySlice.reducer;
