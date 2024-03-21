import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { showToast } from '@/store/toastSlice';
import { useNavigate } from 'react-router-dom';
import { useLogoutQuery } from '@/api/queries/authQuery';
import { useEffect, useState } from 'react';
import { setCredentials } from '@/store/authSlice';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

const LogoutBtn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [skipQuery, setSkipQuery] = useState<boolean>(true);
  const { isSuccess } = useLogoutQuery({ skip: skipQuery });

  useEffect(() => {
    if (isSuccess) {
      dispatch(showToast({ message: 'Logout Successful!', type: 'SUCCESS' }));
      dispatch(setCredentials({ accessToken: null, username: null }));
      navigate('/sign-in');
    }
  }, [isSuccess, dispatch, navigate]);
  const handleLogout = () => {
    setSkipQuery(false);
  };
  return <button onClick={() => handleLogout}>Logout</button>;
};
export default LogoutBtn;
