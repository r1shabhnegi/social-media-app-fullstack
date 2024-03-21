import MoonLoader from 'react-spinners/MoonLoader';

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
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
export default Loading;
