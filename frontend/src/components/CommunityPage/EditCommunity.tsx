import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { MdOutlineCancel } from 'react-icons/md';
import { AiFillPicture } from 'react-icons/ai';
import { useEditCommunityMutation } from '@/api/queries/communityQuery';
import Loading from '../Loading';
import { IoCompassOutline } from 'react-icons/io5';
import EditCommunityForm from '@/forms/EditCommunityForm';

const EditCommunity = ({
  communityName,
  cancel,
}: {
  communityName: string | undefined;
  cancel: () => void;
}) => {
  // const [avatar, setAvatar] = useState<string | null>(null);
  // const [coverImg, setCoverImg] = useState<string | null>(null);

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
        <EditCommunityForm communityName={communityName} />
        {/* <form
          className='bg-[#0f1a1c] p-6 rounded-3xl gap-2 flex flex-col'
          onSubmit={onSubmit}>
          <span className='flex gap-4'>
            <label className='flex-1 mb-2 text-sm font-semibold'>
              Community Name
              <input
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
                <input
                  type='file'
                  accept='image/*'
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
                <input
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
            <textarea
              className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
              placeholder='Write...'
              {...register('description')}
            />
          </label>

          <label className='mb-2 text-sm font-semibold'>
            Rules
            <input
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
        </form> */}
      </div>
    </div>
  );
};
export default EditCommunity;
