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

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';

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

            {/* drop down */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='border-0 hover:bg-transparent ring-0 focus:ring-0'>
                  <Avatar className='size-8 sm:size-9'>
                    <AvatarImage src='https://github.com/r1shabhnegi.png' />
                    <AvatarFallback>{'Rn'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='border-0 ring-0 focus:ring-0 w-56 mt-5 text-gray-200 bg-[#213036] rounded-2xl'
                align='end'>
                <DropdownMenuItem
                  className='cursor-pointer rounded-xl'
                  onClick={() => navigate(`/profile/${username}/posts`)}>
                  <User className='w-4 h-4 mr-2' />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-gray-600' />
                <DropdownMenuItem
                  className='cursor-pointer rounded-xl hover:text-red-600'
                  onClick={handleLogout}>
                  <LogOut className='w-4 h-4 mr-2' />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
