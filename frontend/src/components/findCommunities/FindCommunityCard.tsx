import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const FindCommunityCard = ({
  name,
  avatar,
  description,
  id,
  index,
}: {
  name: string;
  avatar: string;
  description: string;
  id: string;
  index: number;
}) => {
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
          <h2>{name}</h2>
          <p className='w-full text-sm text-[#6f7c71] line-clamp-1'>
            {description}
          </p>
        </span>
      </span>
    </span>
  );
};
export default FindCommunityCard;
