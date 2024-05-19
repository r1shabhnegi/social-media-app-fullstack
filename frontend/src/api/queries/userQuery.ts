import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getUserData: builder.query({
      query: (username) => `/api/user/${username}`,
    }),

    getUserPosts: builder.query({
      query: (username) => `/api/user/${username}/posts`,
    }),

    getUserSaved: builder.query({
      query: (username) => `/api/user/${username}/saved`,
    }),

    getUserComments: builder.query({
      query: (username) => `/api/user/${username}/comments`,
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
