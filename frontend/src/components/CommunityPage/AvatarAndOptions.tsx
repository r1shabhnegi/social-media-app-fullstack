import { IoAdd } from 'react-icons/io5';
import { RxDotsHorizontal } from 'react-icons/rx';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
} from '@/api/queries/communityQuery';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/_store';
import { MdEditNote } from 'react-icons/md';
import { useState } from 'react';
import EditCommunity from './EditCommunity';
// import Loading from '../Loading';

const AvatarAndOptions = ({
  isMod,
  communityName,
  userId,
}: {
  isMod?: boolean;
  communityName?: string;
  userId: string | null;
}) => {
  const [editModal, setEditModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const { userCommunitiesList } = useSelector(
    (state: RootState) => state.community
  );

  const joined = userCommunitiesList.filter(
    ({ ...elem }: { name: string; _id: string }) => elem.name === communityName
  );

  const isNotJoined = joined.length !== 0;

  const [joinCommunity] = useJoinCommunityMutation();
  const [leaveCommunity] = useLeaveCommunityMutation();

  const handleJoinCommunity = async () => {
    if (!isNotJoined) {
      await joinCommunity({ communityName, userId });
    }
    if (isNotJoined) {
      await leaveCommunity({ communityName, userId });
    }
  };
  // console.log(editModal);
  const handleCreatePostBtn = () => {
    navigate('/submit', { state: { communityName } });
  };
  return (
    <div className='max-w-[67rem] justify-between h-24 bg-re-300 mx-auto -mt-12 flex items-end'>
      <span className='flex items-end gap-4'>
        <Avatar className='size-[5.4rem] border-4 border-[#0b1416]'>
          <AvatarImage src='https://github.com/r1shabhnegi.png' />
          <AvatarFallback>RN</AvatarFallback>
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
        <button className='flex items-center justify-center border border-gray-400 rounded-full size-11 hover:border-gray-100'>
          <RxDotsHorizontal className='size-6' />
        </button>
      </span>
      {editModal && (
        <EditCommunity
          cancel={() => setEditModal(!editModal)}
          communityName={communityName}
        />
      )}
    </div>
  );
};
export default AvatarAndOptions;
