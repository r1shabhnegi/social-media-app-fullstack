import MoonLoader from "react-spinners/MoonLoader";
const CommonLoader = ({ size }: { isLoading?: boolean; size?: number }) => {
  return (
    <div className='min-h-screen'>
      <MoonLoader
        color='#f2f2f1'
        loading={true}
        size={size || 40}
        aria-label='Loading Spinner'
        data-testid='loader'
        className='inline-block'
      />
    </div>
  );
};
export default CommonLoader;
