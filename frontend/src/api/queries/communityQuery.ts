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

    getCommunity: builder.mutation({
      query: (data) => ({
        url: '/api/community/getCommunity',
        method: 'POST',
        body: { ...data },
      }),
      providesTags: ['communityPage'],
    }),

    joinCommunity: builder.mutation({
      query: (data) => ({
        url: '/api/community/joinCommunity',
        method: 'POST',
        body: { ...data },
      }),
      invalidatesTags: ['communityPage'],
    }),

    getUserCommunities: builder.query({
      query: () => '/api/community/getUserCommunitiesList',
    }),
  }),
});

export const {
  useCreateCommunityMutation,
  useFindCommunitiesQuery,
  useGetCommunityMutation,
  useJoinCommunityMutation,
  useLazyGetUserCommunitiesQuery,
} = apiRequests;
