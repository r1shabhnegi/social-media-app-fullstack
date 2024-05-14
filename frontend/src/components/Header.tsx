import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/global/_store';

import LeftSideBar from './LeftSideBar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Icons
import { IoMenuSharp } from 'react-icons/io5';
import { CiSearch } from 'react-icons/ci';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { IoAdd } from 'react-icons/io5';
import { useLogoutMutation } from '@/api/queries/authQuery';
import { setLogout } from '@/global/authSlice';
import { showToast } from '@/global/toastSlice';
import CommonLoader from './CommonLoader';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, username, userId } = useSelector(
    (state: RootState) => state.auth
  );
  const [logout, { isLoading: loadingLogoutBtn }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const loggedOut = await logout(userId).unwrap();
      if (loggedOut) {
        navigate('/sign-in');
        dispatch(setLogout());
        dispatch(
          showToast({ message: 'Sign Out Successful!', type: 'SUCCESS' })
        );
      }
    } catch (error) {
      dispatch(showToast({ message: 'Error Signing Out!', type: 'ERROR' }));
    }
  };

  return (
    <header className='flex sticky z-[100] top-0 items-center justify-between h-12 py-1 bg-[#0b1416] border-b-[.1rem] border-gray-600 sm:h-14 px-[1rem]'>
      <span className='flex items-center gap-2'>
        {isLoggedIn && (
          <Sheet>
            <SheetTrigger>
              <span className='flex items-center gap-2 p-1 text-[#f2f2f1] rounded lg:hidden'>
                <IoMenuSharp className='size-6' />
              </span>
            </SheetTrigger>
            <SheetContent
              className='bg-[#0b1416] text-[#f2f2f1]'
              side='left'>
              <LeftSideBar />
            </SheetContent>
          </Sheet>
        )}

        <span className='p-1 text-xl font-semibold tracking-tight text-[#f2f2f1] rounded md:text-2xl lg:3xl lg:pr-16'>
          <Link
            to='/'
            className='flex items-center '>
            Circlesss
          </Link>
        </span>
      </span>
      <span className='hidden bg-[#1a282d] rounded-full w-full mx-5 sm:flex max-w-[35rem] h-10  items-center'>
        <CiSearch className='ml-3 mr-1 text-[#f2f2f1] size-6' />
        <input
          type='text'
          placeholder='Search...'
          className='w-full p-1 text-sm mr-2 outline-none text-[#f2f2f1] bg-[#1a282d]'
        />
      </span>

      <span className='flex items-center gap-2 md:gap-4'>
        <span className='flex items-center p-1 text-[#f2f2f1] rounded sm:hidden'>
          <CiSearch className='size-7' />
        </span>
        {isLoggedIn ? (
          <>
            <span className='cursor-pointer text-[#f2f2f1]'>
              <IoChatbubbleEllipsesOutline className='size-6' />
            </span>
            <Link to='/submit'>
              <span className='flex gap-1 items-center font-bold text-[#f2f2f1] rounded cursor-pointer sm:mr-2'>
                <IoAdd className='size-7 ' />
                <p className='hidden text-sm sm:inline-block'>Create</p>
              </span>
            </Link>

            <span className='relative flex gap-8 rounded cursor-pointer dropdown dropdown-end'>
              <button
                tabIndex={0}
                role='button'
                className={`flex items-center relative justify-center  rounded-full size-11 `}>
                <span className='rounded-full'>
                  <Avatar className='size-8 sm:size-9'>
                    <AvatarImage src='https://github.com/r1shabhnegi.png' />
                    <AvatarFallback>RN</AvatarFallback>
                  </Avatar>
                </span>
              </button>

              <ul
                tabIndex={0}
                className='dropdown-content z-[1] menu p-2 mt-6 shadow bg-base-100 rounded-box w-52'>
                <li className='flex items-center gap-2 py-3 cursor-pointer'>
                  <span
                    className='flex flex-col rounded-full group'
                    onClick={() => navigate(`/profile/${username}`)}>
                    <Avatar className='size-8 sm:size-9'>
                      <AvatarImage src='https://github.com/r1shabhnegi.png' />
                      <AvatarFallback>RN</AvatarFallback>
                    </Avatar>
                    <p className='text-sm text-gray-400 group-hover:underline'>
                      u/{username}
                    </p>
                  </span>
                  <button
                    className='px-5 py-2 text-base font-semibold text-gray-300 bg-gray-700 rounded-lg'
                    onClick={handleLogout}
                    disabled={loadingLogoutBtn}>
                    {loadingLogoutBtn ? (
                      <CommonLoader
                        isLoading={loadingLogoutBtn}
                        size={25}
                      />
                    ) : (
                      'Logout'
                    )}
                  </button>
                </li>
              </ul>
            </span>
          </>
        ) : (
          <span className='flex px-2 py-1 ml-8 font-bold tracking-tight text-center text-[#f2f2f1] rounded-full text-md md:text-lg lg:text-xl bg-gradient-to-r from-cyan-500 to-blue-700 whitespace-nowrap'>
            <Link to='/sign-in'>Sign In</Link>
          </span>
        )}
      </span>
    </header>
  );
};
export default Header;
