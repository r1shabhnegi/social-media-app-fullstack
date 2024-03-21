import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const Layout = () => {
  return (
    <main className='flex flex-col min-h-screen'>
      <Header />
      <div className='flex-1'>
        <Outlet />
      </div>
    </main>
  );
};
export default Layout;
