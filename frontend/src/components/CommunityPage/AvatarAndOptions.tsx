import { IoAdd } from 'react-icons/io5';
import { RxDotsHorizontal } from 'react-icons/rx';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useNavigate } from 'react-router-dom';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import {
  useDeleteCommunityMutation,
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
} from '@/api/queries/communityQuery';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/global/_store';
import { MdEditNote } from 'react-icons/md';
import { useState } from 'react';
import EditCommunity from './EditCommunity';
import { showToast } from '@/global/toastSlice';
// import Loading from '../Loading';

const AvatarAndOptions = ({
  isMod,
  communityName,
  avatarImg,
  userId,
}: {
  isMod?: boolean;
  communityName?: string;
  avatarImg?: string;
  userId: string | null;
  rules?: string;
}) => {
  const [editModal, setEditModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { userCommunitiesList } = useSelector(
    (state: RootState) => state.community
  );

  const joined = userCommunitiesList.filter(
    ({ ...elem }: { name: string; _id: string }) => elem.name === communityName
  );

  const isNotJoined = joined.length !== 0;

  const [joinCommunity] = useJoinCommunityMutation();
  const [leaveCommunity] = useLeaveCommunityMutation();
  const [deleteCommunity] = useDeleteCommunityMutation();

  const handleJoinCommunity = async () => {
    if (!isNotJoined) {
      await joinCommunity({ communityName, userId });
    }
    if (isNotJoined) {
      await leaveCommunity({ communityName, userId });
    }
  };
  const handleCreatePostBtn = () => {
    navigate('/submit', { state: { communityName } });
  };

  const handleDeleteCommunity = async () => {
    // console.log(communityName);
    try {
      const res = await deleteCommunity({ communityName }).unwrap();
      console.log(res);
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
      console.log(error);
    }
  };

  return (
    <div className='max-w-[67rem] justify-between h-24 bg-re-300 mx-auto -mt-12 flex items-end'>
      <span className='flex items-end gap-4'>
        <Avatar className='size-[5.4rem] border-4 border-[#0b1416]'>
          <AvatarImage
            className='object-cover'
            src={avatarImg}
          />
          <AvatarFallback className='bg-gray-700'>RN</AvatarFallback>
        </Avatar>
        <h1 className='text-4xl font-bold'>r/{communityName}</h1>
      </span>
      <span className='flex gap-2'>
        <button
          className='flex items-center justify-between gap-1 px-3 py-2 font-bold border border-gray-400 rounded-full hover:border-gray-100'
          onClick={handleCreatePostBtn}>
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
      {editModal && <EditCommunity cancel={() => setEditModal(!editModal)} />}
    </div>
  );
};
export default AvatarAndOptions;
