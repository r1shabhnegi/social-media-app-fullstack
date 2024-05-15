import { useEditCommunityMutation } from '@/api/queries/communityQuery';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/global/_store';
import { showToast } from '@/global/toastSlice';
import CommonLoader from '@/components/CommonLoader';
import imageCompression from 'browser-image-compression';

type CommunityEditTypes = {
  name: string;
  description: string;
  avatarImg: FileList;
  coverImg: FileList;
  rules: string;
};

type EditCommunityFormProps = {
  cancel: () => void;
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

  useEffect(() => {
    reset({ name: communityName, description, rules });
  }, [communityName, description, reset, rules]);

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
      className='bg-[#0f1a1c] flex flex-col gap-5'
      onSubmit={onSubmit}>
      <span className='flex gap-5'>
        <label className='text-[#67787e] text-sm flex-1'>
          &nbsp;&nbsp;Name
          <input
            className='flex-1 mt-1 text-[#f2f2f1] bg-[#1a282d] h-16 w-full rounded-3xl p-4 outline outline-1 outline-white focus:border-white focus:border-2 '
            type='text'
            {...register('name')}
          />
        </label>
        <label className='flex-1 text-[#67787e] text-sm'>
          &nbsp;&nbsp;Rules
          <input
            className='flex-1 mt-1 text-[#f2f2f1] bg-[#1a282d] h-16 w-full rounded-3xl p-4 outline outline-1 outline-white focus:border-white focus:border-2 '
            type='text'
            {...register('rules')}
          />
        </label>
      </span>

      <label className='flex flex-1 flex-col text-[#67787e] text-sm'>
        &nbsp;&nbsp; Description
        <textarea
          // rows={20}
          className='flex-1 mt-1 text-[#f2f2f1] bg-[#1a282d] min-h-20 w-full rounded-3xl p-4 outline outline-1 outline-white focus:border-white focus:border-2 '
          {...register('description')}
        />
      </label>

      <span className='flex gap-5'>
        {/* avatarImg */}
        <label className='flex flex-1 flex-col justify-center items-center text-[#67787e] text-sm '>
          Avatar Image
          {/* {avatarUrl ? (
            <img
              src={previewAvatar}
              alt='Avatar Image'
              className='object-cover mt-1 size-36 outline outline-1 outline-white focus:border-white focus:border-2 rounded-3xl'
            />
          ) : (
            <RiImage2Fill className='mt-1 w-44 h-36 outline outline-1 outline-white focus:border-white focus:border-2 rounded-3xl' />
          )} */}
          <Input
            className='flex-1 mt-1 text-[#f2f2f1] p-4 bg-[#1a282d] w-full rounded-3xl  outline-none  '
            accept='image/*'
            type='file'
            {...register('avatarImg')}
          />
        </label>
        {/* coverImg */}
        <label className='flex flex-1 flex-col justify-center items-center text-[#67787e] text-sm'>
          Cover Image
          {/* {avatarUrl ? (
            <img
              src={previewCover}
              alt='Cover Image'
              className='object-cover mt-1 w-44 h-36 outline outline-1 outline-white focus:border-white focus:border-2 rounded-3xl'
            />
          ) : (
            <BsCardImage className='mt-1 w-44 h-36 outline outline-1 outline-white focus:border-white focus:border-2 rounded-3xl' />
          )} */}
          <Input
            type='file'
            className='flex-1 mt-1 text-[#f2f2f1] p-4 bg-[#1a282d] w-full rounded-3xl  outline-none  '
            accept='image/*'
            {...register('coverImg')}
          />
        </label>
      </span>
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
