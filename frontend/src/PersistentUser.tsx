import { useEffect } from 'react';
import { useRefreshTokenQuery } from './api/queries/authQuery';
import { useDispatch } from 'react-redux';
import { setCredentials } from './global/authSlice';
import { AppDispatch } from './global/_store';
import Loading from './components/Loading';

const PersistentUser = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isSuccess, isLoading } = useRefreshTokenQuery({});

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCredentials({ ...data }));
    }
  }, [dispatch, data, isSuccess]);

  return isLoading ? <Loading isLoading={isLoading} /> : children;
};
export default PersistentUser;
