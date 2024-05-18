import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getUserData: builder.query({
      query: (username) => `/api/user/${username}`,
    }),

    getUserPosts: builder.query({
      query: (username) => `/api/user/${username}/posts`,
    }),
  }),
});

export const { useGetUserDataQuery, useGetUserPostsQuery } = apiRequests;
