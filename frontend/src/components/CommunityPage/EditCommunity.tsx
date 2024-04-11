import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { useEffect } from 'react';
import { Textarea } from '../ui/textarea';
import { MdOutlineCancel } from 'react-icons/md';

type CommunityEditTypes = {
  name: string;
  description: string;
  avatar: File;
  coverImage: File;
  rule: string[];
};

const EditCommunity = ({
  communityName,
  cancel,
}: {
  communityName: string | undefined;
  cancel: () => void;
}) => {
  const { register, handleSubmit, reset } = useForm<CommunityEditTypes>();

  useEffect(() => {
    reset({ name: communityName });
  }, [communityName, reset]);

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
        <form className='bg-[#0f1a1c] p-6 rounded-3xl gap-2 flex flex-col'>
          <span className='flex gap-4'>
            <label className='flex-1 mb-2 text-sm font-semibold'>
              Community Name
              <Input
                {...register('name', {})}
                //   value={communityName}
                className='flex-1 mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
              />
            </label>
            <label className='mb-2 text-sm font-semibold'>
              Avatar
              <Input
                type='file'
                className='mt-1 text-[#f2f2f1]  bg-[#1a282d] h-16 rounded-3xl  p-4 outline-none'
              />
            </label>
            <label className='mb-2 text-sm font-semibold'>
              Cover
              <Input
                type='file'
                className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
              />
            </label>
          </span>
          <label className='mb-2 text-sm font-semibold'>
            Description
            <Textarea
              className='mt-1 text-[#f2f2f1]  bg-[#1a282d] w-full h-16 rounded-3xl p-4 outline-none'
              placeholder='Write...'
            />
          </label>

          <label className='mb-2 text-sm font-semibold'>
            Rules
            <Input
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
