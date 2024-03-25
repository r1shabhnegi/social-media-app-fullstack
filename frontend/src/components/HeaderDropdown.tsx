import { CgProfile } from 'react-icons/cg';
import { AiOutlineLogout } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '@/api/queries/authQuery';
import { AppDispatch } from '@/global/_store';
import { useDispatch } from 'react-redux';
import { setLogout } from '@/global/authSlice';
import { showToast } from '@/global/toastSlice';
const HeaderDropdown = ({ username }: { username: string | null }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout('').unwrap();
      dispatch(setLogout());
      dispatch(showToast({ message: 'Sign Out Successful!', type: 'SUCCESS' }));
      navigate('/sign-in');
    } catch (error) {
      dispatch(showToast({ message: 'Error Signing Out!', type: 'ERROR' }));
    }
  };

  const goToProfile = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className='absolute w-48 p-4 bg-gray-100 rounded-md -right-1 drop-shadow-xl top-16'>
      <ul className='flex flex-col gap-6'>
        <li
          className='flex items-center gap-2 cursor-pointer'
          onClick={goToProfile}>
          <CgProfile />
          <p>Profile</p>
        </li>
        <li
          className='flex items-center gap-2 cursor-pointer'
          onClick={handleLogout}>
          <AiOutlineLogout />
          <p>Logout</p>
        </li>
      </ul>
    </div>
  );
};
export default HeaderDropdown;
