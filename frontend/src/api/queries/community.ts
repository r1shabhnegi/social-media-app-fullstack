import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    createCommunity: builder.mutation({
      query: (data) => ({
        url: `/api/community/${data.name}`,
        method: 'POST',
        body: { ...data },
      }),
    }),
  }),
});

export const { useCreateCommunityMutation } = apiRequests;
