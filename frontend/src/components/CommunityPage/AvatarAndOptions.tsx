import { IoAdd } from 'react-icons/io5';
import { RxDotsHorizontal } from 'react-icons/rx';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useParams } from 'react-router-dom';
import { useJoinCommunityMutation } from '@/api/queries/communityQuery';
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
  const { name } = useParams();

  const [joinCommunity] = useJoinCommunityMutation();
  const handleJoinCommunity = async () => {
    const res = await joinCommunity({ communityName, userId });
    console.log(res);
  };

  return (
    <div className='max-w-[67rem] justify-between h-24 bg-re-300 mx-auto -mt-12 flex items-end'>
      <span className='flex items-end gap-4'>
        <Avatar className='size-[5.4rem] border-4 border-[#0b1416]'>
          <AvatarImage src='https://github.com/r1shabhnegi.png' />
          <AvatarFallback>RN</AvatarFallback>
        </Avatar>
        <h1 className='text-4xl font-bold'>r/{name}</h1>
      </span>
      <span className='flex gap-2'>
        <button className='flex items-center justify-between gap-1 px-3 py-2 font-bold border border-gray-400 rounded-full hover:border-gray-100'>
          <IoAdd className='size-7 ' />
          Create a post
        </button>
        <button
          className={`${
            isMod && 'hidden'
          } bg-[#0045ac] hover:bg-[#0079d3] rounded-full font-bold py-2 px-3`}
          onClick={handleJoinCommunity}>
          Join
        </button>
        <button className='flex items-center justify-center border border-gray-400 rounded-full size-11 hover:border-gray-100'>
          <RxDotsHorizontal className='size-6' />
        </button>
      </span>
    </div>
  );
};
export default AvatarAndOptions;
