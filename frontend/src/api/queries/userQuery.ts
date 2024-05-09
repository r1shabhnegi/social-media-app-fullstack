import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    user: builder.query({
      query: (id) => `/api/user/getUserForCommunity/${id}`,
    }),
  }),
});

export const { useUserQuery } = apiRequests;
