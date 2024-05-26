import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const CommunityRightSideBar = ({
  authorName,
  avatar,
  description,
  name,
  rules,
}: {
  description: string;
  name: string;
  avatar: string;
  authorName: string;
  rules: string[];
}) => {
  return (
    <div className='bg-[#162226] w-full rounded-lg lg:flex flex-col gap-2 p-3 h-min'>
      <h1 className='text-sm font-semibold text-gray-100 '>Description</h1>
      <div className='p-3 bg-[#131a1d] rounded-lg'>
        <p className='text-sm text-gray-300'>
          {description ? description : 'No description added'}
        </p>
      </div>

      <h1 className='text-sm font-semibold text-gray-100 '>Moderator</h1>
      <div className='p-3 bg-[#131a1d] rounded-lg'>
        <div className='flex items-center gap-3'>
          <Link to={`/profile/${name}`}>
            <Avatar className='bg-[#1f2426] size-8 sm:size-9'>
              <AvatarImage src={avatar} />
              <AvatarFallback className='bg-[#272d2f] '>
                {name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Link to={`/profile/${authorName}/posts`}>
            <p className='text-sm text-gray-300 cursor-pointer hover:underline'>
              {authorName}
            </p>
          </Link>
        </div>
      </div>
      {rules?.length > 0 ? (
        <>
          <h1 className='text-sm font-semibold text-gray-100 '>Rules</h1>
          <div className='p-3 bg-[#131a1d] rounded-lg'>
            {rules?.map((r: string, i: number) => (
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
  );
};
export default CommunityRightSideBar;
