import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import LeftSideBar from '@/components/LeftSideBarAndCreateCom/LeftSideBar';
import { useNumberOfPostsQuery } from '@/api/queries/postQuery';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/global/_store';
import { setNumberOfPosts } from '@/global/postsSlice';

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isSuccess } = useNumberOfPostsQuery({});

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setNumberOfPosts(data));
    }
  }, [data, dispatch, isSuccess]);

  return (
    <main className=' flex flex-col min-h-screen bg-[#0b1416] text-white'>
      <Header />
      <LeftSideBar />
      <div className='ml-[17rem]'>
        <Outlet />
      </div>
    </main>
  );
};
export default Layout;
