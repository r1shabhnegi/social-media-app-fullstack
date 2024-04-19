import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (data) => ({
        url: '/api/post/createPost',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['getCommunity'],
    }),

    getCommunityPosts: builder.query({ query: (id) => `/api/post/${id}` }),
  }),
});

export const { useCreatePostMutation, useGetCommunityPostsQuery } = apiRequests;
