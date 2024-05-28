import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { setCredentials, setLogout } from '../global/authSlice';
import { RootState } from '@/global/_store';

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryAuthRF = async (
  args: FetchArgs | string,
  api: BaseQueryApi,
  extraOptions: object
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 403) {
    const refreshResult = await baseQuery(
      '/api/auth/refresh',
      api,
      extraOptions
    );
    if (refreshResult?.data) {
      api.dispatch(setCredentials({ ...refreshResult.data }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(setLogout());
    }
  }
  return result;
};

export const apiClient = createApi({
  baseQuery: baseQueryAuthRF,
  endpoints: () => ({}),
  tagTypes: [
    'getCommunity',
    'communityPosts',
    'getUserCommunities',
    'getUserModCommunities',
    'findBestCommunities',
    'getHomePosts',
    'postStats',
    'postDetail',
    'comments',
    'userProfile',
  ],
});
