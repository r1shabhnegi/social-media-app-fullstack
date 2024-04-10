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
      <div className=' bg-[#030303] min-h-screen text-[#f2f2f1] flex items-center justify-center'>
        <div className='flex'>
          <CreatePost />
          <Rules />
        </div>
      </div>
    </>
  );
};
export default Submit;
