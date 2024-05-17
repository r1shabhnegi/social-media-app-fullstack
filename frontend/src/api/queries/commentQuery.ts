import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: (data) => ({
        url: '/api/comment/create',
        method: 'POST',
        body: data,
      }),
    }),

    getComments: builder.query({
      query: ({ postId, commentPage }) =>
        `/api/comment/getComments/${postId}/${commentPage}`,
    }),
  }),
});

export const { useCreateCommentMutation, useGetCommentsQuery } = apiRequests;
