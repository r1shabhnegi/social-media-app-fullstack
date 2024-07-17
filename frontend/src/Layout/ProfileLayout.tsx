import {
  useEditUserMutation,
  useGetUserDataQuery,
} from "@/api/queries/userQuery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdAddPhotoAlternate, MdOutlineCancel } from "react-icons/md";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { useDispatch } from "react-redux";
import { showToast } from "@/global/toastSlice";
import { FaRegEdit } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import CommonLoader from "@/components/CommonLoader";

type EditProfileTypes = {
  name: string;
  description: string;
};

const ProfileLayout = () => {
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { username } = useParams();
  const { data: userData } = useGetUserDataQuery(username);
  const [submitEditUser, { isLoading: loadingEditUser }] =
    useEditUserMutation();
  const { register, handleSubmit, reset } = useForm<EditProfileTypes>();

  useEffect(() => {
    reset({ name: userData?.name, description: userData?.bio });
  }, [reset, userData?.bio, userData?.name]);

  const [avatar, setAvatar] = useState<{ File: object; preview: string }>();

  const onDropAvatar = useCallback((acceptedFiles: File[]) => {
    setAvatar({
      File: acceptedFiles[0],
      preview: URL.createObjectURL(acceptedFiles[0]),
    });
  }, []);
  const {
    getRootProps: getAvatarRootProps,
    isDragActive: isAvatarDragActive,
    getInputProps: getAvatarInputProps,
  } = useDropzone({
    onDrop: onDropAvatar,
    maxSize: 1024 * 4000,
  });

  const onSubmit = handleSubmit(async (data) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
    };

    try {
      const avatarImg =
        avatar?.File instanceof File &&
        (await imageCompression(avatar?.File, options));


      const formData = new FormData();
      formData.append("name", data?.name);
      formData.append("description", data?.description);
      avatarImg && formData.append("avatar", avatarImg);

 

      const res = await submitEditUser(formData).unwrap();

      if (res) {
        setOpenEditProfile(!openEditProfile);
        dispatch(
          showToast({ message: "Edit User Successful!", type: "SUCCESS" })
        );
      }
    } catch (err) {
      dispatch(showToast({ message: "Edit Failed", type: "ERROR" }));
    }
  });
  return (
    <div className='flex py-8 max-w-[65rem] mx-auto '>
      <div className='flex flex-col items-center flex-1 gap-8 w-full max-w-[40rem] mx-auto lg:ml-3 '>
        <div className='flex items-center justify-between w-full px-2'>
          <div className='flex items-center gap-5'>
            <Avatar className='size-[3.5rem] sm:size-[4.5rem]'>
              <AvatarImage
                className='object-cover'
                src={userData?.avatar}
              />
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

              {userData?.bio ? (
                <p className='text-sm font-semibold text-gray-400 text-wrap lg:hidden'>
                  <span className='text-gray-300'>Bio-</span>
                  {userData?.bio}
                </p>
              ) : null}
            </div>
          </div>
          <div
            className='cursor-pointer lg:hidden'
            onClick={() => setOpenEditProfile(!openEditProfile)}>
            <FaRegEdit className='text-gray-400 size-8' />
          </div>
        </div>

        <div className='flex items-center gap-8 py-4'>
          <p
            className={`${
              pathname === `/profile/${username}/posts`
                ? "bg-[#3D494E] underline "
                : ""
            } px-4 py-2 font-semibold text-gray-300  rounded-full cursor-pointer hover:underline`}
            onClick={() => navigate(`/profile/${username}/posts`)}>
            Posts
          </p>
          <p
            className={`${
              pathname === `/profile/${username}/comments`
                ? "bg-[#3D494E] underline "
                : ""
            } px-4 py-2 font-semibold text-gray-300  rounded-full cursor-pointer hover:underline`}
            onClick={() => navigate(`/profile/${username}/comments`)}>
            Comments
          </p>
          <p
            className={`${
              pathname === `/profile/${username}/saved`
                ? "bg-[#3D494E] underline "
                : ""
            } px-4 py-2 font-semibold text-gray-300  rounded-full cursor-pointer hover:underline`}
            onClick={() => navigate(`/profile/${username}/saved`)}>
            Saved
          </p>
        </div>
        <Outlet context={username} />
      </div>
      <div className='bg-[#000000] p-4 lg:w-72 hidden lg:block xl:w-80 rounded-md h-min mr-3'>
        <div className='flex items-center justify-between mb-5'>
          <h1 className='text-lg font-bold text-gray-300'>
            u/{userData?.username}
          </h1>
          <button
            className='px-3 py-2 bg-blue-800 rounded-full'
            onClick={() => setOpenEditProfile(!openEditProfile)}>
            Edit Profile
          </button>
        </div>
        <p className='text-sm text-gray-400'>
          {userData?.bio ? userData?.bio : "Please Add Bio"}
        </p>
      </div>
      {openEditProfile && (
        <div className='fixed top-0 left-0 z-[20] flex items-center justify-center w-full h-screen bg-black bg-opacity-30 p-5'>
          <form
            onSubmit={onSubmit}
            className='bg-[#0f1a1c] gap-7 w-[35rem] z-50 p-6 rounded-3xl flex flex-col'>
            <span className='flex items-end justify-between mb-3'>
              <h1 className='text-3xl '>Edit community</h1>
              <MdOutlineCancel
                className='cursor-pointer size-7'
                onClick={() => setOpenEditProfile(!openEditProfile)}
              />
            </span>
            <label className='flex flex-col text-[#67787e] text-sm'>
              &nbsp;&nbsp;Name
              <Input
                {...register("name")}
                className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
              />
            </label>
            <label className='flex flex-col text-[#67787e] text-sm'>
              &nbsp;&nbsp;Description
              <Textarea
                {...register("description")}
                className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
              />
            </label>
            <label className='flex flex-col text-[#67787e] text-sm'>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Avatar Image
              <div
                {...getAvatarRootProps({
                  className: `rounded-3xl flex mt-1 flex bg-[#1A282D] justify-center items-center size-32 ${
                    !avatar?.preview && "border"
                  }`,
                })}
                onClick={() => console.log("e")}>
                <input {...getAvatarInputProps()} />
                {isAvatarDragActive ? (
                  <p className='font-bold text-gray-700'>Drop</p>
                ) : (
                  <div className='flex items-center justify-center'>
                    {avatar?.preview ? (
                      <img
                        src={avatar?.preview}
                        alt='avatar img'
                        className='object-cover object-center rounded-3xl size-32'
                      />
                    ) : (
                      <MdAddPhotoAlternate className='size-16' />
                    )}
                  </div>
                )}
              </div>
            </label>
            <div className='flex justify-end gap-5 mt-3'>
              {loadingEditUser ? (
                <CommonLoader />
              ) : (
                <>
                  <button
                    disabled={loadingEditUser}
                    className='px-5 py-3 bg-[#223237] rounded-2xl'
                    type='button'
                    onClick={() => setOpenEditProfile(!openEditProfile)}>
                    Cancel
                  </button>
                  <button
                    disabled={loadingEditUser}
                    type='submit'
                    className='px-5 py-3 bg-[#0045ac] hover:bg-[#0079d3] rounded-2xl'>
                    Submit
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default ProfileLayout;
