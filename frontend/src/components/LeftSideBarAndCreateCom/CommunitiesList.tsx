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
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import CommonLoader from '../CommonLoader';

const CommunitiesList = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
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
  );
};
export default CommunitiesList;
