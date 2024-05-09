import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (data) => ({
        url: '/api/post/createPost',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['getCommunity', 'communityPosts'],
    }),

    getCommunityPosts: builder.query({
      query: (id) => `/api/post/${id}
    `,
      providesTags: ['communityPosts'],
    }),

    getPostStats: builder.query({
      query: (postId) => `/api/post/getPostStats/${postId}`,
    }),

    addUpVote: builder.mutation({
      query: (data) => ({
        url: '/api/post/addUpVote',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useCreatePostMutation,
  useLazyGetCommunityPostsQuery,
  useGetPostStatsQuery,
  useAddUpVoteMutation,
} = apiRequests;
