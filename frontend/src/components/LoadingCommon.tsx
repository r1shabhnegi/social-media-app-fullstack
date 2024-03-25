import MoonLoader from 'react-spinners/MoonLoader';

const LoadingCommon = ({ isPending }:{isPending:boolean})) => {
  return (
    <div className='flex flex-1 h-screen'>
      <MoonLoader
        color='#000000'
        loading={isPending}
        size={50}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  );
};
export default LoadingCommon;
