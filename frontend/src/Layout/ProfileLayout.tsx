import {
  useEditUserMutation,
  useGetUserDataQuery,
} from '@/api/queries/userQuery';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineCancel } from 'react-icons/md';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { useDispatch } from 'react-redux';
import { showToast } from '@/global/toastSlice';

type EditProfileTypes = {
  name: string;
  description: string;
  avatar: FileList;
};

const ProfileLayout = () => {
  const [openEditProfile, setEditProfile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { username } = useParams();
  const { data: userData } = useGetUserDataQuery({});
  const [submitEditUser, { isLoading: loadingEditUser }] =
    useEditUserMutation();
  const { register, handleSubmit, reset } = useForm<EditProfileTypes>();

  useEffect(() => {
    reset({ name: userData?.name, description: userData?.description });
  }, [reset, userData?.description, userData?.name]);

  const onSubmit = handleSubmit(async (data) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
    };

    try {
      const avatar =
        data?.avatar[0] && (await imageCompression(data?.avatar[0], options));

      console.log(avatar);
      const formData = new FormData();
      formData.append('name', data?.name);
      formData.append('description', data?.description);
      // formData.append('avatar', avatar);

      console.log(formData.entries());
      const res = await submitEditUser(formData).unwrap();
      if (res) {
        dispatch(
          showToast({ message: 'Edit User Successful!', type: 'SUCCESS' })
        );
      }
    } catch {
      dispatch(showToast({ message: 'Edit Failed', type: 'ERROR' }));
    }
  });

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
      <div className='bg-[#000000] p-4 w-80 rounded-md h-min'>
        <div className='flex items-center justify-between mb-5'>
          <h1 className='text-lg font-bold text-gray-300'>
            u/{userData?.username}
          </h1>
          <button
            className='px-3 py-2 bg-blue-800 rounded-full'
            onClick={() => setEditProfile(true)}>
            Edit Profile
          </button>
        </div>
        <p className='text-sm text-gray-400'>
          {userData?.bio ? userData?.bio : 'Please Add Bio'}
        </p>
      </div>
      {openEditProfile && (
        <div className='fixed top-0 left-0 z-[20] flex items-center justify-center w-full h-screen bg-black bg-opacity-30'>
          <form
            onSubmit={onSubmit}
            className='bg-[#0f1a1c] gap-7 w-[35rem] z-50 p-6 rounded-3xl flex flex-col'>
            <span className='flex items-end justify-between mb-3'>
              <h1 className='text-3xl '>Edit community</h1>
              <MdOutlineCancel
                className='cursor-pointer size-7'
                onClick={() => setEditProfile((prev) => !prev)}
              />
            </span>
            <label className='flex flex-col text-[#67787e] text-sm'>
              &nbsp;&nbsp;Name
              <Input
                {...register('name')}
                className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
              />
            </label>
            <label className='flex flex-col text-[#67787e] text-sm'>
              &nbsp;&nbsp;Description
              <Textarea
                {...register('description')}
                className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
              />
            </label>
            <label className='flex flex-col text-[#67787e] text-sm'>
              &nbsp;&nbsp;Avatar
              <Input
                type='file'
                accept='image/*'
                {...register('avatar')}
                className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
              />
            </label>
            <div className='flex justify-end gap-5 mt-3'>
              <button
                disabled={loadingEditUser}
                className='px-5 py-3 bg-[#223237] rounded-2xl'
                type='button'
                onClick={() => setEditProfile((prev) => !prev)}>
                Cancel
              </button>
              <button
                disabled={loadingEditUser}
                type='submit'
                className='px-5 py-3 bg-[#0045ac] hover:bg-[#0079d3] rounded-2xl'>
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default ProfileLayout;
