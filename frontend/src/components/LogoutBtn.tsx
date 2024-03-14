import { useMutation } from '@tanstack/react-query';
import { authValidation } from '@/global/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/global/store';
import * as ApiClient from '../ApiClient';
import { showToast } from '@/global/toastSlice';
import { useNavigate } from 'react-router-dom';

const LogoutBtn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const mutation = useMutation({
    mutationFn: ApiClient.logout,
    onSuccess: async () => {
      dispatch(authValidation());
      dispatch(
        showToast({ message: 'Logged Out Successfully!', type: 'SUCCESS' })
      );
      navigate('/sign-in');
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };
  return <button onClick={() => handleLogout()}>Logout</button>;
};
export default LogoutBtn;
