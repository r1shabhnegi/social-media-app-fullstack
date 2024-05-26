import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getUserData: builder.query({
      query: () => `/api/user`,
    }),

    getUserPosts: builder.query({
      query: () => `/api/user/posts`,
    }),

    getUserSaved: builder.query({
      query: () => `/api/user/saved`,
    }),

    getUserComments: builder.query({
      query: () => `/api/user/comments`,
    }),

    editUser: builder.mutation({
      query: (data) => ({
        url: '/api/user/editUser',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUserDataQuery,
  useGetUserPostsQuery,
  useLazyGetUserSavedQuery,
  useLazyGetUserCommentsQuery,
  useEditUserMutation,
} = apiRequests;
