const Error = ({ error }: { error: string | null }) => {
  return <div className='font-bold text-black bg-gray-400'>{error}</div>;
};
export default Error;
