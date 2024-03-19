import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import setCredentials, { logout } from '../global/authSlice';
import { RootState } from '@/global/store';

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `bearer ${token}`);
    }
    return headers;
  },
});

// type credentialsTypes= {
//   accessToken: string,
//   username:string
// }

const baseQueryAuthRF = async (
  args: FetchArgs | string,
  api: BaseQueryApi,
  extraOptions: object
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    const refresh = await baseQuery('/refresh', api, extraOptions);
    if (refresh?.data) {
      const username = (api.getState() as RootState).auth.username;

      api.dispatch(
        setCredentials(undefined, {
          ...refresh.data,
          username,
          type: '',
        })
      );
      result = await baseQuery(args, api, extraOptions);
      throw new Error();
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
