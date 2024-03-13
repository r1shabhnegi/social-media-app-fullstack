import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import * as ApiClient from './ApiClient';
import { setAuth } from './global/authSlice';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { isError } = useQuery({
    queryKey: ['validation-token'],
    queryFn: ApiClient.validateToken,
  });

  dispatch(setAuth(!isError));

  return <>{children}</>;
};
export default AuthProvider;
