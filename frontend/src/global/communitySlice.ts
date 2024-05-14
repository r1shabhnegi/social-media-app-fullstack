import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userCommunitiesList: [],
  modCommunitiesList: [],
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setUserCommunitiesList: (state, action) => {
      state.userCommunitiesList = action.payload;
    },

    setModCommunitiesList: (state, action) => {
      state.modCommunitiesList = action.payload;
    },
  },
});

export const { setUserCommunitiesList, setModCommunitiesList } =
  communitySlice.actions;

export default communitySlice.reducer;
