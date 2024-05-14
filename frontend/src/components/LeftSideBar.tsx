import { Link, useLocation } from 'react-router-dom';

// Icons
import { AiFillHome } from 'react-icons/ai';
import { MdGroups3 } from 'react-icons/md';
import { IoAdd } from 'react-icons/io5';
import { useState } from 'react';
import CreateCommunity from './CreateCommunity';

import {
  useLazyGetUserCommunitiesQuery,
  useLazyGetUserModCommunitiesQuery,
} from '@/api/queries/communityQuery';
import { AppDispatch, RootState } from '@/global/_store';
import {
  setUserCommunitiesList,
  setModCommunitiesList,
} from '@/global/communitySlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import CommonLoader from './CommonLoader';

const LeftSideBar = () => {
  const [showCommunityCreate, setShowCommunityCreate] =
    useState<boolean>(false);

  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [
    communitiesList,
    { data: userCommunitiesData, isLoading: userComLoading },
  ] = useLazyGetUserCommunitiesQuery();

  const [
    modCommunitiesList,
    { data: modCommunitiesData, isLoading: modComLoading },
  ] = useLazyGetUserModCommunitiesQuery();

  useEffect(() => {
    if (isLoggedIn) {
      communitiesList({});
      modCommunitiesList({});
    }
  }, [isLoggedIn, communitiesList, modCommunitiesList]);

  useEffect(() => {
    if (userCommunitiesData && modCommunitiesData) {
      dispatch(setUserCommunitiesList(userCommunitiesData));
      dispatch(setModCommunitiesList(modCommunitiesData));
    }
  }, [userCommunitiesData, dispatch, modCommunitiesData]);

  userComLoading ||
    (modComLoading && (
      <CommonLoader isLoading={userComLoading || modComLoading} />
    ));

  return (
    <div className='fixed h-[44.3rem] overflow-auto w-[17rem] bg-[#0b1416]  sm:top-14 top-12 border-gray-600 border-r-[0.1rem]  hidden lg:inline'>
      <span className='flex flex-col gap-1 p-4 pb-10'>
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
          onClick={() => setShowCommunityCreate(!showCommunityCreate)}>
          <IoAdd className='size-6' />
          <p>Create a community</p>
        </span>

        <div className='flex flex-col'>
          <span>
            <p className='flex flex-col p-2 text-[0.8rem] px-5 text-gray-400'>
              MODERATION
            </p>
            <span className='flex flex-col'>
              {modCommunitiesData?.map(
                ({
                  name,
                  avatarImg,
                  _id,
                }: {
                  name: string;
                  avatarImg: string;
                  _id: number;
                }) => (
                  <Link
                    key={_id}
                    to={`/community/${name}`}>
                    <span className='flex items-center gap-3 px-4 py-2 hover:bg-gray-900 rounded-xl'>
                      <Avatar className='size-8 sm:size-8'>
                        <AvatarImage
                          className='object-cover'
                          src={avatarImg}
                        />
                        <AvatarFallback className='bg-gray-600'>
                          {name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <span>
                        <p>r/{name}</p>
                      </span>
                    </span>
                  </Link>
                )
              )}
            </span>
          </span>

          <span>
            <p className='flex flex-col p-2 text-[0.8rem] px-5 text-gray-400'>
              COMMUNITIES
            </p>
            <span className='flex flex-col'>
              {userCommunitiesData?.map(
                ({
                  name,
                  _id,
                  avatarImg,
                }: {
                  name: string;
                  _id: number;
                  avatarImg: string;
                }) => (
                  <Link
                    key={_id}
                    to={`/community/${name}`}>
                    <span className='flex items-center gap-3 px-4 py-2 hover:bg-gray-900 rounded-xl'>
                      <Avatar className='size-8 sm:size-8'>
                        <AvatarImage
                          className='object-cover'
                          src={avatarImg}
                        />
                        <AvatarFallback className='bg-gray-600'>
                          {name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <span>
                        <p>r/{name}</p>
                      </span>
                    </span>
                  </Link>
                )
              )}
            </span>
          </span>
        </div>
      </span>

      {showCommunityCreate && (
        <CreateCommunity
          cancelBtn={() => setShowCommunityCreate(!showCommunityCreate)}
        />
      )}
    </div>
  );
};
export default LeftSideBar;
