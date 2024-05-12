import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (data) => ({
        url: '/api/post/createPost',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['getCommunity', 'communityPosts', 'getHomePosts'],
    }),

    getAllCommunityPosts: builder.query({
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

    getAllPost: builder.query({
      query: () => '/api/post/getAllPosts',
      providesTags: ['getHomePosts'],
    }),

    getPostDetails: builder.query({ query: (id) => `/api/post/detail/${id}` }),
  }),
});

export const {
  useCreatePostMutation,
  useLazyGetAllCommunityPostsQuery,
  useGetPostStatsQuery,
  useAddUpVoteMutation,
  useGetAllPostQuery,
  useGetPostDetailsQuery,
} = apiRequests;
