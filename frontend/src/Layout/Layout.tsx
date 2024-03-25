import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import LeftSideBar from '@/components/LeftSideBar';
import RightSidebar from '@/components/RightSidebar';

const Layout = () => {
  return (
    <main className='flex flex-col min-h-screen'>
      <Header />
      <div className='flex flex-1'>
        <LeftSideBar />
        <div className='flex-1'>
          <Outlet />
        </div>
        <RightSidebar />
      </div>
    </main>
  );
};
export default Layout;
