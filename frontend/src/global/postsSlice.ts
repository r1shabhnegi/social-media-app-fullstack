import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  numberOfPosts: 0,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setNumberOfPosts: (state, action) => {
      state.numberOfPosts = action.payload;
    },
  },
});

export const { setNumberOfPosts } = postsSlice.actions;
export default postsSlice.reducer;
