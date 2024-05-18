import { useGetUserDataQuery } from '@/api/queries/userQuery';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

const ProfileLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  console.log(pathname);
  const { username } = useParams();
  const { data: userData } = useGetUserDataQuery(username);
  console.log(userData);
  return (
    <div className='flex py-8 max-w-[65rem]  mx-auto'>
      <div className='flex flex-col flex-1 gap-8'>
        <div className='flex items-center w-full gap-5'>
          <Avatar className='size-8 sm:size-[4.5rem]'>
            <AvatarImage src={userData?.avatar} />
            <AvatarFallback className='bg-[#3D494E]'>
              {userData?.name?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col justify-center'>
            <p className='text-xl font-bold text-gray-200 uppercase'>
              {userData?.name}
            </p>
            <p className='-mt-1 text-sm font-semibold text-gray-400'>
              u/{userData?.username}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-8 py-4'>
          <p
            className={`${
              pathname === `/profile/${username}/posts`
                ? 'bg-[#3D494E] underline '
                : ''
            } px-4 py-2 font-semibold text-gray-300  rounded-full cursor-pointer hover:underline`}
            onClick={() => navigate(`/profile/${username}/posts`)}>
            Posts
          </p>
          <p
            className={`${
              pathname === `/profile/${username}/comments`
                ? 'bg-[#3D494E] underline '
                : ''
            } px-4 py-2 font-semibold text-gray-300  rounded-full cursor-pointer hover:underline`}
            onClick={() => navigate(`/profile/${username}/comments`)}>
            Comments
          </p>
          <p
            className={`${
              pathname === `/profile/${username}/saved`
                ? 'bg-[#3D494E] underline '
                : ''
            } px-4 py-2 font-semibold text-gray-300  rounded-full cursor-pointer hover:underline`}
            onClick={() => navigate(`/profile/${username}/saved`)}>
            Saved
          </p>
        </div>
        <Outlet context={username} />
      </div>
      <div className='bg-gray-500 w-80 h-min'>sds</div>
    </div>
  );
};
export default ProfileLayout;
