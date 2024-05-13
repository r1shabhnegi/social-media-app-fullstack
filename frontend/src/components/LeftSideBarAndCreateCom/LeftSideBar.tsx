import { Link, useLocation } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

// Icons
import { AiFillHome } from 'react-icons/ai';
import { MdGroups3 } from 'react-icons/md';
import { IoAdd } from 'react-icons/io5';
import { useState } from 'react';
import CreateCommunity from './CreateCommunity';
import CommunitiesList from './CommunitiesList';

const LeftSideBar = () => {
  const [showCommunityCreate, setShowCommunityCreate] =
    useState<boolean>(false);
  const { pathname } = useLocation();

  const showCreateCommunity = () => {
    setShowCommunityCreate(!showCommunityCreate);
  };
  return (
    <div className='fixed w-[17rem]  sm:top-14 top-12  hidden lg:inline'>
      <ScrollArea className='h-[44.3rem]'>
        <span className='bg-[#0b1416] pb-10 flex flex-col  p-4 border-gray-600 border-r-[0.1rem] gap-1'>
          <Link to='/'>
            <span
              className={`${
                pathname === '/' ? 'bg-[#1a282d]' : 'bg-[#0b1416]'
              } flex cursor-pointer rounded-lg hover:bg-[#1a282d] p-2 items-center gap-4 text-sm px-5`}>
              <AiFillHome className='size-6' />
              <p>Home</p>
            </span>
          </Link>
          <Link to='/communities'>
            <span
              className={`${
                pathname === '/communities' ? 'bg-[#1a282d]' : 'bg-[#0b1416]'
              } flex cursor-pointer rounded-lg hover:bg-[#1a282d] p-2 items-center gap-4 text-sm px-5`}>
              <MdGroups3 className='size-6' />
              <p>Find Communities</p>
            </span>
          </Link>

          <span
            className='flex cursor-pointer rounded-lg hover:bg-[#1a282d] p-2 items-center gap-4 text-sm px-5'
            onClick={showCreateCommunity}>
            <IoAdd className='size-6' />
            <p>Create a community</p>
          </span>

          <CommunitiesList />
        </span>

        {showCommunityCreate && (
          <CreateCommunity
            cancelBtn={() => setShowCommunityCreate(!showCommunityCreate)}
          />
        )}
      </ScrollArea>
    </div>
  );
};
export default LeftSideBar;
