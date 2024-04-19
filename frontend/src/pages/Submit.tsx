import Header from '@/components/Header/Header';
import CreatePost from '@/components/submit/CreatePost';
import Rules from '@/components/submit/Rules';
import { useLocation } from 'react-router-dom';

const Submit = () => {
  const { state } = useLocation();
  console.log(state);
  return (
    <>
      <Header />
      <div className=' bg-[#030303] min-h-screen pt-8 text-[#f2f2f1] flex items-start justify-center'>
        <CreatePost selectedCommunity={state} />
        <Rules />
      </div>
    </>
  );
};
export default Submit;
