import MoonLoader from 'react-spinners/MoonLoader';

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className='flex bg-[#0b1416] items-center justify-center min-h-screen'>
      <MoonLoader
        color='#f2f2f1'
        loading={isLoading}
        size={50}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  );
};
export default Loading;
