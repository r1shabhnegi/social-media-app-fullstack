import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { RootState } from "./global/_store";
import { setIsLoading } from "./global/authSlice";
import { useEffect } from "react";

const ProtectedRoutes = () => {
  const dispatch = useDispatch();
  const { isLoading, isLoggedIn } = useSelector(
    (state: RootState) => state.auth
  );
  useEffect(() => {
    dispatch(setIsLoading(false));
  }, [dispatch]);

  return isLoading ? null : isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to='/sign-in' />
  );
};
export default ProtectedRoutes;
