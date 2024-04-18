const CommunityBanner = ({ coverImg }: { coverImg: string }) => {
  return (
    <div className=' sm:p-2'>
      <img
        src={coverImg}
        className='w-full  max-w-[70rem] h-14 sm:h-20  md:h-32 mx-auto bg-gray-500 sm:rounded-md object-cover'
      />
    </div>
  );
};
export default CommunityBanner;
