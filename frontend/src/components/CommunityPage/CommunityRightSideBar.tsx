import { useUserQuery } from '@/api/queries/userQuery';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Link } from 'react-router-dom';

const CommunityRightSideBar = ({
  description,
  author,
}: {
  description: string;
  author: string;
}) => {
  const { data } = useUserQuery(author);
  console.log('user-', data);
  return (
    <div className='bg-[#1A282D] rounded-lg w-80 flex flex-col gap-4 p-3 h-min'>
      <div className='p-2 bg-gray-700 rounded-lg'>
        <h1 className='mb-2 font-semibold text-gray-100'>Description</h1>
        <p className='text-sm text-gray-300'>{description}</p>
      </div>

      <div className='p-2 bg-gray-700 rounded-lg'>
        <h1 className='mb-2 font-semibold text-gray-100 '>Moderator</h1>
        <div className='flex items-center gap-3'>
          <Link to={`/profile/${data?.name}`}>
            <Avatar className='bg-gray-700 size-8 sm:size-9'>
              <AvatarImage src={data?.avatar} />
              <AvatarFallback className='bg-gray-500 '>
                {data?.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Link to={`/profile/${data?.name}`}>
            <p className='text-sm text-gray-300 cursor-pointer hover:underline'>
              {data?.name}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default CommunityRightSideBar;
