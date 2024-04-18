import { MdOutlineCancel } from 'react-icons/md';

import EditCommunityForm from '@/forms/EditCommunityForm';

const EditCommunity = ({
  cancel,
}: {
  communityName: string;
  cancel: () => void;
}) => {
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-[#0f1a1c]  p-6 rounded-3xl'>
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
        <EditCommunityForm cancel={cancel} />
      </div>
    </div>
  );
};
export default EditCommunity;
