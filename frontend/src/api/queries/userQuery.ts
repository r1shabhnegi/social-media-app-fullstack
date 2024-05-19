import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getUserData: builder.query({
      query: (username) => `/api/user/${username}`,
    }),

    getUserPosts: builder.query({
      query: (username) => `/api/user/${username}/posts`,
    }),

    getUserSaved: builder.query({
      query: (username) => `/api/user/${username}/saved`,
    }),
  }),
});

export const {
  useGetUserDataQuery,
  useGetUserPostsQuery,
  useLazyGetUserSavedQuery,
} = apiRequests;
