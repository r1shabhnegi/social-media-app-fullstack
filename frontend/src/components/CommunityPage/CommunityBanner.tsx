import { memo } from 'react';

const CommunityBanner = memo(({ coverImg }: { coverImg: string }) => {
  return (
    <div className=' sm:p-2'>
      {coverImg ? (
        <img
          src={coverImg}
          alt='coverImg'
          className='w-full  max-w-[70rem] h-14 sm:h-20  md:h-32 mx-auto bg-gray-500 sm:rounded-md object-cover'
        />
      ) : (
        <div className='w-full  max-w-[70rem] h-14 sm:h-20  md:h-32 mx-auto bg-gray-500 sm:rounded-md object-cover'></div>
      )}
    </div>
  );
});
export default CommunityBanner;
