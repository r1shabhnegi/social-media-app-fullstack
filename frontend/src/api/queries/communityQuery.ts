import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    createCommunity: builder.mutation({
      query: (data) => ({
        url: `/api/community/create`,
        method: 'POST',
        body: { ...data },
      }),
    }),

    findBestCommunities: builder.query({
      query: (pageCount) => `/api/community/findBestCommunities/${pageCount}`,
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
