import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import LeftSideBar from '@/components/LeftSideBarAndCreateCom/LeftSideBar';
import RightSidebar from '@/components/RightSideBar/RightSidebar';

const Layout = () => {
  return (
    <main className='flex flex-col min-h-screen bg-[#0b1416] text-white'>
      <Header />
      <div className='flex flex-1'>
        {/* hides below larger screen */}
        <span className='hidden lg:inline'>
          <LeftSideBar />
        </span>

        <div className='flex-1'>
          <Outlet />
        </div>
        {/* <RightSidebar /> */}
      </div>
    </main>
  );
};
export default Layout;
