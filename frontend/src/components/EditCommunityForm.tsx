import { useEditCommunityMutation } from '@/api/queries/communityQuery';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/global/_store';
import { showToast } from '@/global/toastSlice';
import CommonLoader from '@/components/CommonLoader';
import imageCompression from 'browser-image-compression';
import { EditCommunityFormProps } from '@/lib/types';
import { useDropzone } from 'react-dropzone';
import { MdAddPhotoAlternate } from 'react-icons/md';
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

  const { register, handleSubmit, reset } = useForm<CommunityEditTypes>();
  // drop-zone

  const [avatar, setAvatar] = useState<{ File: object; preview: string }>();
  const [cover, setCover] = useState<{ File: object; preview: string }>();

  const onDropAvatar = useCallback((acceptedFiles: File[]) => {
    setAvatar({
      File: acceptedFiles[0],
      preview: URL.createObjectURL(acceptedFiles[0]),
    });
  }, []);
  const onDropCover = useCallback((acceptedFiles: File[]) => {
    setCover({
      File: acceptedFiles[0],
      preview: URL.createObjectURL(acceptedFiles[0]),
    });
  }, []);

  // console.log(file);

  const { getRootProps: getAvatarRootProps, isDragActive: isAvatarDragActive } =
    useDropzone({
      onDrop: onDropAvatar,
      maxSize: 1024 * 4000,
    });
  const { getRootProps: getCoverRootProps, isDragActive: isCoverDragActive } =
    useDropzone({
      onDrop: onDropCover,
      maxSize: 1024 * 4000,
    });

  useEffect(() => {
    reset({ name: communityName, description, rules });
  }, [communityName, description, reset, rules]);

  // end

  const onSubmit = handleSubmit(async (data) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const avatarImage = await imageCompression(avatar?.File, options);
      const coverImage = await imageCompression(cover?.File, options);

      const formData = new FormData();
      formData.append('communityName', communityName);
      formData.append('description', data.description);
      formData.append('name', data.name);
      formData.append('rules', data.rules);

      formData.append('avatarImg', avatarImage);
      formData.append('coverImg', coverImage);
      const res = await editCommunity(formData).unwrap();

      if (res) {
        dispatch(
          showToast({
            message: 'Community Edited Successfully!',
            type: 'SUCCESS',
          })
        );
        cancel();
      } else {
        throw new Error('Error Editing Community!');
      }
    } catch (error) {
      dispatch(
        showToast({
          message: 'Error Editing Community!',
          type: 'ERROR',
        })
      );
    }
  });

  return (
    <form
      className='bg-[#0f1a1c] w-[55rem] flex flex-col gap-5 z-[200]'
      onSubmit={onSubmit}>
      <div className='flex gap-5'>
        <div className='flex flex-col w-[18rem] gap-3'>
          <label className='flex flex-col text-[#67787e] text-sm'>
            &nbsp;&nbsp;Name
            <input
              className='mt-1 text-[#f2f2f1] bg-[#1a282d] h-16 rounded-3xl p-4 outline outline-1 outline-white focus:border-white focus:border-2 '
              type='text'
              {...register('name')}
            />
          </label>
          <label className='flex flex-col text-[#67787e] text-sm'>
            &nbsp;&nbsp;Rules
            <input
              className='mt-1 text-[#f2f2f1] bg-[#1a282d] h-16  rounded-3xl p-4 outline outline-1 outline-white focus:border-white focus:border-2 '
              type='text'
              {...register('rules')}
            />
          </label>
        </div>
        <label className='flex flex-1 flex-col text-[#67787e] text-sm'>
          &nbsp;&nbsp; Description
          <textarea
            rows={5}
            className='overflow-hidden flex-1 mt-1 text-[#f2f2f1] bg-[#1a282d] min-h-20 rounded-3xl p-4 outline outline-1 outline-white focus:border-white focus:border-2 '
            {...register('description')}
          />
        </label>
      </div>

      <div className='flex gap-5'>
        {/* avatarImg */}
        <label className='flex flex-col text-[#67787e] text-sm'>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Avatar Image
          <div
            {...getAvatarRootProps({
              className: `rounded-3xl flex mt-1 flex justify-center items-center size-32 ${
                !avatar?.preview && 'border'
              }`,
            })}>
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
              className: `rounded-3xl h-32 flex mt-1 flex justify-center items-center h-full flex-1 ${
                !cover?.preview && 'border'
              }`,
            })}>
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
  );
};
export default EditCommunityForm;
