import { IoAdd, IoMenuOutline, IoSearchOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { TbLayoutSidebarRightCollapseFilled } from 'react-icons/tb';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LeftSideBar from './LeftSideBar';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { isAuth } = useSelector((state: RootState) => state.auth);

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
                {/* sd */}
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
            <span className='p-1 text-gray-600 rounded active:bg-gray-300 '>
              <IoAdd className='w-7 h-7 md:w-10 md:h-10' />
            </span>

            <span className='p-1 text-gray-600 rounded active:bg-gray-300 '>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline'>Open</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      Profile
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />

                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <IoMenuOutline className='w-7 h-7 md:w-10 md:h-10' /> */}
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
