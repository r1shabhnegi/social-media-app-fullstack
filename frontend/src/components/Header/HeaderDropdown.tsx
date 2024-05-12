import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '@/api/queries/authQuery';
import { useDispatch } from 'react-redux';
import { setLogout } from '@/global/authSlice';
import { showToast } from '@/global/toastSlice';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { IoIosLogOut } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';

const HeaderDropdown = ({ username }: { username: string | null }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const loggedOut = await logout('');
      if (loggedOut) {
        dispatch(setLogout());
        dispatch(
          showToast({ message: 'Sign Out Successful!', type: 'SUCCESS' })
        );
        navigate('/sign-in');
      }
    } catch (error) {
      dispatch(showToast({ message: 'Error Signing Out!', type: 'ERROR' }));
    }
  };

  const goToProfile = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className='absolute z-50 w-60 p-4 bg-[#0f1a1c] rounded-md -right-1 drop-shadow-xl top-16 text-[#f2f2f1]'>
      <ul className='flex flex-col gap-6'>
        <li
          className='flex items-center gap-2 cursor-pointer'
          onClick={goToProfile}>
          <span className='rounded-full'>
            <Avatar className='size-8 sm:size-9'>
              <AvatarImage src='https://github.com/r1shabhnegi.png' />
              <AvatarFallback>RN</AvatarFallback>
            </Avatar>
          </span>

          <span>
            <p className='text-sm'>View Profile</p>
            <p className='text-xs text-gray-400'>u/{username}</p>
          </span>
        </li>
        {/* <li
          className='flex items-center gap-3 pl-2 cursor-pointer'
          onClick={handleLogout}>
          <IoSettingsOutline className='size-6' />
          <p className='text-sm'>Settings</p>
        </li> */}
        <li
          className='flex items-center gap-2 pl-2 cursor-pointer'
          onClick={handleLogout}>
          <IoIosLogOut className='size-7' />
          <p className='text-sm'>Logout</p>
        </li>
      </ul>
    </div>
  );
};
export default HeaderDropdown;
