import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    createCommunity: builder.mutation({
      query: (data) => ({
        url: '/api/community/create',
        method: 'POST',
        body: { ...data },
      }),
      invalidatesTags: ['findBestCommunities'],
    }),

    findCommunities: builder.query({
      query: (pageCount) => `/api/community/findCommunities/${pageCount}`,
      providesTags: ['findBestCommunities'],
    }),

    // getCommunity: builder.mutation({
    //   query: (data) => ({
    //     url: '/api/community/getCommunity',
    //     method: 'POST',
    //     body: { ...data },
    //   }),
    //   providesTags: ['getCommunity'],
    // }),

    getCommunity: builder.query({
      query: (name) => `/api/community/getCommunity/${name}`,
      providesTags: ['getCommunity'],
    }),

    joinCommunity: builder.mutation({
      query: (data) => ({
        url: '/api/community/joinCommunity',
        method: 'POST',
        body: { ...data },
      }),
      invalidatesTags: ['getCommunity', 'getUserCommunities'],
    }),

    leaveCommunity: builder.mutation({
      query: (data) => ({
        url: '/api/community/leaveCommunity',
        method: 'POST',
        body: { ...data },
      }),
      invalidatesTags: ['getCommunity', 'getUserCommunities'],
    }),

    getUserCommunities: builder.query({
      query: () => '/api/community/getUserCommunitiesList',
      providesTags: ['getUserCommunities'],
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
} = apiRequests;
