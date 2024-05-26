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

type CommunityEditTypes = {
  name: string;
  description: string;
  avatarImg: FileList;
  coverImg: FileList;
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setAvatar({
      File: acceptedFiles[0],
      preview: URL.createObjectURL(acceptedFiles[0]),
    });
  }, []);
  // console.log(file);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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
      const avatarImage = await imageCompression(data.avatarImg[0], options);
      const coverImage = await imageCompression(data.coverImg[0], options);

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
      className='bg-[#0f1a1c] flex flex-col gap-3 z-[200]'
      onSubmit={onSubmit}>
      <span className='flex gap-3'>
        <label className='text-[#67787e] text-sm flex-1'>
          &nbsp;&nbsp;Name
          <input
            className='mt-1 text-[#f2f2f1] bg-[#1a282d] h-16 w-full rounded-3xl p-4 outline outline-1 outline-white focus:border-white focus:border-2 '
            type='text'
            {...register('name')}
          />
        </label>
        <label className='flex-1 text-[#67787e] text-sm'>
          &nbsp;&nbsp;Rules
          <input
            className='mt-1 text-[#f2f2f1] bg-[#1a282d] h-16 w-full  rounded-3xl p-4 outline outline-1 outline-white focus:border-white focus:border-2 '
            type='text'
            {...register('rules')}
          />
        </label>
      </span>

      <label className='flex flex-col text-[#67787e] text-sm'>
        &nbsp;&nbsp; Description
        <textarea
          rows={5}
          className='overflow-hidden flex-1 mt-1 text-[#f2f2f1] bg-[#1a282d] min-h-20 w-full rounded-3xl p-4 outline outline-1 outline-white focus:border-white focus:border-2 '
          {...register('description')}
        />
      </label>

      {/* avatarImg */}
      <label className='flex flex-col text-[#67787e] text-sm'>
        Avatar Image
        <div {...getRootProps({ className: 'h-20 w-full bg-red-200' })}>
          {/* <input {...getInputProps()} /> */}
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <div className='w-full h-20'>
              {avatar?.preview ? (
                <img
                  src={avatar?.preview}
                  alt=''
                  className='size-10'
                />
              ) : (
                <p className=''>Click to select Avatar / Drop Avatar</p>
              )}
            </div>
          )}
        </div>
      </label>

      {/* coverImg */}
      <label className='flex flex-col text-[#67787e] text-sm'>
        Cover Image
        <Input
          type='file'
          className='flex-1 mt-1 text-[#f2f2f1] p-4 bg-[#1a282d] w-full rounded-3xl  outline-none  '
          accept='image/*'
          {...register('coverImg')}
        />
      </label>

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
