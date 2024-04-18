import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userCommunitiesList: [],
  modCommunitiesList: [],
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
    setUserCommunitiesList: (state, action) => {
      state.userCommunitiesList = action.payload;
    },

    setModCommunitiesList: (state, action) => {
      state.modCommunitiesList = action.payload;
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

export const {
  setUserCommunitiesList,
  setModCommunitiesList,
  setCurrentCommunity,
} = communitySlice.actions;

export default communitySlice.reducer;
