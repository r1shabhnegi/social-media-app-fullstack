import { apiClient } from "../apiClient";

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getUserData: builder.query({
      query: (username) => `/api/user/get/${username}`,
      providesTags: ["userProfile"],
    }),

    getUserPosts: builder.query({
      query: (username) => `/api/user/posts/${username}`,
    }),

    getUserSaved: builder.query({
      query: (username) => `/api/user/saved/${username}`,
    }),

    getUserComments: builder.query({
      query: (username) => `/api/user/comments/${username}`,
    }),

    editUser: builder.mutation({
      query: (data) => ({
        url: "/api/user/editUser",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["userProfile"],
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
