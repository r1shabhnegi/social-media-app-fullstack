import { useEffect } from 'react';
import { useRefreshTokenQuery } from './api/queries/authQuery';
import { useDispatch } from 'react-redux';
import { setCredentials } from './global/authSlice';
import { AppDispatch } from './global/_store';
import PageLoader from './components/PageLoader';

const PersistentUser = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isSuccess, isLoading } = useRefreshTokenQuery({});
  useEffect(() => {
    if (isSuccess) {
      dispatch(setCredentials({ ...data }));
    }
  }, [dispatch, data, isSuccess]);

  return isLoading ? <PageLoader isLoading={isLoading} /> : children;
};
export default PersistentUser;
