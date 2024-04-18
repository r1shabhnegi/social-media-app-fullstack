import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userCommunitiesList: [],
  currentCommunity: {
    name: '',
    description: '',
    createdAt: '',
    author: '',
    rules: '',
    avatarImg: '',
    coverImg: '',
  },
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    userCommunitiesList: (state, action) => {
      state.userCommunitiesList = action.payload;
    },

    setCurrentCommunity: (state, action) => {
      const {
        name,
        description,
        createdAt,
        author,
        rules,
        avatarImg,
        coverImg,
      } = action.payload;

      const currentCommunity = state.currentCommunity;
      currentCommunity.name = name;
      currentCommunity.description = description;
      currentCommunity.createdAt = createdAt;
      currentCommunity.author = author;
      currentCommunity.rules = rules;
      currentCommunity.avatarImg = avatarImg;
      currentCommunity.coverImg = coverImg;
    },
  },
});

export const { userCommunitiesList, setCurrentCommunity } =
  communitySlice.actions;

export default communitySlice.reducer;
