import { MdGroups3 } from 'react-icons/md';
import { MdOutlinePostAdd } from 'react-icons/md';
import { MdCancel } from 'react-icons/md';
import { Link } from 'react-router-dom';

const CreateOptionCard = ({
  setCreateOptions,
}: {
  setCreateOptions: () => void;
}) => {
  return (
    <div
      className='absolute top-0 left-0 z-10 flex items-center justify-center w-full min-h-screen bg-black opacity-70'
      onClick={setCreateOptions}>
      <div className='relative flex gap-32 text-white'>
        <Link to='/create/community'>
          <div className='flex flex-col items-center justify-center p-10 bg-white border border-gray-400 cursor-pointer hover:bg-opacity-40 hover:bg-gray-300 rounded-3xl w-96 h-96 bg-opacity-20'>
            <MdGroups3 className='w-full h-full' />
            <p className='text-3xl font-semibold'>Create Community</p>
          </div>
        </Link>

        <Link to='/create/post'>
          <div className='flex flex-col items-center justify-center p-10 bg-white border border-gray-400 cursor-pointer hover:bg-opacity-40 hover:bg-gray-300 rounded-3xl w-96 h-96 bg-opacity-20'>
            <MdOutlinePostAdd className='w-full h-full' />
            <p className='text-3xl font-semibold'>Create Post</p>
          </div>
        </Link>

        <div
          className='absolute cursor-pointer -top-16 -right-16'
          onClick={setCreateOptions}>
          <MdCancel size={50} />
        </div>
      </div>
    </div>
  );
};
export default CreateOptionCard;
