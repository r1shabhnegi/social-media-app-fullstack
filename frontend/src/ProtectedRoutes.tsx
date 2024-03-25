import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { RootState } from './global/_store';

const ProtectedRoutes = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  return isLoggedIn ? <Outlet /> : <Navigate to='/' />;
};
export default ProtectedRoutes;
