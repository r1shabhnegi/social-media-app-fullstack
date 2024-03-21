import { useEffect, useState } from 'react';
import {
  useRefreshTokenQuery,
  useServerStatusQuery,
} from './api/queries/authQuery';
import Loading from './components/Loading';
import Error from './components/Error';
import { setCredentials } from './store/authSlice';
import { AppDispatch } from './store/store';
import { useDispatch } from 'react-redux';
import PagesContainer from './PagesContainer';
import Toast from './components/Toast';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isError: isErrorServerStatus, isLoading: isLoadingServerStatus } =
    useServerStatusQuery('');
  const {
    data,
    isSuccess: isSuccessRefreshToken,
    isError: isErrorRefreshToken,
    isLoading: isLoadingRefreshToken,
  } = useRefreshTokenQuery('');

  useEffect(() => {
    if (isErrorServerStatus) {
      setIsLoading(false);
      setError(`Server is Down!`);
    }
  }, [isErrorServerStatus]);

  useEffect(() => {
    if (isErrorRefreshToken) {
      setIsLoading(false);
      navigate('/sign-in');
    }
  }, [isErrorRefreshToken, navigate]);

  useEffect(() => {
    setIsLoading(false);
    dispatch(setCredentials({ ...data }));
  }, [dispatch, data, isSuccessRefreshToken]);

  useEffect(() => {
    if (isLoadingServerStatus || isLoadingRefreshToken) {
      setIsLoading(true);
    }
  }, [isLoadingServerStatus, isLoadingRefreshToken]);

  if (isLoading || error) {
    return isLoading ? (
      <Loading isLoading={isLoading} />
    ) : (
      error && <Error error={error} />
    );
  }

  return (
    <>
      <Toast />
      <PagesContainer />
    </>
  );
};
export default App;
