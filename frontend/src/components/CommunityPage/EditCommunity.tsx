import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { MdOutlineCancel } from 'react-icons/md';
import { AiFillPicture } from 'react-icons/ai';
import { useEditCommunityMutation } from '@/api/queries/communityQuery';
import Loading from '../Loading';
type CommunityEditTypes = {
  name: string;
  description: string;
  avatarImg: FileList;
  coverImg: FileList;
  rules: string;
};

const EditCommunity = ({
  communityName,
  cancel,
}: {
  communityName: string | undefined;
  cancel: () => void;
}) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [coverImg, setCoverImg] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<CommunityEditTypes>();

  useEffect(() => {
    reset({ name: communityName });
  }, [communityName, reset]);

  const [editCommunity] = useEditCommunityMutation();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    const formData = new FormData();
    if (data.avatarImg && data.avatarImg.length > 0) {
      formData.append('avatarImg', data.avatarImg[0]);
    }
    if (data.coverImg && data.coverImg.length > 0) {
      formData.append('coverImg', data.coverImg[0]);
    }
    formData.append('description', data.description);
    formData.append('name', data.name);
    formData.append('rules', data.rules);
    // console.log(formData);
    editCommunity(formData);
  });

  // if (isLoading) <Loading isLoading={isLoading} />;
  // console.log(data);

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-[#1A1A1B] p-6 rounded-lg'>
        <div className='flex justify-between'>
          <h1 className='px-1 mb-8 text-xl font-semibold text-center '>
            Edit Community
          </h1>
          <span
            className=' top-10 right-10'
            onClick={cancel}>
            <MdOutlineCancel size={25} />
          </span>
        </div>
        <form
          className='bg-[#0f1a1c] p-6 rounded-3xl gap-2 flex flex-col'
          onSubmit={onSubmit}>
          <span className='flex gap-4'>
            <label className='flex-1 mb-2 text-sm font-semibold'>
              Community Name
              <Input
                {...register('name', {
                  validate: (val) => {
                    if (val.length < 4) {
                      return 'Name must have 4 characters or more.';
                    }
                  },
                })}
                className='flex-1 mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
              />
            </label>
            <label className='flex flex-col text-sm font-semibold'>
              Avatar
              <span className='flex items-center justify-center h-16 p-4 border-[.1rem] mt-1 outline-none rounded-3xl bg-[#1a282d]'>
                {avatar ? (
                  <img
                    className='size-12'
                    src={avatar}
                  />
                ) : (
                  <AiFillPicture className='size-12' />
                )}
                <Input
                  type='file'
                  accept='image/png, image/jpg'
                  {...register('avatarImg')}
                  className='mt-1 text-[#f2f2f1]  bg-[#1a282d] h-16 hidden rounded-3xl  p-4 outline-none'
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const fileURL = URL.createObjectURL(e.target.files[0]);
                      setAvatar(fileURL);
                    }
                  }}
                />
              </span>
            </label>
            <label className='mb-2 text-sm font-semibold'>
              Cover
              <span className='flex items-center justify-center h-16 p-4 border-[.1rem] mt-1 outline-none rounded-3xl bg-[#1a282d]'>
                {coverImg ? (
                  <img
                    className='size-12'
                    src={coverImg}
                  />
                ) : (
                  <AiFillPicture className='size-12' />
                )}
                <Input
                  {...register('coverImg')}
                  accept='image/png, image/jpg'
                  type='file'
                  className='mt-1 text-[#f2f2f1]  bg-[#1a282d] h-16 hidden rounded-3xl  p-4 outline-none'
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const fileURL = URL.createObjectURL(e.target.files[0]);
                      setCoverImg(fileURL);
                    }
                  }}
                />
              </span>
            </label>
          </span>
          <label className='mb-2 text-sm font-semibold'>
            Description
            <Textarea
              className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
              placeholder='Write...'
              {...register('description')}
            />
          </label>

          <label className='mb-2 text-sm font-semibold'>
            Rules
            <Input
              {...register('rules')}
              className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
              placeholder='WriteRules Separated by the Coma (,)'
            />
          </label>
          <span className='flex justify-end gap-5 mt-3'>
            <button
              onClick={cancel}
              className='px-5 py-3 bg-[#223237] rounded-2xl'>
              Cancel
            </button>
            <button className='px-5 py-3 bg-[#0045ac] hover:bg-[#0079d3] rounded-2xl'>
              Submit
            </button>
          </span>
        </form>
      </div>
    </div>
  );
};
export default EditCommunity;
