import { useEditCommunityMutation } from '@/api/queries/communityQuery';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type CommunityEditTypes = {
  name: string;
  description: string;
  avatarImg: FileList;
  coverImg: FileList;
  rules: string;
};

const EditCommunityForm = ({
  communityName,
}: {
  communityName: string | undefined;
}) => {
  const [editCommunity] = useEditCommunityMutation();
  const { register, handleSubmit, reset } = useForm<CommunityEditTypes>();

  useEffect(() => {
    reset({ name: communityName });
  }, [communityName, reset]);

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    const formData = new FormData();
    formData.append('description', data.description);
    formData.append('name', data.name);
    formData.append('rules', data.rules);

    formData.append('avatarImg', data.avatarImg[0]);
    formData.append('coverImg', data.coverImg[0]);
    editCommunity(formData);
  });

  return (
    <form
      className='flex flex-col'
      onSubmit={onSubmit}>
      <label className='flex flex-col'>
        Name
        <input
          className='flex-1 mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
          type='text'
          {...register('name')}
        />
      </label>
      <label>
        Description
        <textarea
          rows={20}
          className='min-h-20 overflow-hidden flex-1 mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
          {...register('description')}
        />
      </label>
      <label>
        Rules
        <input
          className='flex-1 mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
          type='text'
          {...register('rules')}
        />
      </label>
      <span className='flex'>
        <label>
          Avatar Image
          <input
            className='flex-1 mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
            accept='image/*'
            type='file'
            {...register('avatarImg')}
          />
        </label>
        <label>
          Cover Image
          <input
            type='file'
            className='flex-1 mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
            accept='image/*'
            {...register('coverImg')}
          />
        </label>
      </span>
      <button type='submit'>Submit</button>
    </form>
  );
};
export default EditCommunityForm;
