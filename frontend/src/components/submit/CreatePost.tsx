import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const CreatePost = () => {
  const {} = useForm();

  return (
    <div className='w-[45rem] mr-5 '>
      <h1 className='px-1 font-semibold py-3 border-b-[.1rem] border-gray-700'>
        Create a post
      </h1>

      <div className='mt-5 w-72 mb-2 bg-[#1A1A1B] p-3'>Choose Community</div>

      <div className=' bg-[#1A1A1B] rounded-lg p-3 '>
        <form className='flex flex-col gap-8'>
          <label className='pb-3 text-sm font-semibold'>
            Title
            <Input
              className='border-[.1rem] border-gray-700 bg-[#1A1A1B]'
              placeholder='Title'
            />
          </label>

          <label className='pb-3 text-sm font-semibold '>
            Description
            <Textarea
              rows={8}
              className='border-[.1rem] border-gray-700 bg-[#1A1A1B]'
              placeholder='Text...'
            />
          </label>

          <label className='pb-3 text-sm font-semibold '>
            Add Photo
            <Input
              type='file'
              className='border-[.1rem] text-[#f2f2f1] border-gray-700 bg-[#1A1A1B]'
            />
          </label>

          {/* <button></button> */}
          <span className='flex justify-end gap-5'>
            <button>Cancel</button>
            <button>Submit</button>
          </span>
        </form>
      </div>
    </div>
  );
};
export default CreatePost;
