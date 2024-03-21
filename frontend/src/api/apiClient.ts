import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../store/authSlice';
import { RootState } from '@/store/store';

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;
    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`);
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
    const refreshResult = await baseQuery('/refresh', api, extraOptions);
    if (refreshResult?.data) {
      const username = (api.getState() as RootState).auth.username;
      api.dispatch(
        setCredentials(setCredentials({ ...refreshResult.data, username }))
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const apiClient = createApi({
  baseQuery: baseQueryAuthRF,
  endpoints: () => ({}),
});
