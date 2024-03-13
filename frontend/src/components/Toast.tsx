import { useEffect } from 'react';

export type ToastTypes = {
  message: string;
  type: 'SUCCESS' | 'ERROR';
  onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastTypes) => {
  const bgType = type === 'ERROR' ? 'bg-red-400' : 'bg-green-400';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <span
      className={`${bgType} fixed flex items-center justify-center px-6 py-5 text-xl font-bold text-gray-800  rounded-xl bottom-10 left-10`}>
      {message}
    </span>
  );
};
export default Toast;
