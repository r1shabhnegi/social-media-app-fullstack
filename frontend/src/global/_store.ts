import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './toastSlice';
import authReducer from './authSlice';
import { apiClient } from '@/api/apiClient';
import communityReducer from './communitySlice'
// import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    [apiClient.reducerPath]: apiClient.reducer,
    toast: toastReducer,
    auth: authReducer,
    community: communityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiClient.middleware),
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
