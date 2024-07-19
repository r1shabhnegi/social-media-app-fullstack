import { useEditCommunityMutation } from "@/api/queries/communityQuery";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/global/_store";
import { showToast } from "@/global/toastSlice";
import CommonLoader from "@/components/CommonLoader";
import imageCompression from "browser-image-compression";
import { EditCommunityFormProps } from "@/lib/types";
import { useDropzone } from "react-dropzone";
import { MdAddPhotoAlternate, MdOutlineCancel } from "react-icons/md";
type CommunityEditTypes = {
  name: string;
  description: string;
  rules: string;
};

const EditCommunityForm = ({
  cancel,
  name: communityName,
  description,
  rules,
}: EditCommunityFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [editCommunity, { isLoading }] = useEditCommunityMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommunityEditTypes>();
  // drop-zone

  const [avatar, setAvatar] = useState<{ File: object; preview: string }>();
  const [cover, setCover] = useState<{ File: object; preview: string }>();

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
  const onDropCover = useCallback((acceptedFiles: File[]) => {
    setCover({
      File: acceptedFiles[0],
      preview: URL.createObjectURL(acceptedFiles[0]),
    });
  }, []);

  const {
    getRootProps: getCoverRootProps,
    isDragActive: isCoverDragActive,
    getInputProps: getCoverInputProps,
  } = useDropzone({
    onDrop: onDropCover,
    maxSize: 1024 * 4000,
  });

  useEffect(() => {
    reset({ name: communityName, description, rules });
  }, [communityName, description, reset, rules]);

  // end

  const onSubmit = handleSubmit(async (data) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const avatarImage =
        avatar?.File instanceof File &&
        (await imageCompression(avatar?.File, options));
      const coverImage =
        cover?.File instanceof File &&
        (await imageCompression(cover?.File, options));

      const formData = new FormData();
      formData.append("communityName", communityName);
      formData.append("description", data.description);
      formData.append("name", data.name);
      formData.append("rules", data.rules);
      avatarImage && formData.append("avatarImg", avatarImage);
      coverImage && formData.append("coverImg", coverImage);

      // for (const [key, value] of formData) {
      //   console.log(key, value);
      // }

      const res = await editCommunity(formData).unwrap();

      if (res) {
        dispatch(
          showToast({
            message: "Community Edited Successfully!",
            type: "SUCCESS",
          })
        );
        cancel();
      } else {
        throw new Error("Error Editing Community!");
      }
    } catch (error) {
      dispatch(
        showToast({
          message: "Error Editing Community!",
          type: "ERROR",
        })
      );
    }
  });

  return (
    <div className='fixed top-0 bottom-0 z-[100] left-0 right-0 flex items-center justify-center bg-[#0f1a1c] sm:bg-black sm:bg-opacity-50'>
      <div className='bg-[#0f1a1c] sm:mx-10 p-6 rounded-3xl max-w-[60rem] w-full overflow-y-auto sm:overflow-y-hidden max-h-[40rem]'>
        <div className='flex justify-between'>
          <h1 className='px-1 mb-8 text-xl font-semibold text-center md:text-3xl '>
            Edit Community
          </h1>
          <span
            className='cursor-pointer top-10 right-10'
            onClick={cancel}>
            <MdOutlineCancel size={25} />
          </span>
        </div>
        <form
          className='bg-[#0f1a1c] flex flex-col gap-5 z-[200]'
          onSubmit={onSubmit}>
          <div className='flex flex-col gap-5 md:flex-row'>
            <div className='flex flex-col w-full gap-3 md:w-1/3 sm:flex-row md:flex-col'>
              <label className='flex flex-1 flex-col text-[#67787e] text-sm'>
                &nbsp;&nbsp;Name
                <input
                  className='mt-1 text-[#f2f2f1] bg-[#1a282d] h-16 rounded-3xl p-4 outline outline-1 outline-white focus:border-white focus:border-2 '
                  type='text'
                  {...register("name")}
                />
                {errors?.name && (
                  <p className='text-xs font-semibold text-red-500'>
                    &nbsp;&nbsp;{errors?.name.message}
                  </p>
                )}
              </label>
              <label className='flex flex-1 flex-col text-[#67787e] text-sm'>
                &nbsp;&nbsp;Rules
                <input
                  className='mt-1 text-[#f2f2f1] bg-[#1a282d] h-16  rounded-3xl p-4 outline outline-1 outline-white focus:border-white focus:border-2 '
                  type='text'
                  {...register("rules")}
                />
                {errors?.rules && (
                  <p className='text-xs font-semibold text-red-500'>
                    &nbsp;&nbsp;{errors?.rules.message}
                  </p>
                )}
              </label>
            </div>
            <label className='flex flex-1 flex-col text-[#67787e] text-sm'>
              &nbsp;&nbsp; Description
              <textarea
                rows={5}
                className='overflow-hidden flex-1 mt-1 text-[#f2f2f1] bg-[#1a282d] min-h-20 rounded-3xl p-4 outline outline-1 outline-white focus:border-white focus:border-2 '
                {...register("description", {
                  validate: (val) => {
                    if (val && val.length > 500) {
                      return "Description must have less then 500 letters";
                    }
                  },
                })}
              />
              {errors?.description && (
                <p className='text-xs font-semibold text-red-500'>
                  &nbsp;&nbsp;{errors?.description.message}
                </p>
              )}
            </label>
          </div>

          <div className='flex gap-5'>
            {/* avatarImg */}
            <label className='flex flex-col text-[#67787e] text-sm'>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Avatar Image
              <div
                {...getAvatarRootProps({
                  className: `rounded-3xl flex mt-1 flex bg-[#1A282D] justify-center items-center size-32 ${
                    !avatar?.preview && "border"
                  }`,
                })}
                onClick={() => console.log("a")}>
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

            {/* coverImg */}
            <label className='flex flex-1 flex-col text-[#67787e] text-sm'>
              &nbsp;&nbsp;Cover Image
              <div
                {...getCoverRootProps({
                  className: `rounded-3xl h-32 flex mt-1 flex bg-[#1A282D] justify-center items-center h-full flex-1 ${
                    !cover?.preview && "border"
                  }`,
                })}
                onClick={() => console.log("a")}>
                <input {...getCoverInputProps()} />
                {isCoverDragActive ? (
                  <p className='font-bold text-gray-700'>Drop</p>
                ) : (
                  <div className='flex items-center justify-center w-full h-32'>
                    {cover?.preview ? (
                      <img
                        src={cover?.preview}
                        alt='avatar img'
                        className='object-cover object-center w-full h-32 rounded-3xl'
                      />
                    ) : (
                      <MdAddPhotoAlternate className='size-16' />
                    )}
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className='flex justify-end gap-5 mt-3'>
            {isLoading ? (
              <CommonLoader isLoading={isLoading} />
            ) : (
              <>
                <button
                  className='px-5 py-3 bg-[#223237] rounded-2xl'
                  type='button'
                  disabled={isLoading}
                  onClick={cancel}>
                  Cancel
                </button>
                <button
                  disabled={isLoading}
                  className='px-5 py-3 bg-[#0045ac] hover:bg-[#0079d3] rounded-2xl'>
                  Submit
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditCommunityForm;
