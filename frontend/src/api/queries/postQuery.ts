import { apiClient } from "../apiClient";

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    numberOfPosts: builder.query({ query: () => "/api/post/numberOfPosts" }),

    createPost: builder.mutation({
      query: (data) => ({
        url: "/api/post/create-post",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["getCommunity", "communityPosts", "getHomePosts"],
    }),

    getAllCommunityPosts: builder.query({
      query: ({ communityId, page }) =>
        `/api/post/community-posts/${communityId}/${page}`,
      providesTags: ["communityPosts"],
    }),

    getAllPosts: builder.query({
      query: (page) => `/api/post/get-all-posts/${page}`,
      providesTags: ["getHomePosts"],
    }),

    getPostDetails: builder.query({ query: (id) => `/api/post/detail/${id}` }),

    getPostStats: builder.query({
      query: ({ postId }) => `/api/post/post-stats/${postId}`,
      providesTags: ["postStats"],
    }),

    upVote: builder.mutation({
      query: (data) => ({
        url: "/api/post/up-vote",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["postStats"],
    }),

    downVote: builder.mutation({
      query: (data) => ({
        url: "/api/post/down-vote",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["postStats"],
    }),

    savePost: builder.mutation({
      query: (data) => ({
        url: "/api/post/save-post",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["postStats"],
    }),

    deletePost: builder.mutation({
      query: (postId) => ({
        url: "/api/post/delete-post",
        method: "POST",
        body: postId,
      }),
      invalidatesTags: ["getHomePosts", "communityPosts"],
    }),

    postDetails: builder.query({
      query: (postId) => `/api/post/post-details/${postId}`,
      providesTags: ["postDetail"],
    }),

    postDetailsCommunityInfo: builder.query({
      query: (id) => `/api/post/post-details-community-info/${id}`,
    }),

    communityNumberOfPosts: builder.query({
      query: (communityId) => `/api/post/number-of-posts/${communityId}`,
    }),

    getRecentPosts: builder.query({
      query: () => "/api/post/recent-post",
      providesTags: ["recent-post"],
    }),
    createRecentPosts: builder.mutation({
      query: (postId) => ({
        url: "/api/post/recent-post",
        method: "POST",
        body: postId,
      }),
      invalidatesTags: ["recent-post"],
    }),

    communitiesFeedPosts: builder.query({
      query: (page) => `/api/post/communities-feed-posts/${page}`,
      providesTags: ["communities-feed-posts"],
    }),
  }),
});

export const {
  useNumberOfPostsQuery,
  useCreatePostMutation,
  useCreateRecentPostsMutation,
  useGetRecentPostsQuery,
  // useGetAllCommunityPostsQuery,
  useCommunitiesFeedPostsQuery,
  useGetAllPostsQuery,
  useLazyGetPostStatsQuery,
  useUpVoteMutation,
  useDownVoteMutation,
  useSavePostMutation,
  useDeletePostMutation,
  usePostDetailsQuery,
  useLazyPostDetailsCommunityInfoQuery,
  useCommunityNumberOfPostsQuery,
  useGetAllCommunityPostsQuery,
} = apiRequests;
