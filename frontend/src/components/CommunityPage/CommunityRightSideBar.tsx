import { useUserQuery } from '@/api/queries/userQuery';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Link } from 'react-router-dom';

const CommunityRightSideBar = ({
  description,
  author,
  // communityName,
  rules,
}: {
  description: string;
  author: string;
  communityName: string | undefined;
  rules: string[];
}) => {
  const { data } = useUserQuery(author);
  console.log('user-', data);
  return (
    <div className='bg-[#1A282D] rounded-lg w-80 flex flex-col gap-2 p-3 h-min'>
      {/* <div className='flex justify-between mb-2'>
        <h1 className='text-xl font-bold'>r/{communityName}</h1>
        <h1></h1>
      </div> */}

      <h1 className='text-sm font-semibold text-gray-100 '>Description</h1>
      <div className='p-3 bg-gray-700 rounded-lg'>
        <p className='text-sm text-gray-300'>{description}</p>
      </div>

      <h1 className='text-sm font-semibold text-gray-100 '>Moderator</h1>
      <div className='p-3 bg-gray-700 rounded-lg'>
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
      {rules?.length > 0 ? (
        <>
          <h1 className='text-sm font-semibold text-gray-100 '>Rules</h1>
          <div className='p-3 bg-gray-700 rounded-lg'>
            {rules?.map((r, i) => (
              <p className='text-sm text-gray-300'>
                {i + 1}. {r}
              </p>
            ))}
          </div>
        </>
      ) : null}

      {/* <h1 className='text-sm font-semibold text-gray-100 '>Members</h1> */}
    </div>
  );
};
export default CommunityRightSideBar;
