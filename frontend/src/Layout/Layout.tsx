import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import LeftSideBar from '@/components/LeftSideBarAndCreateCom/LeftSideBar';

const Layout = () => {
  return (
    <main className='flex flex-col min-h-screen bg-[#0b1416] text-white'>
      <Header />
      <div className='flex flex-1'>
        <span className='hidden lg:inline'>
          <LeftSideBar />
        </span>

        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
    </main>
  );
};
export default Layout;
