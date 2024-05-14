import { AppDispatch, RootState } from '@/global/_store';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import PageLoader from '@/components/PageLoader';

import { IoAdd } from 'react-icons/io5';
import { RxDotsHorizontal } from 'react-icons/rx';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import {
  useGetCommunityQuery,
  useDeleteCommunityMutation,
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
} from '@/api/queries/communityQuery';
import { MdEditNote } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { showToast } from '@/global/toastSlice';
import { MdOutlineCancel } from 'react-icons/md';

import EditCommunityForm from '@/forms/EditCommunityForm';
import { useLazyGetAllCommunityPostsQuery } from '@/api/queries/postQuery';
import PostCard from '@/components/PostCard';
import CommonLoader from '@/components/CommonLoader';

type postDataType = {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  communityId: string;
  communityName: string;
  authorAvatar: string;
  image: string;
  downVotes: number;
  upVotes: number;
  createdAt: string;
};

const CommunityPage = () => {
  const [editModal, setEditModal] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [postsData, setPostsData] = useState<postDataType[]>([]);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((state: RootState) => state.auth);
  const { userCommunitiesList } = useSelector(
    (state: RootState) => state.community
  );
  const { numberOfPosts } = useSelector((state: RootState) => state.posts);
  const { name: communityName } = useParams();

  const {
    data: communityData,
    isSuccess,
    isLoading: communityLoading,
  } = useGetCommunityQuery(communityName);
  const [fetchCommunityData, { isLoading: loadingCommunityPosts }] =
    useLazyGetAllCommunityPostsQuery();
  const [joinCommunity] = useJoinCommunityMutation();
  const [leaveCommunity] = useLeaveCommunityMutation();
  const [deleteCommunity] = useDeleteCommunityMutation();

  useEffect(() => {
    if (page + 1 * 5 < numberOfPosts) {
      const fetchPosts = async () => {
        if (isSuccess) {
          try {
            const response = await fetchCommunityData({
              communityId: communityData?._id,
              page,
            }).unwrap();
            if (response) {
              setPostsData((prev) => [...prev, ...response]);
            }
          } catch (error) {
            console.log(error);
          }
        }
      };
      fetchPosts();
    }
  }, [communityData?._id, fetchCommunityData, isSuccess, numberOfPosts, page]);

  const handleScrollPagination = () => {
    if (
      document.documentElement.scrollTop + window.innerHeight + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prev) => prev + 1);
      console.log(page);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScrollPagination);

    return () => window.removeEventListener('scroll', handleScrollPagination);
  }, []);

  const isMod = userId === communityData?.authorId;

  const joined = userCommunitiesList.filter(
    ({ ...elem }: { name: string; _id: string }) => elem.name === communityName
  );
  const isNotJoined = joined.length !== 0;

  const handleJoinCommunity = async () => {
    if (!isNotJoined) {
      await joinCommunity({ communityName, userId });
    }
    if (isNotJoined) {
      await leaveCommunity({ communityName, userId });
    }
  };

  const handleDeleteCommunity = async () => {
    try {
      const res = await deleteCommunity({ communityName }).unwrap();
      if (res) {
        navigate('/');
        dispatch(
          showToast({
            message: 'Community Deleted Successfully!',
            type: 'SUCCESS',
          })
        );
      }
    } catch (error) {
      showToast({
        message: 'Failed Deleting Community!',
        type: 'ERROR',
      });
    }
  };

  if (communityLoading) return <PageLoader isLoading={communityLoading} />;

  return (
    <div className='flex max-w-[65rem] mx-auto flex-col'>
      <div className=' sm:p-2'>
        {communityData?.coverImg ? (
          <img
            src={communityData?.coverImg}
            alt='coverImg'
            className='object-cover w-full mx-auto bg-gray-500 h-14 sm:h-20 md:h-32 sm:rounded-md'
          />
        ) : (
          <div className='w-full mx-auto bg-gray-500 h-14 sm:h-20 md:h-32 sm:rounded-md'></div>
        )}
      </div>

      <div className='flex items-end justify-between h-24 px-3 -mt-12'>
        <span className='flex items-end gap-4'>
          <Avatar className='size-[5.4rem] border-4 border-[#0b1416]'>
            <AvatarImage
              className='object-cover'
              src={communityData?.avatarImg}
            />
            <AvatarFallback className='bg-gray-700'>RN</AvatarFallback>
          </Avatar>
          <h1 className='text-4xl font-bold'>r/{communityName}</h1>
        </span>

        <span className='flex gap-2'>
          <button
            className='flex items-center justify-between gap-1 px-3 py-2 font-bold border border-gray-400 rounded-full hover:border-gray-100'
            onClick={() => navigate('/submit', { state: { communityName } })}>
            <IoAdd className='size-7 ' />
            Create a post
          </button>

          {isMod && (
            <button
              className='flex items-center justify-between gap-1 px-3 py-2 font-bold border border-gray-400 rounded-full hover:border-gray-100'
              onClick={() => setEditModal(!editModal)}>
              <MdEditNote className='size-7 ' />
              Edit
            </button>
          )}

          <button
            className={`${isMod && 'hidden'} ${
              isNotJoined
                ? 'bg-[#898989] hover:bg-[#626262]'
                : 'bg-[#0045ac] hover:bg-[#0079d3]'
            }  rounded-full font-bold py-2 px-3`}
            onClick={handleJoinCommunity}>
            {isNotJoined ? 'Leave' : 'Join'}
          </button>

          <div className='dropdown dropdown-end'>
            <button
              tabIndex={0}
              role='button'
              className={`${
                !isMod && 'hidden'
              } flex items-center relative justify-center border border-gray-400 rounded-full size-11 hover:border-gray-100`}>
              <RxDotsHorizontal className='size-6' />
            </button>
            <ul
              tabIndex={0}
              className='dropdown-content z-[1] menu p-2 mt-5 shadow bg-base-100 rounded-box w-52'>
              <li>
                <a onClick={handleDeleteCommunity}>
                  <MdOutlineDeleteOutline className='size-6' />
                  <p>Delete Community</p>
                </a>
              </li>
            </ul>
          </div>
        </span>
        {editModal && (
          <div className='fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-[#0f1a1c]  p-6 rounded-3xl'>
              <div className='flex justify-between'>
                <h1 className='px-1 mb-8 text-xl font-semibold text-center '>
                  Edit Community
                </h1>
                <span
                  className=' top-10 right-10'
                  onClick={() => setEditModal(!editModal)}>
                  <MdOutlineCancel size={25} />
                </span>
              </div>
              <EditCommunityForm
                cancel={() => setEditModal(!editModal)}
                name={communityData?.name}
                description={communityData?.description}
                rules={communityData?.rules}
              />
            </div>
          </div>
        )}
      </div>

      <div className='flex gap-20 mt-10 w-ful'>
        <div className='flex-1'>
          {loadingCommunityPosts ? (
            <CommonLoader isLoading={loadingCommunityPosts} />
          ) : (
            <>
              {postsData?.map((postData: postDataType) => (
                <div key={postData._id}>
                  <PostCard postData={postData} />
                </div>
              ))}
            </>
          )}
        </div>
        <div className='bg-[#1A282D] rounded-lg w-80 flex flex-col gap-2 p-3 h-min'>
          <h1 className='text-sm font-semibold text-gray-100 '>Description</h1>
          <div className='p-3 bg-gray-700 rounded-lg'>
            <p className='text-sm text-gray-300'>
              {communityData?.description}
            </p>
          </div>

          <h1 className='text-sm font-semibold text-gray-100 '>Moderator</h1>
          <div className='p-3 bg-gray-700 rounded-lg'>
            <div className='flex items-center gap-3'>
              <Link to={`/profile/${communityData?.name}`}>
                <Avatar className='bg-gray-700 size-8 sm:size-9'>
                  <AvatarImage src={communityData?.avatar} />
                  <AvatarFallback className='bg-gray-500 '>
                    {communityData?.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Link to={`/profile/${communityData?.authorName}`}>
                <p className='text-sm text-gray-300 cursor-pointer hover:underline'>
                  {communityData?.authorName}
                </p>
              </Link>
            </div>
          </div>
          {communityData?.rules?.length > 0 ? (
            <>
              <h1 className='text-sm font-semibold text-gray-100 '>Rules</h1>
              <div className='p-3 bg-gray-700 rounded-lg'>
                {communityData?.rules?.map((r: string, i: number) => (
                  <p
                    className='text-sm text-gray-300'
                    key={r + i}>
                    {i + 1}. {r}
                  </p>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default CommunityPage;
