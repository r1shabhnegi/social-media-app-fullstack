import { IoAdd, IoMenuOutline, IoSearchOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { TbLayoutSidebarRightCollapseFilled } from 'react-icons/tb';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LeftSideBar from './LeftSideBar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import LogoutBtn from './LogoutBtn';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';

const Header = () => {
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);

  return (
    <header className='flex items-center justify-between px-2 py-2 bg-gray-200'>
      <span className='flex items-center gap-3'>
        <span className='p-1 text-xl font-semibold tracking-tight text-gray-600 rounded md:text-3xl active:bg-gray-300'>
          <Link
            to='/'
            className='flex items-center '>
            Circlesss
          </Link>
        </span>

        {isAuth && (
          <Sheet>
            <SheetTrigger>
              <span className='flex items-center p-1 text-gray-600 rounded active:bg-gray-300 '>
                <TbLayoutSidebarRightCollapseFilled className='w-7 h-7 md:w-10 md:h-10' />
              </span>
            </SheetTrigger>
            <SheetContent side='left'>
              <LeftSideBar />
            </SheetContent>
          </Sheet>
        )}
      </span>

      <span className='hidden mr-10 sm:flex'>
        <input type='text' />
      </span>

      <span className='flex items-center gap-3'>
        <span className='p-1 text-gray-600 rounded active:bg-gray-300 sm:hidden'>
          <IoSearchOutline className='w-7 h-7 md:w-10 md:h-10' />
        </span>
        {isAuth ? (
          <>
            <span className='flex items-center p-1 font-bold text-gray-600 rounded active:bg-gray-300'>
              <IoAdd className='w-7 h-7 md:w-10 md:h-10' /> Create
            </span>

            <span className='flex items-center p-1 text-gray-600 rounded active:bg-gray-300'>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <IoMenuOutline className='w-7 h-7 md:w-10 md:h-10' />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56'>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogoutBtn />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </>
        ) : (
          <span className='flex px-2 py-1 font-bold tracking-tight text-center text-white rounded-full text-md md:text-lg lg:text-xl bg-gradient-to-r from-cyan-500 to-blue-700'>
            <Link to='/sign-in'>Sign In</Link>
          </span>
        )}
      </span>
    </header>
  );
};
export default Header;
