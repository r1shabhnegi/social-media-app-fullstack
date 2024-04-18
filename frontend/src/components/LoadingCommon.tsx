import MoonLoader from 'react-spinners/MoonLoader';

const LoadingCommon = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className='flex flex-1 h-screen'>
      <MoonLoader
        color='#000000'
        loading={isLoading}
        size={50}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  );
};
export default LoadingCommon;
