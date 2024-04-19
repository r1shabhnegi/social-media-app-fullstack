import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (data) => ({
        url: '/api/post/createPost',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useCreatePostMutation } = apiRequests;
