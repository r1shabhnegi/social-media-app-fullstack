import { apiClient } from "../apiClient";

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    createCommunity: builder.mutation({
      query: (data) => ({
        url: "/api/community/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        "findBestCommunities",
        "getUserModCommunities",
        "getUserCommunities",
      ],
    }),

    findCommunities: builder.query({
      query: (pageCount) => `/api/community/find-communities/${pageCount}`,
      providesTags: ["findBestCommunities"],
    }),

    getCommunity: builder.query({
      query: (name) => `/api/community/get-community/${name}`,
      providesTags: ["getCommunity"],
    }),

    joinCommunity: builder.mutation({
      query: (data) => ({
        url: "/api/community/join-community",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        "getCommunity",
        "getUserCommunities",
        "communities-feed-posts",
      ],
    }),

    leaveCommunity: builder.mutation({
      query: (data) => ({
        url: "/api/community/leave-community",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["getCommunity", "getUserCommunities"],
    }),

    getUserCommunities: builder.query({
      query: () => "/api/community/get-user-communities-list",
      providesTags: ["getUserCommunities"],
    }),

    getUserModCommunities: builder.query({
      query: () => "/api/community/get-user-mod-communities",
      providesTags: ["getUserModCommunities"],
    }),
    editCommunity: builder.mutation({
      query: (data) => ({
        url: "/api/community/create/edit-community",
        method: "POST",
        body: data,
        data: true,
      }),
      invalidatesTags: [
        "getCommunity",
        "getUserCommunities",
        "getUserModCommunities",
      ],
    }),

    deleteCommunity: builder.mutation({
      query: (data) => ({
        url: "/api/community/delete-community",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["getUserCommunities", "getUserModCommunities"],
    }),
  }),
});

export const {
  useCreateCommunityMutation,
  useGetCommunityQuery,
  useJoinCommunityMutation,
  useLazyGetUserCommunitiesQuery,
  useLeaveCommunityMutation,
  useFindCommunitiesQuery,
  useEditCommunityMutation,
  useLazyGetUserModCommunitiesQuery,
  useDeleteCommunityMutation,
} = apiRequests;
