import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/_store';

import LeftSideBar from '../LeftSideBar/LeftSideBar';
import HeaderDropdown from './HeaderDropdown';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Icons
import { IoMenuSharp } from 'react-icons/io5';
import { CiSearch } from 'react-icons/ci';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { IoAdd } from 'react-icons/io5';

const Header = () => {
  const navigate = useNavigate();
  const [openDropDown, setOpenDropDown] = useState(false);

  const { isLoggedIn, username } = useSelector(
    (state: RootState) => state.auth
  );

  const handleCreateButton = () => {
    navigate('/submit');
  };

  const handleHeaderDropDown = () => {
    setOpenDropDown(!openDropDown);
  };

  return (
    <header className='flex items-center justify-between h-12 py-1 bg-[#0b1416] border-b-[.1rem] border-gray-600 sm:h-14 px-[1rem]'>
      <span className='flex items-center gap-2'>
        {/* Left-Bar for small display- lg- */}
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

        {/* LOGO */}
        <span className='p-1 text-xl font-semibold tracking-tight text-[#f2f2f1] rounded md:text-2xl lg:3xl lg:pr-16'>
          <Link
            to='/'
            className='flex items-center '>
            Circlesss
          </Link>
        </span>
      </span>
      {/* Search for big screen - lg+ */}
      <span className='hidden bg-[#1a282d] rounded-full w-full mx-5 sm:flex max-w-[35rem] h-10  items-center'>
        <CiSearch className='ml-3 mr-1 text-[#f2f2f1] size-6' />
        <input
          type='text'
          placeholder='Search...'
          className='w-full p-1 text-sm mr-2 outline-none text-[#f2f2f1] bg-[#1a282d]'
        />
      </span>

      <span className='flex items-center gap-2 md:gap-4'>
        {/* Search for small display - md- */}
        <span className='flex items-center p-1 text-[#f2f2f1] rounded sm:hidden'>
          <CiSearch className='size-7' />
        </span>
        {isLoggedIn ? (
          <>
            {/* messages */}

            <span className='cursor-pointer text-[#f2f2f1]'>
              <IoChatbubbleEllipsesOutline className='size-6' />
            </span>

            {/* create posts */}
            <span
              className='flex gap-1 items-center font-bold text-[#f2f2f1] rounded cursor-pointer sm:mr-2'
              onClick={handleCreateButton}>
              <IoAdd className='size-7 ' />
              <p className='hidden text-sm sm:inline-block'>Create</p>
            </span>

            <span
              className='relative flex gap-8 rounded cursor-pointer'
              onClick={handleHeaderDropDown}>
              <span className='rounded-full'>
                <Avatar className='size-8 sm:size-9'>
                  <AvatarImage src='https://github.com/r1shabhnegi.png' />
                  <AvatarFallback>RN</AvatarFallback>
                </Avatar>
              </span>
              {openDropDown && <HeaderDropdown username={username} />}
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
