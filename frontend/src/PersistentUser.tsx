import { useEffect } from 'react';
import { useRefreshTokenQuery } from './api/queries/authQuery';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from './global/authSlice';
import { AppDispatch, RootState } from './global/_store';
import PageLoader from './components/PageLoader';

const PersistentUser = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isSuccess, isLoading } = useRefreshTokenQuery({});

  console.log('loading', isLoading);
  useEffect(() => {
    if (isSuccess) {
      dispatch(setCredentials({ ...data }));
    }
  }, [dispatch, data, isSuccess]);

  const { username } = useSelector((state: RootState) => state.auth);

  return isLoading ? <PageLoader isLoading={isLoading} /> : children;
};
export default PersistentUser;
