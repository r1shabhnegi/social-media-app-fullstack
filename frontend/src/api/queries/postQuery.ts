import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    numberOfPosts: builder.query({ query: () => '/api/post/numberOfPosts' }),

    createPost: builder.mutation({
      query: (data) => ({
        url: '/api/post/createPost',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['getCommunity', 'communityPosts', 'getHomePosts'],
    }),

    getAllCommunityPosts: builder.query({
      query: ({ communityId, page }) => `/api/post/${communityId}/${page}`,
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

    getAllPost: builder.query({
      query: (page) => `/api/post/getAllPosts/${page}`,
      providesTags: ['getHomePosts'],
    }),

    getPostDetails: builder.query({ query: (id) => `/api/post/detail/${id}` }),
  }),
});

export const {
  useNumberOfPostsQuery,
  useCreatePostMutation,
  useLazyGetAllCommunityPostsQuery,
  useGetPostStatsQuery,
  useAddUpVoteMutation,
  useGetAllPostQuery,
  useGetPostDetailsQuery,
} = apiRequests;
