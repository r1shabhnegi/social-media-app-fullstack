import { AppDispatch, RootState } from '@/global/_store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '@/global/toastSlice';

const Toast = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toastValue = useSelector((state: RootState) => state.toast.toastValue);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [type, setType] = useState<'ERROR' | 'SUCCESS' | undefined>(undefined);

  useEffect(() => {
    setMessage(toastValue?.message);
    setType(toastValue?.type);
    const timer = setTimeout(() => {
      dispatch(showToast(undefined));
      setMessage(undefined);
      setType(undefined);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, toastValue]);

  const bgType = type === 'ERROR' ? 'bg-red-400' : 'bg-green-400';

  if (message && type) {
    return (
      <span
        className={`${bgType} z-50 fixed flex items-center justify-center px-6 py-5 text-xl font-bold text-gray-800  rounded-xl bottom-10 left-10`}>
        {message}
      </span>
    );
  }
};
export default Toast;
