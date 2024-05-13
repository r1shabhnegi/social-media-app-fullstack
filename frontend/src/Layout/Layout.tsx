import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import LeftSideBar from '@/components/LeftSideBarAndCreateCom/LeftSideBar';

const Layout = () => {
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
