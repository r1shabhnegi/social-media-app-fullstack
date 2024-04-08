import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/_store';

const FindCommunityCard = ({
  name,
  avatar,
  description,
  id,
  index,
  author,
}: {
  name: string;
  avatar: string;
  description: string;
  id: string;
  index: number;
  author: string;
}) => {
  const { userId } = useSelector((state: RootState) => state.auth);
  const isMod = author === userId;

  return (
    <span className='flex items-center gap-4 p-2 mb-16 w-96'>
      <p>{index + 1}</p>
      <span className='flex items-center gap-2 p-2 '>
        <Avatar className='size-8 sm:size-9'>
          <AvatarImage src={avatar} />
          <AvatarFallback className='bg-gray-600'>
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span>
          <span className='flex items-center justify-between pr-4'>
            <h2>{name}</h2>
            <p
              className={`${
                !isMod && 'hidden'
              } px-[.2rem] text-xs bg-orange-700 `}>
              MOD
            </p>
          </span>
          <p className='w-full text-sm text-[#6f7c71] line-clamp-1'>
            {description}
          </p>
        </span>
      </span>
    </span>
  );
};
export default FindCommunityCard;
