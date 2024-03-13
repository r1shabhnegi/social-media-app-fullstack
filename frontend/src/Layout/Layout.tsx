import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import { useEffect, useState } from 'react';
import Toast, { ToastTypes } from '@/components/Toast';

const Layout = () => {
  const [toast, setToast] = useState<ToastTypes | undefined>(undefined);
  const toastValue = useSelector((state: RootState) => state.toast.toastValue);

  useEffect(() => {
    setToast(toastValue);
  }, [toastValue]);

  return (
    <main className='flex flex-col min-h-screen'>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      <Header />
      <div className='flex-1'>
        <Outlet />
      </div>
    </main>
  );
};
export default Layout;
