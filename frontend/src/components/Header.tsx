import { IoAdd, IoSearchOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { TbLayoutSidebarRightCollapseFilled } from 'react-icons/tb';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LeftSideBar from './LeftSideBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaChevronDown } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/_store';
import { useState } from 'react';
import CreateOptionsCard from './CreateOptionsCard';
import HeaderDropdown from './HeaderDropdown';
import { IoSearch } from 'react-icons/io5';

const Header = () => {
  const [createOptions, setCreateOptions] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);

  const { isLoggedIn, username } = useSelector(
    (state: RootState) => state.auth
  );

  const handleCreateButton = () => {
    setCreateOptions(!createOptions);
  };

  const handleHeaderDropDown = () => {
    setOpenDropDown(!openDropDown);
  };

  return (
    <header className='flex items-center justify-between h-12 px-4 py-1 bg-gray-200 sm:h-14 md:px-10'>
      <span className='flex items-center gap-2 md:gap-10'>
        <span className='p-1 text-xl font-semibold tracking-tight text-gray-600 rounded md:text-2xl lg:3xl active:bg-gray-300'>
          <Link
            to='/'
            className='flex items-center '>
            Circlesss
          </Link>
        </span>

        {isLoggedIn && (
          <Sheet>
            <SheetTrigger>
              <span className='flex items-center gap-2 p-1 text-gray-600 rounded active:bg-gray-300'>
                <TbLayoutSidebarRightCollapseFilled className='size-7 md:size-8 lg:size-10' />
                <p className='hidden font-bold lg:inline-block'>Communities</p>
              </span>
            </SheetTrigger>
            <SheetContent side='left'>
              <LeftSideBar />
            </SheetContent>
          </Sheet>
        )}
      </span>

      <span className='hidden bg-white rounded-full w-full mr-2 sm:flex max-w-[35rem] h-10  items-center mx-10'>
        <IoSearch className='ml-3 text-gray-600 size-8' />
        <input
          type='text'
          placeholder='Search...'
          className='w-full p-1 mr-3 outline-none'
        />
      </span>

      <span className='flex items-center gap-1 sm:gap-2 md:gap-6'>
        <span className='flex items-center p-1 text-gray-600 rounded active:bg-gray-300 sm:hidden'>
          <IoSearchOutline className='w-6 h-6 md:w-10 md:h-10' />
        </span>
        {isLoggedIn ? (
          <>
            <span
              className='flex items-center p-1 font-bold text-gray-600 rounded cursor-pointer active:bg-gray-300'
              onClick={handleCreateButton}>
              <IoAdd className='w-7 h-7 md:w-10 md:h-10' />
              <p className='hidden sm:inline-block'>Create</p>
            </span>

            <span
              className='relative flex gap-8 p-1 rounded cursor-pointer t6xt-gray-600 active:bg-gray-300'
              onClick={handleHeaderDropDown}>
              <span className='flex items-center gap-2'>
                <Avatar className='size-9 sm:size-10'>
                  <AvatarImage src='https://github.com/r1shabhnegi.png' />
                  <AvatarFallback>RN</AvatarFallback>
                </Avatar>
                <p className='hidden lg:block'>{username}</p>
              </span>
              <span className='items-center hidden lg:flex'>
                <FaChevronDown />
              </span>
              {openDropDown && <HeaderDropdown username={username} />}
            </span>
          </>
        ) : (
          <span className='flex px-2 py-1 ml-8 font-bold tracking-tight text-center text-white rounded-full text-md md:text-lg lg:text-xl bg-gradient-to-r from-cyan-500 to-blue-700 whitespace-nowrap'>
            <Link to='/sign-in'>Sign In</Link>
          </span>
        )}
      </span>
      {createOptions && (
        <CreateOptionsCard
          setCreateOptions={() => setCreateOptions(!createOptions)}
        />
      )}
    </header>
  );
};
export default Header;
