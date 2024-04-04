import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    createCommunity: builder.mutation({
      query: (data) => ({
        url: `/api/community/create`,
        method: 'POST',
        body: { ...data },
      }),
      invalidatesTags: ['findBestCommunities'],
    }),

    findBestCommunities: builder.query({
      query: (pageCount) => `/api/community/findBestCommunities/${pageCount}`,
      providesTags: ['findBestCommunities'],
    }),

    communityPage: builder.query({
      query: (communityName) => `/api/community/${communityName}`,
    }),
  }),
});

export const {
  useCreateCommunityMutation,
  useFindBestCommunitiesQuery,
  useCommunityPageQuery,
} = apiRequests;
