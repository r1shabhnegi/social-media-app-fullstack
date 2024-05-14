import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { RootState } from './global/_store';

const ProtectedRoutes = () => {
  // const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = true;
  console.log(isLoggedIn);
  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate
      to='/sign-in'
      state={{ from: location }}
      replace
    />
  );
};
export default ProtectedRoutes;
