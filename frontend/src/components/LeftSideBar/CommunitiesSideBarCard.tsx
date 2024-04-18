import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const CommunitiesSideBarCard = ({
  name,
  avatarImg,
}: {
  name: string;
  avatarImg: string;
}) => {
  return (
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
  );
};
export default CommunitiesSideBarCard;
