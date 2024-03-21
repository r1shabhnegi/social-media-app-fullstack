import { apiClient } from '../apiClient';

export const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // SERVER_STATUS
    serverStatus: builder.query({ query: () => '/server-status' }),

    // REFRESH_TOKEN
    refreshToken: builder.query({ query: () => '/refresh' }),

    // LOGIN
    login: builder.mutation({
      query: (data) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: { ...data },
      }),
    }),

    // LOGOUT
    logout: builder.query({
      query: () => '/api/auth/logout',
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutQuery,
  useServerStatusQuery,
  useRefreshTokenQuery,
} = apiRequests;
